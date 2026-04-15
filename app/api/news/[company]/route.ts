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
