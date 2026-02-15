import { motion } from 'framer-motion'
import useGameStore from '../../store'
import Button from '../../../../components/ui/Button'
import Character from '../illustrations/Character'

export default function HomeScreen() {
  const navigateTo = useGameStore((s) => s.navigateTo)
  const totalStars = useGameStore((s) => s.getTotalStars())
  const treasures = useGameStore((s) => s.treasures)

  return (
    <div className="h-full w-full overflow-hidden relative">
      {/* Animated background */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="home-bg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a0e2e" />
            <stop offset="30%" stopColor="#2d1b4e" />
            <stop offset="60%" stopColor="#44286a" />
            <stop offset="100%" stopColor="#1a3a5c" />
          </linearGradient>
          <radialGradient id="home-glow" cx="0.5" cy="0.3" r="0.4">
            <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="400" height="800" fill="url(#home-bg)" />
        <rect width="400" height="800" fill="url(#home-glow)" />

        {/* Stars in sky */}
        {[
          [40, 60], [120, 40], [200, 80], [280, 30], [350, 70],
          [60, 140], [170, 120], [300, 110], [380, 150],
          [90, 200], [230, 180], [340, 200],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={1 + (i % 3) * 0.5} fill="#fde68a" opacity={0.3 + (i % 4) * 0.15}>
            <animate attributeName="opacity" values={`${0.3 + (i % 4) * 0.15};${0.1};${0.3 + (i % 4) * 0.15}`} dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
          </circle>
        ))}

        {/* Mountains silhouette */}
        <path d="M 0 600 L 80 480 L 140 540 L 220 440 L 300 520 L 360 460 L 400 500 L 400 800 L 0 800 Z" fill="#1a2a3a" opacity="0.5" />
        <path d="M 0 650 L 100 560 L 180 600 L 260 530 L 350 580 L 400 550 L 400 800 L 0 800 Z" fill="#0f1f2f" opacity="0.6" />

        {/* Ground */}
        <path d="M 0 700 Q 100 690 200 695 Q 300 700 400 690 L 400 800 L 0 800 Z" fill="#1a3a2a" />
        <path d="M 0 720 Q 80 710 200 715 Q 350 720 400 712 L 400 800 L 0 800 Z" fill="#15301f" />
      </svg>

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full bg-amber-300/30 pointer-events-none"
          style={{ left: `${10 + i * 16}%`, top: `${30 + (i % 3) * 10}%` }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.6 }}
        />
      ))}

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-4"
        >
          {/* Treasure chest icon */}
          <motion.div
            animate={{ y: [0, -8, 0], rotate: [0, 2, -2, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            className="mb-3"
          >
            <svg viewBox="0 0 100 80" className="w-32 h-24 mx-auto drop-shadow-2xl">
              {/* Glow */}
              <ellipse cx="50" cy="40" rx="48" ry="35" fill="#fbbf24" opacity="0.1" />
              {/* Chest body */}
              <rect x="15" y="35" width="70" height="40" rx="6" fill="#8B4513" />
              <rect x="12" y="30" width="76" height="12" rx="5" fill="#6d3410" />
              {/* Chest detail bands */}
              <rect x="15" y="50" width="70" height="3" fill="#6d3410" opacity="0.5" />
              <rect x="15" y="62" width="70" height="3" fill="#6d3410" opacity="0.5" />
              {/* Lock */}
              <rect x="42" y="35" width="16" height="14" rx="3" fill="#FFD700" />
              <circle cx="50" cy="42" r="3.5" fill="#DAA520" />
              <rect x="48" y="42" width="4" height="5" rx="1" fill="#DAA520" />
              {/* Shine */}
              <path d="M 25 35 L 30 30 L 35 35" fill="#A0522D" opacity="0.5" />
            </svg>
          </motion.div>

          <h1 className="text-5xl font-extrabold text-white tracking-tight mb-1 drop-shadow-lg">
            Treasure Quest
          </h1>
          <p className="text-amber-300 text-lg font-medium tracking-wide">The Decomposer</p>
        </motion.div>

        {/* Character */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="mb-6"
        >
          <Character pose="idle" size={100} />
        </motion.div>

        {/* Play button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
          className="mb-6"
        >
          <Button size="lg" onClick={() => navigateTo('levelSelect')}>
            Start Adventure
          </Button>
        </motion.div>

        {/* Stats */}
        {(totalStars > 0 || treasures.length > 0) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex gap-8 text-center"
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/10">
              <p className="text-amber-400 text-xl font-bold">★ {totalStars}</p>
              <p className="text-amber-300/40 text-xs">Stars</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/10">
              <p className="text-amber-400 text-xl font-bold">{treasures.length}</p>
              <p className="text-amber-300/40 text-xs">Treasures</p>
            </div>
          </motion.div>
        )}

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-white/25 text-xs mt-10 text-center tracking-wider"
        >
          THINK FIRST • PLAN SMART • FIND THE TREASURE
        </motion.p>
      </div>
    </div>
  )
}
