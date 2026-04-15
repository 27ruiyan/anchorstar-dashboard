'use client'

import { CompanyProvider, useCompany } from '@/components/CompanyContext'
import TopBar from '@/components/TopBar'
import EventCard from '@/components/EventCard'
import { translations } from '@/data/translations'
import { useRouter } from 'next/navigation'
import { Event } from '@/types'
import { useLiveEvents } from '@/lib/useLiveEvents'
import { SentimentSection } from '@/components/SentimentSection'

function DashboardContent() {
  const { selectedCompany, setSelectedEvent, setIsPanelOpen, lang } = useCompany()
  const { events } = useLiveEvents()
  const t = translations[lang]
  const router = useRouter()

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

        {/* Most Relevant Events */}
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

        {/* Sentiment Analysis */}
        <SentimentSection companyId={selectedCompany.id} />
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <CompanyProvider>
      <DashboardContent />
    </CompanyProvider>
  )
}
