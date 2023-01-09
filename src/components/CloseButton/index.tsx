import { Cross2Icon } from '@radix-ui/react-icons'
import { ButtonHTMLAttributes, DetailedHTMLProps } from 'react'
import s from './styles.module.scss'

interface CloseButtonProps
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  positionAbsolute?: boolean
  transparent?: boolean
}

export function CloseButton({
  positionAbsolute = true,
  transparent = false,
  ...props
}: CloseButtonProps) {
  if (transparent) {
    return (
      <button
        className={
          positionAbsolute
            ? `${s.closeButton} ${s.positionAbsolute} ${s.transparent}`
            : `${s.closeButton} ${s.transparent}`
        }
        aria-label="Close"
        type="button"
      >
        <Cross2Icon />
      </button>
    )
  }

  return (
    <button
      className={
        positionAbsolute
          ? `${s.closeButton} ${s.positionAbsolute}`
          : `${s.closeButton}`
      }
      aria-label="Close"
      type="button"
      {...props}
    >
      <Cross2Icon />
    </button>
  )
}
