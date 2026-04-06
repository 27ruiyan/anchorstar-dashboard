'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import CompanySelector from './CompanySelector'
import { useCompany } from './CompanyContext'
import { translations } from '@/data/translations'

export default function TopBar() {
  const pathname = usePathname()
  const isDashboard = pathname === '/dashboard'
  const { lang, setLang } = useCompany()
  const t = translations[lang]

  return (
    <div
      style={{
        height: '64px',
        background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 28px',
        flexShrink: 0,
      }}
    >
      <div className="flex items-center gap-5">
        <span
          style={{
            fontFamily: 'var(--font-cormorant), serif',
            fontSize: '16px',
            letterSpacing: '0.18em',
            color: 'var(--gold)',
            textTransform: 'uppercase',
          }}
        >
          {t.title}
        </span>
        <span
          style={{
            fontFamily: 'var(--font-dm-mono), monospace',
            fontSize: '11px',
            color: 'var(--text-muted)',
          }}
        >
          {t.subtitle}
        </span>
      </div>

      <CompanySelector />

      <div className="flex items-center gap-5">
        {isDashboard ? (
          <Link
            href="/"
            style={{
              fontFamily: 'var(--font-dm-mono), monospace',
              fontSize: '11px',
              letterSpacing: '0.1em',
              color: 'var(--text-secondary)',
              textTransform: 'uppercase',
              textDecoration: 'none',
              transition: 'color 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--gold)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
          >
            &larr; {t.globalMap}
          </Link>
        ) : (
          <Link
            href="/dashboard"
            style={{
              fontFamily: 'var(--font-dm-mono), monospace',
              fontSize: '11px',
              letterSpacing: '0.1em',
              color: 'var(--text-secondary)',
              textTransform: 'uppercase',
              textDecoration: 'none',
              transition: 'color 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--gold)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
          >
            {t.dashboard} &rarr;
          </Link>
        )}
        <div
          style={{
            fontFamily: 'var(--font-dm-mono), monospace',
            fontSize: '11px',
            display: 'flex',
            gap: '2px',
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--border-primary)',
            borderRadius: '2px',
            padding: '2px',
          }}
        >
          <button
            onClick={() => setLang('EN')}
            style={{
              background: lang === 'EN' ? 'var(--bg-secondary)' : 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: lang === 'EN' ? 'var(--gold)' : 'var(--text-muted)',
              fontFamily: 'inherit',
              fontSize: 'inherit',
              padding: '4px 8px',
              borderRadius: '1px',
              transition: 'color 0.15s ease',
            }}
          >
            EN
          </button>
          <button
            onClick={() => setLang('JP')}
            style={{
              background: lang === 'JP' ? 'var(--bg-secondary)' : 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: lang === 'JP' ? 'var(--gold)' : 'var(--text-muted)',
              fontFamily: 'inherit',
              fontSize: 'inherit',
              padding: '4px 8px',
              borderRadius: '1px',
              transition: 'color 0.15s ease',
            }}
          >
            JP
          </button>
        </div>
      </div>
    </div>
  )
}
