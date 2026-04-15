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
