import { useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useLunchRushStore from '../store'
import { DIFFICULTIES, getPalette } from '../data/config'
import sounds from '../sounds'
import OrderTicket from './OrderTicket'
import Tray from './Tray'
import FoodGrid from './FoodGrid'
import PackingAnimation from './PackingAnimation'

export default function GameScreen() {
  const difficulty = useLunchRushStore((s) => s.difficulty)
  const orders = useLunchRushStore((s) => s.orders)
  const currentOrderIndex = useLunchRushStore((s) => s.currentOrderIndex)
  const packedItems = useLunchRushStore((s) => s.packedItems)
  const lives = useLunchRushStore((s) => s.lives)
  const score = useLunchRushStore((s) => s.score)
  const orderStartTime = useLunchRushStore((s) => s.orderStartTime)
  const sessionStatus = useLunchRushStore((s) => s.sessionStatus)
  const tapFoodItem = useLunchRushStore((s) => s.tapFoodItem)
  const removeFromTray = useLunchRushStore((s) => s.removeFromTray)
  const submitOrder = useLunchRushStore((s) => s.submitOrder)
  const orderTimedOut = useLunchRushStore((s) => s.orderTimedOut)

  const config = DIFFICULTIES[difficulty]
  const currentOrder = orders[currentOrderIndex]
  const palette = useMemo(() => getPalette(difficulty), [difficulty])
  const packedItemIds = useMemo(() => new Set(packedItems.map((p) => p.id)), [packedItems])

  const handleTap = useCallback((item) => {
    sounds.tap()
    tapFoodItem(item)
  }, [tapFoodItem])

  const handleRemove = useCallback((id) => {
    sounds.remove()
    removeFromTray(id)
  }, [removeFromTray])

  const handleSubmit = useCallback(() => {
    if (packedItems.length > 0 && currentOrder) {
      const requiredIds = [...currentOrder.items.map((i) => i.id)].sort()
      const packedIds = [...packedItems.map((i) => i.id)].sort()
      const correct = requiredIds.length === packedIds.length && requiredIds.every((id, i) => id === packedIds[i])
      if (correct) {
        sounds.orderSuccess()
      } else {
        sounds.orderWrong()
      }
    }
    submitOrder()
  }, [submitOrder, packedItems, currentOrder])

  const handleTimeout = useCallback(() => {
    sounds.orderWrong()
    orderTimedOut()
  }, [orderTimedOut])

  if (!currentOrder || !config) return null

  const maxLives = config.lives

  const isFull = packedItems.length === currentOrder.items.length
  const canSubmit = packedItems.length > 0 && !sessionStatus

  return (
    <div className="h-full w-full flex flex-col bg-slate-950 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* HUD */}
      <div className="flex items-center justify-between px-4 py-2 shrink-0 relative z-10 bg-slate-950/80 backdrop-blur-sm border-b border-white/5">
        <div className="flex items-center gap-0.5">
          {Array.from({ length: maxLives }, (_, i) => (
            <motion.span
              key={i}
              animate={i >= lives ? { scale: [1, 0.5], opacity: [1, 0.3] } : {}}
              className="text-lg"
            >
              {i < lives ? '\u2764\uFE0F' : '\u{1F5A4}'}
            </motion.span>
          ))}
        </div>
        <div className="flex items-center gap-1.5 bg-white/5 rounded-full px-3 py-1">
          <span className="text-white/40 text-[10px] font-bold uppercase tracking-wider">
            Order
          </span>
          <span className="text-white text-xs font-bold tabular-nums">
            {currentOrderIndex + 1}/{orders.length}
          </span>
        </div>
        <div className="flex items-center gap-1.5 bg-white/5 rounded-full px-3 py-1">
          <span className="text-amber-400 text-xs">&#9733;</span>
          <span className="text-white font-bold text-sm tabular-nums">{score}</span>
        </div>
      </div>

      {/* Order ticket */}
      <AnimatePresence mode="wait">
        <OrderTicket
          key={`${currentOrder.id}-${orderStartTime}`}
          order={currentOrder}
          orderIndex={currentOrderIndex}
          totalOrders={orders.length}
          difficulty={difficulty}
          orderStartTime={orderStartTime}
          sessionStatus={sessionStatus}
          onTimeout={handleTimeout}
        />
      </AnimatePresence>

      {/* Tray / Lunchbox */}
      <div className="px-4 py-1 shrink-0 relative z-10">
        <Tray
          slots={currentOrder.items.length}
          packedItems={packedItems}
          sessionStatus={sessionStatus}
          onRemove={handleRemove}
        />
      </div>

      {/* Send button */}
      <div className="px-4 py-2 shrink-0 relative z-10">
        <motion.button
          whileTap={canSubmit ? { scale: 0.95 } : {}}
          onClick={handleSubmit}
          disabled={!canSubmit}
          className={`w-full py-3 rounded-xl font-bold text-base transition-all relative overflow-hidden ${
            isFull && canSubmit
              ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/30 active:from-orange-600 active:to-amber-600'
              : canSubmit
                ? 'bg-orange-500/40 text-white/60'
                : 'bg-white/5 text-white/20'
          }`}
        >
          {isFull && canSubmit && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
            />
          )}
          <span className="relative z-10">
            {isFull ? '🍱 Pack & Send!' : `Pack it up (${packedItems.length}/${currentOrder.items.length})`}
          </span>
        </motion.button>
      </div>

      {/* Food grid */}
      <FoodGrid
        palette={palette}
        packedItemIds={packedItemIds}
        onTap={handleTap}
      />

      {/* Packing animation overlay */}
      <AnimatePresence>
        {sessionStatus === 'packing' && (
          <PackingAnimation
            packedItems={packedItems}
            customerEmoji={currentOrder.customerEmoji}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
