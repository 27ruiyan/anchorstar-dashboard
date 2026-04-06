'use client'

import { CompanyProvider, useCompany } from '@/components/CompanyContext'
import TopBar from '@/components/TopBar'
import ResilienceScoreBar from '@/components/ResilienceScoreBar'
import EventCard from '@/components/EventCard'
import { events } from '@/data/events'
import { insights } from '@/data/insights'
import { translations, translateArchetype } from '@/data/translations'
import { useRouter } from 'next/navigation'
import { Event, GenZArchetype } from '@/types'

const ARCHETYPE_DESCRIPTIONS_EN: Record<GenZArchetype, string> = {
  Optimizer: 'Seeks efficiency and measurable improvement in every system',
  Explorer: 'Driven by curiosity and new experience, values optionality',
  Builder: 'Creates new structures rather than reforming existing ones',
  'Grounded Minimalist': 'Prioritizes sustainability and sufficiency over growth',
}

const ARCHETYPE_DESCRIPTIONS_JP: Record<GenZArchetype, string> = {
  Optimizer: '\u3042\u3089\u3086\u308b\u30b7\u30b9\u30c6\u30e0\u306b\u304a\u3044\u3066\u52b9\u7387\u3068\u6e2c\u5b9a\u53ef\u80fd\u306a\u6539\u5584\u3092\u8ffd\u6c42',
  Explorer: '\u597d\u5947\u5fc3\u3068\u65b0\u3057\u3044\u7d4c\u9a13\u306b\u99c6\u308a\u7acb\u3066\u3089\u308c\u3001\u9078\u629e\u80a2\u3092\u91cd\u8996',
  Builder: '\u65e2\u5b58\u306e\u6539\u9769\u3067\u306f\u306a\u304f\u65b0\u3057\u3044\u69cb\u9020\u3092\u5275\u9020',
  'Grounded Minimalist': '\u6210\u9577\u3088\u308a\u3082\u6301\u7d9a\u53ef\u80fd\u6027\u3068\u5145\u8db3\u6027\u3092\u512a\u5148',
}

