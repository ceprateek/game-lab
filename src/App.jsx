import { AnimatePresence, motion } from 'framer-motion'
import useAppStore from './store/appStore'
import GameSelector from './games/GameSelector'
import TreasureQuestApp from './games/treasure-quest/TreasureQuestApp'
import MemoryGameApp from './games/memory-game/MemoryGameApp'

const gameComponents = {
  'treasure-quest': TreasureQuestApp,
  'memory-game': MemoryGameApp,
}

export default function App() {
  const currentGame = useAppStore((s) => s.currentGame)
  const GameComponent = gameComponents[currentGame]

  return (
    <div className="h-full w-full overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentGame || 'selector'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="h-full w-full"
        >
          {GameComponent ? <GameComponent /> : <GameSelector />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
