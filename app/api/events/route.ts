import { NextResponse } from 'next/server'
import { fetchLiveEvents } from '@/lib/liveEvents'
import { events as fallbackEvents } from '@/data/events'

export const revalidate = 900

export async function GET() {
  try {
    const liveEvents = await fetchLiveEvents()
    if (liveEvents.length > 0) {
      return NextResponse.json({ events: liveEvents, source: 'live' })
    }
    return NextResponse.json({ events: fallbackEvents, source: 'fallback' })
  } catch {
    return NextResponse.json({ events: fallbackEvents, source: 'fallback' })
  }
}
