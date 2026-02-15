import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import useMemoryStore from '../store'
import { difficulties } from '../data/cards'
import Card from './Card'
import Button from '../../../components/ui/Button'

function formatTime(ms) {
  const seconds = Math.floor(ms / 1000)
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export default function GameBoard() {
  const {
    cards,
    difficulty,
    flippedIndices,
    matchedIds,
    moves,
    startTime,
    flipCard,
    goToDifficulty,
  } = useMemoryStore()

  const [elapsed, setElapsed] = useState(0)
  const config = difficulties[difficulty]

  useEffect(() => {
    if (!startTime) return
    const interval = setInterval(() => {
      setElapsed(Date.now() - startTime)
    }, 1000)
    return () => clearInterval(interval)
  }, [startTime])

  // Check if game is won (store handles transition, but stop timer visually)
  const isWon = matchedIds.length === config.pairs

  return (
    <div className="h-full w-full flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <Button variant="ghost" size="sm" onClick={goToDifficulty}>
          ← Back
        </Button>
        <div className="flex items-center gap-3">
          <div className="bg-white/10 text-white/70 text-xs px-2.5 py-1 rounded-lg">
            {moves} moves
          </div>
          <div className="bg-white/10 text-white/70 text-xs px-2.5 py-1 rounded-lg">
            {formatTime(isWon ? 0 : elapsed)}
          </div>
        </div>
      </div>

      {/* Card grid */}
      <div className="flex-1 flex items-center justify-center px-4 pb-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="grid gap-2 sm:gap-3 w-full max-w-sm"
          style={{
            gridTemplateColumns: `repeat(${config.cols}, 1fr)`,
          }}
        >
          {cards.map((card, index) => (
            <Card
              key={card.uid}
              card={card}
              index={index}
              isFlipped={flippedIndices.includes(index)}
              isMatched={matchedIds.includes(card.id)}
              onFlip={flipCard}
            />
          ))}
        </motion.div>
      </div>
    </div>
  )
}
