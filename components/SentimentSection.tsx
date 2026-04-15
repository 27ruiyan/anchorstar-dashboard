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
        <div
          style={{
            border: '1px solid var(--border-primary)',
            borderLeft: '3px solid var(--gold-dim)',
            padding: '20px 24px',
            background: 'var(--bg-secondary)',
          }}
        >
          <div style={{ height: '12px', width: '120px', background: 'var(--bg-tertiary)', marginBottom: '12px', borderRadius: '2px' }} />
          <div style={{ height: '14px', width: '100%', background: 'var(--bg-tertiary)', marginBottom: '8px', borderRadius: '2px' }} />
          <div style={{ height: '14px', width: '80%', background: 'var(--bg-tertiary)', borderRadius: '2px' }} />
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: '24px 32px 48px' }}>
      {/* Section header with toggle */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
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
            <span style={{ fontFamily: 'var(--font-dm-mono), monospace', fontSize: '9px', color: 'var(--text-muted)' }}>
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
            <div style={{ display: 'flex', gap: '6px', marginTop: '12px', flexWrap: 'wrap' }}>
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
            const articleSentiment = sentiment?.articleSentiments[article.id] || article.sentiment
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
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--border-secondary)' }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-primary)' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '4px', gap: '12px' }}>
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
                <div style={{ fontFamily: 'var(--font-dm-mono), monospace', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '4px' }}>
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
