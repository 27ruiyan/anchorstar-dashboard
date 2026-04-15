# Japanese Sentiment Analysis — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a dual-lens (Global vs. Japan) sentiment analysis section to the company dashboard, showing AI-generated summaries grounded in real news sources.

**Architecture:** Two-stage pipeline — Stage 1 fetches news from TheNewsAPI (global + Japanese), Stage 2 sends articles to Claude API for sentiment analysis. Both stages serve hardcoded mock data when API keys are missing. A client-side hook fetches both endpoints in parallel and feeds a new `SentimentSection` component on the dashboard.

**Tech Stack:** Next.js App Router, TypeScript, TheNewsAPI, Anthropic Claude API, Tailwind CSS v4

---

## File Structure

| Action | Path | Responsibility |
|--------|------|----------------|
| Create | `types/sentiment.ts` | NewsArticle, SentimentResult, API response types |
| Create | `data/mockNews.ts` | Hardcoded mock news articles per company (global + japan) |
| Create | `data/mockSentiment.ts` | Hardcoded mock sentiment results per company |
| Create | `lib/newsApi.ts` | TheNewsAPI fetch logic (global + japan queries) |
| Create | `lib/sentimentApi.ts` | Claude API sentiment analysis logic |
| Create | `app/api/news/[company]/route.ts` | Stage 1 API route — news fetching |
| Create | `app/api/sentiment/[company]/route.ts` | Stage 2 API route — sentiment analysis |
| Create | `lib/useSentiment.ts` | Client-side hook for fetching news + sentiment |
| Create | `components/SentimentSection.tsx` | Dashboard UI — summary card, toggle, article list |
| Modify | `app/dashboard/page.tsx` | Import and render SentimentSection below events grid |

---

### Task 1: Sentiment Types

**Files:**
- Create: `types/sentiment.ts`

- [ ] **Step 1: Create the sentiment types file**

```typescript
// types/sentiment.ts

export type SentimentRating = 'positive' | 'neutral' | 'mixed' | 'negative'
export type Region = 'global' | 'japan'

export interface NewsArticle {
  id: string
  title: string
  source: string
  url: string
  publishedAt: string
  snippet: string
  region: Region
  sentiment: SentimentRating
}

export interface SentimentResult {
  globalSummary: string
  japanSummary: string
  globalSentiment: SentimentRating
  japanSentiment: SentimentRating
  globalThemes: string[]
  japanThemes: string[]
  articleSentiments: Record<string, SentimentRating>
}

export interface NewsResponse {
  articles: NewsArticle[]
  source: 'live' | 'mock'
}

export interface SentimentResponse {
  sentiment: SentimentResult | null
  source: 'live' | 'mock'
}
```

- [ ] **Step 2: Verify the file compiles**

Run: `bunx tsc --noEmit types/sentiment.ts 2>&1 || echo "Check manually"`

- [ ] **Step 3: Commit**

```bash
git add types/sentiment.ts
git commit -m "feat: add sentiment analysis types"
```

---

### Task 2: Mock Data — News Articles

**Files:**
- Create: `data/mockNews.ts`

- [ ] **Step 1: Create mock news data**

