import { motion } from 'framer-motion'
import useGameStore from '../../store'
import levels from '../../data/levels'
import Button from '../../../../components/ui/Button'
import Character from '../illustrations/Character'

const levelThemes = {
  1: { bg: 'from-emerald-800 to-emerald-950', icon: '🌴', color: 'text-emerald-400', label: 'Jungle' },
  2: { bg: 'from-blue-800 to-blue-950', icon: '🌊', color: 'text-blue-400', label: 'River' },
  3: { bg: 'from-stone-800 to-stone-950', icon: '🕯️', color: 'text-purple-400', label: 'Cave' },
}

const treasureEmojis = { coin: '🪙', gem: '💎', crystal: '🔮' }

export default function LevelSelect() {
  const navigateTo = useGameStore((s) => s.navigateTo)
  const levelProgress = useGameStore((s) => s.levelProgress)
  const isLevelUnlocked = useGameStore((s) => s.isLevelUnlocked)

  return (
    <div className="h-full w-full relative overflow-hidden">
      {/* Background */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="map-bg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2a1a0e" />
            <stop offset="50%" stopColor="#3d2a18" />
            <stop offset="100%" stopColor="#2a1a0e" />
          </linearGradient>
        </defs>
        <rect width="400" height="800" fill="url(#map-bg)" />

        {/* Parchment texture lines */}
        {[...Array(20)].map((_, i) => (
          <line key={i} x1="0" y1={i * 40} x2="400" y2={i * 40} stroke="#4a3a28" strokeWidth="0.5" opacity="0.3" />
        ))}

        {/* Compass rose in corner */}
        <g transform="translate(340 80) scale(0.5)" opacity="0.2">
          <circle cx="0" cy="0" r="40" fill="none" stroke="#c4a060" strokeWidth="2" />
          <polygon points="0,-35 5,0 0,35 -5,0" fill="#c4a060" />
          <polygon points="-35,0 0,5 35,0 0,-5" fill="#c4a060" />
          <text x="0" y="-42" textAnchor="middle" fill="#c4a060" fontSize="12">N</text>
        </g>

        {/* Dotted trail path connecting levels */}
        <path
          d="M 100 650 Q 150 580 200 550 Q 250 520 200 450 Q 150 380 200 320"
          stroke="#c4a060"
          strokeWidth="3"
          strokeDasharray="8 8"
          fill="none"
          opacity="0.3"
        />
      </svg>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Header */}
        <div className="px-4 pt-5 pb-3 flex items-center">
          <Button variant="ghost" size="sm" onClick={() => navigateTo('home')}>
            ← Back
          </Button>
          <h1 className="text-2xl font-bold text-amber-100 flex-1 text-center pr-12 tracking-wide">
            Treasure Map
          </h1>
        </div>

        {/* Character peeking */}
        <div className="flex justify-center -mb-4">
          <Character pose="idle" size={70} />
        </div>

        {/* Level cards */}
        <div className="flex-1 overflow-y-auto px-4 pb-6 pt-2">
          <div className="space-y-4">
            {levels.map((level, index) => {
              const unlocked = isLevelUnlocked(level.id)
              const progress = levelProgress[level.id]
              const stars = progress?.stars || 0
              const theme = levelThemes[level.id]

              return (
                <motion.button
                  key={level.id}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.15, type: 'spring', stiffness: 200 }}
                  onClick={() => unlocked && navigateTo('gameplay', level.id)}
                  disabled={!unlocked}
                  className={`w-full text-left rounded-2xl overflow-hidden transition-all active:scale-[0.97] ${
                    !unlocked ? 'opacity-40 grayscale' : ''
                  }`}
                >
                  <div className={`bg-gradient-to-r ${theme.bg} p-4 border border-white/10 rounded-2xl relative`}>
                    {/* Completed glow */}
                    {progress?.completed && (
                      <div className="absolute inset-0 rounded-2xl bg-amber-400/5 border border-amber-400/20" />
                    )}

                    <div className="flex items-center gap-4 relative">
                      {/* Level icon */}
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-3xl shrink-0 ${
                        progress?.completed
                          ? 'bg-amber-500/30 border-2 border-amber-400/50'
                          : unlocked
                            ? 'bg-white/10 border-2 border-white/20'
                            : 'bg-white/5 border border-white/10'
                      }`}>
                        {unlocked ? theme.icon : '🔒'}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className={`text-xs font-bold uppercase tracking-wider ${theme.color}`}>
                            {theme.label}
                          </span>
                          <span className="text-white/30 text-xs">Level {level.id}</span>
                        </div>
                        <h3 className="text-white font-bold text-base truncate">{level.title}</h3>

                        {/* Stars */}
                        {progress?.completed ? (
                          <div className="flex gap-1 mt-1.5">
                            {[1, 2, 3].map((s) => (
                              <span key={s} className={`text-base ${s <= stars ? 'text-amber-400' : 'text-white/15'}`}>
                                ★
                              </span>
                            ))}
                          </div>
                        ) : unlocked ? (
                          <p className="text-white/40 text-xs mt-1">{level.steps.length} steps to plan</p>
                        ) : (
                          <p className="text-white/30 text-xs mt-1">Complete previous level to unlock</p>
                        )}
                      </div>

                      {/* Treasure */}
                      {progress?.completed && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="text-3xl"
                        >
                          {treasureEmojis[level.treasure.icon] || '🪙'}
                        </motion.span>
                      )}
                    </div>
                  </div>
                </motion.button>
              )
            })}
          </div>

          {/* Map progress */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6 bg-amber-900/30 border border-amber-700/30 rounded-2xl p-4 text-center"
          >
            <p className="text-amber-400/60 text-xs font-bold uppercase tracking-wider mb-2">
              Ancient Map Pieces
            </p>
            <div className="flex justify-center gap-3">
              {levels.map((l) => (
                <motion.div
                  key={l.id}
                  className={`w-12 h-12 rounded-lg flex items-center justify-center text-lg ${
                    levelProgress[l.id]?.completed
                      ? 'bg-amber-500/30 border-2 border-amber-400/50'
                      : 'bg-white/5 border border-white/10'
                  }`}
                  animate={levelProgress[l.id]?.completed ? { scale: [1, 1.05, 1] } : {}}
                  transition={{ repeat: Infinity, duration: 3 }}
                >
                  {levelProgress[l.id]?.completed ? '📜' : '❓'}
                </motion.div>
              ))}
            </div>
            <p className="text-amber-300/30 text-xs mt-2">
              {Object.values(levelProgress).filter(p => p.completed).length} / {levels.length} pieces found
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
