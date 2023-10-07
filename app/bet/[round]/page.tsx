'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  convertDenomToMicroDenom,
  convertMicroDenomToDenom,
  rounds,
} from '@/utils'
import Image from 'next/image'
import classNames from 'classnames'
import { useWagemos } from '@/contexts/betting'
import {
  useWagemosListOddsQuery,
  useWagemosRoundQuery,
  wagemosQueryKeys,
} from '@/types/Wagemos.react-query'
import { useAccountsByIdsQuery } from '@/hooks/useAccountsByIdsQuery'
import { AbstractAccountId } from '@abstract-money/abstract.js'
import { useAccount } from '@/contexts/account'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useWallet } from '@/contexts/wallet'
import { WagemosMessageComposer } from '@/types/Wagemos.message-composer'
import { useTx } from '@/contexts/tx'
import { coin } from '@cosmjs/amino'

export default function Round({ params }: { params: { round: string } }) {
  const round = useMemo(
    () => rounds.find((round) => round.id === parseInt(params.round))!,
    [params.round]
  )

  const { tx } = useTx()
  const { chain } = useAccount()
  const { wallet, refreshBalances } = useWallet()
  const { wagemosClient } = useWagemos()

  const { data: roundData, isLoading: isLoadingRoundData } =
    useWagemosRoundQuery({
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

  const { data: teamAccounts, isLoading: isLoadingTeamAccounts } =
    useAccountsByIdsQuery({
      ids: roundData?.teams || [],
      options: {
        enabled: !!roundData?.teams,
      },
    })

  const { data: odds, isLoading: isLoadingOdds } = useWagemosListOddsQuery({
    args: {
      roundId: round.id,
    },
    client: wagemosClient,
    options: {
      select: ({ odds }) => odds,
    },
  })

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

  const queryClient = useQueryClient()

  const handleSubmitMutation = useMutation({
    mutationFn: async (amount: number) => {
      if (!selectedTeam) {
        alert('Please click on a team to select it first.')
        throw new Error('selectedTeam not found')
      }
      if (!wagemosClient) throw new Error('wagemosClient not found')
      if (!wallet?.cosmwasm) throw new Error('cosmwasm not found')

      const contractAddress = await wagemosClient.address()
      const messageComposer = new WagemosMessageComposer(
        wallet.address,
        contractAddress
      )

      const microAmount = convertDenomToMicroDenom(amount).toString()

      const msg = messageComposer.placeBet(
        {
          roundId: round.id,
          bet: {
            account_id: new AbstractAccountId(selectedTeam),
            asset: {
              name: 'neutron>hackmos',
              amount: microAmount,
            },
          },
        },
        [coin(microAmount, wallet.balance.denom)]
      )

      await tx(
        [msg],
        {
          toast: {
            title: 'Wager Placed!',
          },
        },
        refreshBalances
      )
    },
    onSuccess: () => {
      return queryClient.invalidateQueries({
        predicate: ({ queryKey }) =>
          queryKey?.[0] === wagemosQueryKeys.listOdds,
      })
    },
  })

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
          {isLoadingRoundData ? (
            <div className="h-8 rounded-md bg-white/25 animate-pulse w-12"></div>
          ) : (
            <p className="font-calsans text-2xl lg:text-3xl text-left">
              {convertMicroDenomToDenom(
                roundData?.total_bet.amount || 0
              ).toFixed(2)}
            </p>
          )}
          <p className="font-medium text-white/50 ml-2">
            total $HACKMOS wagered
          </p>
        </div>
        <div className="border-zinc-800 border rounded-md flex flex-row items-baseline p-6">
          {isLoadingRoundData ? (
            <div className="h-8 rounded-md bg-white/25 animate-pulse w-12"></div>
          ) : (
            <p className="font-calsans text-2xl lg:text-3xl text-left">
              {roundData?.bet_count || 0}
            </p>
          )}
          <p className="font-medium text-white/50 ml-2">total bettors</p>
        </div>
      </div>
      <p className="font-calsans text-2xl lg:text-3xl mt-8">Teams competing</p>
      <div className="grid grid-cols-1 gap-2 mt-4 max-h-[37vh] overflow-y-scroll">
        {isLoadingTeamAccounts || isLoadingOdds
          ? [100, 101, 102, 103].map((key) => (
              <div
                key={key}
                className="rounded-md border border-zinc-800 grid grid-cols-5 p-4 gap-2"
              >
                <div className="col-span-3 flex flex-row justify-start">
                  <div className="h-7 rounded-md bg-white/25 animate-pulse w-1/2"></div>
                </div>
                <div className="flex flex-row justify-end">
                  <div className="h-5 rounded-md bg-white/25 animate-pulse w-2/3"></div>
                </div>
                <div className="flex flex-row justify-end">
                  <div className="h-5 rounded-md bg-white/25 animate-pulse w-2/3"></div>
                </div>
              </div>
            ))
          : teamAccounts?.map((team) => (
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
                <p className="font-semibold col-span-3 text-lg text-left mt-1">
                  {team.info.name}
                </p>
                <p className="font-medium text-right text-base text-white/50 mt-1">
                  <span className="font-calsans text-lg text-white">
                    {team.info.description}
                  </span>{' '}
                  members
                </p>
                <p className="font-medium text-right text-base text-white/50">
                  <span className="font-calsans text-2xl text-white">
                    {parseFloat(
                      odds?.find(
                        (prob) =>
                          prob.account_id.seq === team.accountId.sequence
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
        <button
          onClick={() => handleSubmitMutation.mutate(10)}
          disabled={!selectedTeam}
          className="flex flex-col disabled:cursor-not-allowed bg-zinc-700 rounded-md px-3 py-8 hover:bg-opacity-75 transition duration-200 ease-in-out cursor-pointer"
        >
          <p className="font-calsans text-3xl lg:text-4xl text-left">+10.00</p>
          <p className="font-medium text-white/50 mt-1.5">$HACKMOS wager</p>
        </button>
        <button
          onClick={() => handleSubmitMutation.mutate(25)}
          disabled={!selectedTeam}
          className="flex flex-col disabled:cursor-not-allowed bg-zinc-800 rounded-md px-3 py-8 hover:bg-opacity-75 transition duration-200 ease-in-out cursor-pointer"
        >
          <p className="font-calsans text-3xl lg:text-4xl text-left">+25.00</p>
          <p className="font-medium text-white/50 mt-1.5">$HACKMOS wager</p>
        </button>
        <button
          onClick={() => handleSubmitMutation.mutate(50)}
          disabled={!selectedTeam}
          className="flex flex-col disabled:cursor-not-allowed bg-zinc-900 rounded-md px-3 py-8 hover:bg-opacity-75 transition duration-200 ease-in-out cursor-pointer"
        >
          <p className="font-calsans text-3xl lg:text-4xl text-left">+50.00</p>
          <p className="font-medium text-white/50 mt-1.5">$HACKMOS wager</p>
        </button>
        <form
          action="javascript:void(0);"
          onSubmit={() => handleSubmitMutation.mutate(customAmount)}
          className="flex flex-col border border-zinc-800 rounded-md px-3 py-6"
        >
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
          <button
            type="submit"
            className="bg-zinc-800 hover:bg-zinc-900 text-white font-calsans inline-flex justify-center items-center rounded-md text-sm py-2 mt-2"
          >
            Submit Wager
          </button>
        </form>
      </div>
    </div>
  )
}