```typescript
// data/mockNews.ts

import { NewsArticle } from '@/types/sentiment'

// Mock articles keyed by company ID, each with global + japan articles
export const mockNews: Record<string, NewsArticle[]> = {
  kodansha: [
    {
      id: 'mock-kodansha-g1',
      title: 'Kodansha Signs Multi-Year Licensing Deal With Penguin Random House',
      source: 'Reuters',
      url: 'https://example.com/kodansha-penguin',
      publishedAt: '2026-04-12T09:00:00Z',
      snippet: 'The deal expands Kodansha\'s English-language manga distribution to over 40 new markets, signaling aggressive international growth beyond their traditional East Asian stronghold.',
      region: 'global',
      sentiment: 'positive',
    },
    {
      id: 'mock-kodansha-g2',
      title: 'AI Art Tools Threaten Japan\'s Manga Industry, Creators Warn',
      source: 'Nikkei Asia',
      url: 'https://example.com/ai-manga-threat',
      publishedAt: '2026-04-10T14:30:00Z',
      snippet: 'Leading manga artists have petitioned major publishers including Kodansha to establish clear policies on AI-generated artwork, citing concerns about devaluation of hand-drawn illustration.',
      region: 'global',
      sentiment: 'negative',
    },
    {
      id: 'mock-kodansha-g3',
      title: 'Anime Streaming Revenue Surges 23% in Q1, Boosting IP Holders',
      source: 'Bloomberg',
      url: 'https://example.com/anime-streaming-surge',
      publishedAt: '2026-04-08T11:00:00Z',
      snippet: 'First-quarter streaming revenue for anime content hit record levels, with Kodansha-owned properties accounting for a significant share of Crunchyroll\'s top-performing titles.',
      region: 'global',
      sentiment: 'positive',
    },
    {
      id: 'mock-kodansha-g4',
      title: 'Digital Manga Sales Plateau as Market Matures',
      source: 'Financial Times',
      url: 'https://example.com/digital-manga-plateau',
      publishedAt: '2026-04-06T08:15:00Z',
      snippet: 'After years of double-digit growth, digital manga sales have begun to plateau in Western markets, raising questions about the sustainability of the recent manga boom.',
      region: 'global',
      sentiment: 'neutral',
    },
    {
      id: 'mock-kodansha-j1',
      title: '講談社、デジタル漫画プラットフォームの大規模刷新を発表',
      source: '日本経済新聞',
      url: 'https://example.com/kodansha-digital-jp',
      publishedAt: '2026-04-11T06:00:00Z',
      snippet: '講談社は自社デジタル漫画プラットフォームの大幅なリニューアルを発表。AIレコメンデーション機能とクリエイター向け収益分配モデルの改善を柱とする。',
      region: 'japan',
      sentiment: 'positive',
    },
    {
      id: 'mock-kodansha-j2',
      title: '出版業界、若手漫画家の減少に危機感',
      source: '朝日新聞',
      url: 'https://example.com/manga-artist-decline',
      publishedAt: '2026-04-09T07:30:00Z',
      snippet: '講談社を含む大手出版社が、新人漫画家の応募数減少に対する対策を検討。SNSやウェブトゥーンへの人材流出が背景にあるとされる。',
      region: 'japan',
      sentiment: 'negative',
    },
    {
      id: 'mock-kodansha-j3',
      title: '「進撃の巨人」完結後も続くグッズ売上の好調',
      source: '東洋経済',
      url: 'https://example.com/aot-merchandise',
      publishedAt: '2026-04-07T10:00:00Z',
      snippet: '連載終了から数年が経過した「進撃の巨人」だが、グローバルなグッズ売上は依然として好調を維持。IP長期活用の成功モデルとして注目される。',
      region: 'japan',
      sentiment: 'positive',
    },
    {
      id: 'mock-kodansha-j4',
      title: '漫画アプリ競争激化、講談社の戦略は',
      source: '週刊ダイヤモンド',
      url: 'https://example.com/manga-app-competition',
      publishedAt: '2026-04-05T09:00:00Z',
      snippet: '国内漫画アプリ市場の競争が激化する中、講談社は独自コンテンツの囲い込みとグローバル展開の二軸で差別化を図る方針を示した。',
      region: 'japan',
      sentiment: 'mixed',
    },
  ],
  persol: [
    {
      id: 'mock-persol-g1',
      title: 'Japan Staffing Giant PERSOL Bets on AI-Powered Recruitment',
      source: 'Financial Times',
      url: 'https://example.com/persol-ai-recruitment',
      publishedAt: '2026-04-11T10:00:00Z',
      snippet: 'PERSOL Group is investing heavily in AI-driven matching algorithms to transform its staffing business, aiming to reduce placement times by 40% across its Japanese operations.',
      region: 'global',
      sentiment: 'positive',
    },
    {
      id: 'mock-persol-g2',
      title: 'Japan\'s Labor Shortage Deepens as Birth Rate Hits Record Low',
      source: 'The Economist',
      url: 'https://example.com/japan-labor-shortage',
      publishedAt: '2026-04-09T12:00:00Z',
      snippet: 'Japan\'s demographic crisis is accelerating, with staffing firms like PERSOL facing the paradox of rising demand for workers alongside a shrinking pool of available talent.',
      region: 'global',
      sentiment: 'mixed',
    },
    {
      id: 'mock-persol-g3',
      title: 'Southeast Asian Expansion Drives Growth for Japanese HR Firms',
      source: 'Nikkei Asia',
      url: 'https://example.com/persol-sea-expansion',
      publishedAt: '2026-04-07T08:00:00Z',
      snippet: 'PERSOL and other Japanese HR firms are finding new growth in Southeast Asia, where young populations and rapid digitalization create demand for modern staffing solutions.',
      region: 'global',
      sentiment: 'positive',
    },
    {
      id: 'mock-persol-j1',
      title: 'パーソル、リスキリング事業を大幅拡充へ',
      source: '日本経済新聞',
      url: 'https://example.com/persol-reskilling',
      publishedAt: '2026-04-10T06:00:00Z',
      snippet: 'パーソルグループはリスキリング支援事業の規模を2倍に拡大する計画を発表。AI・DX人材の育成に重点を置く方針。',
      region: 'japan',
      sentiment: 'positive',
    },
    {
      id: 'mock-persol-j2',
      title: 'Z世代の「静かな退職」、人材業界に波紋',
      source: '朝日新聞',
      url: 'https://example.com/quiet-quitting-japan',
      publishedAt: '2026-04-08T07:00:00Z',
      snippet: 'Z世代を中心に広がる「静かな退職」トレンドが、パーソルなど人材大手の従来型ビジネスモデルに見直しを迫っている。',
      region: 'japan',
      sentiment: 'negative',
    },
    {
      id: 'mock-persol-j3',
      title: '派遣業界のDX化、パーソルが先行',
      source: '東洋経済',
      url: 'https://example.com/persol-dx',
      publishedAt: '2026-04-06T10:00:00Z',
      snippet: '人材派遣業界のデジタル化が進む中、パーソルのAIマッチングプラットフォームが業界標準となりつつある。',
      region: 'japan',
      sentiment: 'positive',
    },
  ],
  'ntt-east': [
    {
      id: 'mock-ntt-g1',
      title: 'NTT Group Expands Smart City Initiatives Across Rural Japan',
      source: 'Reuters',
      url: 'https://example.com/ntt-smart-city',
      publishedAt: '2026-04-12T09:30:00Z',
      snippet: 'NTT East is deploying IoT infrastructure in depopulated rural areas, positioning telecom infrastructure as essential for regional revitalization efforts.',
      region: 'global',
      sentiment: 'positive',
    },
    {
      id: 'mock-ntt-g2',
      title: 'Fixed-Line Telecom Revenue Continues Global Decline',
      source: 'The Economist',
      url: 'https://example.com/fixed-line-decline',
      publishedAt: '2026-04-10T11:00:00Z',
      snippet: 'Traditional telecom operators including NTT face continued revenue pressure as consumers and businesses shift to mobile and cloud-based communication.',
      region: 'global',
      sentiment: 'negative',
    },
    {
      id: 'mock-ntt-g3',
      title: 'Japan Data Center Demand Surges Amid AI Boom',
      source: 'Bloomberg',
      url: 'https://example.com/japan-data-center',
      publishedAt: '2026-04-08T14:00:00Z',
      snippet: 'Demand for data center capacity in Japan has surged, benefiting infrastructure players like NTT East that are rapidly expanding their facility footprint.',
      region: 'global',
      sentiment: 'positive',
    },
    {
      id: 'mock-ntt-j1',
      title: 'NTT東日本、地方自治体向けDXパッケージを発表',
      source: '日本経済新聞',
      url: 'https://example.com/ntt-east-dx-package',
      publishedAt: '2026-04-11T06:30:00Z',
      snippet: 'NTT東日本は地方自治体向けのDX包括パッケージを発表。行政手続きのオンライン化から防災システムまでをワンストップで提供する。',
      region: 'japan',
      sentiment: 'positive',
    },
    {
      id: 'mock-ntt-j2',
      title: '光回線契約数、初の前年割れ',
      source: '朝日新聞',
      url: 'https://example.com/fiber-decline',
      publishedAt: '2026-04-09T07:00:00Z',
      snippet: '家庭向け光回線の新規契約数が初めて前年を下回った。若年層のモバイル回線のみの利用が拡大していることが要因。',
      region: 'japan',
      sentiment: 'negative',
    },
    {
      id: 'mock-ntt-j3',
      title: 'データセンター需要急増、NTT東が設備投資拡大',
      source: '週刊東洋経済',
      url: 'https://example.com/ntt-data-center-jp',
      publishedAt: '2026-04-07T09:00:00Z',
      snippet: 'AI需要の急増を受け、NTT東日本はデータセンターへの設備投資を前年比50%増とする方針を明らかにした。',
      region: 'japan',
      sentiment: 'positive',
    },
  ],
  kikkoman: [
    {
      id: 'mock-kikkoman-g1',
      title: 'Kikkoman Expands Plant-Based Seasoning Line for Western Markets',
      source: 'Reuters',
      url: 'https://example.com/kikkoman-plant-based',
      publishedAt: '2026-04-11T10:00:00Z',
      snippet: 'Kikkoman is launching a new plant-based seasoning range targeting health-conscious Gen Z consumers in North America and Europe.',
      region: 'global',
      sentiment: 'positive',
    },
    {
      id: 'mock-kikkoman-g2',
      title: 'Japanese Food Exports Hit Record on Weak Yen, Global Demand',
      source: 'Bloomberg',
      url: 'https://example.com/japan-food-exports',
      publishedAt: '2026-04-09T13:00:00Z',
      snippet: 'Japanese food exports have reached record levels, with soy sauce maker Kikkoman among the key beneficiaries of surging global interest in Japanese cuisine.',
      region: 'global',
      sentiment: 'positive',
    },
    {
      id: 'mock-kikkoman-g3',
      title: 'Sustainability Scrutiny Intensifies for Global Food Brands',
      source: 'Financial Times',
      url: 'https://example.com/food-sustainability',
      publishedAt: '2026-04-07T08:30:00Z',
      snippet: 'Consumer pressure on food brands to demonstrate sustainable sourcing is intensifying, with companies like Kikkoman facing calls for greater supply chain transparency.',
      region: 'global',
      sentiment: 'mixed',
    },
    {
      id: 'mock-kikkoman-j1',
      title: 'キッコーマン、国内醤油市場でシェア拡大',
      source: '日本経済新聞',
      url: 'https://example.com/kikkoman-market-share',
      publishedAt: '2026-04-10T06:00:00Z',
      snippet: 'キッコーマンの国内醤油市場シェアが過去最高を更新。健康志向の減塩醤油シリーズが好調な売上を牽引している。',
      region: 'japan',
      sentiment: 'positive',
    },
    {
      id: 'mock-kikkoman-j2',
      title: '食品業界、原材料高騰で値上げ相次ぐ',
      source: '朝日新聞',
      url: 'https://example.com/food-price-hikes',
      publishedAt: '2026-04-08T07:30:00Z',
      snippet: '大豆や小麦の国際価格上昇を受け、キッコーマンを含む食品大手が相次いで製品の値上げを発表している。',
      region: 'japan',
      sentiment: 'negative',
    },
    {
      id: 'mock-kikkoman-j3',
      title: '発酵食品ブーム、Z世代に広がる健康志向',
      source: '週刊ダイヤモンド',
      url: 'https://example.com/fermented-food-boom',
      publishedAt: '2026-04-06T10:00:00Z',
      snippet: 'Z世代を中心に発酵食品への関心が高まっており、キッコーマンの伝統的な製品群が再評価される機運が高まっている。',
      region: 'japan',
      sentiment: 'positive',
    },
  ],
  kirin: [
    {
      id: 'mock-kirin-g1',
      title: 'Kirin Holdings Accelerates Health Science Pivot',
      source: 'Bloomberg',
      url: 'https://example.com/kirin-health-science',
      publishedAt: '2026-04-12T10:00:00Z',
      snippet: 'Kirin Holdings is doubling down on its health science division, with new immunology products expected to offset declining beer revenue in Japan.',
      region: 'global',
      sentiment: 'positive',
    },
    {
      id: 'mock-kirin-g2',
      title: 'Gen Z Alcohol Abstention Reshapes Global Beverage Market',
      source: 'The Economist',
      url: 'https://example.com/gen-z-alcohol',
      publishedAt: '2026-04-10T12:00:00Z',
      snippet: 'The trend of Gen Z consumers reducing alcohol consumption is forcing beverage giants like Kirin to rapidly expand their non-alcoholic offerings.',
      region: 'global',
      sentiment: 'mixed',
    },
    {
      id: 'mock-kirin-g3',
      title: 'Australian Beer Market Shows Signs of Recovery',
      source: 'Reuters',
      url: 'https://example.com/australia-beer',
      publishedAt: '2026-04-08T09:00:00Z',
      snippet: 'Kirin\'s Australian subsidiary Lion has reported improved results as the premium beer segment shows recovery, driven by post-pandemic hospitality spending.',
      region: 'global',
      sentiment: 'positive',
    },
    {
      id: 'mock-kirin-j1',
      title: 'キリン、ノンアルコール飲料の新ブランドを発表',
      source: '日本経済新聞',
      url: 'https://example.com/kirin-non-alcohol',
      publishedAt: '2026-04-11T06:00:00Z',
      snippet: 'キリンホールディングスはZ世代をターゲットとした新ノンアルコールブランドを発表。健康志向とライフスタイル訴求を前面に打ち出す。',
      region: 'japan',
      sentiment: 'positive',
    },
    {
      id: 'mock-kirin-j2',
      title: 'ビール市場縮小続く、大手各社の対応は',
      source: '朝日新聞',
      url: 'https://example.com/beer-market-shrink',
      publishedAt: '2026-04-09T07:00:00Z',
      snippet: '国内ビール市場の縮小が止まらない中、キリンを含む大手各社は事業ポートフォリオの転換を加速させている。',
      region: 'japan',
      sentiment: 'negative',
    },
    {
      id: 'mock-kirin-j3',
      title: 'キリン、免疫ケア商品が累計販売1億本突破',
      source: '東洋経済',
      url: 'https://example.com/kirin-immunity',
      publishedAt: '2026-04-07T10:00:00Z',
      snippet: 'キリンの免疫ケア商品「iMUSE」シリーズが累計販売1億本を突破。ヘルスサイエンス事業の成長を象徴する成果となった。',
      region: 'japan',
      sentiment: 'positive',
    },
  ],
  nintendo: [
    {
      id: 'mock-nintendo-g1',
      title: 'Nintendo Switch 2 Pre-Orders Exceed Expectations Globally',
      source: 'Bloomberg',
      url: 'https://example.com/switch2-preorders',
      publishedAt: '2026-04-12T08:00:00Z',
      snippet: 'Pre-order demand for Nintendo\'s Switch 2 console has surpassed initial projections, with retailers reporting waitlists across North America and Europe.',
      region: 'global',
      sentiment: 'positive',
    },
    {
      id: 'mock-nintendo-g2',
      title: 'Nintendo Faces Backlash Over Palworld Lawsuit',
      source: 'The Verge',
      url: 'https://example.com/nintendo-palworld',
      publishedAt: '2026-04-10T15:00:00Z',
      snippet: 'Nintendo\'s aggressive IP protection strategy has drawn criticism from indie developers and gamers, with the Palworld patent lawsuit becoming a lightning rod for debate.',
      region: 'global',
      sentiment: 'negative',
    },
    {
      id: 'mock-nintendo-g3',
      title: 'Super Nintendo World Expansion Opens at Universal Studios Hollywood',
      source: 'Reuters',
      url: 'https://example.com/nintendo-world-hollywood',
      publishedAt: '2026-04-08T12:00:00Z',
      snippet: 'The new Super Nintendo World area at Universal Studios Hollywood has opened to strong attendance, demonstrating the continued strength of Nintendo\'s IP licensing strategy.',
      region: 'global',
      sentiment: 'positive',
    },
    {
      id: 'mock-nintendo-j1',
      title: '任天堂、Switch 2の国内初回出荷台数を上方修正',
      source: '日本経済新聞',
      url: 'https://example.com/switch2-japan',
      publishedAt: '2026-04-11T06:00:00Z',
      snippet: '任天堂はSwitch 2の国内初回出荷台数を当初計画から上方修正。国内予約の好調を受けた対応で、発売日の品薄回避を目指す。',
      region: 'japan',
      sentiment: 'positive',
    },
    {
      id: 'mock-nintendo-j2',
      title: 'ゲーム業界、開発費高騰が経営圧迫',
      source: '朝日新聞',
      url: 'https://example.com/game-dev-costs',
      publishedAt: '2026-04-09T07:30:00Z',
      snippet: '次世代機向けゲームの開発費高騰が業界全体の課題に。任天堂も例外ではなく、タイトル数の絞り込みと外部委託の拡大で対応する方針。',
      region: 'japan',
      sentiment: 'mixed',
    },
    {
      id: 'mock-nintendo-j3',
      title: '任天堂IPの映画展開、第2弾の制作決定',
      source: '東洋経済',
      url: 'https://example.com/nintendo-movie',
      publishedAt: '2026-04-07T10:00:00Z',
      snippet: 'マリオ映画の世界的大ヒットを受け、任天堂は新たなIP映画化プロジェクトの始動を発表。ゼルダの伝説が有力候補とされる。',
      region: 'japan',
      sentiment: 'positive',
    },
  ],
}
```

