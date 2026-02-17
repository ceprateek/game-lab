import { motion } from 'framer-motion'

export default function PackingAnimation({ packedItems, customerEmoji }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
    >
      <div className="flex flex-col items-center">
        {/* Lunchbox closing */}
        <motion.div
          className="relative"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 0.4 }}
        >
          {/* Lid */}
          <motion.div
            initial={{ rotateX: 80, originY: '100%' }}
            animate={{ rotateX: 0 }}
            transition={{ delay: 0.1, duration: 0.5, ease: 'easeOut' }}
            className="relative z-10 bg-gradient-to-b from-amber-600 to-amber-700 rounded-t-2xl w-52 h-8 border-2 border-amber-500/60 flex items-center justify-center"
            style={{ perspective: '200px' }}
          >
            <div className="w-10 h-2 bg-amber-400/40 rounded-full" />
          </motion.div>

          {/* Box body with items */}
          <div className="bg-gradient-to-b from-amber-700 to-amber-800 rounded-b-2xl w-52 border-2 border-t-0 border-amber-600/60 p-3">
            <div className="flex items-center justify-center gap-2 flex-wrap">
              {packedItems.map((item, i) => (
                <motion.span
                  key={item.id}
                  initial={{ scale: 1 }}
                  animate={{ scale: [1, 0.8], y: [0, 2] }}
                  transition={{ delay: 0.3 + i * 0.08, duration: 0.3 }}
                  className="text-2xl drop-shadow-lg"
                >
                  {item.emoji}
                </motion.span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Sending animation — box slides to customer */}
        <motion.div
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: [0, 1, 1, 0], y: [20, 0, 0, -60], scale: [0.9, 1, 1, 0.7] }}
          transition={{ delay: 0.9, duration: 0.8, ease: 'easeInOut' }}
          className="mt-6 flex flex-col items-center gap-2"
        >
          <span className="text-4xl">{customerEmoji}</span>
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2, duration: 0.3 }}
            className="bg-green-500/20 border border-green-500/40 rounded-full px-4 py-1.5"
          >
            <span className="text-green-400 text-sm font-bold">Enjoy!</span>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  )
}
