import BigNumber from 'bignumber.js'

export const microDenomMultiplier = 1_000_000

export const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || 'https://wagemos.com/'
export const NETWORK = process.env.NEXT_PUBLIC_NETWORK || 'neutron'
export const DENOM =
  process.env.NEXT_PUBLIC_DENOM ||
  'factory/neutron1js3pkant5zgm954n3cq2wz0e4z03tvq927hnc3/uhackmos'

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const convertMicroDenomToDenom = (
  amount: number | string | BigNumber
): number => {
  const value = Number(amount)
  const multiplierValue = new BigNumber(`1e+${microDenomMultiplier}`)
  return isNaN(value)
    ? 0
    : new BigNumber(value).dividedBy(multiplierValue).toNumber()
}

export const convertDenomToMicroDenom = (
  amount: number | string | BigNumber
): number => {
  const value = Number(amount)
  const multiplierValue = new BigNumber(`1e+${microDenomMultiplier}`)
  return isNaN(value)
    ? 0
    : new BigNumber(value).multipliedBy(multiplierValue).toNumber()
}

export const tracks = [
  {
    id: 'neutron',
    name: 'Neutron',
    description:
      'Build cross-chain CosmWasm smart contracts using IBC on Neutron.',
    image: '/neutron.svg',
  },
  {
    id: 'okp4',
    name: 'OKP-4',
    description:
      'Develop digital asset sharing & coordination protocols on OKP-4.',
    image: '/okp.svg',
  },
  {
    id: 'abci',
    name: 'ABCI++',
    description: "Improve IBC using Interchain Foundation's ABCI++.",
    image: '/icf.svg',
  },
]

export const bounties = [
  {
    id: 'abstract',
    name: 'Abstract',
    image: '/abstract.svg',
  },
  {
    id: 'akash',
    name: 'Akash Network',
    image: '/akash.svg',
  },
]

export const rounds = [...tracks, ...bounties]
