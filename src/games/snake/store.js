import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useSnakeStore = create(
  persist(
    (set, get) => ({
      // Navigation
      screen: 'difficulty', // difficulty | playing | results

      // Game config
      difficulty: null,

      // Results
      result: null, // { score, length, time, stars }

      // Persisted
      bestScores: {},

      // Actions
      selectDifficulty: (difficulty) => {
        set({
          screen: 'playing',
          difficulty,
          result: null,
        })
      },

      finishGame: ({ score, length, time }) => {
        let stars = 0
        if (score >= 500) stars = 3
        else if (score >= 250) stars = 2
        else if (score >= 100) stars = 1

        const result = { score, length, time, stars }
        set({ screen: 'results', result })

        // Save best score
        const { bestScores, difficulty } = get()
        const existing = bestScores[difficulty]
        if (!existing || score > existing.score) {
          set({
            bestScores: {
              ...bestScores,
              [difficulty]: { score, stars },
            },
          })
        }
      },

      resetGame: () => {
        const { difficulty } = get()
        if (difficulty) {
          set({ screen: 'playing', result: null })
        } else {
          set({ screen: 'difficulty' })
        }
      },

      goToDifficulty: () => {
        set({ screen: 'difficulty', result: null })
      },
    }),
    {
      name: 'snake-save',
      partialize: (state) => ({
        bestScores: state.bestScores,
      }),
    }
  )
)

export default useSnakeStore
