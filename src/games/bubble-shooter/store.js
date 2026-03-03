import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { calculateStars } from './data/config'

const useBubbleShooterStore = create(
  persist(
    (set, get) => ({
      screen: 'difficulty',
      difficulty: null,
      score: 0,
      stars: 0,
      won: false,
      bestScores: {},

      selectDifficulty: (difficulty) => {
        set({ screen: 'playing', difficulty, score: 0, stars: 0, won: false })
      },

      finishGame: ({ score, won }) => {
        const stars = won ? calculateStars(score) : 1
        const { bestScores, difficulty } = get()
        const existing = bestScores[difficulty]
        const newBest = !existing || score > existing.score
        set({
          screen: 'results',
          score,
          stars,
          won,
          bestScores: newBest
            ? { ...bestScores, [difficulty]: { score, stars } }
            : bestScores,
        })
      },

      resetGame: () => {
        const { difficulty } = get()
        if (difficulty) get().selectDifficulty(difficulty)
      },

      goToDifficulty: () => set({ screen: 'difficulty' }),
    }),
    {
      name: 'bubble-shooter-save',
      partialize: (state) => ({ bestScores: state.bestScores }),
    }
  )
)

export default useBubbleShooterStore
