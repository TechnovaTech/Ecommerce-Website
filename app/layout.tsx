import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import RealTimeProvider from "@/components/real-time-provider"
import { Toaster } from "@/components/ui/toaster"

const geist = Geist({ subsets: ["latin"] })
const geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Shukan Mall - Online Shopping Store",
  description: "Shukan Mall - Your one-stop destination for quality products at competitive prices",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={geist.className} suppressHydrationWarning>
        <RealTimeProvider>
          {children}
        </RealTimeProvider>
        <Toaster />
      </body>
    </html>
  )
}
