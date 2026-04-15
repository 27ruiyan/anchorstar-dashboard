# Japanese Sentiment Analysis — Design Spec

## Overview

A new section on the company dashboard that shows a dual-lens sentiment view (Global vs. Japan) for each company, powered by real news articles from TheNewsAPI and AI-generated summaries via the Claude API.

## Goals

- Show users how a selected company is perceived globally and in Japan specifically
- Ground all sentiment in real, clickable news sources (Perplexity-like)
- Fit naturally into the existing dashboard page and design system
- Keep it MVP — good architecture, minimal complexity

## Architecture: Two-Stage Pipeline

### Stage 1: News Fetching

**Route:** `GET /api/news/[company]`

- Accepts company slug (e.g., `kodansha`, `nintendo`)
- Looks up company from `data/companies.ts` to get both English name and `nameJp`
- Makes two parallel calls to TheNewsAPI:
  - **Global**: English-language articles mentioning the company name
  - **Japan**: Japanese-language articles (`language=ja`) mentioning the company name or `nameJp`
- Returns up to ~10 articles per lens (20 total)
- Each article includes: `title`, `source`, `url`, `publishedAt`, `snippet`, `region` (`"global"` | `"japan"`)
- Cached with `revalidate: 900` (15 min)
- Falls back to empty arrays on API failure

**Environment variable:** `THE_NEWS_API_KEY`

### Stage 2: Sentiment Analysis

**Route:** `GET /api/sentiment/[company]`

- Fetches articles from Stage 1 internally
- Sends articles to Claude API with a structured prompt requesting:
  - `globalSummary`: 2-3 sentence summary of global coverage tone
  - `japanSummary`: 2-3 sentence summary of Japanese coverage tone, noting divergence from global
  - `globalSentiment`: one of `"positive"` | `"neutral"` | `"mixed"` | `"negative"`
  - `japanSentiment`: same enum
  - `globalThemes`: 2-3 short theme labels (e.g., "supply chain concerns")
  - `japanThemes`: 2-3 short theme labels
- Also returns per-article sentiment tags (batch-assigned in the same LLM call to avoid extra requests)
- Response is structured JSON
- Cached with `revalidate: 900` (15 min)
- Falls back to `null` if Claude API fails — UI shows articles without summary

**Environment variable:** `ANTHROPIC_API_KEY`

## Client-Side

### Hook: `lib/useSentiment.ts`

```typescript
export function useSentiment(companySlug: string) {
  // Returns: { articles, sentiment, isLoading, error }
  // Fetches /api/news/[company] and /api/sentiment/[company] in parallel
  // Simple useState + useEffect pattern (matches useLiveEvents.ts)
}
```

### Types

```typescript
interface NewsArticle {
  id: string
  title: string
  source: string
  url: string
  publishedAt: string
  snippet: string
  region: 'global' | 'japan'
  sentiment: 'positive' | 'neutral' | 'mixed' | 'negative'
}

interface SentimentResult {
  globalSummary: string
  japanSummary: string
  globalSentiment: 'positive' | 'neutral' | 'mixed' | 'negative'
  japanSentiment: 'positive' | 'neutral' | 'mixed' | 'negative'
  globalThemes: string[]
  japanThemes: string[]
}
```

## Dashboard UI

New section on `/dashboard` page, below the existing "Most Relevant Events" grid.

### Layout

1. **Section header**: "SENTIMENT ANALYSIS" (gold, uppercase, matching existing style) with Global/Japan toggle tabs on the right
2. **Summary card**: Gold left border accent, contains:
   - Sentiment badge (color-coded: green/blue/red/gray)
   - Article count + last updated timestamp
   - 2-3 sentence AI summary
   - Key theme pills (reuse existing `TagPill` component)
3. **Sources list**: Compact article cards, each with:
   - Headline (clickable → opens original article in new tab)
   - Source name + publish date
   - Excerpt snippet
   - Sentiment tag (color-coded)
4. **Loading state**: Skeleton placeholders
5. **Empty state**: "No recent coverage" message

### Toggle Behavior

- Global/Japan tabs switch both the summary card and the articles list
- Default to "Global" on load

### Design System

- Follows existing dark theme (`--bg-primary`, `--text-primary`, `--gold`)
- Fonts: Cormorant Garamond (headings), DM Mono (metadata, labels)
- Sentiment badge colors: green (`positive`), blue (`mixed`), red (`negative`), gray (`neutral`)
- Article cards: subtle border, hover highlight, click opens new tab

## Components

- **`SentimentSection.tsx`** — main container, manages Global/Japan toggle state, renders summary + articles. `'use client'` directive (needs state for toggle + data fetching).
- No other new components needed — reuses `TagPill` from existing codebase.

## Data Flow

```
User selects company on dashboard
  → useSentiment(companySlug) fires
  → Parallel fetch: /api/news/[company] + /api/sentiment/[company]
  → Articles render immediately when news endpoint responds
  → Summary renders when sentiment endpoint responds
  → User toggles Global/Japan to switch view (client-side filter, no re-fetch)
```

## Mock Data (Development)

Both API routes return hardcoded mock data until the real APIs are connected. This lets us build and validate the full UI without API keys.

- `data/mockNews.ts` — ~4-5 mock articles per lens (global + japan) per company, with realistic titles, sources, dates, excerpts, and sentiment tags
- `data/mockSentiment.ts` — mock sentiment summaries, scores, and themes per company
- API routes check for env vars (`THE_NEWS_API_KEY`, `ANTHROPIC_API_KEY`) — if missing, return mock data instead of calling external services

## Error Handling

- TheNewsAPI failure → empty articles, "No recent coverage" message
- Claude API failure → articles still display, summary area shows "Sentiment analysis unavailable"
- Both fail → section shows graceful empty state

## Not In Scope (MVP)

- Historical sentiment trends / charts
- Per-article AI explanations
- Streaming LLM responses
- Search/filter within articles
- Sentiment comparison across companies
- Persistent storage / database
