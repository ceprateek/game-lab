import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useGameStore from '../../store/gameStore'
import { getLevelById } from '../../data/levels'
import Character from '../illustrations/Character'

export default function ExecutionPhase() {
  const { currentLevelId, executionResults, finishExecution } = useGameStore()
  const level = getLevelById(currentLevelId)
  const [visibleCount, setVisibleCount] = useState(0)
  const [done, setDone] = useState(false)

  const allSuccess = executionResults.every((r) => r.success)
  const currentResult = executionResults[visibleCount - 1]
  const characterPose = done
    ? allSuccess ? 'success' : 'fail'
    : visibleCount > 0
      ? currentResult?.success ? 'walking' : 'fail'
      : 'idle'

  useEffect(() => {
    if (visibleCount < executionResults.length) {
      const timer = setTimeout(() => setVisibleCount((c) => c + 1), 1200)
      return () => clearTimeout(timer)
    } else if (visibleCount > 0) {
      const timer = setTimeout(() => setDone(true), 800)
      return () => clearTimeout(timer)
    }
  }, [visibleCount, executionResults.length])

  useEffect(() => {
    if (done) {
      const timer = setTimeout(finishExecution, 1000)
      return () => clearTimeout(timer)
    }
  }, [done, finishExecution])

  if (!level) return null

  const allSteps = [...level.steps, ...level.distractors]

  return (
    <div className="flex flex-col h-full px-4 pt-4">
      {/* Character animation area */}
      <div className="flex flex-col items-center mb-4">
        <motion.div
          animate={{
            x: visibleCount > 0 && !done ? [0, 10, -10, 0] : 0,
          }}
          transition={{ repeat: Infinity, duration: 1 }}
        >
          <Character pose={characterPose} size={100} />
        </motion.div>

        {/* Status text */}
        <AnimatePresence mode="wait">
          <motion.p
            key={visibleCount}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-white/60 text-sm mt-2 text-center h-6"
          >
            {done
              ? allSuccess
                ? 'Perfect execution!'
                : 'Something went wrong...'
              : visibleCount > 0
                ? currentResult?.success
                  ? 'Step completed!'
                  : 'Step failed!'
                : 'Starting your plan...'}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-white/10 rounded-full h-2 mb-4">
        <motion.div
          className={`h-full rounded-full ${
            currentResult && !currentResult.success ? 'bg-red-400' : 'bg-amber-400'
          }`}
          initial={{ width: 0 }}
          animate={{ width: `${(visibleCount / executionResults.length) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Step results list */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {executionResults.map((result, index) => {
          const step = allSteps.find((s) => s.id === result.stepId)
          const visible = index < visibleCount
          const isCurrentStep = index === visibleCount - 1

          return (
            <motion.div
              key={result.stepId}
              initial={{ opacity: 0.3, x: 0 }}
              animate={visible ? {
                opacity: 1,
                x: 0,
                scale: isCurrentStep ? 1.02 : 1,
              } : {
                opacity: 0.3,
              }}
              transition={{ duration: 0.4 }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                !visible
                  ? 'bg-white/5'
                  : result.success
                    ? 'bg-green-500/20 border border-green-400/30'
                    : 'bg-red-500/20 border border-red-400/30'
              } ${isCurrentStep ? 'ring-2 ring-white/20' : ''}`}
            >
              {/* Step number */}
              <span className="text-white/30 text-xs font-bold w-4">{index + 1}</span>

              {/* Status icon */}
              {visible ? (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                    result.success
                      ? 'bg-green-500/30 text-green-300'
                      : 'bg-red-500/30 text-red-300'
                  }`}
                >
                  {result.success ? '✓' : '✗'}
                </motion.div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                  <span className="text-white/20 text-xs">○</span>
                </div>
              )}

              {/* Step text */}
              <div className="flex-1 min-w-0">
                <p className={`font-medium text-sm ${visible ? 'text-white' : 'text-white/30'}`}>
                  {step?.text || result.stepId}
                </p>
                {visible && !result.success && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="text-red-300/70 text-xs mt-1 leading-relaxed"
                  >
                    {result.message}
                  </motion.p>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
