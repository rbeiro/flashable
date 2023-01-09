import * as AlertDialog from '@radix-ui/react-alert-dialog'
import { ReactNode } from 'react'
import s from './styles.module.scss'

interface RequiresChildrenProps {
  children: ReactNode
}

export function Root({ children }: RequiresChildrenProps) {
  return <AlertDialog.Root>{children}</AlertDialog.Root>
}

export function Trigger({ children }: RequiresChildrenProps) {
  return <AlertDialog.Trigger asChild>{children}</AlertDialog.Trigger>
}
export function Title({ children }: RequiresChildrenProps) {
  return <AlertDialog.Title className={s.title}>{children}</AlertDialog.Title>
}
export function Description({ children }: RequiresChildrenProps) {
  return (
    <AlertDialog.Description className={s.description}>
      {children}
    </AlertDialog.Description>
  )
}

interface ContentProps extends RequiresChildrenProps {
  action: string
  actionFunction: () => void
}

export function Content({ children, action, actionFunction }: ContentProps) {
  return (
    <AlertDialog.Portal>
      <AlertDialog.Overlay className={s.overlay} />
      <AlertDialog.Content className={s.content}>
        {children}
        <div className={s.buttonsContainer}>
          <AlertDialog.Cancel asChild>
            <button className={`${s.button} ${s.slate}`}>Cancelar</button>
          </AlertDialog.Cancel>
          <AlertDialog.Action asChild>
            <button
              className={`${s.button} ${s.danger}`}
              onClick={actionFunction}
            >
              {action}
            </button>
          </AlertDialog.Action>
        </div>
      </AlertDialog.Content>
    </AlertDialog.Portal>
  )
}
