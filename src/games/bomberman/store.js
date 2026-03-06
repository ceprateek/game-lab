import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { difficulties } from './data/config'

const useBombermanStore = create(
  persist(
    (set, get) => ({
      // Navigation
      screen: 'difficulty', // difficulty | playing | results

      // Game config
      difficulty: null,

      // Results
      result: null, // { score, enemiesKilled, wallsDestroyed, time, stars, won }

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

      finishGame: ({ score, enemiesKilled, wallsDestroyed, time, won }) => {
        const { difficulty } = get()
        const config = difficulties[difficulty]
        const thresholds = config?.starThresholds || [200, 400, 600]

        let stars = 0
        if (won) {
          if (score >= thresholds[2]) stars = 3
          else if (score >= thresholds[1]) stars = 2
          else if (score >= thresholds[0]) stars = 1
        }

        const result = { score, enemiesKilled, wallsDestroyed, time, stars, won }
        set({ screen: 'results', result })

        // Save best score
        const { bestScores } = get()
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
      name: 'bomberman-save',
      partialize: (state) => ({
        bestScores: state.bestScores,
      }),
    }
  )
)

export default useBombermanStore
