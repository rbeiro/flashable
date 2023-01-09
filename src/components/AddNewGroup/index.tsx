import React, { ReactNode, SyntheticEvent, useRef, useState } from 'react'
import supabase from '../../lib/supabase-browser'
import { useFlashCardStore } from '../../lib/zustand/flashCardStore'
import * as Popup from '../Dialog'
import { Input } from '../Inputs'

import s from './styles.module.scss'

interface PopupProps {
  children: ReactNode
}
export function AddNewGroup({ children }: PopupProps) {
  const [open, setOpen] = useState(false)
  const { addNewSection } = useFlashCardStore()

  const sectionNameRef = useRef<HTMLInputElement>(null)

  async function handleNewGroupCreation(e: SyntheticEvent) {
    e.preventDefault()
    const { data: userData } = await supabase.auth.getSession()
    if (
      userData.session?.user.role === 'authenticated' &&
      sectionNameRef.current
    ) {
      const { data, error } = await supabase
        .from('sections')
        .insert({
          user_id: userData.session?.user.id,
          title: sectionNameRef.current.value,
        })
        .select()

      if (!error) {
        addNewSection({
          id: data[0].id,
          title: sectionNameRef.current.value,
          flashcards: null,
        })
        setOpen(false)
      }
    }
  }

  return (
    <Popup.Root open={open} onOpenFunction={setOpen}>
      <Popup.Trigger>{children}</Popup.Trigger>

      <Popup.Portal>
        <div>
          <Popup.Title>Novo grupo</Popup.Title>
          <Popup.Description>
            Adicione um novo grupo de flashcards.
          </Popup.Description>
        </div>
        <form
          onSubmit={(e) => handleNewGroupCreation(e)}
          className={s.addNewFlashcardForm}
        >
          <Input type="text" labelName="Título" reference={sectionNameRef} />

          <button type="submit">Adicionar grupo</button>
        </form>
      </Popup.Portal>
    </Popup.Root>
  )
}
