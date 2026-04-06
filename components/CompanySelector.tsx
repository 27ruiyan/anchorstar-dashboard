'use client'

import { companies } from '@/data/companies'
import { useCompany } from './CompanyContext'

export default function CompanySelector() {
  const { selectedCompany, setSelectedCompany, lang } = useCompany()

  return (
    <div className="flex flex-col items-center">
      <select
        value={selectedCompany.id}
        onChange={(e) => {
          const company = companies.find((c) => c.id === e.target.value)
          if (company) setSelectedCompany(company)
        }}
        style={{
          background: 'var(--bg-tertiary)',
          color: 'var(--text-primary)',
          border: '1px solid var(--border-primary)',
          fontFamily: 'var(--font-cormorant), serif',
          fontSize: '15px',
          padding: '5px 28px 5px 12px',
          borderRadius: '2px',
          outline: 'none',
          cursor: 'pointer',
          appearance: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23888880'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 10px center',
        }}
      >
        {companies.map((c) => (
          <option key={c.id} value={c.id}>
            {lang === 'JP' ? `${c.nameJp} (${c.name})` : c.name}
          </option>
        ))}
      </select>
      <span
        style={{
          fontFamily: 'var(--font-dm-mono), monospace',
          fontSize: '10px',
          color: 'var(--text-muted)',
          marginTop: '2px',
        }}
      >
        {lang === 'JP' ? selectedCompany.sector : selectedCompany.nameJp}
      </span>
    </div>
  )
}
