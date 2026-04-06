'use client'

import { Event, Urgency } from '@/types'
import { useCompany } from './CompanyContext'
import { translations, translateDomain, translateUrgency } from '@/data/translations'
import TagPill from './TagPill'

function getUrgencyStyle(urgency: Urgency) {
  switch (urgency) {
    case 'critical':
      return {
        background: 'rgba(192,80,80,0.15)',
        color: '#C05050',
        border: '1px solid rgba(192,80,80,0.3)',
      }
    case 'high':
      return {
        background: 'var(--gold-faint)',
        color: 'var(--gold)',
        border: '1px solid var(--gold-dim)',
      }
    default:
      return {
        background: 'var(--bg-tertiary)',
        color: 'var(--text-secondary)',
        border: '1px solid var(--border-secondary)',
      }
  }
}

interface EventCardProps {
  event: Event
  onClick: () => void
}

export default function EventCard({ event, onClick }: EventCardProps) {
  const { lang } = useCompany()
  const t = translations[lang]
  const urgencyStyle = getUrgencyStyle(event.urgency)
  const title = lang === 'JP' && event.titleJp ? event.titleJp : event.title
  const summary = lang === 'JP' && event.summaryJp ? event.summaryJp : event.summary

  return (
    <div
      onClick={onClick}
      style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-primary)',
        padding: '16px',
        cursor: 'pointer',
        transition: 'background 0.15s ease',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-tertiary)')}
      onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--bg-secondary)')}
    >
      <div className="flex items-center justify-between" style={{ marginBottom: '10px' }}>
        <span
          style={{
            ...urgencyStyle,
            fontFamily: 'var(--font-dm-mono), monospace',
            fontSize: '9px',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            padding: '2px 8px',
            borderRadius: '2px',
          }}
        >
          {translateUrgency(event.urgency, lang)}
        </span>
        <span
          style={{
            fontFamily: 'var(--font-dm-mono), monospace',
            fontSize: '9px',
            color: 'var(--text-muted)',
          }}
        >
          {event.timestamp}
        </span>
      </div>

      <h3
        style={{
          fontFamily: 'var(--font-cormorant), serif',
          fontSize: '15px',
          fontWeight: 400,
          color: 'var(--text-primary)',
          margin: '0 0 6px 0',
          lineHeight: 1.3,
        }}
      >
        {title}
      </h3>

      <p
        style={{
          fontFamily: 'var(--font-dm-mono), monospace',
          fontSize: '11px',
          color: 'var(--text-muted)',
          lineHeight: 1.5,
          margin: '0 0 12px 0',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {summary}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1">
          {event.resilienceDomains.map((d) => (
            <TagPill key={d} label={translateDomain(d, lang)} gold />
          ))}
        </div>
        <span
          style={{
            fontFamily: 'var(--font-dm-mono), monospace',
            fontSize: '9px',
            color: 'var(--gold)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            flexShrink: 0,
          }}
        >
          {t.viewIntelligence} &rarr;
        </span>
      </div>
    </div>
  )
}
