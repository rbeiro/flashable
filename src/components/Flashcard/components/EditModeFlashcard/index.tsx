import { BaseSyntheticEvent, Dispatch, SetStateAction, useState } from 'react'
import { useFlashCardStore } from '../../../../lib/zustand/flashCardStore'
import s from './styles.module.scss'
import supabase from '../../../../lib/supabase-browser'
import { Button } from '../../../Button'
import { MultiLineInput } from '../../../Inputs'

interface EditFlashCardProps {
  id?: string
  answerRevealed?: boolean
  wordOrQuestion: string
  answer: string
  type: 'Pergunta' | 'Palavra' | 'Frase'
}

interface Section {
  id: number
  title: string
  flashcards: EditFlashCardProps[] | null
}

interface FlashcardPageProps extends EditFlashCardProps {
  currentSection: Section
  toggleEditMode: (value: boolean) => void
}

export function EditModeFlashcard({
  id,
  answerRevealed: defaultAnswerRevealed,
  wordOrQuestion,
  answer,
  type,
  toggleEditMode,
  currentSection,
}: FlashcardPageProps) {
  const [answerRevealed, setAnswerRevealed] = useState(defaultAnswerRevealed)
  const [wordOrQuestionValue, setWordOrQuestionValue] = useState(wordOrQuestion)
  const [answerValue, setAnswerValue] = useState(answer)
  const [editedFlashcardType, setEditedFlashcardType] = useState(type)

  const { editFlashCard } = useFlashCardStore()
  function toggleShowAnswer() {
    setAnswerRevealed(!answerRevealed)
  }

  function handleInputEdit(
    e: BaseSyntheticEvent,
    setState: Dispatch<SetStateAction<string>>,
  ) {
    e.preventDefault()
    const target = e.target as HTMLTextAreaElement
    setState(target.value)
  }

  async function handleSaveEdits() {
    const { data: userData } = await supabase.auth.getSession()

    if (userData.session?.user.role === 'authenticated') {
      const editedFlashcardData: EditFlashCardProps = {
        id,
        answerRevealed: false,
        wordOrQuestion: wordOrQuestionValue,
        answer: answerValue,
        type: editedFlashcardType,
      }

      const stringfiedFlashcards =
        currentSection.flashcards?.map((flashcard) => {
          if (flashcard.id === id) {
            return JSON.stringify(editedFlashcardData)
          }

          return JSON.stringify(flashcard)
        }) || []

      if (stringfiedFlashcards.length <= 0) {
        stringfiedFlashcards.push(JSON.stringify(editedFlashcardData))
      }

      console.log(stringfiedFlashcards)

      const { error } = await supabase
        .from('sections')
        .update({
          flashcards: [...stringfiedFlashcards],
        })
        .eq('title', currentSection.title)

      if (!error) {
        editFlashCard(editedFlashcardData, currentSection.id)
        console.log('Edits were saved')
        toggleEditMode(false)
      }
    } else {
      console.log('Not Allowed')
    }
  }

  function handleTypeInput(e: BaseSyntheticEvent) {
    setEditedFlashcardType(e.target.value)
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
          <div className={s.inputWrapper}>
            <input
              className={s.editableTitle}
              type="text"
              value={editedFlashcardType}
              onChange={handleTypeInput}
              placeholder={String(type)}
            />
          </div>
          <div className={s.editableContent}>
            <MultiLineInput
              initialHeight="37px"
              value={wordOrQuestionValue}
              onChange={(e) => handleInputEdit(e, setWordOrQuestionValue)}
            />
          </div>
          <Button
            variant="transparent-background"
            fillParent
            size="sm"
            type="button"
            onClick={() => {
              if (id) toggleShowAnswer()
            }}
          >
            editar resposta
          </Button>
        </>
      ) : (
        // "Back" of flashcard
        <>
          <h3 className={s.title}>Resposta:</h3>
          <div className={s.editableContent}>
            <MultiLineInput
              initialHeight="37px"
              value={answerValue}
              onChange={(e) => handleInputEdit(e, setAnswerValue)}
            />
          </div>
          <Button
            variant="transparent-background"
            fillParent
            size="sm"
            type="button"
            onClick={() => {
              if (id) toggleShowAnswer()
            }}
          >
            editar pergunta
          </Button>
        </>
      )}
      <button onClick={handleSaveEdits} className={s.saveButton}>
        Salvar
      </button>
    </div>
  )
}