- [ ] **Step 2: Verify it compiles**

Run: `bunx tsc --noEmit 2>&1 | head -20`

- [ ] **Step 3: Commit**

```bash
git add data/mockNews.ts
git commit -m "feat: add mock news data for all companies"
```

---

### Task 3: Mock Data — Sentiment Results

**Files:**
- Create: `data/mockSentiment.ts`

- [ ] **Step 1: Create mock sentiment data**

```typescript
// data/mockSentiment.ts

import { SentimentResult } from '@/types/sentiment'

export const mockSentiment: Record<string, SentimentResult> = {
  kodansha: {
    globalSummary: 'Global coverage of Kodansha is cautiously optimistic, with attention on their expanding manga licensing deals in North America and European markets. However, several outlets raise concerns about AI-generated content threatening traditional manga workflows, a theme that has intensified over the past two weeks.',
    japanSummary: 'Japanese media coverage is focused on Kodansha\'s digital platform overhaul and the growing challenge of attracting new manga creators. There is a notable tension between optimism about IP monetization success and concern about the pipeline of new talent entering the industry.',
    globalSentiment: 'mixed',
    japanSentiment: 'mixed',
    globalThemes: ['manga licensing growth', 'AI content risks', 'IP monetization'],
    japanThemes: ['digital platform renewal', 'creator pipeline concerns', 'IP long-term value'],
    articleSentiments: {
      'mock-kodansha-g1': 'positive',
      'mock-kodansha-g2': 'negative',
      'mock-kodansha-g3': 'positive',
      'mock-kodansha-g4': 'neutral',
      'mock-kodansha-j1': 'positive',
      'mock-kodansha-j2': 'negative',
      'mock-kodansha-j3': 'positive',
      'mock-kodansha-j4': 'mixed',
    },
  },
  persol: {
    globalSummary: 'International coverage highlights PERSOL\'s AI-driven recruitment transformation as a bright spot, while noting the structural challenge of Japan\'s deepening labor shortage. The company\'s Southeast Asian expansion is viewed as a pragmatic growth strategy.',
    japanSummary: 'Japanese media portrays PERSOL as a frontrunner in HR industry digitalization, but notes the threat that Gen Z\'s evolving work attitudes pose to the traditional staffing model. Reskilling initiatives are seen as a necessary pivot.',
    globalSentiment: 'mixed',
    japanSentiment: 'mixed',
    globalThemes: ['AI recruitment', 'labor shortage', 'Southeast Asia expansion'],
    japanThemes: ['reskilling push', 'Gen Z work attitudes', 'HR digitalization lead'],
    articleSentiments: {
      'mock-persol-g1': 'positive',
      'mock-persol-g2': 'mixed',
      'mock-persol-g3': 'positive',
      'mock-persol-j1': 'positive',
      'mock-persol-j2': 'negative',
      'mock-persol-j3': 'positive',
    },
  },
  'ntt-east': {
    globalSummary: 'Global sentiment toward NTT East reflects a familiar telecom narrative: core fixed-line revenue is declining, but data center and smart city initiatives provide a growth counterbalance. The AI-driven surge in data center demand is a particularly positive signal.',
    japanSummary: 'Japanese coverage emphasizes NTT East\'s role in regional digital transformation, with government DX packages receiving positive attention. However, the first-ever decline in fiber subscriptions signals a structural shift that is difficult to reverse.',
    globalSentiment: 'mixed',
    japanSentiment: 'mixed',
    globalThemes: ['data center demand', 'fixed-line decline', 'smart city growth'],
    japanThemes: ['regional DX leadership', 'fiber subscription decline', 'data center investment'],
    articleSentiments: {
      'mock-ntt-g1': 'positive',
      'mock-ntt-g2': 'negative',
      'mock-ntt-g3': 'positive',
      'mock-ntt-j1': 'positive',
      'mock-ntt-j2': 'negative',
      'mock-ntt-j3': 'positive',
    },
  },
  kikkoman: {
    globalSummary: 'International coverage of Kikkoman is broadly positive, centered on the company\'s successful expansion into plant-based products and the tailwind from record Japanese food exports. Sustainability pressures remain a watchpoint but are not yet a major concern.',
    japanSummary: 'Domestic coverage highlights Kikkoman\'s growing market share in Japan\'s soy sauce market, driven by health-conscious product lines. Raw material cost pressures are a concern, but the fermented food trend among younger consumers is a notable positive.',
    globalSentiment: 'positive',
    japanSentiment: 'mixed',
    globalThemes: ['plant-based expansion', 'food export boom', 'sustainability pressure'],
    japanThemes: ['market share growth', 'raw material costs', 'Gen Z fermented food interest'],
    articleSentiments: {
      'mock-kikkoman-g1': 'positive',
      'mock-kikkoman-g2': 'positive',
      'mock-kikkoman-g3': 'mixed',
      'mock-kikkoman-j1': 'positive',
      'mock-kikkoman-j2': 'negative',
      'mock-kikkoman-j3': 'positive',
    },
  },
  kirin: {
    globalSummary: 'Global coverage of Kirin reflects a company in strategic transition. The health science pivot is generating positive attention, while the declining alcohol market among Gen Z remains a persistent theme. Recovery in the Australian beer market provides a near-term boost.',
    japanSummary: 'Japanese media covers Kirin\'s non-alcoholic brand launch favorably, framing it as a timely response to shifting consumer preferences. The continued shrinkage of the domestic beer market is treated as an industry-wide inevitability rather than a Kirin-specific failure.',
    globalSentiment: 'mixed',
    japanSentiment: 'mixed',
    globalThemes: ['health science pivot', 'Gen Z alcohol decline', 'Australian recovery'],
    japanThemes: ['non-alcoholic innovation', 'beer market decline', 'iMUSE success'],
    articleSentiments: {
      'mock-kirin-g1': 'positive',
      'mock-kirin-g2': 'mixed',
      'mock-kirin-g3': 'positive',
      'mock-kirin-j1': 'positive',
      'mock-kirin-j2': 'negative',
      'mock-kirin-j3': 'positive',
    },
  },
  nintendo: {
    globalSummary: 'Global sentiment toward Nintendo is strongly positive, driven by exceptional Switch 2 pre-order demand and the successful expansion of Super Nintendo World theme parks. The ongoing Palworld lawsuit is a reputational risk, though it hasn\'t materially dampened enthusiasm.',
    japanSummary: 'Japanese coverage is optimistic about Nintendo\'s hardware cycle momentum and IP expansion into film. Rising game development costs are noted as an industry-wide headwind, but Nintendo\'s financial reserves and focused portfolio strategy are seen as buffers.',
    globalSentiment: 'positive',
    japanSentiment: 'positive',
    globalThemes: ['Switch 2 demand', 'IP licensing success', 'patent litigation risk'],
    japanThemes: ['hardware cycle momentum', 'movie IP expansion', 'development cost pressure'],
    articleSentiments: {
      'mock-nintendo-g1': 'positive',
      'mock-nintendo-g2': 'negative',
      'mock-nintendo-g3': 'positive',
      'mock-nintendo-j1': 'positive',
      'mock-nintendo-j2': 'mixed',
      'mock-nintendo-j3': 'positive',
    },
  },
}
```

