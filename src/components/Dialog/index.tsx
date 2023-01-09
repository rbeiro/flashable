import * as Dialog from '@radix-ui/react-dialog'
import { ReactNode } from 'react'
import { CloseButton } from '../CloseButton'
import s from './styles.module.scss'

interface RequiresChildrenProps {
  children: ReactNode
}

interface RootProps extends RequiresChildrenProps {
  onOpenFunction?: (open: boolean) => void
  open?: boolean
}

export function Root({ children, open, onOpenFunction }: RootProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenFunction}>
      {children}
    </Dialog.Root>
  )
}

export function Trigger({ children }: RequiresChildrenProps) {
  return <Dialog.Trigger asChild>{children}</Dialog.Trigger>
}
export function Title({ children }: RequiresChildrenProps) {
  return <Dialog.Title className={s.title}>{children}</Dialog.Title>
}
export function Description({ children }: RequiresChildrenProps) {
  return (
    <Dialog.Description className={s.description}>
      {children}
    </Dialog.Description>
  )
}

export function Portal({ children }: RequiresChildrenProps) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className={s.overlay} />
      <Dialog.Content className={s.content}>
        {children}
        <Dialog.Close asChild>
          <div>
            <CloseButton />
          </div>
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  )
}
