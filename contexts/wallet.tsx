import type { ChainWalletBase } from '@cosmos-kit/core'
import type { SigningStargateClient } from '@cosmjs/stargate'
import type { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate'
import type { Coin } from '@cosmjs/amino'
import { useManager, useNameService } from '@cosmos-kit/react-lite'
import { useWalletSelect } from './wallet-select'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { DENOM, NETWORK, capitalize, convertMicroDenomToDenom } from '@/utils'
import { fromBech32, toBech32 } from '@cosmjs/encoding'

interface NameserviceResponse {
  names: string[]
  primary_name: string
}

export interface Account {
  address: string
  nsName?: string
  balance: Coin
  coins: Coin[]
  stargate: SigningStargateClient
  cosmwasm: SigningCosmWasmClient
  wallet: ChainWalletBase
}

export interface WalletContext {
  wallet: Account | undefined
  isFetchingWallet: boolean
  refreshBalances: () => Promise<void>
  connect: (type?: string) => Promise<void>
  disconnect: () => void
}

const Wallet = createContext<WalletContext>({
  wallet: undefined,
  isFetchingWallet: false,
  refreshBalances: async () => {},
  connect: async () => {},
  disconnect: () => {},
})

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const { walletRepos } = useManager()
  const { selectWallet } = useWalletSelect()

  const { data: stargazeNameservice } = useNameService('stargaze')
  const { data: icnsNameservice } = useNameService('icns')

  const [wallet, setWallet] = useState<Account | undefined>(undefined)
  const [isFetchingWallet, setIsFetchingWallet] = useState<boolean>(false)

  const connect = useCallback(
    async (type?: string) => {
      try {
        const walletRepo = walletRepos.find(
          (wallet) => wallet.chainName === NETWORK
        )
        if (!walletRepo)
          throw new Error(`${capitalize(NETWORK)} wallet repo not found`)

        if (!walletRepo.current) {
          const walletName = type ?? (await selectWallet(walletRepo))
          if (!walletName) return

          await walletRepo.connect(walletName)
        }

        setIsFetchingWallet(true)

        const walletBase: ChainWalletBase | undefined = walletRepo.current

        if (!walletBase) throw new Error(`Wallet does not exist`)

        await walletBase.initClient()
        await walletBase.initOfflineSigner()

        const signer = walletBase.offlineSigner
        const accounts = await signer?.getAccounts()

        if (!accounts || !accounts[0]) throw new Error(`Account does not exist`)

        const address = accounts[0].address

        if (!walletBase || !address) throw new Error(`Account does not exist`)
        if (!signer) throw new Error(`Signer does not exist`)

        const unzippedAddress = fromBech32(address)
        const stargazeAddress = toBech32('stars', unzippedAddress.data)
        const osmoAddress = toBech32('osmo', unzippedAddress.data)

        const stargazeName: NameserviceResponse | undefined =
          await stargazeNameservice?.resolveName(stargazeAddress)
        const icnsName: NameserviceResponse | undefined =
          await icnsNameservice?.resolveName(osmoAddress)

        let nsName = undefined

        if (Boolean(icnsName?.primary_name) && icnsName?.primary_name !== '') {
          nsName = icnsName?.primary_name.replace('.osmo', `.ntrn`)
        } else if (
          Boolean(stargazeName?.primary_name) &&
          stargazeName?.primary_name !== ''
        ) {
          nsName = stargazeName?.primary_name.replace('.stars', `.ntrn`)
        }

        if (!walletBase.client) throw new Error(`Client does not exist`)

        const stargate = await walletBase.getSigningStargateClient()
        const cosmwasm = await walletBase.getSigningCosmWasmClient()

        const balances = stargate ? await stargate.getAllBalances(address) : []

        const coins =
          balances?.map((coin) => {
            return {
              denom: coin.denom,
              amount: String(coin.amount),
            }
          }) ?? []

        const balance = coins.find((coin) => {
          return coin.denom === DENOM
        }) || { denom: DENOM, amount: '0' }

        if (stargate == null || cosmwasm == null) {
          throw new Error('Unable to instantiate account while RPC is down')
        }

        const account: Account = {
          address,
          nsName,
          balance,
          coins,
          stargate,
          cosmwasm,
          wallet: walletBase,
        }

        setWallet(account)
        setIsFetchingWallet(false)
      } catch (e) {
        setIsFetchingWallet(false)
        console.error(e)
      }
    },
    [icnsNameservice, stargazeNameservice, walletRepos, selectWallet]
  )

  const disconnect = useCallback(() => {
    const walletRepo = walletRepos.find(
      (wallet) => wallet.chainName === NETWORK
    )

    if (!walletRepo)
      throw new Error(`${capitalize(NETWORK)} wallet repo not found`)

    if (!walletRepo.current) throw new Error(`Wallet is not connected`)

    walletRepo.disconnect()
    setWallet(undefined)
  }, [walletRepos])

  const refreshBalances = useCallback(async () => {
    if (!wallet) throw new Error(`Wallet is not connected`)
    try {
      setIsFetchingWallet(true)

      const balances = await wallet.stargate.getAllBalances(wallet.address)

      const coins =
        balances?.map((coin) => {
          return {
            denom: coin.denom,
            amount: String(coin.amount),
          }
        }) ?? []

      const balance = coins.find((coin) => {
        return coin.denom === DENOM
      }) || { denom: DENOM, amount: '0' }

      const account: Account = {
        address: wallet.address,
        nsName: wallet.nsName,
        balance,
        coins,
        stargate: wallet.stargate,
        cosmwasm: wallet.cosmwasm,
        wallet: wallet.wallet,
      }

      setWallet(account)
    } catch (e) {
      setIsFetchingWallet(false)
      console.error(e)
    }
  }, [wallet])

  useEffect(() => {
    const currentWallet = localStorage.getItem(
      'cosmos-kit@2:core//current-wallet'
    )
    if (currentWallet) {
      connect(currentWallet)
    }
  }, [connect])

  return (
    <Wallet.Provider
      value={{ wallet, refreshBalances, isFetchingWallet, connect, disconnect }}
    >
      {children}
    </Wallet.Provider>
  )
}

export const useWallet = (): WalletContext => useContext(Wallet)
