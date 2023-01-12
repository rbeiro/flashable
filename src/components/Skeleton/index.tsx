import React from 'react'
import s from './Styles.module.scss'

interface RootProps {
  children: React.ReactNode
  minWidth?: number
  maxWidth?: number
  minHeight?: number
}

export function Root({ children, maxWidth, minWidth, minHeight }: RootProps) {
  return (
    <div
      className={s.Root}
      style={
        maxWidth ? { maxWidth, minWidth, minHeight } : { minWidth, minHeight }
      }
    >
      {children}
    </div>
  )
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

interface LineProps {
  lineThickness?: number
}

export function FullLine({ lineThickness }: LineProps) {
  return (
    <div
      className={`${s.line} ${s.fullLine}`}
      style={lineThickness ? { height: lineThickness } : {}}
    />
  )
}

export function MediumLine({ lineThickness }: LineProps) {
  return (
    <div
      className={`${s.line} ${s.mediumLine}`}
      style={lineThickness ? { height: lineThickness } : {}}
    />
  )
}

export function ShortLine({ lineThickness }: LineProps) {
  return (
    <div
      className={`${s.line} ${s.shortLine}`}
      style={lineThickness ? { height: lineThickness } : {}}
    />
  )
}

interface ContainerProps {
  children?: React.ReactNode
}

export function Container({ children }: ContainerProps) {
  return <div className={s.Container}>{children}</div>
}

export function MediumContainer({ children }: ContainerProps) {
  return <div className={`${s.Container} ${s.mediumContainer}`}>{children}</div>
}

export function SmallContainer({ children }: ContainerProps) {
  return <div className={`${s.Container} ${s.smallContainer}`}>{children}</div>
}

export function ExtraSmallContainer({ children }: ContainerProps) {
  return <div className={`${s.Container} ${s.xsContainer}`}>{children}</div>
}

interface BoxProps {
  width: number | string
  height: number | string
}

export function Box({ width, height }: BoxProps) {
  return (
    <div
      className={`${s.Container} ${s.xsContainer}`}
      style={{ width, height }}
    />
  )
}
