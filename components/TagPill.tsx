'use client'

interface TagPillProps {
  label: string
  gold?: boolean
}

export default function TagPill({ label, gold }: TagPillProps) {
  return (
    <span
      style={{
        border: `1px solid ${gold ? 'var(--gold-dim)' : 'var(--border-secondary)'}`,
        color: gold ? 'var(--gold)' : 'var(--text-secondary)',
        background: 'transparent',
        fontSize: '9px',
        letterSpacing: '0.08em',
        padding: '2px 8px',
        borderRadius: '2px',
        textTransform: 'uppercase',
        fontFamily: 'var(--font-dm-mono), monospace',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </span>
  )
}
