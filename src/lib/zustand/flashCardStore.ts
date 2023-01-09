import { useEffect, useState } from 'react'
import create from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import supabaseBrowser from '../supabase-browser'

interface FlashCard {
  id?: string
  answerRevealed?: boolean
  wordOrQuestion: string
  answer: string
  type: 'Pergunta' | 'Palavra' | 'Frase'
}

interface Section {
  id: number
  title: string
  flashcards: FlashCard[] | null
  created_at?: string
}

interface FlashcardsProps {
  deleteEverything: () => void
  sections?: Section[] | undefined
  userDataFirstLoad?: boolean
  setUserDataFirstLoad: (value: boolean) => void
  setSections: (data: Section[] | undefined) => void
  addNewSection: (newSection: Section) => void
  deleteSection: (sectionId: number) => void
  addNewFlashCard: (data: FlashCard, sectionId: number) => void
  deleteFlashCard: (flashcardId: string, sectionId: number) => void
  getInitialSections: () => Promise<void>
}

export const useFlashCardStore = create<FlashcardsProps>()(
  devtools(
    persist(
      (set, get) => ({
        userDataFirstLoad: false,
        deleteEverything: () => set({}, true), // clears the entire store, actions included

        setUserDataFirstLoad(value) {
          set(() => {
            return { userDataFirstLoad: value }
          })
        },

        setSections(data) {
          set(() => ({ sections: data }))
        },

        addNewSection(newSection) {
          set((state) =>
            state.sections
              ? { sections: [...state.sections, newSection] }
              : { sections: [newSection] },
          )
        },

        deleteSection(sectionId) {
          set((state) => {
            const updatedSection = state.sections?.filter(
              (section) => section.id !== sectionId,
            )

            return {
              ...state,
              sections: updatedSection,
            }
          })
        },

        addNewFlashCard(flashcardData, sectionId) {
          set((state) => {
            const updatedSections = state.sections?.map((curSection) => {
              if (curSection.id === sectionId) {
                const currentSectionFlashcards = curSection.flashcards
                const updatedFlashcards = currentSectionFlashcards
                  ? [...currentSectionFlashcards, flashcardData]
                  : [flashcardData]
                return {
                  ...curSection,
                  flashcards: updatedFlashcards,
                }
              }

              return curSection
            })

            return {
              ...state,
              sections: updatedSections,
            }
          })
        },

        deleteFlashCard(selectedFlashcardId, selectedSectionId) {
          set((state) => {
            const updatedSections = state.sections?.map((curSection) => {
              if (curSection.id === selectedSectionId) {
                const currentSectionFlashcards = curSection.flashcards!
                const filteredFlashcards = currentSectionFlashcards.filter(
                  (curFlashcard) => curFlashcard.id !== selectedFlashcardId,
                )

                return {
                  ...curSection,
                  flashcards: filteredFlashcards,
                }
              }

              return curSection
            })

            return {
              ...state,
              sections: updatedSections,
            }
          })
        },

        async getInitialSections() {
          const { data } = await supabaseBrowser.from('sections').select()
          console.log(data)

          if (data && data.length > 0) {
            const rawSections: {
              id: number
              flashcards: string[]
              title: string
              created_at: string
            }[] = data

            const parsedSectionData: Section[] = []

            console.log(rawSections)

            rawSections.forEach((curRawSection) => {
              const currentFlashcards = curRawSection.flashcards
              if (currentFlashcards) {
                const parsedFlashcard: FlashCard[] =
                  curRawSection.flashcards?.map((curFlashcard: string) =>
                    JSON.parse(curFlashcard),
                  )

                parsedSectionData.push({
                  id: curRawSection.id,
                  flashcards: parsedFlashcard,
                  title: curRawSection.title,
                  created_at: curRawSection.created_at,
                })
                return
              }

              parsedSectionData.push({
                id: curRawSection.id,
                flashcards: null,
                title: curRawSection.title,
                created_at: curRawSection.created_at,
              })
            })

            set((state) => {
              return {
                ...state,
                sections: parsedSectionData.sort(
                  (a, b) =>
                    new Date(a.created_at!).getTime() -
                    new Date(b.created_at!).getTime(),
                ),
              }
            })
          }

          // const alreadyLoaded = get().userDataFirstLoad

          // if (alreadyLoaded) {
          //   return
          // }

          // if (data && data?.length > 0) {
          //   const finalData: any = []
          //   data.forEach((cur) => {
          //     if (cur.flashcards) {
          //       const parsedFlashCards: FlashCard[] = []
          //       cur.flashcards.forEach((cur: string) => {
          //         parsedFlashCards.push(JSON.parse(cur))
          //       })

          //       finalData.push({
          //         id: cur.id,
          //         user_id: cur.user_id,
          //         title: cur.title,
          //         flashcards: parsedFlashCards,
          //         created_at: cur.created_at,
          //       })
          //       return
          //     }

          //     finalData.push(cur)
          //   })
          //   set(() => ({ sections: finalData.sort() }))
          // }
        },
      }),
      {
        name: 'flashcards-storage',
      },
    ),
  ),
)

