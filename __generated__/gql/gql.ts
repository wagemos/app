/* eslint-disable */
import * as types from './graphql';
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel-plugin for production.
 */
const documents = {
    "\n  query AccountsByIds($ids: [AccountIdWithChain!]!) {\n    accountsByIds(ids: $ids) {\n      id\n      chain\n      accountId {\n        sequence\n      }\n      info {\n        name\n        description\n        governance {\n          governanceType\n          owner\n        }\n      }\n      proxy\n      namespace\n      manager\n      subAccounts {\n        accountId {\n          sequence\n          trace\n        }\n        modules {\n          id\n        }\n      }\n    }\n  }\n": types.AccountsByIdsDocument,
    "\n  query Deployment($chain: ID!) {\n    version\n    deployment(chain: $chain) {\n      ansHost\n      registry\n      accountFactory\n    }\n    chainInfo(chain: $chain) {\n      rpcUrl\n    }\n  }\n": types.DeploymentDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query AccountsByIds($ids: [AccountIdWithChain!]!) {\n    accountsByIds(ids: $ids) {\n      id\n      chain\n      accountId {\n        sequence\n      }\n      info {\n        name\n        description\n        governance {\n          governanceType\n          owner\n        }\n      }\n      proxy\n      namespace\n      manager\n      subAccounts {\n        accountId {\n          sequence\n          trace\n        }\n        modules {\n          id\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query AccountsByIds($ids: [AccountIdWithChain!]!) {\n    accountsByIds(ids: $ids) {\n      id\n      chain\n      accountId {\n        sequence\n      }\n      info {\n        name\n        description\n        governance {\n          governanceType\n          owner\n        }\n      }\n      proxy\n      namespace\n      manager\n      subAccounts {\n        accountId {\n          sequence\n          trace\n        }\n        modules {\n          id\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query Deployment($chain: ID!) {\n    version\n    deployment(chain: $chain) {\n      ansHost\n      registry\n      accountFactory\n    }\n    chainInfo(chain: $chain) {\n      rpcUrl\n    }\n  }\n"): (typeof documents)["\n  query Deployment($chain: ID!) {\n    version\n    deployment(chain: $chain) {\n      ansHost\n      registry\n      accountFactory\n    }\n    chainInfo(chain: $chain) {\n      rpcUrl\n    }\n  }\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;