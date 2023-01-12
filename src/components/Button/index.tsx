import {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react'
import { LoadingSpinner } from '../LoadingSpinner'
import s from './styles.module.scss'

interface ButtonProps
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  withLink?: boolean
  children: ReactNode
  variant?: 'colorful' | 'transparent-background' | 'border-only' | 'default'
  size?: 'sm' | 'md' | 'xs'
  fillParent?: boolean
  isLoading?: boolean
}

export function Button({
  withLink,
  children,
  variant = 'default',
  size = 'md',
  isLoading,
  fillParent,
  ...props
}: ButtonProps) {
  const [onLoadButtonWidth, setOnLoadButtonWidth] = useState(0)
  const buttonRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    setOnLoadButtonWidth(Number(buttonRef.current?.clientWidth))
  }, [])

  return (
    <button
      ref={buttonRef}
      style={
        !fillParent && isLoading ? { width: `${onLoadButtonWidth}px` } : {}
      }
      disabled={isLoading}
      className={`${s.container} ${
        withLink !== undefined && s[`withLink_${size}`]
      } ${s[variant]} ${!withLink && s[size]} ${fillParent && s.fillParent}`}
      {...props}
    >
      {isLoading && <LoadingSpinner />}
      {!isLoading && children}
    </button>
  )
}
