'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { CompanyProfile, Event } from '@/types'
import { companies } from '@/data/companies'

export type Lang = 'EN' | 'JP'

interface CompanyContextType {
  selectedCompany: CompanyProfile
  setSelectedCompany: (company: CompanyProfile) => void
  selectedEvent: Event | null
  setSelectedEvent: (event: Event | null) => void
  isPanelOpen: boolean
  setIsPanelOpen: (open: boolean) => void
  lang: Lang
  setLang: (lang: Lang) => void
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined)

export function CompanyProvider({ children }: { children: ReactNode }) {
  const [selectedCompany, setSelectedCompany] = useState<CompanyProfile>(companies[0])
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [lang, setLang] = useState<Lang>('EN')

  return (
    <CompanyContext.Provider
      value={{
        selectedCompany,
        setSelectedCompany,
        selectedEvent,
        setSelectedEvent,
        isPanelOpen,
        setIsPanelOpen,
        lang,
        setLang,
      }}
    >
      {children}
    </CompanyContext.Provider>
  )
}

export function useCompany() {
  const context = useContext(CompanyContext)
  if (!context) throw new Error('useCompany must be used within CompanyProvider')
  return context
}
