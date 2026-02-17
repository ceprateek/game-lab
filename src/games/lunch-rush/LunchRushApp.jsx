import { AnimatePresence, motion } from 'framer-motion'
import useLunchRushStore from './store'
import useAppStore from '../../store/appStore'
import GameScreen from './components/GameScreen'
import ResultsScreen from './components/ResultsScreen'
import Button from '../../components/ui/Button'

function DifficultySelect() {
  const selectDifficulty = useLunchRushStore((s) => s.selectDifficulty)
  const bestScores = useLunchRushStore((s) => s.bestScores)
  const backToMenu = useAppStore((s) => s.backToMenu)

  const difficultyOptions = [
    {
      key: 'easy',
      label: 'Easy',
      desc: '5 orders, 20s each, 12 items',
      color: 'from-emerald-600/20 to-emerald-900/30',
      border: 'border-emerald-500/30',
      accent: 'text-emerald-400',
    },
    {
      key: 'medium',
      label: 'Medium',
      desc: '8 orders, 15s each, 18 items',
      color: 'from-amber-600/20 to-amber-900/30',
      border: 'border-amber-500/30',
      accent: 'text-amber-400',
    },
    {
      key: 'hard',
      label: 'Hard',
      desc: '12 orders, 10s each, all items',
      color: 'from-red-600/20 to-red-900/30',
      border: 'border-red-500/30',
      accent: 'text-red-400',
    },
  ]

  return (
    <div className="h-full w-full relative overflow-hidden">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="lr-bg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="50%" stopColor="#7c2d12" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
          <radialGradient id="lr-glow" cx="0.5" cy="0.35" r="0.4">
            <stop offset="0%" stopColor="#f97316" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="400" height="800" fill="url(#lr-bg)" />
        <rect width="400" height="800" fill="url(#lr-glow)" />
      </svg>

      {/* Floating food decorations */}
      {['\u{1F34E}', '\u{1F96A}', '\u{1F964}', '\u{1F371}'].map((e, i) => (
        <motion.div
          key={i}
          className="absolute text-2xl opacity-[0.12] pointer-events-none"
          style={{ left: `${15 + i * 22}%`, top: `${60 + i * 8}%` }}
          animate={{ y: [0, -15, 0], rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 4 + i, ease: 'easeInOut' }}
        >
          {e}
        </motion.div>
      ))}

      <div className="relative z-10 h-full flex flex-col px-6 pt-5">
        <div className="flex items-center mb-8">
          <Button variant="ghost" size="sm" onClick={backToMenu}>
            &larr; Games
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            className="text-5xl mb-3"
          >
            {'\u{1F371}'}
          </motion.div>
          <h1 className="text-3xl font-extrabold text-white mb-1">Lunch Rush</h1>
          <p className="text-orange-300/50 text-sm">Order Up!</p>
        </motion.div>

        <div className="flex-1 flex flex-col justify-center space-y-4 max-w-sm mx-auto w-full">
          {difficultyOptions.map((opt, index) => {
            const best = bestScores[opt.key]
            return (
              <motion.button
                key={opt.key}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.1, type: 'spring', stiffness: 200 }}
                onClick={() => selectDifficulty(opt.key)}
                className="w-full text-left active:scale-[0.97] transition-transform"
              >
                <div className={`bg-gradient-to-r ${opt.color} border ${opt.border} rounded-2xl p-4`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-bold text-lg">{opt.label}</h3>
                      <p className="text-white/40 text-xs">{opt.desc}</p>
                    </div>
                    <div className="text-right">
                      {best ? (
                        <div>
                          <div className="flex gap-0.5 justify-end">
                            {[1, 2, 3].map((s) => (
                              <span key={s} className={`text-sm ${s <= best.stars ? 'text-amber-400' : 'text-white/15'}`}>
                                {'\u2605'}
                              </span>
                            ))}
                          </div>
                          <p className="text-white/30 text-xs">{best.score} pts</p>
                        </div>
                      ) : (
                        <span className={`${opt.accent} text-xs font-medium`}>New</span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.button>
            )
          })}
        </div>

        <div className="pb-8" />
      </div>
    </div>
  )
}

export default function LunchRushApp() {
  const screen = useLunchRushStore((s) => s.screen)

  return (
    <div className="h-full w-full overflow-hidden relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={screen}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="h-full w-full relative z-10"
        >
          {screen === 'difficulty' && <DifficultySelect />}
          {screen === 'playing' && <GameScreen />}
          {screen === 'results' && <ResultsScreen />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
