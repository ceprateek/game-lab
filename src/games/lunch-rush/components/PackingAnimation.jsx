import { useState } from 'react'
import { motion } from 'framer-motion'

const REACTIONS = [
  { emoji: '\u{1F60B}', text: 'Yummy!' },
  { emoji: '\u{1F929}', text: 'Perfect!' },
  { emoji: '\u{1F60A}', text: 'Thanks!' },
  { emoji: '\u{1F973}', text: 'Awesome!' },
  { emoji: '\u{1F44C}', text: 'Delicious!' },
]

const SPARKLE_COLORS = ['#f97316', '#eab308', '#ef4444', '#ec4899', '#a855f7', '#22c55e']

export default function PackingAnimation({ packedItems, customerEmoji, streak }) {
  const [reaction] = useState(() => REACTIONS[Math.floor(Math.random() * REACTIONS.length)])
  const showSparkles = streak >= 3

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
    >
      <div className="flex flex-col items-center">
        {/* Lunchbox closing */}
        <motion.div
          className="relative"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 0.6 }}
        >
          {/* Lid */}
          <motion.div
            initial={{ rotateX: 80, originY: '100%' }}
            animate={{ rotateX: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: 'easeOut' }}
            className="relative z-10 bg-gradient-to-b from-amber-600 to-amber-700 rounded-t-2xl w-64 h-10 border-2 border-amber-500/60 flex items-center justify-center"
            style={{ perspective: '200px' }}
          >
            <div className="w-12 h-2.5 bg-amber-400/40 rounded-full" />
          </motion.div>

          {/* Box body with items */}
          <div className="bg-gradient-to-b from-amber-700 to-amber-800 rounded-b-2xl w-64 border-2 border-t-0 border-amber-600/60 p-4">
            <div className="flex items-center justify-center gap-3 flex-wrap">
              {packedItems.map((item, i) => (
                <motion.span
                  key={item.id}
                  initial={{ scale: 1 }}
                  animate={{ scale: [1, 0.8], y: [0, 3] }}
                  transition={{ delay: 0.5 + i * 0.12, duration: 0.4 }}
                  className="text-3xl drop-shadow-lg"
                >
                  {item.emoji}
                </motion.span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Customer reaction */}
        <motion.div
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: [0, 1, 1, 1], y: [30, 0, 0, 0], scale: [0.8, 1, 1, 1] }}
          transition={{ delay: 1.5, duration: 1.2, ease: 'easeInOut' }}
          className="mt-8 flex flex-col items-center gap-3 relative"
        >
          <span className="text-5xl">{customerEmoji}</span>

          {/* Sparkle burst for streaks */}
          {showSparkles && Array.from({ length: 8 }, (_, i) => {
            const angle = (i / 8) * Math.PI * 2
            const dist = 60 + Math.random() * 25
            return (
              <motion.div
                key={i}
                className="absolute w-2.5 h-2.5 rounded-full"
                style={{
                  backgroundColor: SPARKLE_COLORS[i % SPARKLE_COLORS.length],
                  top: '50%',
                  left: '50%',
                }}
                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                animate={{
                  x: Math.cos(angle) * dist,
                  y: Math.sin(angle) * dist,
                  opacity: 0,
                  scale: 0.3,
                }}
                transition={{ delay: 2.0 + i * 0.04, duration: 0.6, ease: 'easeOut' }}
              />
            )
          })}

          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 2.2, duration: 0.4, type: 'spring', stiffness: 250 }}
            className="bg-green-500/20 border border-green-500/40 rounded-full px-5 py-2 flex items-center gap-2"
          >
            <span className="text-xl">{reaction.emoji}</span>
            <span className="text-green-400 text-base font-bold">{reaction.text}</span>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  )
}
