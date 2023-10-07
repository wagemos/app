import BigNumber from 'bignumber.js'
import { AbstractAccountId } from '@abstract-money/abstract.js'

export const microDenomMultiplier = 1_000_000

export const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || 'https://wagemos.com/'

export const NETWORK = process.env.NEXT_PUBLIC_NETWORK || 'neutron'
export const BETTING_ACCOUNT_ID = AbstractAccountId.local(2)
export const GAS_DENOM = process.env.NEXT_PUBLIC_GAS_DENOM || 'untrn'
export const DENOM =
  process.env.NEXT_PUBLIC_DENOM ||
  'factory/neutron1js3pkant5zgm954n3cq2wz0e4z03tvq927hnc3/uhackmos'

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const convertMicroDenomToDenom = (amount: number | string): number => {
  const value = Number(amount)
  return isNaN(value) ? 0 : value / microDenomMultiplier
}

export const convertDenomToMicroDenom = (
  amount: number | string | BigNumber
): number => {
  const value = Number(amount)
  return isNaN(value) ? 0 : value * microDenomMultiplier
}

export const tracks = [
  {
    id: 0,
    name: 'Neutron',
    description:
      'Build cross-chain CosmWasm smart contracts using IBC on Neutron.',
    image: '/neutron.svg',
  },
  {
    id: 1,
    name: 'OKP-4',
    description:
      'Develop digital asset sharing & coordination protocols on OKP-4.',
    image: '/okp.svg',
  },
  {
    id: 2,
    name: 'ABCI++',
    description: "Improve IBC using Interchain Foundation's ABCI++.",
    image: '/icf.svg',
  },
]

export const bounties = [
  {
    id: 3,
    name: 'Abstract',
    image: '/abstract.svg',
  },
  {
    id: 4,
    name: 'Akash Network',
    image: '/akash.svg',
  },
]

export const rounds = [...tracks, ...bounties]
