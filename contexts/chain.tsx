import { createContext, useContext, useMemo } from 'react'

import { ChainProvider as CosmosKitProvider } from '@cosmos-kit/react-lite'
import { chains, assets } from 'chain-registry'

import { wallets as MetaMaskWallet } from '@cosmos-kit/cosmos-extension-metamask'
import { wallets as KeplrWallet } from '@cosmos-kit/keplr'
import { wallets as XdefiWallet } from '@cosmos-kit/xdefi'
import { wallets as OmniWallet } from '@cosmos-kit/omni'
import { CHAIN_INFO } from '@/chain-info'

export interface ChainContext {}

export const Chain = createContext<ChainContext>({})

const wallets = [
  ...KeplrWallet,
  ...XdefiWallet,
  ...MetaMaskWallet,
  ...OmniWallet,
]

export function ChainProvider({ children }: { children: React.ReactNode }) {
  const chainList = useMemo(
    () =>
      CHAIN_INFO.map((info) => {
        let chain = chains.find(
          (chain) => chain.chain_name === info.chain_name
        )!
        chain.apis = {
          rpc: [
            {
              address: info.rpc,
            },
          ],
          rest: [
            {
              address: info.api,
            },
          ],
        }
        return chain
      }),
    []
  )

  return (
    <CosmosKitProvider
      chains={chainList}
      assetLists={assets}
      wallets={wallets}
      walletModal={() => <></>}
      walletConnectOptions={{
        signClient: {
          projectId: '301bbeb993bb36b3549650f4a7c249b7',
          metadata: {
            name: 'Wagemos',
            description: 'Unlock the Full Potential of Hackathons with Wagemos',
            url: 'https://wagemos.com',
            icons: ['https://wagemos.com/icon.png'],
          },
        },
      }}
      logLevel="DEBUG"
    >
      <Chain.Provider value={{}}>{children}</Chain.Provider>
    </CosmosKitProvider>
  )
}

export const useChain = (): ChainContext => useContext(Chain)
