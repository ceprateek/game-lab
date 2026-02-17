import { motion, AnimatePresence } from 'framer-motion'

export default function Tray({ slots, packedItems, sessionStatus, onRemove }) {
  return (
    <div className="relative">
      {/* Lunchbox label */}
      <div className="flex items-center gap-1.5 mb-1.5 px-1">
        <span className="text-base">🍱</span>
        <span className="text-white/50 text-[11px] font-bold uppercase tracking-wider">
          Lunch Box
        </span>
        <span className="text-white/25 text-[10px] ml-auto">
          {packedItems.length}/{slots} items
        </span>
      </div>

      {/* Lunchbox container */}
      <div
        className={`relative rounded-2xl border-2 p-3 transition-all duration-300 ${
          sessionStatus === 'success'
            ? 'bg-green-900/30 border-green-500/60 shadow-lg shadow-green-500/20'
            : sessionStatus === 'error'
              ? 'bg-red-900/30 border-red-500/60 shadow-lg shadow-red-500/20'
              : 'bg-amber-950/20 border-amber-700/30'
        }`}
      >
        {/* Lunchbox inner divider lines */}
        <div className="absolute inset-3 pointer-events-none">
          {slots > 1 && Array.from({ length: slots - 1 }, (_, i) => (
            <div
              key={i}
              className="absolute top-0 bottom-0 border-r border-dashed border-white/5"
              style={{ left: `${((i + 1) / slots) * 100}%` }}
            />
          ))}
        </div>

        {/* Item slots */}
        <div className="flex items-stretch justify-center gap-2">
          {Array.from({ length: slots }, (_, i) => {
            const item = packedItems[i]
            return (
              <motion.div
                key={i}
                animate={
                  sessionStatus === 'error'
                    ? { x: [0, -4, 4, -4, 4, 0] }
                    : sessionStatus === 'success'
                      ? { scale: [1, 1.08, 1] }
                      : {}
                }
                transition={{ duration: 0.4 }}
                className={`flex-1 min-w-0 aspect-square max-w-[72px] rounded-xl flex flex-col items-center justify-center relative transition-all duration-200 ${
                  item
                    ? 'bg-white/10 border border-white/20 shadow-inner'
                    : 'border-2 border-dashed border-white/10 bg-white/[0.02]'
                }`}
              >
                <AnimatePresence mode="popLayout">
                  {item ? (
                    <motion.button
                      key={item.id}
                      initial={{ scale: 0, rotate: -15, y: 20 }}
                      animate={{ scale: 1, rotate: 0, y: 0 }}
                      exit={{ scale: 0, rotate: 15, y: -20, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 350, damping: 18 }}
                      onClick={() => onRemove(item.id)}
                      className="w-full h-full flex flex-col items-center justify-center gap-0.5"
                    >
                      <span className="text-2xl leading-none drop-shadow-md">{item.emoji}</span>
                      <span className="text-white/50 text-[8px] font-medium truncate w-full text-center px-0.5">
                        {item.label}
                      </span>
                      {/* Remove badge */}
                      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500/80 rounded-full flex items-center justify-center shadow-sm">
                        <span className="text-white text-[10px] font-bold">&times;</span>
                      </span>
                    </motion.button>
                  ) : (
                    <motion.div
                      key={`empty-${i}`}
                      className="flex flex-col items-center justify-center gap-0.5 opacity-20"
                    >
                      <span className="text-lg leading-none">?</span>
                      <span className="text-white/40 text-[8px]">empty</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
