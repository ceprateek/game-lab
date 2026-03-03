import { AnimatePresence, motion } from 'framer-motion'
import useBubbleShooterStore from './store'
import useAppStore from '../../store/appStore'
import GameScreen from './components/GameScreen'
import ResultsScreen from './components/ResultsScreen'
import Button from '../../components/ui/Button'
import { difficulties } from './data/config'

function DifficultySelect() {
  const selectDifficulty = useBubbleShooterStore((s) => s.selectDifficulty)
  const bestScores = useBubbleShooterStore((s) => s.bestScores)
  const backToMenu = useAppStore((s) => s.backToMenu)

  const opts = [
    { key: 'easy', gradient: 'from-cyan-600/20 to-cyan-900/30', border: 'border-cyan-500/30', accent: 'text-cyan-400' },
    { key: 'medium', gradient: 'from-violet-600/20 to-violet-900/30', border: 'border-violet-500/30', accent: 'text-violet-400' },
    { key: 'hard', gradient: 'from-red-600/20 to-red-900/30', border: 'border-red-500/30', accent: 'text-red-400' },
  ]

  return (
    <div className="h-full w-full relative overflow-hidden">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="bs-bg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="50%" stopColor="#0c2340" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
          <radialGradient id="bs-glow" cx="0.5" cy="0.35" r="0.4">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="400" height="800" fill="url(#bs-bg)" />
        <rect width="400" height="800" fill="url(#bs-glow)" />
      </svg>

      <div className="relative z-10 h-full flex flex-col px-6 pt-5">
        <div className="flex items-center mb-8">
          <Button variant="ghost" size="sm" onClick={backToMenu}>← Games</Button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.div
            animate={{ y: [0, -6, 0], scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            className="text-5xl mb-3"
          >
            🫧
          </motion.div>
          <h1 className="text-3xl font-extrabold text-white mb-1">Bubble Shooter</h1>
          <p className="text-cyan-300/50 text-sm">Pop &amp; Match</p>
        </motion.div>

        <div className="flex-1 flex flex-col justify-center space-y-4 max-w-sm mx-auto w-full">
          {opts.map((opt, i) => {
            const cfg = difficulties[opt.key]
            const best = bestScores[opt.key]
            return (
              <motion.button
                key={opt.key}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.1, type: 'spring', stiffness: 200 }}
                onClick={() => selectDifficulty(opt.key)}
                className="w-full text-left active:scale-[0.97] transition-transform"
              >
                <div className={`bg-gradient-to-r ${opt.gradient} border ${opt.border} rounded-2xl p-4`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-bold text-lg">{cfg.label}</h3>
                      <p className="text-white/40 text-xs">{cfg.desc}</p>
                    </div>
                    <div className="text-right">
                      {best ? (
                        <div>
                          <div className="flex gap-0.5 justify-end">
                            {[1, 2, 3].map((s) => (
                              <span key={s} className={`text-sm ${s <= best.stars ? 'text-amber-400' : 'text-white/15'}`}>★</span>
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

export default function BubbleShooterApp() {
  const screen = useBubbleShooterStore((s) => s.screen)

  return (
    <div className="h-full w-full overflow-hidden relative bg-slate-950">
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
