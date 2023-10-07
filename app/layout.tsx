'use client'

import { ChainProvider } from '@/contexts/chain'
import { WalletSelectProvider } from '@/contexts/wallet-select'
import { WalletProvider } from '@/contexts/wallet'

import Meta from '@/components/Meta'
import Nav from '@/components/Nav'

import Local from 'next/font/local'
import { Inter } from 'next/font/google'

import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

const calsans = Local({
  src: '../public/CalSans.woff2',
  variable: '--font-calsans',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${calsans.variable} overflow-hidden min-h-screen`}
    >
      <Meta />
      <ChainProvider>
        <WalletSelectProvider>
          <WalletProvider>
            <body>
              <Nav />
              {children}
            </body>
          </WalletProvider>
        </WalletSelectProvider>
      </ChainProvider>
    </html>
  )
}
