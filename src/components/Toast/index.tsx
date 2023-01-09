import s from './styles.module.scss'
import * as RadixToast from '@radix-ui/react-toast'
import { CloseButton } from '../CloseButton'
import { ReactNode } from 'react'
import { XCircle, CheckCircle } from 'phosphor-react'

interface ToastProps {
  children?: ReactNode
  title?: string
  description?: string
  success?: boolean
  open: boolean
  handleOpenChange?: (open: boolean) => void
}

export function Toast({
  children,
  title,
  description,
  open,
  handleOpenChange,
  success = true,
}: ToastProps) {
  const timeOnScreen = 4500

  return (
    <RadixToast.Provider swipeDirection="right" duration={timeOnScreen}>
      {children}
      <RadixToast.Root
        className={s.root}
        open={open}
        onOpenChange={handleOpenChange}
      >
        {success ? (
          <CheckCircle size={24} weight="fill" className="success" />
        ) : (
          <XCircle size={24} weight="fill" className="error" />
        )}

        <div className={s.content}>
          {title && (
            <RadixToast.Title className={s.title}>{title}</RadixToast.Title>
          )}

          {description && (
            <RadixToast.Title className={s.description}>
              {description}
            </RadixToast.Title>
          )}
        </div>

        <RadixToast.Close className={s.action} asChild>
          <div>
            <CloseButton positionAbsolute={false} />
          </div>
        </RadixToast.Close>
      </RadixToast.Root>

      <RadixToast.Viewport className={s.ToastViewport} />
    </RadixToast.Provider>
  )
}
