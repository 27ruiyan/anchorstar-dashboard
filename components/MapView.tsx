'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from 'react-simple-maps'
import { geoCentroid, geoArea } from 'd3-geo'
import { events } from '@/data/events'
import { translations } from '@/data/translations'
import { useCompany } from './CompanyContext'
import { Event, Urgency } from '@/types'

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

function getUrgencyColor(urgency: Urgency): string {
  switch (urgency) {
    case 'critical': return '#E05555'
    case 'high': return '#D4B36A'
    case 'medium': return '#5A8AB8'
    case 'low': return '#5A9A7A'
  }
}

const DOT_SIZE: Record<Urgency, number> = {
  critical: 5,
  high: 4.5,
  medium: 4,
  low: 3.5,
}

const GLOW_SIZE: Record<Urgency, number> = {
  critical: 14,
  high: 12,
  medium: 10,
  low: 9,
}

const SKIP_LABELS = new Set([
  'Antarctica', 'Fr. S. Antarctic Lands', 'Falkland Is.',
  'N. Cyprus', 'Kosovo', 'W. Sahara',
])

export default function MapView() {
  const { selectedEvent, setSelectedEvent, setIsPanelOpen, lang } = useCompany()
  const t = translations[lang]
  const [hoveredEvent, setHoveredEvent] = useState<Event | null>(null)
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [center, setCenter] = useState<[number, number]>([20, 10])
  const [liveZoom, setLiveZoom] = useState(1)
  const containerRef = useRef<HTMLDivElement>(null)
  const zoomRef = useRef(1)
  const centerRef = useRef<[number, number]>([20, 10])

  // Custom wheel handler — scroll pans, pinch zooms
  useEffect(() => {
    const node = containerRef.current
    if (!node) return

    const handler = (e: WheelEvent) => {
      e.preventDefault()
      e.stopPropagation()

      const isPinch = e.ctrlKey || e.metaKey

      if (isPinch) {
        // Pinch-to-zoom
        const intensity = Math.min(Math.abs(e.deltaY) * 0.015, 0.35)
        const zoomFactor = e.deltaY > 0 ? 1 - intensity : 1 + intensity
        const newZoom = Math.max(1, Math.min(20, zoomRef.current * zoomFactor))
        zoomRef.current = newZoom
        setZoom(newZoom)
        setLiveZoom(newZoom)
      } else {
        // Two-finger scroll = pan
        const s = 0.15 / zoomRef.current
        const newCenter: [number, number] = [
          centerRef.current[0] + e.deltaX * s,
          Math.max(-60, Math.min(75, centerRef.current[1] + e.deltaY * s)),
        ]
        centerRef.current = newCenter
        setCenter(newCenter)
      }
    }

    node.addEventListener('wheel', handler, { passive: false })
    return () => node.removeEventListener('wheel', handler)
  }, [])

  const handleEventClick = useCallback((event: Event) => {
    setSelectedEvent(event)
    setIsPanelOpen(true)
  }, [setSelectedEvent, setIsPanelOpen])

  const handleMoveEnd = useCallback((position: { coordinates: [number, number]; zoom: number }) => {
    centerRef.current = position.coordinates
    zoomRef.current = position.zoom
    setCenter(position.coordinates)
    setZoom(position.zoom)
    setLiveZoom(position.zoom)
  }, [])

  const handleMove = useCallback((position: { x: number; y: number; zoom: number }) => {
    zoomRef.current = position.zoom
    setLiveZoom(position.zoom)
  }, [])

  const handleZoomIn = useCallback(() => {
    const newZ = Math.min(zoomRef.current * 1.5, 20)
    zoomRef.current = newZ
    setZoom(newZ)
    setLiveZoom(newZ)
  }, [])

  const handleZoomOut = useCallback(() => {
    const newZ = Math.max(zoomRef.current / 1.5, 1)
    zoomRef.current = newZ
    setZoom(newZ)
    setLiveZoom(newZ)
  }, [])

  // Dots stay constant visual size: counter-scale by zoom
  const dotScale = 1 / liveZoom

  return (
    <div
      ref={containerRef}
      style={{
        flex: 1,
        position: 'relative',
        overflow: 'hidden',
        touchAction: 'none',
      }}
    >
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 130,
          center: [0, 20],
        }}
        style={{
          width: '100%',
          height: '100%',
          background: '#060A0C',
        }}
      >
        <defs>
          {events.map((event) => {
            const color = getUrgencyColor(event.urgency)
            return (
              <radialGradient key={`glow-${event.id}`} id={`glow-${event.id}`}>
                <stop offset="0%" stopColor={color} stopOpacity={0.6} />
                <stop offset="35%" stopColor={color} stopOpacity={0.15} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </radialGradient>
            )
          })}
        </defs>

        <ZoomableGroup
          center={center}
          zoom={zoom}
          onMoveEnd={handleMoveEnd}
          onMove={handleMove}
          minZoom={1}
          maxZoom={20}
          filterZoomEvent={((e: unknown) => {
            // Block wheel — our custom handler manages it
            // Allow mouse drag and touch
            const ev = e as { type?: string }
            if (ev.type === 'wheel') return false
            return true
          }) as unknown as (element: SVGElement) => boolean}
        >
          <Geographies geography={GEO_URL}>
            {({ geographies }) => {
              const geoWithArea = geographies.map((geo) => ({
                geo,
                area: geoArea(geo),
                name: (geo.properties?.name as string) || '',
              }))

              return (
                <>
                  {geoWithArea.map(({ geo }) => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill="#111B22"
                      stroke="#1a2e35"
                      strokeWidth={Math.max(0.08, 0.35 / liveZoom)}
                      style={{
                        default: { outline: 'none' },
                        hover: { fill: '#162028', outline: 'none' },
                        pressed: { outline: 'none' },
                      }}
                    />
                  ))}

                  {/* Country labels */}
                  {geoWithArea.map(({ geo, area, name }) => {
                    if (!name || SKIP_LABELS.has(name)) return null

                    const centroid = geoCentroid(geo)
                    if (!centroid[0] && !centroid[1]) return null

                    const isLarge = area > 0.01
                    const isMedium = area > 0.002
                    const isSmall = area > 0.0003

                    let showAt: number
                    if (isLarge) showAt = 1.2
                    else if (isMedium) showAt = 2.0
                    else if (isSmall) showAt = 3.5
                    else showAt = 6

                    if (liveZoom < showAt) return null

                    const baseSize = isLarge ? 4.5 : isMedium ? 3.5 : isSmall ? 2.8 : 2.2
                    const fontSize = baseSize / Math.pow(liveZoom, 0.35)
                    const clampedSize = Math.max(1.5, Math.min(fontSize, 6))

                    const fadeProgress = Math.min(1, (liveZoom - showAt) / (showAt * 0.5))
                    const maxOpacity = isLarge ? 0.55 : isMedium ? 0.45 : 0.35
                    const opacity = fadeProgress * maxOpacity

                    if (opacity <= 0.02) return null

                    return (
                      <Marker key={`label-${geo.rsmKey}`} coordinates={centroid as [number, number]}>
                        <text
                          textAnchor="middle"
                          dominantBaseline="central"
                          style={{
                            fontFamily: 'var(--font-cormorant), Georgia, serif',
                            fontSize: `${clampedSize}px`,
                            fill: '#607880',
                            opacity,
                            letterSpacing: isLarge ? '0.15em' : '0.1em',
                            fontWeight: 300,
                            pointerEvents: 'none',
                            userSelect: 'none',
                          }}
                        >
                          {name}
                        </text>
                      </Marker>
                    )
                  })}
                </>
              )
            }}
          </Geographies>

          {/* Event markers — constant visual size via counter-scaling */}
          {events.map((event) => {
            const isSelected = selectedEvent?.id === event.id
            const isHovered = hoveredEvent?.id === event.id
            const size = DOT_SIZE[event.urgency] * dotScale
            const glowSize = GLOW_SIZE[event.urgency] * dotScale
            const color = getUrgencyColor(event.urgency)

            return (
              <Marker
                key={event.id}
                coordinates={event.coordinates}
                onMouseEnter={(e) => {
                  setHoveredEvent(event)
                  const rect = (e.target as SVGElement).closest('svg')?.getBoundingClientRect()
                  if (rect) {
                    setTooltipPos({
                      x: e.clientX - rect.left,
                      y: e.clientY - rect.top,
                    })
                  }
                }}
                onMouseLeave={() => setHoveredEvent(null)}
                onClick={() => handleEventClick(event)}
              >
                {/* Glow */}
                <circle r={glowSize} fill={`url(#glow-${event.id})`} />

                {/* Selection ring */}
                {isSelected && (
                  <circle
                    r={size + 3 * dotScale}
                    fill="none"
                    stroke="var(--gold)"
                    strokeWidth={0.8 * dotScale}
                    opacity={0.7}
                  />
                )}

                {/* Core dot */}
                <circle
                  r={isHovered ? size * 1.2 : size}
                  fill={color}
                  opacity={0.9}
                />

                {/* Bright center */}
                <circle
                  r={size * 0.35}
                  fill="#ffffff"
                  opacity={0.5}
                />

                {/* Hit target */}
                <circle
                  r={Math.max(size * 2, 10 * dotScale)}
                  fill="transparent"
                  style={{ cursor: 'pointer' }}
                />
              </Marker>
            )
          })}
        </ZoomableGroup>
      </ComposableMap>

      {/* Overlay UI */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 30,
        }}
      >
        {/* Zoom indicator */}
        <div
          style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(12, 12, 12, 0.85)',
            border: '1px solid var(--border-primary)',
            padding: '6px 12px',
            backdropFilter: 'blur(8px)',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-dm-mono), monospace',
              fontSize: '9px',
              color: 'var(--text-muted)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            {t.zoom}
          </span>
          <span
            style={{
              fontFamily: 'var(--font-dm-mono), monospace',
              fontSize: '13px',
              color: 'var(--gold)',
              fontWeight: 400,
              minWidth: '40px',
            }}
          >
            {liveZoom.toFixed(1)}x
          </span>
        </div>

        {/* Zoom controls */}
        <div
          style={{
            position: 'absolute',
            bottom: '20px',
            right: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '1px',
            pointerEvents: 'auto',
          }}
        >
          <button
            onClick={handleZoomIn}
            style={{
              width: '36px',
              height: '36px',
              background: 'rgba(12, 12, 12, 0.85)',
              border: '1px solid var(--border-primary)',
              borderBottom: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              fontFamily: 'var(--font-dm-mono), monospace',
              fontSize: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(8px)',
              transition: 'color 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--gold)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
          >
            +
          </button>
          <button
            onClick={handleZoomOut}
            style={{
              width: '36px',
              height: '36px',
              background: 'rgba(12, 12, 12, 0.85)',
              border: '1px solid var(--border-primary)',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              fontFamily: 'var(--font-dm-mono), monospace',
              fontSize: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(8px)',
              transition: 'color 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--gold)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
          >
            &minus;
          </button>
        </div>

        {/* Scroll hint */}
        {liveZoom <= 1.1 && (
          <div
            style={{
              position: 'absolute',
              bottom: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              fontFamily: 'var(--font-dm-mono), monospace',
              fontSize: '10px',
              color: 'var(--text-muted)',
              letterSpacing: '0.08em',
              opacity: 0.6,
            }}
          >
            {t.scrollHint}
          </div>
        )}

        {/* Tooltip */}
        {hoveredEvent && (
          <div
            style={{
              position: 'absolute',
              left: tooltipPos.x + 14,
              top: tooltipPos.y - 12,
              background: 'rgba(12, 12, 12, 0.92)',
              border: '1px solid var(--border-secondary)',
              padding: '8px 12px',
              maxWidth: '240px',
              backdropFilter: 'blur(8px)',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-dm-mono), monospace',
                fontSize: '11px',
                color: 'var(--text-primary)',
                marginBottom: '4px',
                lineHeight: 1.3,
              }}
            >
              {lang === 'JP' && hoveredEvent.titleJp ? hoveredEvent.titleJp : hoveredEvent.title}
            </div>
            <div
              style={{
                fontFamily: 'var(--font-dm-mono), monospace',
                fontSize: '9px',
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              {hoveredEvent.country} &bull; {hoveredEvent.urgency}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
