import type { Metadata } from "next"
import { Cormorant_Garamond, DM_Mono } from "next/font/google"
import "./globals.css"

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400"],
})

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["300", "400"],
})

export const metadata: Metadata = {
  title: "Resilience Intelligence | Anchorstar \u00d7 Mori Building",
  description: "Strategic intelligence dashboard translating global events into company-specific strategic actions through a Gen Z behavioral lens.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmMono.variable}`}>
      <body>{children}</body>
    </html>
  )
}
