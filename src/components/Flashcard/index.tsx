import { useState } from 'react'

import * as RightClickMenu from '@radix-ui/react-context-menu'
import { DefaultFlashcard } from './components/DefaultFlashcard'
import { EditModeFlashcard } from './components/EditModeFlashcard'

import s from './styles.module.scss'
import { Button } from '../Button'

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

export function Flashcard({
  id,
  answerRevealed,
  wordOrQuestion,
  answer,
  type,
  currentSection,
}: FlashcardPageProps) {
  const [editMode, setEditMode] = useState(false)

  function toggleEditMode(value: boolean) {
    setEditMode(value)
  }
  return (
    <RightClickMenu.Root>
      <RightClickMenu.Trigger>
        {!editMode && (
          <DefaultFlashcard
            id={id}
            answerRevealed={answerRevealed}
            wordOrQuestion={wordOrQuestion}
            answer={answer}
            type={type}
            currentSection={currentSection}
          />
        )}
        {editMode && (
          <EditModeFlashcard
            id={id}
            answerRevealed={answerRevealed}
            wordOrQuestion={wordOrQuestion}
            answer={answer}
            type={type}
            toggleEditMode={toggleEditMode}
            currentSection={currentSection}
          />
        )}
      </RightClickMenu.Trigger>

      <RightClickMenu.Portal>
        <RightClickMenu.Content className={s.rightClickMenuContent}>
          <RightClickMenu.Item className={s.rightClickMenuItem}>
            <Button size="sm" onClick={() => toggleEditMode(true)}>
              Editar
            </Button>
          </RightClickMenu.Item>
        </RightClickMenu.Content>
      </RightClickMenu.Portal>
    </RightClickMenu.Root>
  )
}
