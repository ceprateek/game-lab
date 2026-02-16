import { motion } from 'framer-motion'
import { GROUPS } from '../data/config'

export default function FoodGrid({ palette, packedItemIds, onTap }) {
  const grouped = GROUPS.map((g) => ({
    ...g,
    items: palette.filter((f) => f.group === g.id),
  })).filter((g) => g.items.length > 0)

  return (
    <div className="flex-1 overflow-y-auto px-3 pb-4">
      {grouped.map((group) => (
        <div key={group.id} className="mb-3">
          <div className="flex items-center gap-1.5 mb-1.5 px-1">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: group.color }} />
            <span className="text-white/40 text-[10px] font-bold uppercase tracking-wider">{group.label}</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {group.items.map((item) => {
              const isPacked = packedItemIds.has(item.id)
              return (
                <motion.button
                  key={item.id}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => !isPacked && onTap(item)}
                  disabled={isPacked}
                  className={`flex flex-col items-center justify-center rounded-xl py-2.5 px-1 border transition-all ${
                    isPacked
                      ? 'bg-white/5 border-white/5 opacity-30'
                      : 'bg-white/10 border-white/10 active:bg-white/20'
                  }`}
                >
                  <span className="text-2xl leading-none mb-0.5">{item.emoji}</span>
                  <span className="text-white/60 text-[10px] font-medium truncate w-full text-center">{item.label}</span>
                </motion.button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
