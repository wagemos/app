import { createContext, ReactNode, useContext, SVGProps } from 'react'
import { TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx.js'
import { isDeliverTxSuccess } from '@cosmjs/stargate'
import { coins } from '@cosmjs/stargate'

import { CheckCircleIcon } from '@heroicons/react/24/outline'
import {
  XMarkIcon as XIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/solid'
import toast, { Toaster, ToastOptions } from 'react-hot-toast'
import classNames from 'classnames'
import { useWallet } from './wallet'
import { GasPrice } from '@cosmjs/stargate'
import { Uint53 } from '@cosmjs/math'
import Spinner from '@/components/Spinner'
import { GAS_DENOM } from '@/utils'

export const ToasterContainer = Toaster

export enum ToastTypes {
  Success = 'success',
  Error = 'error',
  Pending = 'pending',
  Warning = 'warning',
}

export interface ToastPayload {
  actions?: JSX.Element
  message?: string | JSX.Element
  title: string
  type: ToastTypes
  dismissable?: boolean
}

function customToast(
  { actions, title, type, message, dismissable }: ToastPayload,
  options?: ToastOptions
): any {
  let Icon: (props: SVGProps<SVGSVGElement>) => JSX.Element

  switch (type) {
    case ToastTypes.Success: {
      Icon = CheckCircleIcon as any
      break
    }
    case ToastTypes.Error: {
      Icon = ExclamationCircleIcon as any
      break
    }
    case ToastTypes.Pending: {
      Icon = Spinner
      break
    }
    case ToastTypes.Warning: {
      Icon = ExclamationTriangleIcon as any
      break
    }
  }

  return toast.custom(
    (t: any) => (
      <div
        onLoad={() => {
          setTimeout(() => toast.dismiss(t.id), 3000)
        }}
        onClick={dismissable ? () => toast.dismiss(t.id) : () => {}}
        className={classNames(
          t.visible ? 'animate-enter' : 'animate-leave',
          dismissable ? 'cursor-pointer' : '',
          'group w-full max-w-sm bg-[#262626] bg-opacity-40 backdrop-blur-md border border-[#262626] shadow-lg rounded-md pointer-events-auto p-2'
        )}
      >
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Icon
              className="w-5 h-5 text-[#E2E2E2] mt-0.5"
              aria-hidden="true"
            />
          </div>

          <div className="ml-3 w-0 flex-1 pt-0.5">
            <p className="text-sm font-medium text-[#E2E2E2]">{title}</p>

            {message && (
              <p className="mt-1 text-sm text-[#E2E2E2]">{message}</p>
            )}

            {actions}
          </div>
          {dismissable && (
            <div className="justify-center flex-shrink-0 hidden h-full ml-4 group-hover:flex">
              <button className="inline-flex text-white">
                <span className="sr-only">Close</span>
                <XIcon className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          )}
        </div>
      </div>
    ),
    options
  )
}

interface CustomToast {
  dismiss: typeof toast.dismiss
  toast: typeof customToast
  error: (msg: string) => void
}

export function useToaster(): CustomToast {
  function error(msg: string) {
    customToast({
      type: ToastTypes.Error,
      title: 'Error',
      message: msg,
    })
  }

  return {
    dismiss: toast.dismiss,
    toast: customToast,
    error,
  }
}

export interface Msg {
  typeUrl: string
  value: any
}

export interface TxOptions {
  gas?: number
  denom?: string
  toast?: {
    title?: ToastPayload['title']
    message?: ToastPayload['message']
    type?: ToastTypes
    actions?: JSX.Element
  }
}

export interface TxContext {
  tx: (
    msgs: Msg[],
    options: TxOptions,
    callback?: (hash: string) => void
  ) => Promise<void>
}

export const Tx = createContext<TxContext>({
  tx: () => new Promise(() => {}),
})

export function TxProvider({ children }: { children: ReactNode }) {
  const { wallet } = useWallet()

  const toaster = useToaster()

  const tx = async (
    msgs: Msg[],
    options: TxOptions,
    callback?: (hash: string) => void
  ) => {
    if (!wallet) throw new Error('Wallet is not connected')

    let simulateToastId = ''

    simulateToastId = toaster.toast(
      {
        title: 'Simulating transaction...',
        type: ToastTypes.Pending,
      },
      { duration: 999999 }
    )

    let gas: number
    try {
      gas = await wallet.cosmwasm.simulate(wallet.address, msgs, undefined)
    } catch (e) {
      return toaster.toast({
        title: 'Error',
        message: (e as Error).message,
        type: ToastTypes.Error,
      })
    }

    const gasLimit = Math.round(gas * 1.3)
    const { denom, amount: gasPriceAmount } = GasPrice.fromString(
      `0.1${GAS_DENOM}`
    )
    const amount = gasPriceAmount
      .multiply(new Uint53(gasLimit))
      .ceil()
      .toString()

    const fee = {
      amount: coins(amount, denom),
      gas: String(gasLimit),
    }

    toaster.dismiss(simulateToastId)

    let signed
    try {
      signed = await wallet.cosmwasm.sign(wallet.address, msgs, fee, '')
    } catch (e) {
      return toaster.toast({
        title: 'Error',
        message: (e as Error).message,
        type: ToastTypes.Error,
      })
    }

    let broadcastToastId = ''

    broadcastToastId = toaster.toast(
      {
        title: 'Broadcasting transaction...',
        type: ToastTypes.Pending,
      },
      { duration: 999999 }
    )

    if (wallet.cosmwasm && signed) {
      await wallet.cosmwasm
        .broadcastTx(Uint8Array.from(TxRaw.encode(signed).finish()))
        .then((res) => {
          toaster.dismiss(broadcastToastId)
          if (isDeliverTxSuccess(res)) {
            // Run callback
            if (callback) callback(res.transactionHash)

            toaster.toast({
              title: options.toast?.title || 'Transaction Successful',
              type: options.toast?.type || ToastTypes.Success,
              dismissable: true,
              actions: options.toast?.actions || <></>,
              message: options.toast?.message || <></>,
            })
          } else {
            toaster.toast({
              title: 'Error',
              message: res.rawLog,
              type: ToastTypes.Error,
            })
          }
        })
    } else {
      toaster.dismiss(broadcastToastId)
    }
  }

  return <Tx.Provider value={{ tx }}>{children}</Tx.Provider>
}

export const useTx = (): TxContext => useContext(Tx)
