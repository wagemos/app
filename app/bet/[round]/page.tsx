'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { rounds } from '@/utils'
import Image from 'next/image'
import classNames from 'classnames'
import { useWagemos } from '@/contexts/betting'
import {
  useWagemosListOddsQuery,
  useWagemosRoundQuery,
} from '@/types/Wagemos.react-query'
import { useAccountsByIdsQuery } from '@/hooks/useAccountsByIdsQuery'
import { AbstractAccountId } from '@abstract-money/abstract.js'
import { useAccount } from '@/contexts/account'

const teams = [
  {
    id: 1,
    name: 'Hackmos Betting Platform',
    teamSize: 2,
    odds: 1.65,
  },
  {
    id: 2,
    name: 'Trustless Interchain Oracle',
    teamSize: 5,
    odds: 2.35,
  },
  {
    id: 3,
    name: 'Validator Deleagation Bootstrapping Platform',
    teamSize: 3,
    odds: 3.15,
  },
]

export default function Round({ params }: { params: { round: string } }) {
  const round = useMemo(
    () => rounds.find((round) => round.id === parseInt(params.round))!,
    [params.round]
  )

  const { chain } = useAccount()
  const { wagemosClient } = useWagemos()

  const { data: roundData } = useWagemosRoundQuery({
    client: wagemosClient,
    args: { roundId: round.id },
    options: {
      select: (round) => ({
        ...round,
        teams: round.teams.map((team) => ({
          sequence: team.seq,
          trace: new AbstractAccountId(team.seq, team.trace).nullableTrace,
          chain,
        })),
      }),
    },
  })

  const { data: teamAccounts } = useAccountsByIdsQuery({
    ids: roundData?.teams || [],
    options: {
      enabled: !!roundData?.teams,
    },
  })

  const { data: odds } = useWagemosListOddsQuery({
    args: {
      roundId: round.id,
    },
    client: wagemosClient,
    options: {
      select: ({ odds }) => odds,
    },
  })

  useEffect(() => {
    console.log('roundData', roundData)
  }, [roundData])

  useEffect(() => {
    console.log('teamAccounts', teamAccounts)
  }, [teamAccounts])

  const [customAmount, setCustomAmount] = useState<number>(0)
  const [selectedTeam, setSelectedTeam] = useState<number | undefined>(
    undefined
  )

  const handleSelectTeam = useCallback(
    (id: number) => {
      if (selectedTeam === id) {
        setSelectedTeam(undefined)
      } else {
        setSelectedTeam(id)
      }
    },
    [selectedTeam, setSelectedTeam]
  )

  return (
    <div>
      <div className="flex flex-row items-center w-full justify-between">
        <div className="flex items-center space-x-4">
          <Image
            src={round.image}
            alt={String(round.id)}
            width={128}
            height={128}
            className="h-12 w-12"
          />
          <p className="font-calsans text-4xl lg:text-5xl text-left">
            {round.name}
          </p>
        </div>
        <div></div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-8">
        <div className="border-zinc-800 border rounded-md flex flex-row items-baseline p-6">
          <p className="font-calsans text-2xl lg:text-3xl text-left">1024.00</p>
          <p className="font-medium text-white/50 ml-2">
            total $HACKMOS wagered
          </p>
        </div>
        <div className="border-zinc-800 border rounded-md flex flex-row items-baseline p-6">
          <p className="font-calsans text-2xl lg:text-3xl text-left">24</p>
          <p className="font-medium text-white/50 ml-2">total bettors</p>
        </div>
      </div>
      <p className="font-calsans text-2xl lg:text-3xl mt-8">Teams competing</p>
      <div className="grid grid-cols-1 gap-2 mt-4 max-h-[37vh] overflow-y-scroll">
        {teamAccounts?.map((team) => (
          <button
            key={team.id}
            onClick={() => handleSelectTeam(team.accountId.sequence)}
            className={classNames(
              selectedTeam === team.accountId.sequence
                ? 'border-zinc-500 ring-zinc-500 ring'
                : 'border-zinc-800',
              'rounded-md border grid grid-cols-5 p-4 gap-2'
            )}
          >
            <p className="font-semibold col-span-3 text-lg text-left">
              {team.info.name}
            </p>
            <p className="font-medium text-right">
              <span className="font-calsans text-lg">{team.description}</span>{' '}
              members
            </p>
            <p className="font-medium text-right">
              <span className="font-calsans text-lg">
                {parseFloat(
                  odds?.find(
                    (prob) => prob.account_id.seq === team.accountId.sequence
                  )?.odds || '1'
                ).toFixed(2)}
                :1
              </span>{' '}
              odds
            </p>
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        <div className="flex flex-col bg-zinc-700 rounded-md px-3 py-8 hover:bg-opacity-75 transition duration-200 ease-in-out cursor-pointer">
          <p className="font-calsans text-3xl lg:text-4xl text-left">+10.00</p>
          <p className="font-medium text-white/50 mt-1.5">$HACKMOS wager</p>
        </div>
        <div className="flex flex-col bg-zinc-800 rounded-md px-3 py-8 hover:bg-opacity-75 transition duration-200 ease-in-out cursor-pointer">
          <p className="font-calsans text-3xl lg:text-4xl text-left">+25.00</p>
          <p className="font-medium text-white/50 mt-1.5">$HACKMOS wager</p>
        </div>
        <div className="flex flex-col bg-zinc-900 rounded-md px-3 py-8 hover:bg-opacity-75 transition duration-200 ease-in-out cursor-pointer">
          <p className="font-calsans text-3xl lg:text-4xl text-left">+50.00</p>
          <p className="font-medium text-white/50 mt-1.5">$HACKMOS wager</p>
        </div>
        <div className="flex flex-col border border-zinc-800 rounded-md px-3 py-6">
          <div>
            <label htmlFor="amount" className="sr-only">
              Custom Wager
            </label>
            <input
              type="number"
              name="amount"
              id="amount"
              className="block font-calsans w-full rounded-md border-0 py-2.5 text-lg bg-transparent ring-zinc-900 ring-1 ring-inset placeholder:text-white/50 focus:ring-2 focus:ring-inset focus:ring-zinc-600"
              placeholder="Custom Amount..."
              value={customAmount}
              onChange={(e) => setCustomAmount(parseInt(e.target.value))}
              min={1}
              step={1}
            />
          </div>
          <button className="bg-zinc-800 hover:bg-zinc-900 text-white font-calsans inline-flex justify-center items-center rounded-md text-sm py-2 mt-2">
            Submit Wager
          </button>
        </div>
      </div>
    </div>
  )
}
