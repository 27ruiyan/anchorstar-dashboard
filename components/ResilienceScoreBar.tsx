'use client'

interface ResilienceScoreBarProps {
  label: string
  value: number
  highlight?: boolean
}

export default function ResilienceScoreBar({ label, value, highlight }: ResilienceScoreBarProps) {
  return (
    <div className="flex items-center gap-4">
      <span
        style={{
          fontFamily: 'var(--font-dm-mono), monospace',
          fontSize: '10px',
          color: highlight ? 'var(--gold)' : 'var(--text-secondary)',
          width: '180px',
          flexShrink: 0,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
        }}
      >
        {label}
      </span>
      <div
        style={{
          flex: 1,
          height: '2px',
          background: 'var(--border-primary)',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            height: '2px',
            width: `${value}%`,
            background: highlight ? 'var(--gold)' : 'var(--text-muted)',
            transition: 'width 0.6s ease',
          }}
        />
      </div>
      <span
        style={{
          fontFamily: 'var(--font-dm-mono), monospace',
          fontSize: '12px',
          color: highlight ? 'var(--gold)' : 'var(--text-secondary)',
          width: '28px',
          textAlign: 'right',
          flexShrink: 0,
        }}
      >
        {value}
      </span>
    </div>
  )
}