export const useHydration = () => {
  const [hydrated, setHydrated] = useState(
    useFlashCardStore.persist.hasHydrated,
  )

  useEffect(() => {
    // Note: This is just in case you want to take into account manual rehydration.
    // You can remove the following line if you don't need it.
    const unsubHydrate = useFlashCardStore.persist.onHydrate(() =>
      setHydrated(false),
    )

    const unsubFinishHydration = useFlashCardStore.persist.onFinishHydration(
      () => setHydrated(true),
    )

    setHydrated(useFlashCardStore.persist.hasHydrated())

    return () => {
      unsubHydrate()
      unsubFinishHydration()
    }
  }, [])

  return hydrated
}

// export const useFlashCardStore = create<FlashcardsProps>((set, get) => ({
//   sections: [],

//   setSections (data) {
//     set(() => ({sections: data}))
//   },

//   addNewSection(newSection) {
//     set((state) => ({sections: [...state.sections, newSection]}))
//   },

//   deleteSection(sectionId) {
//     const currentSections = get().sections
//     const updatedSections = currentSections.filter((cur) => cur.id !== sectionId)

//     set(() => ({sections: updatedSections}))
//   },

//   addNewFlashCard(data, sectionId) {
//     const currentSections = get().sections
//     const updatedSections = currentSections.map((cur) => {
//       if(cur.id === sectionId) {
//         const flashcards = cur.flashcards ? [...cur.flashcards, data] : [data]
//         return {
//           ...cur,
//           flashcards
//         }
//       }
//       return cur
//     })

//     set(() => ({sections: updatedSections}))
//   },

//   deleteFlashCard(flashcard, sectionId) {
//     const currentSections = get().sections
//     const updatedSections = currentSections.map((cur) => {
//       if(cur.id === sectionId) {
//         const updatedFlashcards = cur.flashcards!.filter((curFlashcards) => curFlashcards.id !== flashcard)
//         return {
//           ...cur,
//           flashcards: updatedFlashcards
//         }
//       }

//       return cur
//     })

//     set(() => ({sections: updatedSections}))
//   },

//   async getSectionsOnSignIn() {

//     const { data, error } = await supabaseBrowser
//     .from("sections")
//     .select()

//     if(data) {
//       const finalData: any = []
//       data.forEach((cur) => {
//         if (cur.flashcards) {
//           const parsedFlashCards: FlashCard[] = []
//           cur.flashcards.map((cur: string) => {
//             parsedFlashCards.push(JSON.parse(cur))
//           })

//           finalData.push({
//             id: cur.id,
//             user_id: cur.user_id,
//             title: cur.title,
//             flashcards: parsedFlashCards,
//           })
//           return
//         }

//         finalData.push(cur)

//       })
//       setSections(finalData)
//     }

//   }
// }))