- [ ] **Step 2: Verify it compiles**

Run: `bunx tsc --noEmit 2>&1 | head -20`

- [ ] **Step 3: Commit**

```bash
git add data/mockSentiment.ts
git commit -m "feat: add mock sentiment data for all companies"
```

---

### Task 4: News API Route (Stage 1)

**Files:**
- Create: `lib/newsApi.ts`
- Create: `app/api/news/[company]/route.ts`

- [ ] **Step 1: Create the news API fetch logic**

```typescript
// lib/newsApi.ts

import { NewsArticle } from '@/types/sentiment'
import { companies } from '@/data/companies'

const THE_NEWS_API_BASE = 'https://api.thenewsapi.com/v1/news/all'

interface TheNewsApiArticle {
  uuid: string
  title: string
  source: string
  url: string
  published_at: string
  description: string
  snippet: string
}

interface TheNewsApiResponse {
  data: TheNewsApiArticle[]
}

export async function fetchNewsForCompany(companyId: string): Promise<NewsArticle[]> {
  const apiKey = process.env.THE_NEWS_API_KEY
  if (!apiKey) return []

  const company = companies.find((c) => c.id === companyId)
  if (!company) return []

  const [globalArticles, japanArticles] = await Promise.all([
    fetchArticles(apiKey, company.name, 'en'),
    fetchArticles(apiKey, `${company.name} OR ${company.nameJp}`, 'ja'),
  ])

  const toNewsArticle = (article: TheNewsApiArticle, region: 'global' | 'japan'): NewsArticle => ({
    id: article.uuid,
    title: article.title,
    source: article.source,
    url: article.url,
    publishedAt: article.published_at,
    snippet: article.snippet || article.description || '',
    region,
    sentiment: 'neutral', // placeholder — Stage 2 will assign real sentiment
  })

  return [
    ...globalArticles.map((a) => toNewsArticle(a, 'global')),
    ...japanArticles.map((a) => toNewsArticle(a, 'japan')),
  ]
}

async function fetchArticles(
  apiKey: string,
  search: string,
  language: string,
  limit = 10
): Promise<TheNewsApiArticle[]> {
  const params = new URLSearchParams({
    api_token: apiKey,
    search,
    language,
    limit: String(limit),
    sort: 'published_at',
  })

  const res = await fetch(`${THE_NEWS_API_BASE}?${params}`)
  if (!res.ok) return []

  const data: TheNewsApiResponse = await res.json()
  return data.data || []
}
```

