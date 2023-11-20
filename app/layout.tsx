'use client'

import { ChainProvider } from '@/contexts/chain'
import { WalletSelectProvider } from '@/contexts/wallet-select'
import { WalletProvider } from '@/contexts/wallet'

import Meta from '@/components/Meta'
import Nav from '@/components/Nav'

import Local from 'next/font/local'
import { Inter } from 'next/font/google'

import './globals.css'
import React from 'react'
import { BETTING_ACCOUNT_ID, NETWORK } from '@/utils'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagemosProvider } from '@/contexts/betting'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ToasterContainer, TxProvider } from '@/contexts/tx'
import { AbstractProvider, AccountProvider, QueryClientProvider as AQueryClientProvider }
  from '@abstract-money/abstract.js-react'
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
      <ToasterContainer position="bottom-center" />
      <Meta />
      <QueryClientProvider client={queryClient}>
        <AQueryClientProvider client={queryClient}>
        <AbstractProvider chainNames={[NETWORK]} chainOptions={{ [NETWORK]: {
          useBatchClient: true
          }}}>
        <ChainProvider>
          <WalletSelectProvider>
            <WalletProvider>
              <AccountProvider accountId={BETTING_ACCOUNT_ID}>
                <WagemosProvider>
                  <TxProvider>
                    <body>
                      <Nav />
                      {children}
                    </body>
                  </TxProvider>
                </WagemosProvider>
              </AccountProvider>
            </WalletProvider>
          </WalletSelectProvider>
        </ChainProvider>
        </AbstractProvider>
        </AQueryClientProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </html>
  )
}
