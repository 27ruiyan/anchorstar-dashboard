# Resilience Intelligence Dashboard

A strategic intelligence dashboard for Anchorstar x Mori Building that translates global events into company-specific strategic actions through a Gen Z behavioral lens. Built for Japanese corporate executives (35-50) as a decision-support tool that surfaces emerging risks and opportunities across resilience domains.

## Setup

```bash
npm install
npm run dev
```

Set up environment variables:

```bash
cp .env.example .env.local
```

Then add your NewsAPI key:

```bash
NEWS_API_KEY=your_newsapi_key_here
```

If the key is missing or the API fails, the app automatically falls back to local demo data.

## How to extend

### Add a new company

Edit `/data/companies.ts` and add a new `CompanyProfile` object to the `companies` array. Follow the existing format with sector, scores, and strategic priorities.

### Add a new event

Edit `/data/events.ts` and add a new `Event` object with coordinates, resilience domains, urgency level, and industry relevance tags.

### Live news data source

The app now fetches live articles from [NewsAPI](https://newsapi.org/) via `/api/events` and maps them into the existing `Event` shape for map + dashboard display.

### Add a new InsightCard

Edit `/data/insights.ts` and add a new `InsightCard` linking an `eventId` to a `companyId` with analysis, risks, opportunities, and recommended actions. Missing combinations will show a generic fallback.

## Deployment

```bash
vercel deploy
```
