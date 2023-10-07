import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import request, { type RequestDocument, type Variables } from 'graphql-request'
import { type TypedDocumentNode } from '@graphql-typed-document-node/core'
import type { RemoveIndex, VariablesAndRequestHeaders } from 'graphql-request/dist/types'
import { type QueryKey } from '@tanstack/query-core'

export const SUBGRAPH_URL = 'https://abstract-subgraph-0-19.fly.dev/'

/**
 * A strongly-typed query to the Abstract subgraph.
 * @param gqlQuery
 * @param variablesAndRequestHeaders
 */
export const subgraphQuery = <TResult, V extends Variables = Variables>(
  gqlQuery: RequestDocument | TypedDocumentNode<TResult, V>,
  ...variablesAndRequestHeaders: VariablesAndRequestHeaders<V>
) => request(SUBGRAPH_URL, gqlQuery, ...variablesAndRequestHeaders)

/**
 * Query abstract subgraph with options provided for react query.
 * @param gqlQuery
 * @param options
 * @param variablesAndRequestHeaders
 */
export const useSubgraphQuery = <
  TQueryKey extends QueryKey = QueryKey,
  TResult = unknown,
  TData = TResult,
  V extends Variables = Variables
>(
  options: Omit<UseQueryOptions<TResult, Error, TData, TQueryKey>, 'queryFn'>,
  gqlQuery: RequestDocument | TypedDocumentNode<TResult, V>,
  ...variablesAndRequestHeaders: VariablesAndRequestHeaders<V>
) => {
  return useQuery({
    queryFn: () => subgraphQuery<TResult, V>(gqlQuery, ...variablesAndRequestHeaders),
    ...options,
  })
}
