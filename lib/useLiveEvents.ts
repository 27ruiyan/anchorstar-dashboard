'use client'

import { useEffect, useState } from 'react'
import { Event } from '@/types'
import { events as fallbackEvents } from '@/data/events'

type EventsResponse = {
  events?: Event[]
  source?: 'live' | 'fallback'
}

export function useLiveEvents() {
  const [events, setEvents] = useState<Event[]>(fallbackEvents)
  const [isLoading, setIsLoading] = useState(true)
  const [source, setSource] = useState<'live' | 'fallback'>('fallback')

  useEffect(() => {
    let isMounted = true

    const run = async () => {
      try {
        const res = await fetch('/api/events')
        if (!res.ok) return
        const data = (await res.json()) as EventsResponse
        if (!isMounted || !data.events || data.events.length === 0) return
        setEvents(data.events)
        setSource(data.source === 'live' ? 'live' : 'fallback')
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    void run()
    return () => {
      isMounted = false
    }
  }, [])

  return { events, isLoading, source }
}