function DashboardContent() {
  const { selectedCompany, setSelectedEvent, setIsPanelOpen, lang } = useCompany()
  const t = translations[lang]
  const router = useRouter()
  const scores = selectedCompany.defaultScores
  const scoreEntries = Object.entries(scores) as [string, number][]
  const overallScore = Math.round(
    scoreEntries.reduce((sum, [, v]) => sum + v, 0) / scoreEntries.length
  )

  const scoreLabels: Record<string, string> = {
    genZAlignment: t.genZAlignmentLabel,
    adaptationReadiness: t.adaptationReadinessLabel,
    exposureToDisruption: t.exposureToDisruptionLabel,
    ecosystemStrength: t.ecosystemStrengthLabel,
    reinventionMomentum: t.reinventionMomentumLabel,
  }

  const archetypeDescriptions = lang === 'JP' ? ARCHETYPE_DESCRIPTIONS_JP : ARCHETYPE_DESCRIPTIONS_EN

  const rankedEvents = [...events]
    .map((event) => {
      const relevanceScore = event.industryRelevance.filter((ind) =>
        selectedCompany.sector.toLowerCase().includes(ind.toLowerCase()) ||
        ind.toLowerCase().includes(selectedCompany.sector.split('/')[0].trim().toLowerCase())
      ).length
      const urgencyScore = { critical: 4, high: 3, medium: 2, low: 1 }[event.urgency]
      return { event, score: relevanceScore * 2 + urgencyScore }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)

  const companyInsights = insights.filter((i) => i.companyId === selectedCompany.id)
  const allRisks = companyInsights.flatMap((i) => i.risks)
  const allOpportunities = companyInsights.flatMap((i) => i.opportunities)

  const archetypeCounts: Record<GenZArchetype, number> = {
    Optimizer: 0,
    Explorer: 0,
    Builder: 0,
    'Grounded Minimalist': 0,
  }
  events.forEach((e) => {
    e.genZArchetypes.forEach((a) => {
      archetypeCounts[a]++
    })
  })
  const maxArchetype = Object.entries(archetypeCounts).sort(
    ([, a], [, b]) => b - a
  )[0][0]

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event)
    setIsPanelOpen(true)
    router.push('/')
  }

  const companyDisplayName = lang === 'JP' ? selectedCompany.nameJp : selectedCompany.name
  const companySubName = lang === 'JP' ? selectedCompany.name : selectedCompany.nameJp

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <TopBar />

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {/* Company Header */}
        <div
          style={{
            padding: '20px 32px',
            borderBottom: '1px solid var(--border-primary)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              borderLeft: '2px solid var(--gold)',
              paddingLeft: '16px',
            }}
          >
            <h1
              style={{
                fontFamily: 'var(--font-cormorant), serif',
                fontSize: '28px',
                fontWeight: 300,
                color: 'var(--text-primary)',
                margin: 0,
              }}
            >
              {companyDisplayName}
            </h1>
            <span
              style={{
                fontFamily: 'var(--font-dm-mono), monospace',
                fontSize: '12px',
                color: 'var(--text-muted)',
              }}
            >
              {companySubName}
            </span>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div
              style={{
                fontFamily: 'var(--font-dm-mono), monospace',
                fontSize: '10px',
                color: 'var(--text-secondary)',
              }}
            >
              {selectedCompany.sector}
            </div>
            <div
              style={{
                fontFamily: 'var(--font-dm-mono), monospace',
                fontSize: '10px',
                color: 'var(--text-muted)',
              }}
            >
              {selectedCompany.employees} {t.employees}
            </div>
          </div>
        </div>

        {/* Resilience Score */}
        <div
          style={{
            padding: '24px 32px',
            borderBottom: '1px solid var(--border-primary)',
          }}
        >
          <div className="flex items-start justify-between gap-12">
            <div style={{ flex: 1 }}>
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
                {t.resilienceScore}
              </span>
              <div className="flex flex-col gap-3">
                {scoreEntries.map(([key, value]) => (
                  <ResilienceScoreBar
                    key={key}
                    label={scoreLabels[key] || key}
                    value={value}
                    highlight={key === 'genZAlignment'}
                  />
                ))}
              </div>
            </div>
            <div
              style={{
                textAlign: 'center',
                flexShrink: 0,
                paddingTop: '8px',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-cormorant), serif',
                  fontSize: '48px',
                  fontWeight: 300,
                  color: 'var(--gold)',
                  lineHeight: 1,
                }}
              >
                {overallScore}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-dm-mono), monospace',
                  fontSize: '9px',
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  marginTop: '4px',
                }}
              >
                {t.overall}
              </div>
            </div>
          </div>
        </div>

        {/* Most Relevant Events */}
        <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border-primary)' }}>
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
            {t.mostRelevant}
          </span>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '12px',
            }}
          >
            {rankedEvents.map(({ event }) => (
              <EventCard
                key={event.id}
                event={event}
                onClick={() => handleEventClick(event)}
              />
            ))}
          </div>
        </div>

        {/* Risks / Opportunities */}
        <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border-primary)' }}>
          <div className="flex gap-12">
            <div style={{ flex: 1 }}>
              <span
                style={{
                  fontFamily: 'var(--font-dm-mono), monospace',
                  fontSize: '9px',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'var(--red)',
                  display: 'block',
                  marginBottom: '12px',
                }}
              >
                {t.risingRisks}
              </span>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                {(allRisks.length > 0 ? allRisks : selectedCompany.risks).slice(0, 8).map((r, i) => (
                  <li
                    key={i}
                    style={{
                      fontFamily: 'var(--font-dm-mono), monospace',
                      fontSize: '11px',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.5,
                      marginBottom: '8px',
                      paddingLeft: '12px',
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
              <span
                style={{
                  fontFamily: 'var(--font-dm-mono), monospace',
                  fontSize: '9px',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'var(--green)',
                  display: 'block',
                  marginBottom: '12px',
                }}
              >
                {t.risingOpportunities}
              </span>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                {(allOpportunities.length > 0 ? allOpportunities : selectedCompany.strengths).slice(0, 8).map((o, i) => (
                  <li
                    key={i}
                    style={{
                      fontFamily: 'var(--font-dm-mono), monospace',
                      fontSize: '11px',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.5,
                      marginBottom: '8px',
                      paddingLeft: '12px',
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
        </div>

        {/* Gen Z Archetype Activation */}
        <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--border-primary)' }}>
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
            {t.archetypeActivation}
          </span>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '12px',
            }}
          >
            {(Object.entries(archetypeCounts) as [GenZArchetype, number][]).map(
              ([archetype, count]) => (
                <div
                  key={archetype}
                  style={{
                    background: 'var(--bg-secondary)',
                    border: `1px solid ${archetype === maxArchetype ? 'var(--gold)' : 'var(--border-primary)'}`,
                    padding: '16px',
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'var(--font-cormorant), serif',
                      fontSize: '14px',
                      fontWeight: 400,
                      color: archetype === maxArchetype ? 'var(--gold)' : 'var(--text-primary)',
                      marginBottom: '4px',
                    }}
                  >
                    {translateArchetype(archetype, lang)}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-dm-mono), monospace',
                      fontSize: '20px',
                      color: archetype === maxArchetype ? 'var(--gold)' : 'var(--text-secondary)',
                      marginBottom: '8px',
                    }}
                  >
                    {count}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-dm-mono), monospace',
                      fontSize: '10px',
                      color: 'var(--text-muted)',
                      lineHeight: 1.4,
                    }}
                  >
                    {archetypeDescriptions[archetype]}
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        {/* Company Brief */}
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
            {t.companyBrief}
          </span>
          <div
            style={{
              borderLeft: '2px solid var(--gold)',
              paddingLeft: '20px',
            }}
          >
            <div style={{ marginBottom: '16px' }}>
              <span style={subLabel}>{t.businessModel}</span>
              <p style={bodyText}>{lang === 'JP' && selectedCompany.businessModelJp ? selectedCompany.businessModelJp : selectedCompany.businessModel}</p>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <span style={subLabel}>{t.strategicPriorities}</span>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                {(lang === 'JP' && selectedCompany.strategicPrioritiesJp ? selectedCompany.strategicPrioritiesJp : selectedCompany.strategicPriorities).map((p, i) => (
                  <li key={i} style={{ ...bodyText, marginBottom: '4px', paddingLeft: '12px', position: 'relative' as const }}>
                    <span style={{ position: 'absolute' as const, left: 0, color: 'var(--gold)' }}>&bull;</span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <span style={subLabel}>{t.customerProfile}</span>
              <p style={bodyText}>{lang === 'JP' && selectedCompany.customerProfileJp ? selectedCompany.customerProfileJp : selectedCompany.customerProfile}</p>
            </div>

            <div>
              <span style={subLabel}>{t.geographies}</span>
              <div className="flex flex-wrap gap-1.5">
                {selectedCompany.geographies.map((g) => (
                  <span
                    key={g}
                    style={{
                      fontFamily: 'var(--font-dm-mono), monospace',
                      fontSize: '10px',
                      color: 'var(--text-secondary)',
                      border: '1px solid var(--border-secondary)',
                      padding: '2px 8px',
                      borderRadius: '2px',
                    }}
                  >
                    {g}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const subLabel: React.CSSProperties = {
  fontFamily: 'var(--font-dm-mono), monospace',
  fontSize: '9px',
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: 'var(--text-muted)',
  display: 'block',
  marginBottom: '4px',
}

const bodyText: React.CSSProperties = {
  fontFamily: 'var(--font-dm-mono), monospace',
  fontSize: '12px',
  color: 'var(--text-secondary)',
  lineHeight: 1.6,
  margin: 0,
}

export default function DashboardPage() {
  return (
    <CompanyProvider>
      <DashboardContent />
    </CompanyProvider>
  )
}
