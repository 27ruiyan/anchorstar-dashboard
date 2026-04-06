'use client'

import { useCompany } from './CompanyContext'
import { insights } from '@/data/insights'
import { translations, translateDomain, translatePattern, translateArchetype, translateUrgency } from '@/data/translations'
import { InsightCard, Urgency } from '@/types'
import TagPill from './TagPill'
import Link from 'next/link'

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

function getFallbackInsight(eventId: string, companyId: string): InsightCard {
  return {
    eventId,
    companyId,
    whyItMatters: 'This event signals a structural shift that could reshape competitive dynamics in adjacent industries. Analysis pending deeper assessment.',
    genZSignal: 'Gen Z behavioral patterns suggest accelerating divergence from legacy consumer and workforce expectations.',
    generationalContrast: 'Generational divide on this issue reflects deeper structural tensions between institutional stability and emergent adaptability.',
    companyImplication: 'Strategic exposure exists but requires further analysis to quantify direct impact on current business model.',
    risks: [
      'Delayed response could allow competitors to establish first-mover advantage',
      'Existing organizational structures may resist necessary adaptation',
    ],
    opportunities: [
      'Early positioning could unlock new market segments aligned with emerging demand',
      'Cross-functional task force could accelerate strategic response',
    ],
    recommendedActions: [
      'Commission a rapid impact assessment specific to current strategic priorities',
      'Identify internal champions who can bridge generational perspective gaps',
      'Map competitive landscape for early movers in this space',
    ],
  }
}

