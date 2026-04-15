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
