import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { DIFFICULTIES } from '../data/config'
import sounds from '../sounds'

export default function OrderTicket({ order, orderIndex, totalOrders, difficulty, orderStartTime, sessionStatus, onTimeout, packedItemIds }) {
  const config = DIFFICULTIES[difficulty]
  const [timeLeft, setTimeLeft] = useState(config.orderTime)
  const hasTimedOut = useRef(false)

  useEffect(() => {
    hasTimedOut.current = false
    setTimeLeft(config.orderTime)

    const interval = setInterval(() => {
      const elapsed = (Date.now() - orderStartTime) / 1000
      const remaining = Math.max(0, config.orderTime - elapsed)
      setTimeLeft(remaining)

      if (remaining <= 5 && remaining > 0 && Math.ceil(remaining) !== Math.ceil(remaining + 0.1)) {
        sounds.countdown()
      }

      if (remaining <= 0 && !hasTimedOut.current && !sessionStatus) {
        hasTimedOut.current = true
        clearInterval(interval)
        onTimeout()
      }
    }, 100)

    return () => clearInterval(interval)
  }, [orderStartTime, config.orderTime, onTimeout])

  const progress = timeLeft / config.orderTime
  const circumference = 2 * Math.PI * 18
  const strokeOffset = circumference * (1 - progress)
  const timerColor = timeLeft <= 4 ? '#ef4444' : timeLeft <= 8 ? '#f97316' : '#22c55e'

  const collectedCount = packedItemIds ? order.items.filter((i) => packedItemIds.has(i.id)).length : 0
  const allCollected = collectedCount === order.items.length

  return (
    <motion.div
      key={order.id}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="px-4 py-3"
    >
      <div className={`bg-white/5 border rounded-2xl p-3 transition-colors duration-300 ${
        allCollected ? 'border-green-500/30' : 'border-white/10'
      }`}>
        <div className="flex items-center gap-3">
          {/* Customer + countdown ring */}
          <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
            <svg className="absolute inset-0" viewBox="0 0 40 40">
              <circle cx="20" cy="20" r="18" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
              <circle
                cx="20" cy="20" r="18"
                fill="none"
                stroke={timerColor}
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeOffset}
                transform="rotate(-90 20 20)"
                style={{ transition: 'stroke-dashoffset 0.1s linear' }}
              />
            </svg>
            <span className="text-3xl">{order.customerEmoji}</span>
          </div>

          {/* Order details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-white/40 text-sm font-bold uppercase tracking-wider">
                Order {orderIndex + 1}/{totalOrders}
              </span>
              <span className="text-white/30 text-sm">{Math.ceil(timeLeft)}s</span>
              {packedItemIds && (
                <span className="text-white/20 text-sm ml-auto">
                  {collectedCount}/{order.items.length}
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {order.items.map((item) => {
                const collected = packedItemIds?.has(item.id)
                return (
                  <motion.span
                    key={item.id}
                    animate={collected ? { scale: [1, 1.15, 1] } : {}}
                    transition={{ duration: 0.25 }}
                    className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 transition-all duration-200 ${
                      collected
                        ? 'bg-green-500/20 border border-green-500/40'
                        : 'bg-white/10'
                    }`}
                  >
                    <span className="text-xl">{item.emoji}</span>
                    <span className={`text-base font-medium transition-all ${
                      collected ? 'text-white/40 line-through' : 'text-white/70'
                    }`}>{item.label}</span>
                    {collected && <span className="text-green-400 text-sm">&#10003;</span>}
                  </motion.span>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
