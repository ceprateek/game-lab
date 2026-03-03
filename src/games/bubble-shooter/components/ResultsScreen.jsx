import { motion } from 'framer-motion'
import useBubbleShooterStore from '../store'
import useAppStore from '../../../store/appStore'
import StarRating from '../../../components/ui/StarRating'
import Button from '../../../components/ui/Button'

export default function ResultsScreen() {
  const { score, stars, won, difficulty, resetGame, goToDifficulty } = useBubbleShooterStore()
  const backToMenu = useAppStore((s) => s.backToMenu)

  return (
    <div className="h-full w-full relative overflow-hidden">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="bs-result-glow" cx="0.5" cy="0.3" r="0.6">
            <stop offset="0%" stopColor={won ? '#22d3ee' : '#ef4444'} stopOpacity="0.2" />
            <stop offset="50%" stopColor={won ? '#0891b2' : '#dc2626'} stopOpacity="0.05" />
            <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="400" height="800" fill="#0f172a" />
        <rect width="400" height="800" fill="url(#bs-result-glow)" />
      </svg>

      {won &&
        [...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute pointer-events-none"
            style={{ left: `${5 + i * 10}%`, top: '-5%' }}
            animate={{
              y: [0, 800],
              x: [0, (i % 2 === 0 ? 1 : -1) * 20],
              rotate: [0, 360 * (i % 2 === 0 ? 1 : -1)],
            }}
            transition={{
              duration: 3 + (i % 3) * 0.8,
              repeat: Infinity,
              delay: i * 0.2,
              ease: 'linear',
            }}
          >
            <div
              className={`w-2.5 h-2.5 rounded-full ${
                ['bg-cyan-400', 'bg-blue-400', 'bg-violet-400', 'bg-pink-400', 'bg-amber-400'][i % 5]
              }`}
              style={{ opacity: 0.7 }}
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
          {won ? '🎉' : '💔'}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-extrabold text-white mb-1"
        >
          {won
            ? stars === 3 ? 'Perfect!' : stars === 2 ? 'Great Job!' : 'Well Done!'
            : 'Game Over'}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-cyan-200/50 text-sm mb-5 capitalize"
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
          className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl px-10 py-4 mb-8"
        >
          <p className="text-white text-2xl font-bold text-center">{score}</p>
          <p className="text-white/40 text-xs text-center">Score</p>
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
          <Button variant="ghost" size="sm" className="w-full" onClick={backToMenu}>
            ← Games
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
