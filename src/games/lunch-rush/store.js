import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { DIFFICULTIES, STAR_THRESHOLDS, generateOrders } from './data/config'

const useLunchRushStore = create(
  persist(
    (set, get) => ({
      screen: 'difficulty',
      difficulty: null,
      orders: [],
      currentOrderIndex: 0,
      packedItems: [],
      lives: 3,
      score: 0,
      mistakesMade: false,
      orderStartTime: null,
      sessionStatus: null, // null | 'success' | 'error'
      result: null,
      bestScores: {},

      selectDifficulty: (difficulty) => {
        const config = DIFFICULTIES[difficulty]
        const orders = generateOrders(difficulty)
        set({
          screen: 'playing',
          difficulty,
          orders,
          currentOrderIndex: 0,
          packedItems: [],
          lives: config.lives,
          score: 0,
          mistakesMade: false,
          orderStartTime: Date.now(),
          sessionStatus: null,
          result: null,
        })
      },

      tapFoodItem: (foodItem) => {
        const { packedItems, orders, currentOrderIndex, sessionStatus } = get()
        if (sessionStatus) return
        const order = orders[currentOrderIndex]
        if (!order) return
        if (packedItems.length >= order.items.length) return
        if (packedItems.find((p) => p.id === foodItem.id)) return
        set({ packedItems: [...packedItems, foodItem] })
      },

      removeFromTray: (foodItemId) => {
        const { packedItems, sessionStatus } = get()
        if (sessionStatus) return
        set({ packedItems: packedItems.filter((p) => p.id !== foodItemId) })
      },

      submitOrder: () => {
        const { packedItems, orders, currentOrderIndex, score, lives, difficulty, orderStartTime, sessionStatus, mistakesMade } = get()
        if (sessionStatus) return

        const order = orders[currentOrderIndex]
        if (!order || packedItems.length === 0) return

        const requiredIds = [...order.items.map((i) => i.id)].sort()
        const packedIds = [...packedItems.map((i) => i.id)].sort()
        const correct = requiredIds.length === packedIds.length && requiredIds.every((id, i) => id === packedIds[i])

        if (correct) {
          const basePoints = 10 * (currentOrderIndex + 1)
          const config = DIFFICULTIES[difficulty]
          const elapsed = (Date.now() - orderStartTime) / 1000
          const speedBonus = elapsed < config.orderTime * 0.5 ? 5 : 0
          let newScore = score + basePoints + speedBonus

          const isLastOrder = currentOrderIndex === orders.length - 1

          if (isLastOrder && !mistakesMade) {
            newScore += 30
          }

          set({ sessionStatus: 'success', score: newScore })

          if (isLastOrder) {
            setTimeout(() => {
              get().finishGame({ won: true })
            }, 800)
          } else {
            setTimeout(() => {
              set({
                currentOrderIndex: currentOrderIndex + 1,
                packedItems: [],
                sessionStatus: null,
                orderStartTime: Date.now(),
              })
            }, 800)
          }
        } else {
          const newLives = lives - 1
          set({ sessionStatus: 'error', lives: newLives, mistakesMade: true })

          if (newLives <= 0) {
            setTimeout(() => {
              get().finishGame({ won: false })
            }, 1200)
          } else {
            setTimeout(() => {
              set({
                packedItems: [],
                sessionStatus: null,
                orderStartTime: Date.now(),
              })
            }, 1200)
          }
        }
      },

      orderTimedOut: () => {
        const { lives, sessionStatus, currentOrderIndex, mistakesMade } = get()
        if (sessionStatus) return

        const newLives = lives - 1
        set({ sessionStatus: 'error', lives: newLives, mistakesMade: true })

        if (newLives <= 0) {
          setTimeout(() => {
            get().finishGame({ won: false })
          }, 1200)
        } else {
          setTimeout(() => {
            set({
              packedItems: [],
              sessionStatus: null,
              orderStartTime: Date.now(),
            })
          }, 1200)
        }
      },

      finishGame: ({ won }) => {
        const { score, currentOrderIndex, orders, difficulty } = get()
        const thresholds = STAR_THRESHOLDS[difficulty]
        let stars = 0
        if (won) {
          if (score >= thresholds.three) stars = 3
          else if (score >= thresholds.two) stars = 2
          else stars = 1
        }

        const ordersCompleted = won ? orders.length : currentOrderIndex
        const result = { score, ordersCompleted, totalOrders: orders.length, won, stars }
        set({ screen: 'results', result })

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
          get().selectDifficulty(difficulty)
        } else {
          set({ screen: 'difficulty' })
        }
      },

      goToDifficulty: () => {
        set({ screen: 'difficulty', result: null })
      },
    }),
    {
      name: 'lunch-rush-save',
      partialize: (state) => ({ bestScores: state.bestScores }),
    }
  )
)

export default useLunchRushStore
