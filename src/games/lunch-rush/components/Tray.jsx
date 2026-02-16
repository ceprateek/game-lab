import { motion, AnimatePresence } from 'framer-motion'

export default function Tray({ slots, packedItems, sessionStatus, onRemove }) {
  return (
    <div
      className={`flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border transition-colors ${
        sessionStatus === 'success'
          ? 'bg-green-500/10 border-green-500/40'
          : sessionStatus === 'error'
            ? 'bg-red-500/10 border-red-500/40'
            : 'bg-white/5 border-white/10'
      }`}
    >
      {Array.from({ length: slots }, (_, i) => {
        const item = packedItems[i]
        return (
          <motion.div
            key={i}
            animate={
              sessionStatus === 'error'
                ? { x: [0, -4, 4, -4, 4, 0] }
                : sessionStatus === 'success'
                  ? { scale: [1, 1.1, 1] }
                  : {}
            }
            transition={{ duration: 0.4 }}
            className={`w-14 h-14 rounded-xl flex items-center justify-center relative ${
              item ? 'bg-white/10 border border-white/20' : 'border-2 border-dashed border-white/15'
            }`}
          >
            <AnimatePresence mode="popLayout">
              {item && (
                <motion.button
                  key={item.id}
                  initial={{ scale: 0, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 10 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                  onClick={() => onRemove(item.id)}
                  className="w-full h-full flex items-center justify-center"
                >
                  <span className="text-2xl">{item.emoji}</span>
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-white/60 text-[9px] font-bold">&times;</span>
                  </span>
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        )
      })}
    </div>
  )
}