- [ ] **Step 2: Create the API route**

```typescript
// app/api/news/[company]/route.ts

import { NextResponse } from 'next/server'
import { fetchNewsForCompany } from '@/lib/newsApi'
import { mockNews } from '@/data/mockNews'

export const revalidate = 900

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ company: string }> }
) {
  const { company } = await params

  try {
    const articles = await fetchNewsForCompany(company)
    if (articles.length > 0) {
      return NextResponse.json({ articles, source: 'live' })
    }
  } catch {
    // fall through to mock data
  }

  const articles = mockNews[company] || []
  return NextResponse.json({ articles, source: 'mock' })
}
```

- [ ] **Step 3: Verify the route compiles**

Run: `bunx tsc --noEmit 2>&1 | head -20`

- [ ] **Step 4: Test manually**

Run: `bun dev &`

Then: `curl -s http://localhost:3000/api/news/kodansha | head -c 500`

Expected: JSON response with mock articles (since no API key is set).

Kill the dev server after verifying.

- [ ] **Step 5: Commit**

```bash
git add lib/newsApi.ts app/api/news/
git commit -m "feat: add news API route with TheNewsAPI integration and mock fallback"
```

---

### Task 5: Sentiment API Route (Stage 2)

**Files:**
- Create: `lib/sentimentApi.ts`
- Create: `app/api/sentiment/[company]/route.ts`

