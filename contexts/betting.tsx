import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useMemo,
} from 'react'
import { QueryStatus, useQuery } from '@tanstack/react-query'
import { WagemosAppQueryClient } from '@/types/Wagemos.client'
import { useAccount } from '@abstract-money/abstract.js-react'

interface WagemosContext {
  wagemosClient: WagemosAppQueryClient | undefined
  status: QueryStatus
}

const Account = createContext<WagemosContext>({
  wagemosClient: undefined,
  status: 'loading',
})

export const useWagemos = (): WagemosContext => useContext(Account)

const BETTING_APP_MODULE_ID = 'abstract:betting'

export const WagemosProvider: FC<PropsWithChildren> = ({ children }) => {
  const { accountQueryClient, accountId } = useAccount()

  const { data: wagemosClient, status } = useQuery({
    queryKey: ['wagemos-client', accountId],
    queryFn: async () => {
      if (!accountQueryClient) throw new Error('accountQueryClient not found')
      return new WagemosAppQueryClient({
        abstractQueryClient: accountQueryClient.abstract,
        ...accountQueryClient,
        moduleId: BETTING_APP_MODULE_ID,
      })
    },
    enabled: !!accountQueryClient,
  })

  let value = useMemo(
    () => ({ wagemosClient, status }),
    [wagemosClient, status]
  )
  return <Account.Provider value={value}>{children}</Account.Provider>
}
