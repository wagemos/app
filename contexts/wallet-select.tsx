import React, {
  createContext,
  Fragment,
  ReactNode,
  useContext,
  useState,
} from 'react'

import isUserAgentMobile from 'is-mobile'
import { WalletName, WalletRepo } from '@cosmos-kit/core'
import { Dialog, Transition } from '@headlessui/react'
import Image from 'next/image'

const WalletSelectModal = ({
  walletRepo,
  onSelectWallet,
}: {
  walletRepo: WalletRepo
  onSelectWallet: (walletType: WalletName | undefined) => void
}) => {
  return (
    <Transition.Root show={true} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        open={true}
        onClose={() => onSelectWallet(undefined)}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-zinc-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="bg-black p-8 rounded-lg">
                <Dialog.Title className="font-calsans text-2xl lg:text-3xl text-left text-white">
                  Connect a wallet
                </Dialog.Title>
                <Dialog.Description className="text-left text-white/50 mt-2">
                  You will have to use a wallet to place and manage your bets.
                </Dialog.Description>
                <div className="grid grid-cols-2 gap-4 mt-8">
                  {walletRepo?.wallets
                    .filter(({ walletInfo }) => {
                      const mode = isUserAgentMobile()
                        ? 'wallet-connect'
                        : 'extension'
                      return walletInfo.mode === mode
                    })
                    .map(({ walletName, walletInfo }) => (
                      <button
                        key={walletName}
                        onClick={() => onSelectWallet(walletName)}
                      >
                        <div className="flex flex-col items-center justify-center bg-zinc-800 border rounded-lg border-zinc-600 p-6">
                          <Image
                            src={
                              typeof walletInfo.logo === 'string'
                                ? walletInfo.logo
                                : (walletInfo.logo as any).major
                            }
                            width={128}
                            height={128}
                            alt={walletInfo.name}
                            className="w-12 h-12"
                          />
                          <p className="font-semibold mt-4 text-white">
                            {walletInfo.prettyName ===
                            'Cosmos MetaMask Extension'
                              ? 'MetaMask'
                              : walletInfo.prettyName}
                          </p>
                        </div>
                      </button>
                    ))}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export interface WalletSelectContext {
  selectWallet: (walletRepo: WalletRepo) => Promise<WalletName | undefined>
}

export const WalletSelect = createContext<WalletSelectContext>({
  selectWallet: async () => undefined,
})

export const WalletSelectProvider = ({ children }: { children: ReactNode }) => {
  const [modal, setModal] = useState<JSX.Element | undefined>(undefined)

  const selectWallet = (walletRepo: WalletRepo) => {
    // mount modal with a callback
    console.log(walletRepo)
    return new Promise<WalletName | undefined>((resolve) => {
      mountModal(walletRepo, (walletName) => {
        setModal(undefined)
        resolve(walletName)
      })
    })
  }

  function mountModal(
    walletRepo: WalletRepo,
    handleSelectWallet: (walletName: WalletName | undefined) => void
  ) {
    const mounted = (
      <WalletSelectModal
        walletRepo={walletRepo}
        onSelectWallet={handleSelectWallet}
      />
    )
    setModal(mounted)
  }

  return (
    <WalletSelect.Provider value={{ selectWallet }}>
      <>
        {modal}
        {children}
      </>
    </WalletSelect.Provider>
  )
}

export const useWalletSelect = (): WalletSelectContext =>
  useContext(WalletSelect)