- [ ] **Step 1: Create the sentiment analysis logic**

```typescript
// lib/sentimentApi.ts

import { NewsArticle, SentimentResult } from '@/types/sentiment'
import Anthropic from '@anthropic-ai/sdk'

export async function analyzeSentiment(
  companyName: string,
  articles: NewsArticle[]
): Promise<SentimentResult | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return null

  const globalArticles = articles.filter((a) => a.region === 'global')
  const japanArticles = articles.filter((a) => a.region === 'japan')

  if (globalArticles.length === 0 && japanArticles.length === 0) return null

  const client = new Anthropic({ apiKey })

  const articleList = articles
    .map((a) => `[${a.id}] (${a.region}) ${a.title} — ${a.snippet}`)
    .join('\n')

  const message = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: `Analyze the sentiment of recent news coverage about ${companyName}. The articles are divided into global (English) and Japan (Japanese) sources.

Articles:
${articleList}

Respond with ONLY valid JSON matching this exact structure:
{
  "globalSummary": "2-3 sentence summary of global coverage tone, grounded in the articles",
  "japanSummary": "2-3 sentence summary of Japanese coverage tone, noting any divergence from global",
  "globalSentiment": "positive" | "neutral" | "mixed" | "negative",
  "japanSentiment": "positive" | "neutral" | "mixed" | "negative",
  "globalThemes": ["theme1", "theme2", "theme3"],
  "japanThemes": ["theme1", "theme2", "theme3"],
  "articleSentiments": { "article-id": "positive" | "neutral" | "mixed" | "negative" }
}

Rules:
- Base summaries ONLY on the provided articles, not general knowledge
- globalThemes and japanThemes should be 2-3 short labels each
- articleSentiments must include an entry for every article ID
- If one lens has no articles, set its summary to "No recent coverage available" and sentiment to "neutral"`,
      },
    ],
  })

  try {
    const text = message.content[0].type === 'text' ? message.content[0].text : ''
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) return null
    return JSON.parse(jsonMatch[0]) as SentimentResult
  } catch {
    return null
  }
}
```

- [ ] **Step 2: Install the Anthropic SDK**

Run: `bun add @anthropic-ai/sdk`

- [ ] **Step 3: Create the API route**

```typescript
// app/api/sentiment/[company]/route.ts

import { NextResponse } from 'next/server'
import { analyzeSentiment } from '@/lib/sentimentApi'
import { mockNews } from '@/data/mockNews'
import { mockSentiment } from '@/data/mockSentiment'
import { companies } from '@/data/companies'

export const revalidate = 900

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ company: string }> }
) {
  const { company } = await params
  const companyProfile = companies.find((c) => c.id === company)

  if (!companyProfile) {
    return NextResponse.json({ sentiment: null, source: 'mock' })
  }

  try {
    // Fetch articles from our news endpoint
    const newsRes = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/news/${company}`,
      { next: { revalidate: 900 } }
    )
    const newsData = await newsRes.json()

    if (newsData.source === 'live' && newsData.articles.length > 0) {
      const sentiment = await analyzeSentiment(companyProfile.name, newsData.articles)
      if (sentiment) {
        return NextResponse.json({ sentiment, source: 'live' })
      }
    }
  } catch {
    // fall through to mock data
  }

  const sentiment = mockSentiment[company] || null
  return NextResponse.json({ sentiment, source: 'mock' })
}
```

- [ ] **Step 4: Verify the route compiles**

Run: `bunx tsc --noEmit 2>&1 | head -20`

- [ ] **Step 5: Test manually**

Run: `bun dev &`

Then: `curl -s http://localhost:3000/api/sentiment/kodansha | head -c 500`

