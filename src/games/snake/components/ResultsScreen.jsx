import { motion } from 'framer-motion'
import useSnakeStore from '../store'
import StarRating from '../../../components/ui/StarRating'
import Button from '../../../components/ui/Button'

export default function ResultsScreen() {
  const { result, difficulty, resetGame, goToDifficulty } = useSnakeStore()
  const { score, length, time, stars } = result || {}

  const won = stars > 0
  const formattedTime = Math.round((time || 0) / 1000)

  return (
    <div className="h-full w-full relative overflow-hidden">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="snake-result-glow" cx="0.5" cy="0.3" r="0.6">
            <stop offset="0%" stopColor={won ? '#22c55e' : '#ef4444'} stopOpacity="0.2" />
            <stop offset="50%" stopColor={won ? '#16a34a' : '#dc2626'} stopOpacity="0.05" />
            <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="400" height="800" fill="#0f172a" />
        <rect width="400" height="800" fill="url(#snake-result-glow)" />
      </svg>

      {won &&
        [...Array(10)].map((_, i) => (
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
                ['bg-green-400', 'bg-emerald-400', 'bg-lime-400', 'bg-amber-400', 'bg-teal-400'][i % 5]
              }`}
              style={{ opacity: 0.6 }}
            />
          </motion.div>
        ))}

      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6">
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 12 }}
          className="text-7xl mb-4"
        >
          {won ? '🏆' : '💥'}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-extrabold text-white mb-1"
        >
          {won
            ? stars === 3
              ? 'Amazing!'
              : stars === 2
                ? 'Great Job!'
                : 'Nice Run!'
            : 'Game Over'}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-green-200/50 text-sm mb-5 capitalize"
        >
          {difficulty} difficulty
        </motion.p>

        {won && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mb-6"
          >
            <StarRating stars={stars} size="lg" />
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex gap-4 mb-8"
        >
          <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl px-5 py-3 text-center">
            <p className="text-white text-xl font-bold">{score}</p>
            <p className="text-white/40 text-xs">Score</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl px-5 py-3 text-center">
            <p className="text-white text-xl font-bold">{length}</p>
            <p className="text-white/40 text-xs">Length</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl px-5 py-3 text-center">
            <p className="text-white text-xl font-bold">{formattedTime}s</p>
            <p className="text-white/40 text-xs">Time</p>
          </div>
        </motion.div>

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
