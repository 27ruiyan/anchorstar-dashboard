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
