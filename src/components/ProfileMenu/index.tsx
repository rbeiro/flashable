import { useRef, useState } from 'react'
import s from './styles.module.scss'
import * as NavigationMenu from '@radix-ui/react-navigation-menu'
import { ExitIcon } from '@radix-ui/react-icons'
import { Avatar } from '../Avatar'
import { Button } from '../Button'
import { Toast } from '../Toast'
import { useRedirect } from '../../utils/useRedirect'
import supabaseBrowser from '../../lib/supabase-browser'
import { useFlashCardStore } from '../../lib/zustand/flashCardStore'

interface ToastMessage {
  id: string
  isOpen: boolean
  success?: boolean
  title?: string
  message?: string
}

export function ProfileMenu() {
  const [viewportHeight, setViewportHeight] = useState(0)

  const { setUserDataFirstLoad, setSections } = useFlashCardStore()

  const [toastMessage, setToastMessages] = useState<ToastMessage | undefined>(
    undefined,
  )

  const { isRedirecting, redirectTo } = useRedirect()
  async function handleUserSignOut() {
    const { error } = await supabaseBrowser.auth.signOut()
    if (!error) {
      useFlashCardStore.persist.clearStorage()
      setUserDataFirstLoad(false)
      setSections(undefined)
      redirectTo('/')
      setToastMessages({
        id: crypto.randomUUID(),
        isOpen: true,
        success: true,
        title: 'Deslogado com sucesso.',
        message: 'Nos vemos em uma próxima, até logo!',
      })
    }
  }

  const viewportRef = useRef<HTMLDivElement>(null)

  function handleToastDisplay(open: boolean) {
    console.log(open)
    if (!isRedirecting) {
      if (toastMessage) {
        setToastMessages({
          ...toastMessage,
          isOpen: open,
        })
        setTimeout(() => {
          setToastMessages(undefined)
        }, 100)
      }
    }
  }

  function handleMouseOver() {
    setTimeout(() => {
      console.log(viewportRef.current?.clientHeight)
      setViewportHeight(Number(viewportRef.current?.clientHeight))
    }, 210)
  }
  function handleMouseLeave() {
    setTimeout(() => {
      console.log(viewportRef.current?.clientHeight)
      if (viewportRef.current?.clientHeight === viewportHeight) return
      setViewportHeight(0)
    }, 210)
  }

  return (
    <>
      <NavigationMenu.Root className={s.root}>
        <NavigationMenu.List className={s.list}>
          <NavigationMenu.Item>
            <NavigationMenu.Trigger
              onMouseEnter={handleMouseOver}
              onMouseLeave={handleMouseLeave}
            >
              <Avatar />
            </NavigationMenu.Trigger>
            <NavigationMenu.Content className={s.content}>
              {/* <div className={s.contentOption}>
            <GearIcon />
            <Link href={"/settings"}>Configurações</Link>
          </div> */}
              <div className={s.contentOption} onClick={handleUserSignOut}>
                <Button
                  style={{ justifyContent: 'flex-start' }}
                  fillParent
                  size="sm"
                  isLoading={isRedirecting}
                >
                  <ExitIcon />
                  <span>Sair</span>
                </Button>
              </div>
            </NavigationMenu.Content>
          </NavigationMenu.Item>

          <NavigationMenu.Indicator className={s.indicator} />
        </NavigationMenu.List>

        <NavigationMenu.Viewport
          className={s.viewPort}
          ref={viewportRef}
          onMouseEnter={handleMouseOver}
          onMouseLeave={handleMouseLeave}
        />
      </NavigationMenu.Root>

      {toastMessage && (
        <div
          className={s.toastMessageContainer}
          style={{
            top: `calc(var(--header-height) + ${
              viewportHeight ? viewportHeight - 30 : 0
            }px)`,
          }}
        >
          <Toast
            key={toastMessage.id}
            open={toastMessage.isOpen}
            handleOpenChange={(open) => {
              if (!open) handleToastDisplay(open)
            }}
            success={toastMessage.success}
            title={toastMessage.title}
            description={toastMessage.message}
          />
        </div>
      )}
    </>
  )
}
