import { motion } from 'framer-motion'
import useAppStore from '../store/appStore'

const games = [
  {
    id: 'treasure-quest',
    title: 'Treasure Quest',
    subtitle: 'The Decomposer',
    description: 'Plan your steps, find the treasure! Break big problems into small steps.',
    icon: (
      <svg viewBox="0 0 80 64" className="w-16 h-12">
        <rect x="10" y="25" width="60" height="35" rx="5" fill="#8B4513" />
        <rect x="7" y="20" width="66" height="10" rx="4" fill="#6d3410" />
        <rect x="33" y="26" width="14" height="12" rx="2" fill="#FFD700" />
        <circle cx="40" cy="32" r="3" fill="#DAA520" />
        <ellipse cx="40" cy="25" rx="28" ry="10" fill="#FFD700" opacity="0.12" />
      </svg>
    ),
    colors: {
      bg: 'from-amber-600/20 to-amber-900/30',
      border: 'border-amber-500/30',
      accent: 'text-amber-400',
      glow: 'bg-amber-400/10',
    },
  },
  {
    id: 'memory-game',
    title: 'Memory Match',
    subtitle: 'Card Flipper',
    description: 'Flip cards and find matching pairs! Train your memory and focus.',
    icon: (
      <svg viewBox="0 0 80 64" className="w-16 h-12">
        <rect x="4" y="4" width="30" height="40" rx="4" fill="#7c3aed" />
        <text x="19" y="30" textAnchor="middle" fill="#fbbf24" fontSize="18">?</text>
        <rect x="46" y="4" width="30" height="40" rx="4" fill="#2563eb" />
        <text x="61" y="30" textAnchor="middle" fill="#fbbf24" fontSize="18">?</text>
        <rect x="25" y="20" width="30" height="40" rx="4" fill="#059669" />
        <text x="40" y="46" textAnchor="middle" fill="#fff" fontSize="18">!</text>
      </svg>
    ),
    colors: {
      bg: 'from-violet-600/20 to-violet-900/30',
      border: 'border-violet-500/30',
      accent: 'text-violet-400',
      glow: 'bg-violet-400/10',
    },
  },
]

export default function GameSelector() {
  const selectGame = useAppStore((s) => s.selectGame)

  return (
    <div className="h-full w-full overflow-hidden relative">
      {/* Background */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="sel-bg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="40%" stopColor="#1e1b4b" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
          <radialGradient id="sel-glow" cx="0.5" cy="0.25" r="0.5">
            <stop offset="0%" stopColor="#818cf8" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="400" height="800" fill="url(#sel-bg)" />
        <rect width="400" height="800" fill="url(#sel-glow)" />

        {/* Stars */}
        {[
          [30, 50], [100, 30], [180, 70], [260, 25], [340, 55],
          [50, 130], [150, 110], [280, 100], [370, 140],
          [80, 190], [210, 170], [330, 190],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={1 + (i % 3) * 0.5} fill="#c7d2fe" opacity={0.2 + (i % 4) * 0.1}>
            <animate attributeName="opacity" values={`${0.2 + (i % 4) * 0.1};${0.05};${0.2 + (i % 4) * 0.1}`} dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
          </circle>
        ))}
      </svg>

      {/* Floating particles */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full bg-indigo-300/20 pointer-events-none"
          style={{ left: `${15 + i * 22}%`, top: `${20 + (i % 2) * 15}%` }}
          animate={{ y: [0, -25, 0], opacity: [0.15, 0.4, 0.15] }}
          transition={{ duration: 3 + i * 0.7, repeat: Infinity, delay: i * 0.5 }}
        />
      ))}

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center px-6 pt-16 pb-8">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-2"
        >
          <h1 className="text-4xl font-extrabold text-white tracking-tight mb-1 drop-shadow-lg">
            Game Lab
          </h1>
          <p className="text-indigo-300/60 text-sm font-medium tracking-wide">
            Choose your adventure
          </p>
        </motion.div>

        {/* Game cards */}
        <div className="flex-1 flex flex-col justify-center w-full max-w-sm space-y-5">
          {games.map((game, index) => (
            <motion.button
              key={game.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.15, type: 'spring', stiffness: 200 }}
              onClick={() => selectGame(game.id)}
              className="w-full text-left active:scale-[0.97] transition-transform"
            >
              <div className={`bg-gradient-to-br ${game.colors.bg} border ${game.colors.border} rounded-2xl p-5 relative overflow-hidden`}>
                {/* Subtle glow */}
                <div className={`absolute top-0 right-0 w-32 h-32 ${game.colors.glow} rounded-full blur-3xl -translate-y-1/2 translate-x-1/2`} />

                <div className="flex items-center gap-4 relative">
                  {/* Game icon */}
                  <div className="w-16 h-16 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center shrink-0">
                    {game.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h2 className="text-white font-bold text-lg">{game.title}</h2>
                    </div>
                    <p className={`${game.colors.accent} text-xs font-bold uppercase tracking-wider mb-1`}>
                      {game.subtitle}
                    </p>
                    <p className="text-white/40 text-xs leading-relaxed">
                      {game.description}
                    </p>
                  </div>

                  {/* Arrow */}
                  <span className="text-white/20 text-xl shrink-0">&rsaquo;</span>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-white/15 text-xs text-center tracking-wider"
        >
          LEARN THROUGH PLAY
        </motion.p>
      </div>
    </div>
  )
}
