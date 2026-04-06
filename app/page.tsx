'use client'

import { CompanyProvider } from '@/components/CompanyContext'
import TopBar from '@/components/TopBar'
import MapView from '@/components/MapView'
import IntelligencePanel from '@/components/IntelligencePanel'

export default function Home() {
  return (
    <CompanyProvider>
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
        <TopBar />
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <MapView />
        </div>
        {/* Panel renders at the top level, outside the map container */}
        <IntelligencePanel />
      </div>
    </CompanyProvider>
  )
}
