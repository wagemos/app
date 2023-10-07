import { createContext, FC, PropsWithChildren, useContext, useMemo } from 'react'
import { WalletContext } from '@/contexts/wallet'
import {
  AbstractAccountClient,
  AbstractAccountId, AbstractAccountQueryClient,
  AbstractClient,
  AbstractQueryClient,
} from '@abstract-money/abstract.js'
import { QueryStatus, useQuery } from '@tanstack/react-query'
import { combinedQueriesStatus } from 'react-query-helpers'
import { NETWORK } from '@/utils'

interface AccountContext {
  accountId: AbstractAccountId | undefined
  chain: string
  accountClient: AbstractAccountQueryClient | undefined
  status: QueryStatus
}
type WithChain<T> = { chain: string } & T


const Account = createContext<AccountContext>({
  accountClient: undefined,
  accountId: new AbstractAccountId(0),
  chain: NETWORK,
  status: 'loading'
})

export const useAccount = (): AccountContext => useContext(Account)

export const AccountClientProvider: FC<PropsWithChildren<{ accountId: AbstractAccountId, chain: string }>> = ({ accountId, chain, children }) => {


  const { data: abstractClient, status: abstractStatus } = useQuery({
    queryKey: ['abstract-client', chain],
    queryFn: async () => AbstractQueryClient.connectToChain(chain)
  })

  const {data: accountClient, status: accountStatus} = useQuery({
    queryKey: ['abstract-account-client', chain, accountId],
    queryFn: async () => {
      if (!abstractClient) throw new Error('abstractClient not found')
      return AbstractAccountQueryClient.load(abstractClient!, accountId)
    },
    enabled: !!abstractClient
  })

  console.log('accountClient', accountClient)

  const status = combinedQueriesStatus(abstractStatus, accountStatus)


  let value = useMemo(() => ({ accountId: accountId, chain, accountClient, status }), [accountId, chain, accountClient, status])
  return (<Account.Provider value={value}>
  {children}
</Account.Provider>)
}
