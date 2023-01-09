'use client'
import { BaseSyntheticEvent, useEffect, useState } from 'react'

import s from '../../src/styles/App.module.scss'

import {
  Cross2Icon,
  PlusIcon,
  MagnifyingGlassIcon,
} from '@radix-ui/react-icons'
import * as AlertDialog from '../../src/components/AlertDialog'
import * as Skeleton from '../../src/components/Skeleton'
import { useFlashCardStore } from '../../src/lib/zustand/flashCardStore'
import { AddNewCard } from '../../src/components/AddNewCardPopup'
import { AddNewGroup } from '../../src/components/AddNewGroup'
import supabase from '../../src/lib/supabase-browser'
import { Flashcard } from '../../src/components/Flashcard'
import { Input } from '../../src/components/Inputs'

const useHasHydrated = () => {
  const [hasHydrated, setHasHydrated] = useState<boolean>(false)

  useEffect(() => {
    setHasHydrated(true)

    return () => {
      setHasHydrated(false)
    }
  }, [])

  return hasHydrated
}

export default function Page() {
  const [searchedValue, setSearchedValue] = useState<any>('')
  const [isSearchInputOpen, setIsSearchInputOpen] = useState<any>({})
  const {
    sections,
    deleteSection,
    userDataFirstLoad,
    setUserDataFirstLoad,
    getInitialSections,
  } = useFlashCardStore()

  useEffect(() => {
    async function checkAndFetchFlashcardData() {
      if (!userDataFirstLoad) {
        await getInitialSections()
        setUserDataFirstLoad(true)
      }
    }
    checkAndFetchFlashcardData()
  }, [])

  async function handleSectionDelete(id: number) {
    const { error } = await supabase
      .from('sections')
      .delete()
      .eq('id', id)
      .select()

    if (!error) deleteSection(id)
  }

  function handleSearchInputToggle(sectionId: number) {
    if (isSearchInputOpen[sectionId] === undefined) {
      setIsSearchInputOpen({
        ...isSearchInputOpen,
        [sectionId]: 'open',
      })
      return
    }
    if (isSearchInputOpen[sectionId] === 'closed') {
      setIsSearchInputOpen({
        ...isSearchInputOpen,
        [sectionId]: 'open',
      })
      return
    }

    setIsSearchInputOpen({
      ...isSearchInputOpen,
      [sectionId]: 'closed',
    })
  }

  const hasHydrated = useHasHydrated()

  function handleFlashcardSearch(e: BaseSyntheticEvent, sectionId: number) {
    setSearchedValue({
      ...searchedValue,
      [sectionId]: e.target.value,
    })
  }

  return (
    <>
      {!hasHydrated && (
        <Skeleton.Root>
          <Skeleton.Box></Skeleton.Box>
        </Skeleton.Root>
      )}
      {hasHydrated && sections !== undefined ? (
        sections.map((section) => {
          return (
            <>
              <section className={s.sectionContainer} key={section.id}>
                <div className={s.sectionTitle}>
                  <h2>{section.title}</h2>
                  <AlertDialog.Root>
                    <AlertDialog.Trigger>
                      <button
                        className={s.closeButton}
                        aria-label="Close"
                        type="button"
                      >
                        <Cross2Icon />
                      </button>
                    </AlertDialog.Trigger>

                    <AlertDialog.Content
                      action="Sim, desejo deletar"
                      actionFunction={() => handleSectionDelete(section.id)}
                    >
                      <div>
                        <AlertDialog.Title>
                          Você tem certeza absoluta?
                        </AlertDialog.Title>
                        <AlertDialog.Description>
                          Essa ação não pode ser desfeita. Isso irá deletar
                          permanentemente os dados de nosso servidor.
                        </AlertDialog.Description>
                      </div>
                    </AlertDialog.Content>
                  </AlertDialog.Root>

                  <button
                    onClick={() => handleSearchInputToggle(section.id)}
                    className={s.searchButton}
                    aria-label="Search"
                    type="button"
                  >
                    <MagnifyingGlassIcon />
                  </button>

                  <div
                    className={s.revealSearchButtonWrapper}
                    data-state={
                      isSearchInputOpen[section.id]
                        ? isSearchInputOpen[section.id]
                        : 'closed'
                    }
                  >
                    <Input
                      labelName="Pesquisar"
                      labelBackgroundColor="var(--slate1)"
                      value={searchedValue[section.id] || ''}
                      onChange={(e) => handleFlashcardSearch(e, section.id)}
                      onBlur={() => handleSearchInputToggle(section.id)}
                    />
                  </div>
                </div>
                <div className={s.sectionContent}>
                  {section.flashcards &&
                    !searchedValue[section.id] &&
                    section.flashcards.map((flashCard) => {
                      return (
                        <Flashcard
                          key={flashCard.id}
                          currentSection={section}
                          id={flashCard.id}
                          type={flashCard.type}
                          wordOrQuestion={flashCard.wordOrQuestion}
                          answer={flashCard.answer}
                          answerRevealed={flashCard.answerRevealed}
                        />
                      )
                    })}
                  {section.flashcards &&
                    searchedValue[section.id] &&
                    section.flashcards
                      .filter((flashCard) =>
                        flashCard.wordOrQuestion
                          .normalize('NFD')
                          .replace(/[\u0300-\u036f]/g, '')
                          .toLowerCase()
                          .includes(
                            searchedValue[section.id]
                              .normalize('NFD')
                              .replace(/[\u0300-\u036f]/g, '')
                              .toLowerCase(),
                          ),
                      )
                      .map((filteredFlashcard) => {
                        return (
                          <Flashcard
                            key={filteredFlashcard.id}
                            currentSection={section}
                            id={filteredFlashcard.id}
                            type={filteredFlashcard.type}
                            wordOrQuestion={filteredFlashcard.wordOrQuestion}
                            answer={filteredFlashcard.answer}
                            answerRevealed={filteredFlashcard.answerRevealed}
                          />
                        )
                      })}
                  <AddNewCard
                    groupName={section.title}
                    currentFlashcards={section.flashcards}
                  >
                    <button
                      className={`${s.flashcardContainer} ${s.addNewFlashCard}`}
                    >
                      <div className={s.circle}>
                        <PlusIcon />
                      </div>
                    </button>
                  </AddNewCard>
                </div>
              </section>
            </>
          )
        })
      ) : (
        <>
          <h2>Não tem nenhum flash card ainda meu parceiro!</h2>
          <div>
            <span>Para começar, adicione um novo grupo de flashcards: </span>
          </div>
        </>
      )}

      <AddNewGroup>
        <button className={s.addNewSection}>
          Novo grupo
          <div className={s.circle}>
            <PlusIcon />
          </div>
        </button>
      </AddNewGroup>
    </>
  )
}
