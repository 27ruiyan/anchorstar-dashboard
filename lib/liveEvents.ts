import { Event, GenZArchetype, ResilienceDomain, ResiliencePattern, Urgency } from '@/types'

type NewsApiArticle = {
  source?: { name?: string | null } | null
  author?: string | null
  title?: string | null
  description?: string | null
  content?: string | null
  publishedAt?: string | null
}

type NewsApiResponse = {
  status: 'ok' | 'error'
  totalResults?: number
  articles?: NewsApiArticle[]
}

const COUNTRY_COORDS: Record<string, [number, number]> = {
  japan: [138.2, 36.2],
  'south korea': [127.7, 36.5],
  korea: [127.7, 36.5],
  china: [104.2, 35.9],
  taiwan: [120.9, 23.7],
  singapore: [103.8, 1.35],
  indonesia: [106.8, -6.2],
  thailand: [100.5, 13.75],
  vietnam: [106.6, 10.8],
  philippines: [121.0, 14.6],
  india: [78.9, 22.9],
  australia: [133.8, -25.2],
  'united kingdom': [-1.5, 52.3],
  uk: [-1.5, 52.3],
  france: [2.3, 46.8],
  germany: [10.5, 51.2],
  netherlands: [5.3, 52.1],
  spain: [-3.7, 40.4],
  italy: [12.5, 41.9],
  brazil: [-51.9, -14.2],
  chile: [-70.6, -30.5],
  mexico: [-102.5, 23.6],
  canada: [-106.3, 56.1],
  'united states': [-98.5, 39.5],
  usa: [-98.5, 39.5],
}

const defaultCoordinates: [number, number] = [20, 10]

const resilienceKeywords: Array<{ domain: ResilienceDomain; words: string[] }> = [
  { domain: 'Work', words: ['work', 'labor', 'employment', 'workforce', 'productivity', 'automation'] },
  { domain: 'Selfhood', words: ['identity', 'consumer', 'creator', 'lifestyle', 'mental health', 'behavior'] },
  { domain: 'Community', words: ['community', 'housing', 'social', 'collective', 'union'] },
  { domain: 'Aging', words: ['aging', 'elderly', 'birth rate', 'fertility', 'demographic'] },
  { domain: 'Environment', words: ['climate', 'carbon', 'energy', 'sustainability', 'resource'] },
]

const patternKeywords: Array<{ pattern: ResiliencePattern; words: string[] }> = [
  { pattern: 'Finding advantage in the cracks', words: ['ai', 'efficiency', 'optimization', 'disruption'] },
  { pattern: 'Existential reinvention', words: ['demographic', 'structural', 'reinvent', 'collapse'] },
  { pattern: 'Redefining what is normal', words: ['policy', 'regulation', 'shift', 'expectation'] },
  { pattern: 'Enabling collective growth', words: ['community', 'platform', 'creator', 'shared'] },
]

const archetypeKeywords: Array<{ archetype: GenZArchetype; words: string[] }> = [
  { archetype: 'Optimizer', words: ['ai', 'automation', 'efficiency', 'cost'] },
  { archetype: 'Explorer', words: ['innovation', 'new', 'emerging', 'trend'] },
  { archetype: 'Builder', words: ['startup', 'creator', 'build', 'entrepreneur'] },
  { archetype: 'Grounded Minimalist', words: ['climate', 'sustainability', 'resilient', 'wellbeing'] },
]

function inferUrgency(text: string): Urgency {
  if (/\b(crisis|collapse|critical|emergency|war|shock)\b/i.test(text)) return 'critical'
  if (/\b(disruption|surge|warning|risk|tensions)\b/i.test(text)) return 'high'
  if (/\b(shift|trend|pressure|change)\b/i.test(text)) return 'medium'
  return 'low'
}

function inferDomains(text: string): ResilienceDomain[] {
  const hits = resilienceKeywords
    .filter(({ words }) => words.some((word) => text.includes(word)))
    .map(({ domain }) => domain)
  return hits.length > 0 ? hits.slice(0, 2) : ['Work']
}

function inferPattern(text: string): ResiliencePattern {
  return (
    patternKeywords.find(({ words }) => words.some((word) => text.includes(word)))?.pattern ??
    'Redefining what is normal'
  )
}

function inferArchetypes(text: string): GenZArchetype[] {
  const hits = archetypeKeywords
    .filter(({ words }) => words.some((word) => text.includes(word)))
    .map(({ archetype }) => archetype)
  return hits.length > 0 ? hits.slice(0, 2) : ['Explorer']
}

function inferCountryAndCoordinates(text: string): { country: string; coordinates: [number, number] } {
  const lowered = text.toLowerCase()
  for (const [country, coords] of Object.entries(COUNTRY_COORDS)) {
    if (lowered.includes(country)) {
      const normalized = country === 'usa' ? 'United States' : country.replace(/\b\w/g, (c) => c.toUpperCase())
      return { country: normalized, coordinates: coords }
    }
  }
  return { country: 'Global', coordinates: defaultCoordinates }
}

function toIsoDate(value?: string | null): string {
  if (!value) return new Date().toISOString().slice(0, 10)
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return new Date().toISOString().slice(0, 10)
  return parsed.toISOString().slice(0, 10)
}

function toEvent(article: NewsApiArticle, index: number): Event | null {
  const title = article.title?.trim()
  if (!title) return null

  const summary = article.description?.trim() || article.content?.trim() || 'Live news update.'
  const source = article.source?.name?.trim() || article.author?.trim() || 'Live feed'
  const timestamp = toIsoDate(article.publishedAt)
  const combinedText = `${title} ${summary}`.toLowerCase()
  const { country, coordinates } = inferCountryAndCoordinates(combinedText)

  return {
    id: `live-${timestamp}-${index}`,
    title,
    summary,
    source,
    timestamp,
    country,
    coordinates,
    resilienceDomains: inferDomains(combinedText),
    resiliencePattern: inferPattern(combinedText),
    genZArchetypes: inferArchetypes(combinedText),
    generationComparison:
      'Live article indicates an emerging shift that may widen generational expectation gaps in consumer and workforce behavior.',
    confidence: 'medium',
    urgency: inferUrgency(combinedText),
    industryRelevance: ['Technology', 'Media', 'Consumer Goods'],
  }
}

export async function fetchLiveEvents(limit = 18): Promise<Event[]> {
  const apiKey = process.env.NEWS_API_KEY
  if (!apiKey) return []

  const q = encodeURIComponent(
    '(gen z OR workforce OR labor OR ai OR climate OR supply chain OR retail OR manufacturing OR demographics)'
  )
  const url = `https://newsapi.org/v2/everything?q=${q}&language=en&sortBy=publishedAt&pageSize=${limit}&apiKey=${apiKey}`
  const res = await fetch(url, { next: { revalidate: 900 } })
  if (!res.ok) return []

  const payload = (await res.json()) as NewsApiResponse
  if (payload.status !== 'ok' || !payload.articles) return []

  return payload.articles.map(toEvent).filter((event): event is Event => Boolean(event))
}
