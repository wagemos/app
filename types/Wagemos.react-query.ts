/**
 * This file was automatically generated by @cosmwasm/ts-codegen@0.28.0.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run the @cosmwasm/ts-codegen generate command to regenerate this file.
 */

import {
  UseQueryOptions,
  useQuery,
  useMutation,
  UseMutationOptions,
} from '@tanstack/react-query'
import { ExecuteResult } from '@cosmjs/cosmwasm-stargate'
import { StdFee, Coin } from '@cosmjs/amino'
import {
  Decimal,
  AssetEntry,
  AccountOdds,
  AccountId,
  Bet,
  BetsResponse,
  ConfigResponse,
  ListOddsResponse,
  RoundsResponse,
  RoundResponse,
  OddsResponse,
} from './Wagemos.types'
import { WagemosAppQueryClient, WagemosAppClient } from './Wagemos.client'
export const wagemosQueryKeys = {
  contract: [
    {
      contract: 'wagemos',
    },
  ] as const,
  address: (contractAddress: string | undefined) =>
    [{ ...wagemosQueryKeys.contract[0], address: contractAddress }] as const,
  round: (
    contractAddress: string | undefined,
    args?: Record<string, unknown>
  ) =>
    [
      {
        ...wagemosQueryKeys.address(contractAddress)[0],
        method: 'round',
        args,
      },
    ] as const,
  listRounds: (
    contractAddress: string | undefined,
    args?: Record<string, unknown>
  ) =>
    [
      {
        ...wagemosQueryKeys.address(contractAddress)[0],
        method: 'list_rounds',
        args,
      },
    ] as const,
  odds: (contractAddress: string | undefined, args?: Record<string, unknown>) =>
    [
      { ...wagemosQueryKeys.address(contractAddress)[0], method: 'odds', args },
    ] as const,
  listOdds: (
    contractAddress: string | undefined,
    args?: Record<string, unknown>
  ) =>
    [
      {
        ...wagemosQueryKeys.address(contractAddress)[0],
        method: 'list_odds',
        args,
      },
    ] as const,
  config: (
    contractAddress: string | undefined,
    args?: Record<string, unknown>
  ) =>
    [
      {
        ...wagemosQueryKeys.address(contractAddress)[0],
        method: 'config',
        args,
      },
    ] as const,
  bets: (contractAddress: string | undefined, args?: Record<string, unknown>) =>
    [
      { ...wagemosQueryKeys.address(contractAddress)[0], method: 'bets', args },
    ] as const,
}
export const wagemosQueries = {
  round: <TData = RoundResponse>({
    client,
    args,
    options,
  }: WagemosRoundQuery<TData>): UseQueryOptions<
    RoundResponse,
    Error,
    TData
  > => ({
    queryKey: wagemosQueryKeys.round(client?.moduleId, args),
    queryFn: () =>
      client
        ? client.round({
            roundId: args.roundId,
          })
        : Promise.reject(new Error('Invalid client')),
    ...options,
    enabled:
      !!client && (options?.enabled != undefined ? options.enabled : true),
  }),
  listRounds: <TData = RoundsResponse>({
    client,
    args,
    options,
  }: WagemosListRoundsQuery<TData>): UseQueryOptions<
    RoundsResponse,
    Error,
    TData
  > => ({
    queryKey: wagemosQueryKeys.listRounds(client?.moduleId, args),
    queryFn: () =>
      client
        ? client.listRounds({
            limit: args.limit,
            startAfter: args.startAfter,
          })
        : Promise.reject(new Error('Invalid client')),
    ...options,
    enabled:
      !!client && (options?.enabled != undefined ? options.enabled : true),
  }),
  odds: <TData = OddsResponse>({
    client,
    args,
    options,
  }: WagemosOddsQuery<TData>): UseQueryOptions<OddsResponse, Error, TData> => ({
    queryKey: wagemosQueryKeys.odds(client?.moduleId, args),
    queryFn: () =>
      client
        ? client.odds({
            roundId: args.roundId,
            teamId: args.teamId,
          })
        : Promise.reject(new Error('Invalid client')),
    ...options,
    enabled:
      !!client && (options?.enabled != undefined ? options.enabled : true),
  }),
  listOdds: <TData = ListOddsResponse>({
    client,
    args,
    options,
  }: WagemosListOddsQuery<TData>): UseQueryOptions<
    ListOddsResponse,
    Error,
    TData
  > => ({
    queryKey: wagemosQueryKeys.listOdds(client?.moduleId, args),
    queryFn: () =>
      client
        ? client.listOdds({
            roundId: args.roundId,
          })
        : Promise.reject(new Error('Invalid client')),
    ...options,
    enabled:
      !!client && (options?.enabled != undefined ? options.enabled : true),
  }),
  config: <TData = ConfigResponse>({
    client,
    options,
  }: WagemosConfigQuery<TData>): UseQueryOptions<
    ConfigResponse,
    Error,
    TData
  > => ({
    queryKey: wagemosQueryKeys.config(client?.moduleId),
    queryFn: () =>
      client ? client.config() : Promise.reject(new Error('Invalid client')),
    ...options,
    enabled:
      !!client && (options?.enabled != undefined ? options.enabled : true),
  }),
  bets: <TData = BetsResponse>({
    client,
    args,
    options,
  }: WagemosBetsQuery<TData>): UseQueryOptions<BetsResponse, Error, TData> => ({
    queryKey: wagemosQueryKeys.bets(client?.moduleId, args),
    queryFn: () =>
      client
        ? client.bets({
            roundId: args.roundId,
          })
        : Promise.reject(new Error('Invalid client')),
    ...options,
    enabled:
      !!client && (options?.enabled != undefined ? options.enabled : true),
  }),
}
export interface WagemosReactQuery<TResponse, TData = TResponse> {
  client: WagemosAppQueryClient | undefined
  options?: Omit<
    UseQueryOptions<TResponse, Error, TData>,
    "'queryKey' | 'queryFn' | 'initialData'"
  > & {
    initialData?: undefined
  }
}
export interface WagemosBetsQuery<TData>
  extends WagemosReactQuery<BetsResponse, TData> {
  args: {
    roundId: number
  }
}
export function useWagemosBetsQuery<TData = BetsResponse>({
  client,
  args,
  options,
}: WagemosBetsQuery<TData>) {
  return useQuery<BetsResponse, Error, TData>(
    wagemosQueryKeys.bets(client?.moduleId, args),
    () =>
      client
        ? client.bets({
            roundId: args.roundId,
          })
        : Promise.reject(new Error('Invalid client')),
    {
      ...options,
      enabled:
        !!client && (options?.enabled != undefined ? options.enabled : true),
    }
  )
}
export interface WagemosConfigQuery<TData>
  extends WagemosReactQuery<ConfigResponse, TData> {}