export default function IntelligencePanel() {
  const { selectedEvent, selectedCompany, isPanelOpen, setIsPanelOpen, setSelectedEvent, lang } = useCompany()
  const t = translations[lang]

  if (!selectedEvent) return null

  const insight =
    insights.find(
      (i) => i.eventId === selectedEvent.id && i.companyId === selectedCompany.id
    ) || getFallbackInsight(selectedEvent.id, selectedCompany.id)

  const urgencyStyle = getUrgencyStyle(selectedEvent.urgency)

  return (
    <div
      style={{
        position: 'absolute',
        right: 0,
        top: '64px',
        bottom: 0,
        width: '400px',
        background: 'var(--bg-secondary)',
        borderLeft: '1px solid var(--border-primary)',
        transform: isPanelOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.3s ease',
        overflowY: 'auto',
        zIndex: 40,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Close tab on left edge */}
      <button
        onClick={() => {
          setIsPanelOpen(false)
          setSelectedEvent(null)
        }}
        style={{
          position: 'absolute',
          left: '-32px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '32px',
          height: '48px',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-primary)',
          borderRight: 'none',
          color: 'var(--text-secondary)',
          cursor: 'pointer',
          fontFamily: 'var(--font-dm-mono), monospace',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'color 0.15s ease',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--gold)')}
        onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
      >
        &rsaquo;
      </button>

      <div style={{ padding: '16px 20px' }}>
        {/* Header */}
        <div className="flex items-start justify-between" style={{ marginBottom: '12px' }}>
          <button
            onClick={() => {
              setIsPanelOpen(false)
              setSelectedEvent(null)
            }}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              fontFamily: 'var(--font-dm-mono), monospace',
              fontSize: '18px',
              padding: '4px 8px',
              transition: 'color 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--gold)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
          >
            &times;
          </button>
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
            {translateUrgency(selectedEvent.urgency, lang)}
          </span>
        </div>

        {/* Title */}
        <h2
          style={{
            fontFamily: 'var(--font-cormorant), serif',
            fontSize: '18px',
            fontWeight: 300,
            color: 'var(--text-primary)',
            margin: '0 0 8px 0',
            lineHeight: 1.3,
          }}
        >
          {lang === 'JP' && selectedEvent.titleJp ? selectedEvent.titleJp : selectedEvent.title}
        </h2>

        {/* Meta */}
        <div
          style={{
            fontFamily: 'var(--font-dm-mono), monospace',
            fontSize: '10px',
            color: 'var(--text-muted)',
          }}
        >
          {selectedEvent.country} &bull; {selectedEvent.source} &bull; {selectedEvent.timestamp}
        </div>
      </div>

      <div style={{ height: '1px', background: 'var(--border-primary)' }} />

      {/* Tags */}
      <div style={{ padding: '12px 20px' }}>
        <div style={{ marginBottom: '8px' }}>
          <span style={sectionLabel}>{t.resilienceDomain}</span>
          <div className="flex flex-wrap gap-1.5" style={{ marginTop: '4px' }}>
            {selectedEvent.resilienceDomains.map((d) => (
              <TagPill key={d} label={translateDomain(d, lang)} gold />
            ))}
          </div>
        </div>
        <div style={{ marginBottom: '8px' }}>
          <span style={sectionLabel}>{t.pattern}</span>
          <div style={{ marginTop: '4px' }}>
            <TagPill label={translatePattern(selectedEvent.resiliencePattern, lang)} />
          </div>
        </div>
        <div>
          <span style={sectionLabel}>{t.genZArchetypes}</span>
          <div className="flex flex-wrap gap-1.5" style={{ marginTop: '4px' }}>
            {selectedEvent.genZArchetypes.map((a) => (
              <TagPill key={a} label={translateArchetype(a, lang)} />
            ))}
          </div>
        </div>
      </div>

      <div style={{ height: '1px', background: 'var(--border-primary)' }} />

      {/* Global analysis */}
      <div style={{ padding: '12px 20px' }}>
        <Section label={t.whyMatters} content={insight.whyItMatters} />
        <Section label={t.genZSignal} content={insight.genZSignal} />
        <Section label={t.generationalContrast} content={insight.generationalContrast} />
      </div>

      <div style={{ height: '1px', background: 'var(--border-primary)' }} />

      {/* Company-specific */}
      <div style={{ padding: '12px 20px' }}>
        <div
          style={{
            fontFamily: 'var(--font-dm-mono), monospace',
            fontSize: '9px',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--gold)',
            marginBottom: '12px',
          }}
        >
          {t.forCompany} {lang === 'JP' ? selectedCompany.nameJp : selectedCompany.name}
        </div>

        <div
          style={{
            fontFamily: 'var(--font-dm-mono), monospace',
            fontSize: '12px',
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
            marginBottom: '16px',
          }}
        >
          {insight.companyImplication}
        </div>

        <div className="flex gap-6" style={{ marginBottom: '16px' }}>
          <div style={{ flex: 1 }}>
            <span style={sectionLabel}>{t.risks}</span>
            <ul style={{ margin: '6px 0 0 0', padding: 0, listStyle: 'none' }}>
              {insight.risks.map((r, i) => (
                <li
                  key={i}
                  style={{
                    fontFamily: 'var(--font-dm-mono), monospace',
                    fontSize: '11px',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.5,
                    marginBottom: '6px',
                    paddingLeft: '10px',
                    position: 'relative',
                  }}
                >
                  <span style={{ position: 'absolute', left: 0, color: 'var(--red)' }}>&bull;</span>
                  {r}
                </li>
              ))}
            </ul>
          </div>
          <div style={{ flex: 1 }}>
            <span style={sectionLabel}>{t.opportunities}</span>
            <ul style={{ margin: '6px 0 0 0', padding: 0, listStyle: 'none' }}>
              {insight.opportunities.map((o, i) => (
                <li
                  key={i}
                  style={{
                    fontFamily: 'var(--font-dm-mono), monospace',
                    fontSize: '11px',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.5,
                    marginBottom: '6px',
                    paddingLeft: '10px',
                    position: 'relative',
                  }}
                >
                  <span style={{ position: 'absolute', left: 0, color: 'var(--green)' }}>&bull;</span>
                  {o}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div>
          <span style={sectionLabel}>{t.recommendedActions}</span>
          <div style={{ marginTop: '6px' }}>
            {insight.recommendedActions.map((a, i) => (
              <div
                key={i}
                style={{
                  fontFamily: 'var(--font-dm-mono), monospace',
                  fontSize: '12px',
                  color: 'var(--text-primary)',
                  lineHeight: 1.5,
                  marginBottom: '8px',
                  display: 'flex',
                  gap: '8px',
                }}
              >
                <span style={{ color: 'var(--gold)', flexShrink: 0 }}>
                  {String.fromCharCode(0x2460 + i)}
                </span>
                {a}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ height: '1px', background: 'var(--border-primary)' }} />

      {/* Footer link */}
      <div style={{ padding: '12px 20px', textAlign: 'right' }}>
        <Link
          href="/dashboard"
          style={{
            fontFamily: 'var(--font-dm-mono), monospace',
            fontSize: '10px',
            color: 'var(--gold)',
            textDecoration: 'none',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          {t.viewDashboard} &rarr;
        </Link>
      </div>
    </div>
  )
}

const sectionLabel: React.CSSProperties = {
  fontFamily: 'var(--font-dm-mono), monospace',
  fontSize: '9px',
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: 'var(--gold)',
}

function Section({ label, content }: { label: string; content: string }) {
  return (
    <div style={{ marginBottom: '12px' }}>
      <span style={sectionLabel}>{label}</span>
      <p
        style={{
          fontFamily: 'var(--font-dm-mono), monospace',
          fontSize: '12px',
          color: 'var(--text-secondary)',
          lineHeight: 1.6,
          margin: '4px 0 0 0',
        }}
      >
        {content}
      </p>
    </div>
  )
}
