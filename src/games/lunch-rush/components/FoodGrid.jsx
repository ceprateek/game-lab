import { motion } from 'framer-motion'
import { GROUPS } from '../data/config'

const GROUP_BG = {
  protein: 'from-orange-500/10 to-orange-900/5',
  grain: 'from-yellow-500/10 to-yellow-900/5',
  fruit: 'from-pink-500/10 to-pink-900/5',
  vegetable: 'from-green-500/10 to-green-900/5',
  drink: 'from-blue-500/10 to-blue-900/5',
}

const GROUP_BORDER = {
  protein: 'border-orange-500/20',
  grain: 'border-yellow-500/20',
  fruit: 'border-pink-500/20',
  vegetable: 'border-green-500/20',
  drink: 'border-blue-500/20',
}

export default function FoodGrid({ palette, packedItemIds, onTap }) {
  const grouped = GROUPS.map((g) => ({
    ...g,
    items: palette.filter((f) => f.group === g.id),
  })).filter((g) => g.items.length > 0)

  return (
    <div className="flex-1 overflow-y-auto px-3 pb-4 relative z-10">
      {grouped.map((group) => (
        <div key={group.id} className="mb-3">
          <div className="flex items-center gap-1.5 mb-1.5 px-1">
            <div
              className="w-2.5 h-2.5 rounded-full shadow-sm"
              style={{ backgroundColor: group.color, boxShadow: `0 0 6px ${group.color}40` }}
            />
            <span className="text-white/50 text-sm font-bold uppercase tracking-wider">{group.label}</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {group.items.map((item) => {
              const isPacked = packedItemIds.has(item.id)
              return (
                <motion.button
                  key={item.id}
                  whileTap={!isPacked ? { scale: 0.88 } : {}}
                  onClick={() => !isPacked && onTap(item)}
                  disabled={isPacked}
                  className={`flex flex-col items-center justify-center rounded-xl py-3.5 px-2 border transition-all duration-200 ${
                    isPacked
                      ? 'bg-white/[0.02] border-white/5 opacity-25 scale-95'
                      : `bg-gradient-to-b ${GROUP_BG[group.id]} ${GROUP_BORDER[group.id]} active:bg-white/15 shadow-sm`
                  }`}
                >
                  <span className={`text-4xl leading-none mb-1 transition-transform ${isPacked ? 'grayscale' : 'drop-shadow-md'}`}>
                    {item.emoji}
                  </span>
                  <span className={`text-sm font-medium truncate w-full text-center ${
                    isPacked ? 'text-white/25' : 'text-white/70'
                  }`}>
                    {item.label}
                  </span>
                  {isPacked && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute text-green-400 text-sm font-bold"
                    >
                      ✓
                    </motion.span>
                  )}
                </motion.button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
