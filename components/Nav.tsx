'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useWallet } from '@/contexts/wallet'

import classNames from 'classnames'

import Logo from '../public/wagemos.svg'
import { convertMicroDenomToDenom } from '@/utils'
import { ArrowRightOnRectangleIcon } from '@heroicons/react/20/solid'
import Spinner from './Spinner'

const navigation = [
  {
    name: 'Home',
    href: '/',
    strict: true,
  },
  {
    name: 'Bet',
    href: '/bet',
  },
  {
    name: 'Store',
    href: '#',
  },
  {
    name: 'Settings',
    href: '#',
  },
]

const Nav = () => {
  const { wallet, isFetchingWallet, connect, disconnect } = useWallet()
  const pathname = usePathname()
  return (
    <nav className="w-screen px-4 py-3">
      <div className="flex flex-col md:flex-row justify-center md:justify-between items-center h-full px-4">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <Image
              src={Logo}
              alt="Wagemos"
              className="w-12 md:w-16 h-12 md:h-16 mr-1.5"
            />
            <h1 className="text-2xl md:text-3xl text-white font-calsans">
              Wagemos
            </h1>
          </Link>
          <div className="hidden md:flex items-center ml-8 mt-1.5 space-x-6">
            {navigation.map((item) => (
              <Link href={item.href} key={item.name}>
                <p
                  className={classNames(
                    (
                      item.strict
                        ? pathname === item.href
                        : pathname?.startsWith(item.href)
                    )
                      ? 'text-white drop-shadow-glow font-semibold'
                      : 'text-zinc-500 font-light',
                    'text-lg hover:text-white font-sans transition-all duration-200 ease-in-out hover:drop-shadow-2xl'
                  )}
                >
                  {item.name}
                </p>
              </Link>
            ))}
          </div>
        </div>
        {wallet ? (
          <div className="flex items-center border md:border-0 border-zinc-800 rounded-md py-1 px-4 mt-1 md:mt-0 md:p-0">
            <p className="text-white font-calsans text-lg font-semibold mr-2">
              {convertMicroDenomToDenom(wallet.balance.amount).toFixed(2)}
            </p>
            <Image src={Logo} alt="$HACKMOS" className="w-8 h-8 mr-3" />
            <button
              onClick={disconnect}
              className="bg-transparent hover:bg-zinc-900 transition duration-200 ease-in-out rounded-lg p-2"
            >
              <ArrowRightOnRectangleIcon className="text-white w-5 h-5" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => connect()}
            disabled={isFetchingWallet}
            className="bg-zinc-800 w-full mt-4 md:mt-0.5 disabled:hover:bg-zinc-800 hover:bg-zinc-900 rounded-lg md:w-48 inline-flex justify-center items-center py-3 text-white/75 hover:text-white font-sans text-sm transition-all duration-200 ease-in-out"
          >
            {isFetchingWallet ? (
              <Spinner className="text-white h-4 w-4" />
            ) : (
              'Connect Wallet'
            )}
          </button>
        )}
      </div>
    </nav>
  )
}

export default Nav
