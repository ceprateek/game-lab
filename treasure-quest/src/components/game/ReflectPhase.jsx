import { motion } from 'framer-motion'
import useGameStore from '../../store/gameStore'
import { getLevelById } from '../../data/levels'
import Button from '../ui/Button'
import StarRating from '../ui/StarRating'
import Character from '../illustrations/Character'

export default function ReflectPhase() {
  const {
    currentLevelId,
    executionResults,
    lastResult,
    attempts,
    retryLevel,
    completeLevel,
    navigateTo,
  } = useGameStore()

  const level = getLevelById(currentLevelId)
  if (!level || !lastResult) return null

  const allSteps = [...level.steps, ...level.distractors]
  const success = lastResult.allCorrect

  const handleContinue = () => {
    if (success) {
      completeLevel()
      navigateTo('results', currentLevelId)
    }
  }

  return (
    <div className="flex flex-col h-full px-4 pt-4 pb-5">
      {/* Character reaction */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
        className="flex flex-col items-center mb-4"
      >
        <Character pose={success ? 'success' : 'fail'} size={90} />
        <h2 className="text-xl font-bold text-white mt-2">
          {success ? 'Perfect Strategy!' : 'Not Quite Right'}
        </h2>
        <p className="text-white/50 text-xs">
          {success
            ? `Solved in ${attempts} ${attempts === 1 ? 'attempt' : 'attempts'}`
            : 'Let\'s see what happened...'}
        </p>
      </motion.div>

      {/* Stars (success only) */}
      {success && (
        <div className="mb-4">
          <StarRating stars={lastResult.stars} size="md" />
        </div>
      )}

      {/* Step results */}
      <div className="flex-1 overflow-y-auto space-y-2 mb-3">
        {executionResults.map((result, index) => {
          const step = allSteps.find((s) => s.id === result.stepId)
          return (
            <motion.div
              key={result.stepId}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.08 }}
              className={`flex items-start gap-3 px-3 py-2.5 rounded-xl ${
                result.success
                  ? 'bg-green-500/10 border border-green-400/20'
                  : 'bg-red-500/10 border border-red-400/20'
              }`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                result.success ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
              }`}>
                {result.success ? '✓' : '✗'}
              </div>
              <div className="min-w-0">
                <p className="text-white font-medium text-sm">{step?.text || result.stepId}</p>
                <p className={`text-xs mt-0.5 leading-relaxed ${
                  result.success ? 'text-green-300/50' : 'text-red-300/60'
                }`}>
                  {result.message}
                </p>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Hint (on failure) */}
      {!success && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-blue-500/10 border border-blue-400/15 rounded-xl px-4 py-3 mb-3"
        >
          <p className="text-blue-200/80 text-sm text-center leading-relaxed">
            <span className="font-bold">Hint:</span> {level.hint}
          </p>
        </motion.div>
      )}

      {/* Badges (success) */}
      {success && lastResult.badges.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex justify-center gap-2 mb-3"
        >
          {lastResult.badges.map((badge) => (
            <div
              key={badge.id}
              className="bg-purple-500/15 border border-purple-400/25 rounded-lg px-3 py-1.5"
            >
              <p className="text-purple-200 text-xs font-bold">{badge.name}</p>
            </div>
          ))}
        </motion.div>
      )}

      {/* Actions */}
      <div className="space-y-2">
        {success ? (
          <Button variant="primary" size="lg" className="w-full" onClick={handleContinue}>
            Continue
          </Button>
        ) : (
          <Button variant="primary" size="lg" className="w-full" onClick={retryLevel}>
            Try Again
          </Button>
        )}
        <Button variant="ghost" size="sm" className="w-full" onClick={() => navigateTo('levelSelect')}>
          Back to Map
        </Button>
      </div>
    </div>
  )
}
