'use client'
import { Session } from '@supabase/supabase-js'
import Link from 'next/link'
import { ArrowRight } from 'phosphor-react'
import { BaseSyntheticEvent, useEffect, useState } from 'react'
import { z } from 'zod'
import { Button } from '../src/components/Button'
import { Input } from '../src/components/Inputs'
import supabaseBrowser from '../src/lib/supabase-browser'
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

  useEffect(() => {
    async function getSession() {
      const {
        data: { session },
      } = await supabaseBrowser.auth.getSession()
      setSession(session)
    }

    getSession()
  }, [])

  const { isRedirecting, redirectTo } = useRedirect()

  const [emailInputerrorMessage, setEmailInputerrorMessage] = useState('')

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
      </div>
    </section>
  )
}