Expected: JSON response with mock sentiment data.

Kill the dev server after verifying.

- [ ] **Step 6: Commit**

```bash
git add lib/sentimentApi.ts app/api/sentiment/
git commit -m "feat: add sentiment API route with Claude analysis and mock fallback"
```

---

### Task 6: Client-Side Hook

**Files:**
- Create: `lib/useSentiment.ts`

- [ ] **Step 1: Create the sentiment hook**

```typescript
// lib/useSentiment.ts

'use client'

import { useEffect, useState } from 'react'
import { NewsArticle, SentimentResult } from '@/types/sentiment'

export function useSentiment(companyId: string) {
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [sentiment, setSentiment] = useState<SentimentResult | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const run = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const [newsRes, sentimentRes] = await Promise.all([
          fetch(`/api/news/${companyId}`),
          fetch(`/api/sentiment/${companyId}`),
        ])

        if (!isMounted) return

        if (newsRes.ok) {
          const newsData = await newsRes.json()
          setArticles(newsData.articles || [])
        }

        if (sentimentRes.ok) {
          const sentimentData = await sentimentRes.json()
          setSentiment(sentimentData.sentiment || null)
        }
      } catch (err) {
        if (isMounted) {
          setError('Failed to load sentiment data')
        }
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    void run()
    return () => {
      isMounted = false
    }
  }, [companyId])

  return { articles, sentiment, isLoading, error }
}
```

- [ ] **Step 2: Verify it compiles**

Run: `bunx tsc --noEmit 2>&1 | head -20`

- [ ] **Step 3: Commit**

```bash
git add lib/useSentiment.ts
git commit -m "feat: add useSentiment client hook"
```

---

### Task 7: SentimentSection Component

**Files:**
- Create: `components/SentimentSection.tsx`

- [ ] **Step 1: Create the SentimentSection component**

