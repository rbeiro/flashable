import s from './styles.module.scss'
export function LoadingSpinner() {
  return (
    <>
      <div className={s.spinner}>
        <div className={s.spinner_container}>
          <div className={s.spinner_rotator}>
            <div className={s.spinner_left}>
              <div className={s.spinner_circle} />
            </div>
            <div className={s.spinner_right}>
              <div className={s.spinner_circle} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
