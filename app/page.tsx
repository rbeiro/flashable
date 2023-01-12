'use client'
import { Cross2Icon, MagnifyingGlassIcon } from '@radix-ui/react-icons'
import { Session } from '@supabase/supabase-js'
import Link from 'next/link'
import { ArrowRight } from 'phosphor-react'
import { BaseSyntheticEvent, useEffect, useState } from 'react'
import { z } from 'zod'
import { Button } from '../src/components/Button'
import { CloseButton } from '../src/components/CloseButton'
import { Input } from '../src/components/Inputs'
import supabaseBrowser from '../src/lib/supabase-browser'
import { useFlashCardStore } from '../src/lib/zustand/flashCardStore'
import s from '../src/styles/Home.module.scss'
import { getAndFormatFormData } from '../src/utils/getAndFormatFormData'
import { useRedirect } from '../src/utils/useRedirect'

const PreRegisterEmailFormSchema = z.object({
  email: z.string().email({
    message: 'Insira um endereço de e-mail válido',
  }),
})

type PreRegisterEmailFormData = z.infer<typeof PreRegisterEmailFormSchema>

export default function Page() {
  const [session, setSession] = useState<Session | null>(null)

  const { isRedirecting, redirectTo } = useRedirect()

  const [emailInputerrorMessage, setEmailInputerrorMessage] = useState('')

  const { setUserDataFirstLoad } = useFlashCardStore()

  useEffect(() => {
    async function getSession() {
      const {
        data: { session },
      } = await supabaseBrowser.auth.getSession()
      setSession(session)
    }

    getSession()

    if (!session) {
      setUserDataFirstLoad(false)
    }
  }, [])

  async function handlePageRedirection(event: BaseSyntheticEvent) {
    event.preventDefault()

    const data: PreRegisterEmailFormData = getAndFormatFormData(
      PreRegisterEmailFormSchema,
      event,
    )

    const validationResult = PreRegisterEmailFormSchema.shape.email.safeParse(
      data.email,
    )

    if (validationResult.success) {
      setEmailInputerrorMessage('')
      redirectTo(`/signup?email=${data.email}`)
    }

    if (!validationResult.success) {
      setEmailInputerrorMessage(
        validationResult.error.errors[0].message.toString(),
      )
    }
  }

  return (
    <section className={s.container}>
      <div className={s.heroContainer}>
        <div className={s.heroDescription}>
          <div>
            <h1>
              Crie flashcards com facilidade para acelerar o seu processo de
              aprendizado!
            </h1>
            <p>
              Se você quer aprender de forma eficiente e divertida, essa é a
              escolha certa para você! Aqui você pode criar seus próprios
              flashcards personalizados com as informações que precisa aprender
            </p>
          </div>

          {session ? (
            <div className={s.alreadyLoggedInText}>
              <p>Olá, {session.user.user_metadata.name}, acesse seus</p>
              <Button withLink variant="border-only" isLoading={isRedirecting}>
                <Link href="/app">
                  flashcards <ArrowRight />
                </Link>
              </Button>
            </div>
          ) : (
            <form onSubmit={handlePageRedirection}>
              <Input
                labelName="E-mail"
                name="email"
                errorMessage={emailInputerrorMessage}
                whiteSpace
              />
              <Button variant="border-only" isLoading={isRedirecting}>
                cadastrar-se <ArrowRight />
              </Button>
            </form>
          )}
        </div>
        <div className={s.headerFlashcardSection}>
          <div className={s.mockSectionTitle}>
            <h2>Alemão</h2>
            <button className={s.closeButton} aria-label="Close" type="button">
              <Cross2Icon />
            </button>

            <button
              className={s.searchButton}
              aria-label="Search"
              type="button"
            >
              <MagnifyingGlassIcon />
            </button>

            <div className={s.revealSearchButtonWrapper}>
              <Input
                labelName="Isso é só um exemplo"
                labelBackgroundColor="var(--slate1)"
              />
            </div>
          </div>
          <div className={s.flashcardExampleContainer}>
            <div
              className={`${s.mockFlashcardFront} ${s.mockFlashcardContainer}`}
            >
              <h3 className={s.title}>Palavra:</h3>
              <span className={s.content}>
                <p>der Mann</p>
              </span>
              <Button
                variant="transparent-background"
                fillParent
                size="sm"
                type="button"
              >
                mostrar resposta
              </Button>
              <CloseButton />
            </div>
            <div
              className={`${s.mockFlashcardBack} ${s.mockFlashcardContainer}`}
            >
              <h3 className={s.title}>Resposta:</h3>
              <span className={s.content}>
                <p>o homen</p>
              </span>
              <Button
                variant="transparent-background"
                fillParent
                size="sm"
                type="button"
              >
                mostrar pergunta
              </Button>
              <CloseButton />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
