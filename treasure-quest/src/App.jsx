import { AnimatePresence, motion } from 'framer-motion'
import useGameStore from './store/gameStore'
import HomeScreen from './components/screens/HomeScreen'
import LevelSelect from './components/screens/LevelSelect'
import GameplayScreen from './components/screens/GameplayScreen'
import ResultsScreen from './components/screens/ResultsScreen'

const screens = {
  home: HomeScreen,
  levelSelect: LevelSelect,
  gameplay: GameplayScreen,
  results: ResultsScreen,
}

export default function App() {
  const screen = useGameStore((s) => s.screen)
  const Screen = screens[screen] || HomeScreen

  return (
    <div className="h-full w-full overflow-hidden">
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
