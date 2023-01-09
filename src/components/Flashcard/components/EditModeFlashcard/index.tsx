import { BaseSyntheticEvent, useState } from 'react'
// import { useFlashCardStore } from '../../../../lib/zustand/flashCardStore'
import s from './styles.module.scss'
// import supabase from '../../../../lib/supabase-browser'
import { Button } from '../../../Button'
import { MultiLineInput } from '../../../Inputs'


interface EditFlashCardProps {
  id?: string
  answerRevealed?: boolean
  wordOrQuestion: string
  answer: string
  type: Types
}

enum Types {
  'Pergunta',
  'Palavra',
  'Frase'
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
  const [currentTypeInput, setCurrentTypeInput] = useState()
  const [answerRevealed, setAnswerRevealed] = useState(defaultAnswerRevealed)
  const [currentAnswer, setCurrentAnswer] = useState(answer)

  const [frontTextAreaHeight, setFrontTextAreaHeight] = useState(null)
  const [backTextAreaHeight, setBackTextAreaHeight] = useState(null)

  const [currentWordOrQuestion, setCurrentWordOrQuestion] =
    useState(wordOrQuestion)
  // const {} = useFlashCardStore()

  function toggleShowAnswer() {
    setAnswerRevealed(!answerRevealed)
  }

  function handleInputEdit(
    e: BaseSyntheticEvent,
    setState: any,
    setHeightState: any,
  ) {
    e.preventDefault()
    const target = e.target as HTMLTextAreaElement
    console.log(e)

    const textAreaScrollHeight = target.scrollHeight
    setHeightState(textAreaScrollHeight)
    setState(target.value)
  }

  async function handleSaveEdits() {
    console.log('Edits were saved')
    toggleEditMode(false)
  }

  function handleTypeInput(e: BaseSyntheticEvent) {

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
              onChange={handleTypeInput} 
              placeholder={String(type)} 
              defaultValue={type}
            />
            {/* <span className={s.typeSuggestion}>{type}</span> */}
          </div>
          <div className={s.editableContent}>
            <MultiLineInput
              value={currentWordOrQuestion}
              onChange={(e) =>
                handleInputEdit(
                  e,
                  setCurrentWordOrQuestion,
                  setFrontTextAreaHeight,
                )
              }
            />
            {/* <textarea
              style={
                frontTextAreaHeight
                  ? { height: `${frontTextAreaHeight}px` }
                  : { height: `auto` }
              }
              value={currentWordOrQuestion}
              onChange={(e) =>
                handleInputEdit(
                  e,
                  setCurrentWordOrQuestion,
                  setFrontTextAreaHeight,
                )
              }
            /> */}
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
              value={currentAnswer}
              onChange={(e) =>
                handleInputEdit(e, setCurrentAnswer, setBackTextAreaHeight)
              }
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
