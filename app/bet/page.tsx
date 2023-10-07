import Link from 'next/link'
import Image from 'next/image'

import { tracks, bounties } from '@/utils'

import { ChevronRightIcon } from '@heroicons/react/24/outline'

export default function Rounds() {
  return (
    <main className="grid grid-rows-5 lg:grid-cols-4 gap-4 mx-8 max-h-[87vh]">
      {tracks.map((track) => (
        <Link
          href={`/bet/${track.id}`}
          key={track.id}
          className="rounded-lg lg:h-[87vh] overflow-hidden bg-zinc-900 group w-full flex flex-col cursor-pointer justify-between p-6"
        >
          <div className="flex flex-col w-full items-start">
            <div className="flex flex-row items-center w-full justify-between">
              <p className="font-calsans text-3xl lg:text-4xl text-left">
                {track.name}
              </p>
              <ChevronRightIcon className="text-white/50 w-12 h-12 group-hover:text-white group-hover:translate-x-2 transition duration-300 ease-in-out" />
            </div>
            <p className="text-xl text-white/75 mt-4 text-left w-3/4 hidden lg:block">
              {track.description}
            </p>
          </div>
          <div className="flex flex-row items-baseline w-full justify-between">
            <div></div>
            <Image
              src={track.image}
              alt={track.name}
              width={128}
              height={128}
              className="relative opacity-50 left-[4rem] lg:left-[8rem] top-[4rem] lg:top-[12rem] w-[24rem] lg:w-[48rem] h-[24rem] lg:h-[48rem] group-hover:opacity-100 group-hover:-translate-x-8 lg:group-hover:-translate-x-16 group-hover:-translate-y-8 lg:group-hover:-translate-y-16 transition duration-500 ease-in-out"
            />
          </div>
        </Link>
      ))}
      <div className="grid row-span-2 grid-rows-2 lg:h-[87vh] gap-4">
        {bounties.map((bounty) => (
          <Link
            href={`/bet/${bounty.id}`}
            key={bounty.id}
            className="rounded-lg overflow-hidden bg-zinc-900 group w-full flex flex-col cursor-pointer justify-between p-6"
          >
            <div className="flex flex-col w-full items-start">
              <div className="flex flex-row items-center w-full justify-between">
                <p className="font-calsans text-3xl lg:text-4xl text-left">
                  {bounty.name}
                </p>
                <ChevronRightIcon className="text-white/50 w-12 h-12 group-hover:text-white group-hover:translate-x-2 transition duration-300 ease-in-out" />
              </div>
            </div>
            <div className="flex flex-row items-baseline w-full justify-between">
              <div></div>
              <Image
                src={bounty.image}
                alt={bounty.name}
                width={128}
                height={128}
                className="relative opacity-50 left-[4rem] lg:left-[6rem] top-[4rem] lg:top-[6rem] w-[12rem] lg:w-[16rem] h-[12rem] lg:h-[16rem] group-hover:opacity-100 group-hover:-translate-x-8 lg:group-hover:-translate-x-16 group-hover:-translate-y-8 lg:group-hover:-translate-y-16 transition duration-500 ease-in-out"
              />
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}
