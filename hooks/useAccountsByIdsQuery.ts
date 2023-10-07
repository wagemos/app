import { gql } from '@/__generated__/gql'
import { useSubgraphQuery } from './useSubgraphQuery'
import { subgraphQueryKeys } from './subgraphQueryKeys'
import { QueryOptions, type ReactQueryOptions } from 'react-query-helpers'
import { type AccountsByIdsQuery } from '@/__generated__/gql/graphql'

const accountsByIdsQuery = gql(/* GraphQL */ `
  query AccountsByIds($ids: [AccountIdWithChain!]!) {
    accountsByIds(ids: $ids) {
      id
      chain
      accountId {
        sequence
      }
      info {
        name
        description
        governance {
          governanceType
          owner
        }
      }
      proxy
      namespace
      manager
      subAccounts {
        accountId {
          sequence
          trace
        }
        modules {
          id
        }
      }
    }
  }
`)
export interface AccountIdWithChain {
  chain: string
  sequence: number
  trace: Array<string> | null | undefined
}

export interface UseAccountsByIdsQuery
  extends ReactQueryOptions<
    AccountsByIdsQuery,
    AccountsByIdsQuery['accountsByIds']
  > {
  ids: ReadonlyArray<{
    chain: string
    sequence: number
    trace: Array<string> | null | undefined
  }>
}

/**
 * Query the accounts at the passed ids.
 */
export const useAccountsByIdsQuery = ({
  ids,
  options,
}: UseAccountsByIdsQuery) => {
  return useSubgraphQuery(
    {
      ...options,
      queryKey: subgraphQueryKeys.accountByIds(ids),
      select: ({ accountsByIds }) => accountsByIds,
    },
    accountsByIdsQuery,
    {
      // @ts-ignore issue with codegen immutableTypes
      ids,
    }
  )
}
