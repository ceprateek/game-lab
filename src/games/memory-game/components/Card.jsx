import { motion } from 'framer-motion'

export default function Card({ card, index, isFlipped, isMatched, onFlip }) {
  const showFace = isFlipped || isMatched

  return (
    <motion.button
      onClick={() => onFlip(index)}
      disabled={isFlipped || isMatched}
      className="relative w-full aspect-square perspective-[600px]"
      whileTap={!showFace ? { scale: 0.95 } : {}}
    >
      <motion.div
        className="w-full h-full relative"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: showFace ? 180 : 0 }}
        transition={{ duration: 0.4, type: 'spring', stiffness: 300, damping: 25 }}
      >
        {/* Back of card (question mark side) */}
        <div
          className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 border-2 border-indigo-400/30 flex items-center justify-center shadow-lg"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <span className="text-white/40 text-2xl font-bold select-none">?</span>
          <div className="absolute inset-1 rounded-lg border border-white/10" />
        </div>

        {/* Front of card (emoji side) */}
        <div
          className={`absolute inset-0 rounded-xl flex items-center justify-center shadow-lg ${
            isMatched
              ? 'bg-gradient-to-br from-emerald-500/30 to-emerald-700/30 border-2 border-emerald-400/50'
              : 'bg-gradient-to-br from-slate-700 to-slate-800 border-2 border-white/20'
          }`}
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <motion.span
            className="text-3xl sm:text-4xl select-none"
            initial={false}
            animate={isMatched ? { scale: [1, 1.3, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            {card.emoji}
          </motion.span>
        </div>
      </motion.div>
    </motion.button>
  )
}
