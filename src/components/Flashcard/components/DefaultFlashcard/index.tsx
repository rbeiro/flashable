import { useState } from 'react'
import * as AlertDialog from '../../../AlertDialog'
import { useFlashCardStore } from '../../../../lib/zustand/flashCardStore'
import s from './styles.module.scss'
import supabase from '../../../../lib/supabase-browser'
import { CloseButton } from '../../../CloseButton'
import { Button } from '../../../Button'

interface FlashCardProps {
  id?: string
  answerRevealed?: boolean
  wordOrQuestion: string
  answer: string
  type: 'Pergunta' | 'Palavra' | 'Frase'
}

interface Section {
  id: number
  title: string
  flashcards: FlashCardProps[] | null
}

interface FlashcardPageProps extends FlashCardProps {
  currentSection: Section
}

export function DefaultFlashcard({
  id,
  answerRevealed: defaultAnswerRevealed,
  wordOrQuestion,
  answer,
  type,
  currentSection,
}: FlashcardPageProps) {
  const [answerRevealed, setAnswerRevealed] = useState(defaultAnswerRevealed)
  const { deleteFlashCard } = useFlashCardStore()

  function toggleShowAnswer() {
    setAnswerRevealed(!answerRevealed)
  }

  async function handleFlashCardDelete() {
    // Necessaryly there's flashcards since a flashcard is being selected to delete.
    const filteredAndStringfiedFlashcards = currentSection
      .flashcards!.filter((flashcard) => flashcard.id !== id)
      .map((filteredFlashcard) => {
        return JSON.stringify(filteredFlashcard)
      })

    const { error } = await supabase
      .from('sections')
      .update({
        flashcards: [...filteredAndStringfiedFlashcards],
      })
      .eq('title', currentSection.title)
      .select()

    if (!error && id) deleteFlashCard(id, currentSection.id)
  }
  return (
    <div
      className={
        answerRevealed
          ? `${s.flashcardContainer} ${s.answerRevealed}`
          : s.flashcardContainer
      }
    >
      {!answerRevealed ? (
        // "Front" of flashcard
        <>
          <h3 className={s.title}>{type}:</h3>
          <p className={s.content}>{wordOrQuestion}</p>
          <Button
            variant="transparent-background"
            fillParent
            size="sm"
            type="button"
            onClick={() => {
              if (id) toggleShowAnswer()
            }}
          >
            mostrar resposta
          </Button>
        </>
      ) : (
        // "Back" of flashcard
        <>
          <h3 className={s.title}>Resposta:</h3>
          <p className={s.content}>{answer}</p>
          <Button
            variant="transparent-background"
            fillParent
            size="sm"
            type="button"
            onClick={() => {
              if (id) toggleShowAnswer()
            }}
          >
            esconder resposta
          </Button>
        </>
      )}
      <AlertDialog.Root>
        <AlertDialog.Trigger>
          <div>
            <CloseButton />
          </div>
        </AlertDialog.Trigger>

        <AlertDialog.Content
          action="Sim, desejo deletar"
          actionFunction={handleFlashCardDelete}
        >
          <AlertDialog.Title>Você tem certeza absoluta?</AlertDialog.Title>
          <AlertDialog.Description>
            Essa ação não pode ser desfeita. Isso irá deletar permanentemente os
            dados de nosso servidor.
          </AlertDialog.Description>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </div>
  )
}