export function useWagemosConfigQuery<TData = ConfigResponse>({
  client,
  options,
}: WagemosConfigQuery<TData>) {
  return useQuery<ConfigResponse, Error, TData>(
    wagemosQueryKeys.config(client?.moduleId),
    () =>
      client ? client.config() : Promise.reject(new Error('Invalid client')),
    {
      ...options,
      enabled:
        !!client && (options?.enabled != undefined ? options.enabled : true),
    }
  )
}
export interface WagemosListOddsQuery<TData>
  extends WagemosReactQuery<ListOddsResponse, TData> {
  args: {
    roundId: number
  }
}
export function useWagemosListOddsQuery<TData = ListOddsResponse>({
  client,
  args,
  options,
}: WagemosListOddsQuery<TData>) {
  return useQuery<ListOddsResponse, Error, TData>(
    wagemosQueryKeys.listOdds(client?.moduleId, args),
    () =>
      client
        ? client.listOdds({
            roundId: args.roundId,
          })
        : Promise.reject(new Error('Invalid client')),
    {
      ...options,
      enabled:
        !!client && (options?.enabled != undefined ? options.enabled : true),
    }
  )
}
export interface WagemosOddsQuery<TData>
  extends WagemosReactQuery<OddsResponse, TData> {
  args: {
    roundId: number
    teamId: AccountId
  }
}
export function useWagemosOddsQuery<TData = OddsResponse>({
  client,
  args,
  options,
}: WagemosOddsQuery<TData>) {
  return useQuery<OddsResponse, Error, TData>(
    wagemosQueryKeys.odds(client?.moduleId, args),
    () =>
      client
        ? client.odds({
            roundId: args.roundId,
            teamId: args.teamId,
          })
        : Promise.reject(new Error('Invalid client')),
    {
      ...options,
      enabled:
        !!client && (options?.enabled != undefined ? options.enabled : true),
    }
  )
}
export interface WagemosListRoundsQuery<TData>
  extends WagemosReactQuery<RoundsResponse, TData> {
  args: {
    limit?: number
    startAfter?: number
  }
}
export function useWagemosListRoundsQuery<TData = RoundsResponse>({
  client,
  args,
  options,
}: WagemosListRoundsQuery<TData>) {
  return useQuery<RoundsResponse, Error, TData>(
    wagemosQueryKeys.listRounds(client?.moduleId, args),
    () =>
      client
        ? client.listRounds({
            limit: args.limit,
            startAfter: args.startAfter,
          })
        : Promise.reject(new Error('Invalid client')),
    {
      ...options,
      enabled:
        !!client && (options?.enabled != undefined ? options.enabled : true),
    }
  )
}
export interface WagemosRoundQuery<TData>
  extends WagemosReactQuery<RoundResponse, TData> {
  args: {
    roundId: number
  }
}
export function useWagemosRoundQuery<TData = RoundResponse>({
  client,
  args,
  options,
}: WagemosRoundQuery<TData>) {
  return useQuery<RoundResponse, Error, TData>(
    wagemosQueryKeys.round(client?.moduleId, args),
    () =>
      client
        ? client.round({
            roundId: args.roundId,
          })
        : Promise.reject(new Error('Invalid client')),
    {
      ...options,
      enabled:
        !!client && (options?.enabled != undefined ? options.enabled : true),
    }
  )
}
export interface WagemosUpdateConfigMutation {
  client: WagemosAppClient
  msg: {
    rake?: Decimal
  }
  args?: {
    fee?: number | StdFee | 'auto'
    memo?: string
    funds?: Coin[]
  }
}
export function useWagemosUpdateConfigMutation(
  options?: Omit<
    UseMutationOptions<ExecuteResult, Error, WagemosUpdateConfigMutation>,
    'mutationFn'
  >
) {
  return useMutation<ExecuteResult, Error, WagemosUpdateConfigMutation>(
    ({ client, msg, args: { fee, memo, funds } = {} }) =>
      client.updateConfig(msg, fee, memo, funds),
    options
  )
}
export interface WagemosCloseRoundMutation {
  client: WagemosAppClient
  msg: {
    roundId: number
    winner?: AccountId
  }
  args?: {
    fee?: number | StdFee | 'auto'
    memo?: string
    funds?: Coin[]
  }
}
export function useWagemosCloseRoundMutation(
  options?: Omit<
    UseMutationOptions<ExecuteResult, Error, WagemosCloseRoundMutation>,
    'mutationFn'
  >
) {
  return useMutation<ExecuteResult, Error, WagemosCloseRoundMutation>(
    ({ client, msg, args: { fee, memo, funds } = {} }) =>
      client.closeRound(msg, fee, memo, funds),
    options
  )
}
export interface WagemosDistributeWinningsMutation {
  client: WagemosAppClient
  msg: {
    roundId: number
  }
  args?: {
    fee?: number | StdFee | 'auto'
    memo?: string
    funds?: Coin[]
  }
}
export function useWagemosDistributeWinningsMutation(
  options?: Omit<
    UseMutationOptions<ExecuteResult, Error, WagemosDistributeWinningsMutation>,
    'mutationFn'
  >
) {
  return useMutation<ExecuteResult, Error, WagemosDistributeWinningsMutation>(
    ({ client, msg, args: { fee, memo, funds } = {} }) =>
      client.distributeWinnings(msg, fee, memo, funds),
    options
  )
}
export interface WagemosPlaceBetMutation {
  client: WagemosAppClient
  msg: {
    bet: Bet
    roundId: number
  }
  args?: {
    fee?: number | StdFee | 'auto'
    memo?: string
    funds?: Coin[]
  }
}
export function useWagemosPlaceBetMutation(
  options?: Omit<
    UseMutationOptions<ExecuteResult, Error, WagemosPlaceBetMutation>,
    'mutationFn'
  >
) {
  return useMutation<ExecuteResult, Error, WagemosPlaceBetMutation>(
    ({ client, msg, args: { fee, memo, funds } = {} }) =>
      client.placeBet(msg, fee, memo, funds),
    options
  )
}
export interface WagemosUpdateAccountsMutation {
  client: WagemosAppClient
  msg: {
    roundId: number
    toAdd: AccountOdds[]
    toRemove: AccountId[]
  }
  args?: {
    fee?: number | StdFee | 'auto'
    memo?: string
    funds?: Coin[]
  }
}
export function useWagemosUpdateAccountsMutation(
  options?: Omit<
    UseMutationOptions<ExecuteResult, Error, WagemosUpdateAccountsMutation>,
    'mutationFn'
  >
) {
  return useMutation<ExecuteResult, Error, WagemosUpdateAccountsMutation>(
    ({ client, msg, args: { fee, memo, funds } = {} }) =>
      client.updateAccounts(msg, fee, memo, funds),
    options
  )
}
export interface WagemosRegisterMutation {
  client: WagemosAppClient
  msg: {
    roundId: number
  }
  args?: {
    fee?: number | StdFee | 'auto'
    memo?: string
    funds?: Coin[]
  }
}
export function useWagemosRegisterMutation(
  options?: Omit<
    UseMutationOptions<ExecuteResult, Error, WagemosRegisterMutation>,
    'mutationFn'
  >
) {
  return useMutation<ExecuteResult, Error, WagemosRegisterMutation>(
    ({ client, msg, args: { fee, memo, funds } = {} }) =>
      client.register(msg, fee, memo, funds),
    options
  )
}
export interface WagemosCreateRoundMutation {
  client: WagemosAppClient
  msg: {
    baseBetToken: AssetEntry
    description: string
    name: string
  }
  args?: {
    fee?: number | StdFee | 'auto'
    memo?: string
    funds?: Coin[]
  }
}
export function useWagemosCreateRoundMutation(
  options?: Omit<
    UseMutationOptions<ExecuteResult, Error, WagemosCreateRoundMutation>,
    'mutationFn'
  >
) {
  return useMutation<ExecuteResult, Error, WagemosCreateRoundMutation>(
    ({ client, msg, args: { fee, memo, funds } = {} }) =>
      client.createRound(msg, fee, memo, funds),
    options
  )
}
