import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import ConditionalHeader from "@/components/layout/ConditionalHeader"

const inter = Inter({
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "KPOP STYLE",
  description: "K-Pop 스타 코디 쇼핑몰",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <ConditionalHeader />
        {children}
      </body>
    </html>
  )
}