```typescript
// components/SentimentSection.tsx

'use client'

import { useState } from 'react'
import { useSentiment } from '@/lib/useSentiment'
import { Region, SentimentRating } from '@/types/sentiment'
import TagPill from '@/components/TagPill'

const SENTIMENT_COLORS: Record<SentimentRating, string> = {
  positive: 'var(--green)',
  neutral: 'var(--text-secondary)',
  mixed: 'var(--blue)',
  negative: 'var(--red)',
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function SentimentSection({ companyId }: { companyId: string }) {
  const { articles, sentiment, isLoading } = useSentiment(companyId)
  const [activeRegion, setActiveRegion] = useState<Region>('global')

  const filteredArticles = articles.filter((a) => a.region === activeRegion)
  const summary = activeRegion === 'global' ? sentiment?.globalSummary : sentiment?.japanSummary
  const sentimentRating = activeRegion === 'global' ? sentiment?.globalSentiment : sentiment?.japanSentiment
  const themes = activeRegion === 'global' ? sentiment?.globalThemes : sentiment?.japanThemes

  if (isLoading) {
    return (
      <div style={{ padding: '24px 32px 48px' }}>
        <span
          style={{
            fontFamily: 'var(--font-dm-mono), monospace',
            fontSize: '9px',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--gold)',
            display: 'block',
            marginBottom: '16px',
          }}
        >
          Sentiment Analysis
        </span>
        {/* Skeleton loader */}
        <div
          style={{
            border: '1px solid var(--border-primary)',
            borderLeft: '3px solid var(--gold-dim)',
            padding: '20px 24px',
            background: 'var(--bg-secondary)',
          }}
        >
          <div
            style={{
              height: '12px',
              width: '120px',
              background: 'var(--bg-tertiary)',
              marginBottom: '12px',
              borderRadius: '2px',
            }}
          />
          <div
            style={{
              height: '14px',
              width: '100%',
              background: 'var(--bg-tertiary)',
              marginBottom: '8px',
              borderRadius: '2px',
            }}
          />
          <div
            style={{
              height: '14px',
              width: '80%',
              background: 'var(--bg-tertiary)',
              borderRadius: '2px',
            }}
          />
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: '24px 32px 48px' }}>
      {/* Section header with toggle */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-dm-mono), monospace',
            fontSize: '9px',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--gold)',
          }}
        >
          Sentiment Analysis
        </span>
        <div style={{ display: 'flex', border: '1px solid var(--border-secondary)' }}>
          {(['global', 'japan'] as Region[]).map((region) => (
            <button
              key={region}
              onClick={() => setActiveRegion(region)}
              style={{
                padding: '4px 12px',
                background: activeRegion === region ? 'var(--gold)' : 'transparent',
                color: activeRegion === region ? 'var(--bg-primary)' : 'var(--text-secondary)',
                fontFamily: 'var(--font-dm-mono), monospace',
                fontSize: '10px',
                fontWeight: activeRegion === region ? 600 : 400,
                border: 'none',
                borderLeft: region === 'japan' ? '1px solid var(--border-secondary)' : 'none',
                cursor: 'pointer',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              {region}
            </button>
          ))}
        </div>
      </div>

      {/* Summary card */}
      {sentiment ? (
        <div
          style={{
            border: '1px solid var(--border-primary)',
            borderLeft: '3px solid var(--gold)',
            padding: '20px 24px',
            marginBottom: '16px',
            background: 'var(--bg-secondary)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '12px',
            }}
          >
            {sentimentRating && (
              <span
                style={{
                  fontFamily: 'var(--font-dm-mono), monospace',
                  fontSize: '9px',
                  padding: '2px 8px',
                  border: `1px solid ${SENTIMENT_COLORS[sentimentRating]}`,
                  color: SENTIMENT_COLORS[sentimentRating],
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                {sentimentRating}
              </span>
            )}
            <span
              style={{
                fontFamily: 'var(--font-dm-mono), monospace',
                fontSize: '9px',
                color: 'var(--text-muted)',
              }}
            >
              Based on {filteredArticles.length} articles
            </span>
          </div>
          <p
            style={{
              margin: 0,
              lineHeight: 1.7,
              color: 'var(--text-secondary)',
              fontSize: '13px',
              fontFamily: 'var(--font-dm-mono), monospace',
            }}
          >
            {summary}
          </p>
          {themes && themes.length > 0 && (
            <div
              style={{
                display: 'flex',
                gap: '6px',
                marginTop: '12px',
                flexWrap: 'wrap',
              }}
            >
              {themes.map((theme) => (
                <TagPill key={theme} label={theme} />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div
          style={{
            border: '1px solid var(--border-primary)',
            padding: '20px 24px',
            marginBottom: '16px',
            background: 'var(--bg-secondary)',
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-dm-mono), monospace',
            fontSize: '11px',
          }}
        >
          Sentiment analysis unavailable
        </div>
      )}

      {/* Sources label */}
      {filteredArticles.length > 0 && (
        <span
          style={{
            fontFamily: 'var(--font-dm-mono), monospace',
            fontSize: '9px',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
            display: 'block',
            marginBottom: '8px',
          }}
        >
          Sources
        </span>
      )}

      {/* Article list */}
      {filteredArticles.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {filteredArticles.map((article) => {
            const articleSentiment =
              sentiment?.articleSentiments[article.id] || article.sentiment
            return (
              <a
                key={article.id}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'block',
                  border: '1px solid var(--border-primary)',
                  padding: '12px 16px',
                  background: 'var(--bg-primary)',
                  textDecoration: 'none',
                  transition: 'border-color 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-secondary)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-primary)'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'start',
                    marginBottom: '4px',
                    gap: '12px',
                  }}
                >
                  <span
                    style={{
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                      fontFamily: 'var(--font-cormorant), serif',
                      fontWeight: 400,
                      lineHeight: 1.3,
                    }}
                  >
                    {article.title}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-dm-mono), monospace',
                      fontSize: '9px',
                      padding: '2px 6px',
                      border: `1px solid ${SENTIMENT_COLORS[articleSentiment]}`,
                      color: SENTIMENT_COLORS[articleSentiment],
                      textTransform: 'uppercase',
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                    }}
                  >
                    {articleSentiment}
                  </span>
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-dm-mono), monospace',
                    fontSize: '10px',
                    color: 'var(--text-muted)',
                    marginBottom: '4px',
                  }}
                >
                  {article.source} · {formatDate(article.publishedAt)}
                </div>
                <p
                  style={{
                    margin: 0,
                    fontSize: '11px',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.5,
                    fontFamily: 'var(--font-dm-mono), monospace',
                  }}
                >
                  {article.snippet}
                </p>
              </a>
            )
          })}
        </div>
      ) : (
        <div
          style={{
            padding: '20px 24px',
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-dm-mono), monospace',
            fontSize: '11px',
            textAlign: 'center',
          }}
        >
          No recent coverage
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Verify it compiles**

Run: `bunx tsc --noEmit 2>&1 | head -20`

- [ ] **Step 3: Commit**

```bash
git add components/SentimentSection.tsx
git commit -m "feat: add SentimentSection component with dual-lens toggle"
```

---

### Task 8: Integrate into Dashboard

**Files:**
- Modify: `app/dashboard/page.tsx`

- [ ] **Step 1: Add import and render SentimentSection**

Add the import at the top of `app/dashboard/page.tsx`, after the existing imports:

```typescript
import { SentimentSection } from '@/components/SentimentSection'
```

Then add the `SentimentSection` component right after the closing `</div>` of the "Most Relevant Events" section (the `<div style={{ padding: '24px 32px 48px' }}>` block), and before the closing `</div>` of the scrollable area:

```typescript
        {/* Sentiment Analysis */}
        <SentimentSection companyId={selectedCompany.id} />
```

The modified section of the dashboard should look like:

```typescript
        {/* Most Relevant Events */}
        <div style={{ padding: '24px 32px 48px' }}>
          <span
            style={{
              fontFamily: 'var(--font-dm-mono), monospace',
              fontSize: '9px',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--gold)',
              display: 'block',
              marginBottom: '16px',
            }}
          >
            {t.mostRelevant}
          </span>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '12px',
            }}
          >
            {rankedEvents.map(({ event }) => (
              <EventCard
                key={event.id}
                event={event}
                onClick={() => handleEventClick(event)}
              />
            ))}
          </div>
        </div>

        {/* Sentiment Analysis */}
        <SentimentSection companyId={selectedCompany.id} />
```

- [ ] **Step 2: Verify it compiles**

Run: `bunx tsc --noEmit 2>&1 | head -20`

- [ ] **Step 3: Visual verification**

Run: `bun dev`

Open http://localhost:3000/dashboard in the browser. Verify:
- Sentiment Analysis section appears below the events grid
- Global/Japan toggle works
- Summary card shows with sentiment badge and theme pills
- Article list shows with clickable headlines, source, date, snippet, and sentiment tags
- Switching companies updates the sentiment section

- [ ] **Step 4: Commit**

```bash
git add app/dashboard/page.tsx
git commit -m "feat: integrate SentimentSection into company dashboard"
```

---

### Task 9: Final Build Verification

- [ ] **Step 1: Run the production build**

Run: `bun run build`

Expected: Build completes successfully with no errors.

- [ ] **Step 2: Run the linter**

Run: `bun run lint`

Expected: No new lint errors.

- [ ] **Step 3: Manual smoke test**

Run: `bun dev`

Test all 6 companies in the dashboard:
1. Select each company from the dropdown
2. Verify sentiment section updates with correct mock data
3. Toggle between Global and Japan for each
4. Click an article link (should open example.com in new tab)
5. Verify loading skeleton appears briefly on company switch

- [ ] **Step 4: Final commit (if any fixes needed)**

```bash
git add -A
git commit -m "fix: address build/lint issues from sentiment feature"
```
