'use client'

import {
  ChevronRightIcon,
  Cog8ToothIcon,
  ShoppingBagIcon,
} from '@heroicons/react/24/outline'
import { GlobeAltIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="grid grid-rows-3 lg:grid-cols-2 gap-4 mx-8 max-h-[87vh]">
      <Link
        href="/bet"
        className="rounded-lg lg:h-[87vh] overflow-hidden bg-zinc-900 group w-full flex flex-col cursor-pointer justify-between p-6"
      >
        <div className="flex flex-col w-full items-start">
          <div className="flex flex-row items-center w-full justify-between">
            <p className="font-calsans text-3xl lg:text-4xl text-left">
              Betting Markets
            </p>
            <ChevronRightIcon className="text-white/50 group-hover:translate-x-2 w-12 h-12 group-hover:text-white transition duration-300 ease-in-out" />
          </div>
          <p className="text-xl text-white/75 mt-4 text-left w-3/4 hidden lg:block">
            Bet on your favorite Hackmos teams and tracks to earn $HACKMOS
            tokens.
          </p>
        </div>
        <div className="flex flex-row items-baseline w-full justify-between">
          <div></div>
          <GlobeAltIcon className="relative text-white/50 left-[8rem] lg:left-[18rem] top-[2rem] lg:top-[18rem] w-[24rem] lg:w-[48rem] h-[24rem] lg:h-[48rem] group-hover:text-white group-hover:-translate-x-8 lg:group-hover:-translate-x-16 group-hover:-translate-y-8 lg:group-hover:-translate-y-16 transition duration-500 ease-in-out" />
        </div>
      </Link>
      <div className="grid row-span-2 grid-rows-2 lg:h-[87vh] gap-4">
        <Link
          href="#"
          className="rounded-lg overflow-hidden bg-zinc-900 group w-full flex flex-col cursor-pointer justify-between p-6"
        >
          <div className="flex flex-col w-full items-start">
            <div className="flex flex-row items-center w-full justify-between">
              <p className="font-calsans text-3xl lg:text-4xl text-left">
                Store
              </p>
              <ChevronRightIcon className="text-white/50 group-hover:translate-x-2 w-12 h-12 group-hover:text-white transition duration-300 ease-in-out" />
            </div>
          </div>
          <div className="flex flex-row items-baseline w-full justify-between">
            <div></div>
            <ShoppingBagIcon className="relative text-white/50 left-[8rem] lg:left-[10rem] top-[2rem] lg:top-[6rem] w-[24rem] lg:w-[32rem] h-[24rem] lg:h-[32rem] group-hover:text-white group-hover:-translate-x-8 lg:group-hover:-translate-x-16 group-hover:-translate-y-8 lg:group-hover:-translate-y-16 transition duration-500 ease-in-out" />
          </div>
        </Link>
        <Link
          href="#"
          className="rounded-lg overflow-hidden bg-zinc-900 group w-full flex flex-col cursor-pointer justify-between p-6"
        >
          <div className="flex flex-col w-full items-start">
            <div className="flex flex-row items-center w-full justify-between">
              <p className="font-calsans text-3xl lg:text-4xl text-left">
                Settings
              </p>
              <ChevronRightIcon className="text-white/50 group-hover:translate-x-2 w-12 h-12 group-hover:text-white transition duration-300 ease-in-out" />
            </div>
          </div>
          <div className="flex flex-row items-baseline w-full justify-between">
            <div></div>
            <Cog8ToothIcon className="relative text-white/50 left-[8rem] lg:left-[12rem] top-[2rem] lg:top-[6rem] w-[24rem] lg:w-[32rem] h-[24rem] lg:h-[32rem] group-hover:text-white group-hover:-translate-x-8 lg:group-hover:-translate-x-16 group-hover:-translate-y-8 lg:group-hover:-translate-y-16 transition duration-500 ease-in-out" />
          </div>
        </Link>
      </div>
    </main>
  )
}
