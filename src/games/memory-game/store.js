import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { getCardsForGame, difficulties } from './data/cards'

function calculateStars(moves, pairCount) {
  const perfect = pairCount
  const good = pairCount * 1.5
  if (moves <= perfect) return 3
  if (moves <= good) return 2
  return 1
}

const useMemoryStore = create(
  persist(
    (set, get) => ({
      // Navigation
      screen: 'difficulty', // difficulty | playing | results

      // Game state
      difficulty: null,
      cards: [],
      themeName: '',
      flippedIndices: [],
      matchedIds: [],
      moves: 0,
      startTime: null,
      endTime: null,
      stars: 0,
      isChecking: false,

      // Persisted
      bestScores: {},

      // Actions
      selectDifficulty: (difficulty) => {
        const { cards, themeName } = getCardsForGame(difficulty)
        set({
          screen: 'playing',
          difficulty,
          cards,
          themeName,
          flippedIndices: [],
          matchedIds: [],
          moves: 0,
          startTime: Date.now(),
          endTime: null,
          stars: 0,
          isChecking: false,
        })
      },

      flipCard: (index) => {
        const { cards, flippedIndices, matchedIds, isChecking } = get()
        if (isChecking) return
        if (flippedIndices.includes(index)) return
        if (matchedIds.includes(cards[index].id)) return
        if (flippedIndices.length >= 2) return

        const newFlipped = [...flippedIndices, index]
        set({ flippedIndices: newFlipped })

        if (newFlipped.length === 2) {
          const moves = get().moves + 1
          set({ moves, isChecking: true })

          const [first, second] = newFlipped
          const isMatch = cards[first].id === cards[second].id

          setTimeout(() => {
            if (isMatch) {
              const newMatched = [...get().matchedIds, cards[first].id]
              set({
                matchedIds: newMatched,
                flippedIndices: [],
                isChecking: false,
              })

              // Check win
              const { pairs } = difficulties[get().difficulty]
              if (newMatched.length === pairs) {
                const endTime = Date.now()
                const stars = calculateStars(moves, pairs)
                set({ screen: 'results', endTime, stars })

                // Save best score
                const { bestScores, difficulty } = get()
                const existing = bestScores[difficulty]
                if (!existing || moves < existing.moves) {
                  set({
                    bestScores: {
                      ...bestScores,
                      [difficulty]: { moves, stars },
                    },
                  })
                }
              }
            } else {
              set({ flippedIndices: [], isChecking: false })
            }
          }, 800)
        }
      },

      resetGame: () => {
        const { difficulty } = get()
        if (difficulty) {
          get().selectDifficulty(difficulty)
        } else {
          set({ screen: 'difficulty' })
        }
      },

      goToDifficulty: () => {
        set({ screen: 'difficulty' })
      },
    }),
    {
      name: 'memory-game-save',
      partialize: (state) => ({
        bestScores: state.bestScores,
      }),
    }
  )
)

export default useMemoryStore
