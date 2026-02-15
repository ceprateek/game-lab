import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import levels, { getLevelById } from './data/levels'
import { validatePlan, calculateStars, checkBadges, checkIfRushing } from './utils/scoring'

const useGameStore = create(
  persist(
    (set, get) => ({
      // Navigation
      screen: 'home',
      currentLevelId: null,

      // Game phase
      gamePhase: 'planning',
      playerPlan: [],
      availableSteps: [],
      executionResults: [],
      attempts: 0,
      planStartTime: null,
      lastResult: null,

      // Persisted progress
      levelProgress: {},
      treasures: [],
      badges: [],

      // Navigation
      navigateTo: (screen, levelId = null) => {
        set({ screen, currentLevelId: levelId })
        if (screen === 'gameplay' && levelId) {
          get().initLevel(levelId)
        }
      },

      // Initialize a level
      initLevel: (levelId) => {
        const level = getLevelById(levelId)
        if (!level) return
        const allSteps = [...level.steps, ...level.distractors]
        const shuffled = allSteps
          .map((s) => ({ ...s, sortKey: Math.random() }))
          .sort((a, b) => a.sortKey - b.sortKey)
          .map(({ sortKey, ...s }) => s)

        set({
          currentLevelId: levelId,
          gamePhase: 'planning',
          playerPlan: [],
          availableSteps: shuffled,
          executionResults: [],
          attempts: 0,
          planStartTime: Date.now(),
          lastResult: null,
        })
      },

      // Planning actions
      addStepToPlan: (stepId) => {
        const { playerPlan, availableSteps } = get()
        if (playerPlan.includes(stepId)) return
        set({
          playerPlan: [...playerPlan, stepId],
          availableSteps: availableSteps.filter((s) => s.id !== stepId),
        })
      },

      removeStepFromPlan: (stepId) => {
        const { playerPlan, availableSteps, currentLevelId } = get()
        const level = getLevelById(currentLevelId)
        const allSteps = [...level.steps, ...level.distractors]
        const step = allSteps.find((s) => s.id === stepId)
        if (!step) return
        set({
          playerPlan: playerPlan.filter((id) => id !== stepId),
          availableSteps: [...availableSteps, step],
        })
      },

      reorderPlan: (activeId, overId) => {
        const { playerPlan } = get()
        const oldIndex = playerPlan.indexOf(activeId)
        const newIndex = playerPlan.indexOf(overId)
        if (oldIndex === -1 || newIndex === -1) return
        const newPlan = [...playerPlan]
        newPlan.splice(oldIndex, 1)
        newPlan.splice(newIndex, 0, activeId)
        set({ playerPlan: newPlan })
      },

      // Lock in plan and execute
      lockInPlan: () => {
        const { playerPlan, currentLevelId, planStartTime } = get()
        const level = getLevelById(currentLevelId)
        if (!level || playerPlan.length === 0) return

        // Check for rushing
        if (checkIfRushing(planStartTime)) {
          return { rushing: true }
        }

        const attempts = get().attempts + 1
        const { results, allCorrect } = validatePlan(playerPlan, level)
        const planTimeMs = Date.now() - planStartTime

        set({
          gamePhase: 'executing',
          executionResults: results,
          attempts,
          lastResult: {
            allCorrect,
            stars: allCorrect ? calculateStars(attempts) : 0,
            badges: allCorrect ? checkBadges(level.id, attempts, false, planTimeMs) : [],
            planTimeMs,
          },
        })

        return { rushing: false }
      },

      // Move to reflect phase
      finishExecution: () => {
        set({ gamePhase: 'reflecting' })
      },

      // Complete level (from results)
      completeLevel: () => {
        const { currentLevelId, lastResult, levelProgress, treasures, badges } = get()
        if (!lastResult?.allCorrect) return

        const level = getLevelById(currentLevelId)
        const existing = levelProgress[currentLevelId]
        const bestStars = Math.max(existing?.stars || 0, lastResult.stars)

        const newTreasures = treasures.includes(level.treasure.name)
          ? treasures
          : [...treasures, level.treasure.name]

        const newBadgeIds = lastResult.badges.map((b) => b.id)
        const allBadges = [...new Set([...badges, ...newBadgeIds])]

        set({
          levelProgress: {
            ...levelProgress,
            [currentLevelId]: {
              completed: true,
              stars: bestStars,
              bestAttempts: existing?.bestAttempts
                ? Math.min(existing.bestAttempts, lastResult.stars === 3 ? 1 : 2)
                : lastResult.stars === 3
                  ? 1
                  : 2,
            },
          },
          treasures: newTreasures,
          badges: allBadges,
        })
      },

      // Retry current level
      retryLevel: () => {
        const { currentLevelId, attempts } = get()
        const level = getLevelById(currentLevelId)
        if (!level) return
        const allSteps = [...level.steps, ...level.distractors]
        const shuffled = allSteps
          .map((s) => ({ ...s, sortKey: Math.random() }))
          .sort((a, b) => a.sortKey - b.sortKey)
          .map(({ sortKey, ...s }) => s)

        set({
          gamePhase: 'planning',
          playerPlan: [],
          availableSteps: shuffled,
          executionResults: [],
          planStartTime: Date.now(),
          lastResult: null,
          attempts,
        })
      },

      // Check if a level is unlocked
      isLevelUnlocked: (levelId) => {
        if (levelId === 1) return true
        const prev = levelId - 1
        return !!get().levelProgress[prev]?.completed
      },

      // Get total stars
      getTotalStars: () => {
        const { levelProgress } = get()
        return Object.values(levelProgress).reduce((sum, p) => sum + (p.stars || 0), 0)
      },
    }),
    {
      name: 'treasure-quest-save',
      partialize: (state) => ({
        levelProgress: state.levelProgress,
        treasures: state.treasures,
        badges: state.badges,
      }),
    }
  )
)

export default useGameStore
