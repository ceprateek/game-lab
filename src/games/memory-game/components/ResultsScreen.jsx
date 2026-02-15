import { motion } from 'framer-motion'
import useMemoryStore from '../store'
import StarRating from '../../../components/ui/StarRating'
import Button from '../../../components/ui/Button'

function formatTime(ms) {
  if (!ms) return '0:00'
  const seconds = Math.floor(ms / 1000)
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export default function ResultsScreen() {
  const { moves, stars, startTime, endTime, difficulty, themeName, resetGame, goToDifficulty } = useMemoryStore()

  const timeTaken = endTime && startTime ? endTime - startTime : 0

  return (
    <div className="h-full w-full relative overflow-hidden">
      {/* Background */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="mem-victory-glow" cx="0.5" cy="0.3" r="0.6">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#6d28d9" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="400" height="800" fill="#0f172a" />
        <rect width="400" height="800" fill="url(#mem-victory-glow)" />
      </svg>

      {/* Confetti */}
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none"
          style={{ left: `${5 + i * 10}%`, top: '-5%' }}
          animate={{
            y: [0, 800],
            x: [0, (i % 2 === 0 ? 1 : -1) * 25 * Math.random()],
            rotate: [0, 360 * (i % 2 === 0 ? 1 : -1)],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: i * 0.25,
            ease: 'linear',
          }}
        >
          <div
            className={`w-2.5 h-2.5 rounded-sm ${
              ['bg-violet-400', 'bg-pink-400', 'bg-cyan-400', 'bg-amber-400', 'bg-emerald-400'][i % 5]
            }`}
            style={{ opacity: 0.6 }}
          />
        </motion.div>
      ))}

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6">
        {/* Trophy */}
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 12 }}
          className="text-7xl mb-4"
        >
          {stars === 3 ? '🏆' : stars === 2 ? '🎉' : '👏'}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-extrabold text-white mb-1"
        >
          {stars === 3 ? 'Perfect Memory!' : stars === 2 ? 'Great Job!' : 'Well Done!'}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-violet-200/50 text-sm mb-5 capitalize"
        >
          {difficulty} - {themeName}
        </motion.p>

        {/* Stars */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-6"
        >
          <StarRating stars={stars} size="lg" />
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex gap-4 mb-8"
        >
          <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl px-5 py-3 text-center">
            <p className="text-white text-xl font-bold">{moves}</p>
            <p className="text-white/40 text-xs">Moves</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl px-5 py-3 text-center">
            <p className="text-white text-xl font-bold">{formatTime(timeTaken)}</p>
            <p className="text-white/40 text-xs">Time</p>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="w-full max-w-xs space-y-3"
        >
          <Button variant="primary" size="lg" className="w-full" onClick={resetGame}>
            Play Again
          </Button>
          <Button variant="ghost" size="sm" className="w-full" onClick={goToDifficulty}>
            Change Difficulty
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
