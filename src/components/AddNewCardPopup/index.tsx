import { BaseSyntheticEvent, ReactNode, SyntheticEvent, useState } from 'react'
import supabase from '../../lib/supabase-browser'
import { useFlashCardStore } from '../../lib/zustand/flashCardStore'
import * as RadioGroup from '@radix-ui/react-radio-group'
import * as Popup from '../Dialog'
import { Input } from '../Inputs'

import s from './styles.module.scss'
import { z } from 'zod'
import { getAndFormatFormData } from '../../utils/getAndFormatFormData'
import { Button } from '../Button'

const FormDataSchema = z.object({
  wordOrQuestion: z.string().min(1, {
    message: 'Campo obrigatório, insira uma palavra ou pergunta.',
  }),
  answer: z.string().min(1, {
    message: 'Campo obrigatório, insira uma resposta.',
  }),
})

type FormData = z.infer<typeof FormDataSchema>

interface FlashCard {
  id?: string
  answerRevealed?: boolean
  wordOrQuestion: string
  answer: string
  type: 'Pergunta' | 'Palavra' | 'Frase'
}

interface PopupProps {
  children: ReactNode
  groupName: string
  currentFlashcards: FlashCard[] | null
}
export function AddNewCard({ children, groupName }: PopupProps) {
  const { sections, addNewFlashCard } = useFlashCardStore()
  const currentSection = sections?.filter((cur) => cur.title === groupName)
  const currentFlashcards = currentSection![0].flashcards

  const [openPortal, setOpenPortal] = useState(false)

  const [wordOrQuestionInputErroMessage, setWordOrQuestionInputErroMessage] =
    useState('')
  const [answerInputErroMessage, setAnswerInputErroMessage] = useState('')

  const [currentRadioSelected, setCurrentRadioSelected] = useState<
    'Palavra' | 'Pergunta' | 'Frase'
  >('Palavra')

  async function handleNewFlashcardCreation(event: BaseSyntheticEvent) {
    event.preventDefault()
    const formData: FormData = getAndFormatFormData(FormDataSchema, event)

    const inputValidationResult = FormDataSchema.safeParse(formData)

    if (!inputValidationResult.success) {
      inputValidationResult.error.issues.forEach(({ path, message }) => {
        switch (path[0]) {
          case 'wordOrQuestion':
            setWordOrQuestionInputErroMessage(message)
            break

          case 'answer':
            setAnswerInputErroMessage(message)
            break

          default:
            break
        }
      })

      return
    }

    if (inputValidationResult.success) {
      setWordOrQuestionInputErroMessage('')
      setAnswerInputErroMessage('')

      const { data: userData } = await supabase.auth.getSession()

      if (userData.session?.user.role === 'authenticated') {
        const createNewFlashcardData: FlashCard = {
          id: crypto.randomUUID(),
          answerRevealed: false,
          wordOrQuestion: formData.wordOrQuestion,
          answer: formData.answer,
          type: currentRadioSelected,
        }

        const stringfiedFlashcards =
          currentFlashcards?.map((flashcard) => JSON.stringify(flashcard)) || []

        stringfiedFlashcards.push(JSON.stringify(createNewFlashcardData))

        const { error } = await supabase
          .from('sections')
          .update({
            flashcards: [...stringfiedFlashcards],
          })
          .eq('title', groupName)

        if (!error) {
          addNewFlashCard(createNewFlashcardData, currentSection![0].id)
          setOpenPortal(false)
        }
      } else {
        console.log('Not Allowed')
      }
    }
  }

  function handleRadioSelection(e: SyntheticEvent) {
    const target = e.target as HTMLInputElement
    if (
      target.value === 'Pergunta' ||
      target.value === 'Palavra' ||
      target.value === 'Frase'
    )
      setCurrentRadioSelected(target.value)
  }

  return (
    <Popup.Root open={openPortal} onOpenFunction={setOpenPortal}>
      <Popup.Trigger>{children}</Popup.Trigger>

      <Popup.Portal>
        <div>
          <Popup.Title>Novo flashcard</Popup.Title>
          <Popup.Description>
            Adicione um novo flashcard ao grupo: {groupName}.
          </Popup.Description>
        </div>
        <form
          onSubmit={(e) => handleNewFlashcardCreation(e)}
          className={s.addNewFlashcardForm}
        >
          <RadioGroup.Root
            className={s.radioRoot}
            defaultValue={currentRadioSelected}
            aria-label="Tipo de flashcard"
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <RadioGroup.Item
                className={s.radioItem}
                value="Palavra"
                id="r2"
                onClick={handleRadioSelection}
              >
                <RadioGroup.Indicator className={s.radioIndicator} />
              </RadioGroup.Item>
              <label className={s.label} htmlFor="r2">
                Palavra
              </label>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <RadioGroup.Item
                className={s.radioItem}
                value="Pergunta"
                id="r1"
                onClick={handleRadioSelection}
              >
                <RadioGroup.Indicator className={s.radioIndicator} />
              </RadioGroup.Item>
              <label className={s.label} htmlFor="r1">
                Pergunta
              </label>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <RadioGroup.Item
                className={s.radioItem}
                value="Frase"
                id="r3"
                onClick={handleRadioSelection}
              >
                <RadioGroup.Indicator className={s.radioIndicator} />
              </RadioGroup.Item>
              <label className={s.label} htmlFor="r3">
                Frase
              </label>
            </div>
          </RadioGroup.Root>

          <Input
            errorMessage={wordOrQuestionInputErroMessage}
            type="text"
            name="wordOrQuestion"
            labelName={currentRadioSelected}
          />

          <Input
            errorMessage={answerInputErroMessage}
            type="text"
            name="answer"
            labelName="Resposta"
          />
          <Button type="submit">adicionar flashcard</Button>
        </form>
      </Popup.Portal>
    </Popup.Root>
  )
}
