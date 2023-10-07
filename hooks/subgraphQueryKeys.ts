import { type AccountFilter, type ModuleFilter, type PoolFilter } from '@/__generated__/gql/graphql'
import { AbstractAccountId } from '@abstract-money/abstract.js'
import { AccountId } from '@abstract-money/abstract.js/lib/native/registry/Registry.types'

export interface AccountIdWithChain {
  chain: string
  sequence: number
  trace: Array<string> | null | undefined
}

export const subgraphQueryKeys = {
  network: [
    {
      network: 'subgraph',
    },
  ] as const,
  named: (query: string) => [{ ...subgraphQueryKeys.network[0], query }] as const,
  module: (moduleId: string, version = 'latest') =>
    [{ ...subgraphQueryKeys.named('module'), moduleId, version }] as const,
  assets: () => [{ ...subgraphQueryKeys.named('assets') }] as const,
  deployments: () => [{ ...subgraphQueryKeys.named('deployments') }] as const,
  abstractDeployments: () => [{ ...subgraphQueryKeys.named('abstractDeployments') }] as const,
  channels: () => [{ ...subgraphQueryKeys.named('channels') }] as const,
  contracts: () => [{ ...subgraphQueryKeys.named('contracts') }] as const,
  modules: (filter?: ModuleFilter) => [{ ...subgraphQueryKeys.named('modules'), filter }] as const,
  accounts: (filter?: AccountFilter) =>
    [{ ...subgraphQueryKeys.named('accounts'), filter }] as const,
  subAccounts: (accountIds: ReadonlyArray<AccountIdWithChain>) =>
    [{ ...subgraphQueryKeys.named('subAccounts') }, { accountIds }] as const,
  pools: (filter?: PoolFilter) => [{ ...subgraphQueryKeys.named('pools'), filter }] as const,
  accountValue: (accountId: AbstractAccountId) =>
    [{ ...subgraphQueryKeys.named('accountVault') }, { accountId }] as const,
  keyValueNonce: (address: string | undefined) =>
    [{ ...subgraphQueryKeys.named('nextKeyValueByAddressNonce') }, { address }] as const,
  // This query does NOT need the network argument
  accountByIds: (ids: ReadonlyArray<AccountIdWithChain>) =>
    [{ ...subgraphQueryKeys.named('accountsByIds') }, { ids }] as const,
  namespaces: () => [{ ...subgraphQueryKeys.named('namespaces') }] as const,
}
