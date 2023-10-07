import { createContext, FC, PropsWithChildren, useContext, useMemo } from 'react'
import { QueryStatus, useQuery } from '@tanstack/react-query'
import { WagemosAppQueryClient } from '@/types/Wagemos.client'
import { useAccount } from '@/contexts/account'

interface WagemosContext {
  wagemosClient: WagemosAppQueryClient | undefined
  status: QueryStatus
}


const Account = createContext<WagemosContext>({
  wagemosClient: undefined,
  status: 'loading',
})

export const useWagemos = (): WagemosContext => useContext(Account)

export const WagemosProvider: FC<PropsWithChildren> = ({children}) => {
  const {accountClient, accountId} = useAccount()


  const {data: wagemosClient, status} = useQuery({
    queryKey: ['wagemos-client', accountId],
    queryFn: async () => {
      if (!accountClient) throw new Error('accountClient not found')
      return new WagemosAppQueryClient({
        abstractQueryClient: accountClient.abstract, ...accountClient,
        moduleId: 'abstract:betting',
      })
    },
    enabled: !!accountClient,
  })


  let value = useMemo(() => ({wagemosClient, status}), [wagemosClient, status])
  return (<Account.Provider value={value}>
    {children}
  </Account.Provider>)
}
