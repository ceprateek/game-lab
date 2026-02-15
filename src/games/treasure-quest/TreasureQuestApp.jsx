import { AnimatePresence, motion } from 'framer-motion'
import useGameStore from './store'
import useAppStore from '../../store/appStore'
import HomeScreen from './components/screens/HomeScreen'
import LevelSelect from './components/screens/LevelSelect'
import GameplayScreen from './components/screens/GameplayScreen'
import ResultsScreen from './components/screens/ResultsScreen'
import Button from '../../components/ui/Button'

const screens = {
  home: HomeScreen,
  levelSelect: LevelSelect,
  gameplay: GameplayScreen,
  results: ResultsScreen,
}

export default function TreasureQuestApp() {
  const screen = useGameStore((s) => s.screen)
  const backToMenu = useAppStore((s) => s.backToMenu)
  const Screen = screens[screen] || HomeScreen

  return (
    <div className="h-full w-full overflow-hidden relative">
      {/* Back to Games button - only on home screen */}
      {screen === 'home' && (
        <div className="absolute top-4 left-4 z-50">
          <Button variant="ghost" size="sm" onClick={backToMenu}>
            ← Games
          </Button>
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={screen}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="h-full w-full"
        >
          <Screen />
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
