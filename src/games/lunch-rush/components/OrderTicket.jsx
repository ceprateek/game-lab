import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { DIFFICULTIES } from '../data/config'
import sounds from '../sounds'

export default function OrderTicket({ order, orderIndex, totalOrders, difficulty, orderStartTime, sessionStatus, onTimeout }) {
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

      if (remaining <= 0 && !hasTimedOut.current) {
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

  return (
    <motion.div
      key={order.id}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="px-4 py-3"
    >
      <div className="bg-white/5 border border-white/10 rounded-2xl p-3">
        <div className="flex items-center gap-3">
          {/* Customer + countdown ring */}
          <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
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
            <span className="text-2xl">{order.customerEmoji}</span>
          </div>

          {/* Order details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-white/40 text-[10px] font-bold uppercase tracking-wider">
                Order {orderIndex + 1}/{totalOrders}
              </span>
              <span className="text-white/30 text-[10px]">{Math.ceil(timeLeft)}s</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {order.items.map((item) => (
                <span
                  key={item.id}
                  className="inline-flex items-center gap-1 bg-white/10 rounded-lg px-2 py-1"
                >
                  <span className="text-sm">{item.emoji}</span>
                  <span className="text-white/70 text-[11px] font-medium">{item.label}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
