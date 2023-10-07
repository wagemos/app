'use client'

import { ChainProvider } from '@/contexts/chain'
import { WalletSelectProvider } from '@/contexts/wallet-select'
import { WalletProvider } from '@/contexts/wallet'
import { AccountClientProvider } from '@/contexts/account'

import Meta from '@/components/Meta'
import Nav from '@/components/Nav'

import Local from 'next/font/local'
import { Inter } from 'next/font/google'

import './globals.css'
import React from 'react'
import { AbstractAccountId } from '@abstract-money/abstract.js'
import { BETTING_ACCOUNT_ID, NETWORK } from '@/utils'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagemosProvider } from '@/contexts/betting'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

const calsans = Local({
  src: '../public/CalSans.woff2',
  variable: '--font-calsans',
})

const queryClient = new QueryClient()

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
      <QueryClientProvider client={queryClient}>
      <ChainProvider>
        <WalletSelectProvider>
          <WalletProvider>
            <AccountClientProvider accountId={BETTING_ACCOUNT_ID} chain={NETWORK}>
              <WagemosProvider>
              <body>
                <Nav />
                {children}
              </body>
              </WagemosProvider>
            </AccountClientProvider>
          </WalletProvider>
        </WalletSelectProvider>
      </ChainProvider>
      </QueryClientProvider>
    </html>
  )
}
