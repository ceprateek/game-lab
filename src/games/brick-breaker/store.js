import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useBrickBreakerStore = create(
  persist(
    (set, get) => ({
      // Navigation
      screen: 'difficulty', // difficulty | playing | results

      // Game config
      difficulty: null,

      // Results
      result: null, // { score, bricksCleared, totalBricks, lives, won, stars }

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

      finishGame: ({ score, bricksCleared, totalBricks, lives, won }) => {
        let stars = 0
        if (won) {
          if (lives >= 3) stars = 3
          else if (lives >= 2) stars = 2
          else stars = 1
        }

        const result = { score, bricksCleared, totalBricks, lives, won, stars }
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
      name: 'brick-breaker-save',
      partialize: (state) => ({
        bestScores: state.bestScores,
      }),
    }
  )
)

export default useBrickBreakerStore
