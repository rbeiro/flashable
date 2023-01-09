import React from 'react'
import s from './Styles.module.scss'

interface RootProps {
  children: React.ReactNode
}

export function Root({ children }: RootProps) {
  return <div className={s.Root}>{children}</div>
}

interface CircleProps {
  children?: React.ReactNode
}

export function Circle({ children }: CircleProps) {
  if (children) {
    return (
      <div className={s.circleContainer}>
        <div className={s.circle} />
        <div className={s.circleChildrenWrapper}>{children}</div>
      </div>
    )
  }

  return <div className={s.circle} />
}

export function FullLine() {
  return <div className={s.fullLine} />
}

export function MediumLine() {
  return <div className={s.mediumLine} />
}

export function ShortLine() {
  return <div className={s.shortLine} />
}
export function Box() {
  return <div className={s.Box} />
}
