import * as HoverCard from '@radix-ui/react-hover-card'
import { InfoCircledIcon } from '@radix-ui/react-icons'
import { ReactNode } from 'react'
import s from './styles.module.scss'

export function InfoHover({ children }: { children: ReactNode }) {
  return (
    <HoverCard.Root openDelay={50} closeDelay={50}>
      <HoverCard.Trigger>
        <InfoCircledIcon />
      </HoverCard.Trigger>
      <HoverCard.Portal>
        <HoverCard.Content
          side="right"
          sideOffset={10}
          className={s.background}
        >
          {children}
          <HoverCard.Arrow className={s.arrow} />
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  )
}
