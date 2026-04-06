export type ResilienceDomain = 'Work' | 'Selfhood' | 'Community' | 'Aging' | 'Environment'
export type ResiliencePattern =
  | 'Finding advantage in the cracks'
  | 'Existential reinvention'
  | 'Redefining what is normal'
  | 'Enabling collective growth'
export type GenZArchetype = 'Optimizer' | 'Explorer' | 'Builder' | 'Grounded Minimalist'
export type Urgency = 'low' | 'medium' | 'high' | 'critical'
export type Confidence = 'low' | 'medium' | 'high'

export interface Event {
  id: string
  title: string
  titleJp?: string
  summary: string
  summaryJp?: string
  source: string
  timestamp: string
  country: string
  coordinates: [number, number]
  resilienceDomains: ResilienceDomain[]
  resiliencePattern: ResiliencePattern
  genZArchetypes: GenZArchetype[]
  generationComparison: string
  confidence: Confidence
  urgency: Urgency
  industryRelevance: string[]
}

export interface CompanyProfile {
  id: string
  name: string
  nameJp: string
  sector: string
  employees: string
  businessModel: string
  businessModelJp?: string
  geographies: string[]
  strengths: string[]
  risks: string[]
  strategicPriorities: string[]
  strategicPrioritiesJp?: string[]
  customerProfile: string
  customerProfileJp?: string
  defaultScores: ResilienceScore
}

export interface ResilienceScore {
  genZAlignment: number
  adaptationReadiness: number
  exposureToDisruption: number
  ecosystemStrength: number
  reinventionMomentum: number
}

export interface InsightCard {
  eventId: string
  companyId: string
  whyItMatters: string
  genZSignal: string
  generationalContrast: string
  companyImplication: string
  risks: string[]
  opportunities: string[]
  recommendedActions: string[]
}
