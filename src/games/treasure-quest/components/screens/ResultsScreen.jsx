import { motion } from 'framer-motion'
import useGameStore from '../../store'
import { getLevelById, getNextLevelId } from '../../data/levels'
import StarRating from '../../../../components/ui/StarRating'
import Button from '../../../../components/ui/Button'
import Character from '../illustrations/Character'

const treasureEmojis = { coin: '🪙', gem: '💎', crystal: '🔮' }
const gearEmojis = { compass: '🧭', map: '🗺️', torch: '🔦' }

export default function ResultsScreen() {
  const { currentLevelId, lastResult, navigateTo } = useGameStore()
  const level = getLevelById(currentLevelId)
  const nextLevelId = getNextLevelId(currentLevelId)

  if (!level || !lastResult) {
    return null
  }

  return (
    <div className="h-full w-full relative overflow-hidden">
      {/* Celebration background */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="victory-glow" cx="0.5" cy="0.3" r="0.6">
            <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#1a0e2e" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="400" height="800" fill="#1a0e2e" />
        <rect width="400" height="800" fill="url(#victory-glow)" />
      </svg>

      {/* Confetti particles */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none"
          style={{
            left: `${5 + (i * 8)}%`,
            top: '-5%',
          }}
          animate={{
            y: [0, 800],
            x: [0, (i % 2 === 0 ? 1 : -1) * 30 * Math.random()],
            rotate: [0, 360 * (i % 2 === 0 ? 1 : -1)],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: i * 0.2,
            ease: 'linear',
          }}
        >
          <div
            className={`w-3 h-3 rounded-sm ${
              ['bg-amber-400', 'bg-red-400', 'bg-blue-400', 'bg-green-400', 'bg-purple-400'][i % 5]
            }`}
            style={{ opacity: 0.7 }}
          />
        </motion.div>
      ))}

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 overflow-y-auto py-8">
        {/* Character celebration */}
        <motion.div
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 12 }}
        >
          <Character pose="success" size={110} />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-extrabold text-white mb-1 text-center"
        >
          Level Complete!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-amber-200/60 mb-4 text-center text-sm"
        >
          {level.title}
        </motion.p>

        {/* Stars */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-6"
        >
          <StarRating stars={lastResult.stars} size="lg" />
        </motion.div>

        {/* Rewards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="w-full max-w-xs space-y-3 mb-6"
        >
          {/* Treasure */}
          <div className="bg-white/10 backdrop-blur-sm border border-amber-400/20 rounded-xl px-4 py-3 flex items-center gap-3">
            <motion.span
              className="text-4xl"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2, delay: 1 }}
            >
              {treasureEmojis[level.treasure.icon] || '🪙'}
            </motion.span>
            <div>
              <p className="text-amber-400 text-xs font-bold uppercase tracking-wider">Treasure Found</p>
              <p className="text-white font-semibold">{level.treasure.name}</p>
            </div>
          </div>

          {/* Gear */}
          <div className="bg-white/10 backdrop-blur-sm border border-blue-400/20 rounded-xl px-4 py-3 flex items-center gap-3">
            <span className="text-4xl">{gearEmojis[level.gear.icon] || '⚔️'}</span>
            <div>
              <p className="text-blue-400 text-xs font-bold uppercase tracking-wider">New Gear</p>
              <p className="text-white font-semibold">{level.gear.name}</p>
            </div>
          </div>

          {/* Story */}
          <div className="bg-amber-900/30 backdrop-blur-sm border border-amber-700/20 rounded-xl px-4 py-3">
            <p className="text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">📜 Story Unlocked</p>
            <p className="text-amber-100/60 text-sm italic leading-relaxed">"{level.storyPiece}"</p>
          </div>
        </motion.div>

        {/* Badges */}
        {lastResult.badges.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex gap-2 mb-6"
          >
            {lastResult.badges.map((badge) => (
              <div
                key={badge.id}
                className="bg-purple-500/20 border border-purple-400/30 rounded-xl px-3 py-2 text-center"
              >
                <p className="text-white text-sm font-bold">{badge.name}</p>
              </div>
            ))}
          </motion.div>
        )}

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="w-full max-w-xs space-y-3"
        >
          {nextLevelId ? (
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={() => navigateTo('gameplay', nextLevelId)}
            >
              Next Level →
            </Button>
          ) : (
            <div className="text-center">
              <p className="text-amber-300 font-bold mb-3 text-lg">All levels complete!</p>
              <Button
                variant="primary"
                size="lg"
                className="w-full"
                onClick={() => navigateTo('levelSelect')}
              >
                View Map
              </Button>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="w-full"
            onClick={() => navigateTo('levelSelect')}
          >
            Level Select
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
