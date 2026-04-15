import { NextResponse } from 'next/server'
import { analyzeSentiment } from '@/lib/sentimentApi'
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
