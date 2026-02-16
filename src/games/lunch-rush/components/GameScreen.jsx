import { useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useLunchRushStore from '../store'
import { DIFFICULTIES, getPalette } from '../data/config'
import sounds from '../sounds'
import OrderTicket from './OrderTicket'
import Tray from './Tray'
import FoodGrid from './FoodGrid'

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

  return (
    <div className="h-full w-full flex flex-col bg-slate-950">
      {/* HUD */}
      <div className="flex items-center justify-between px-4 py-2 shrink-0">
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
        <span className="text-white/40 text-xs font-bold uppercase tracking-wider">
          {currentOrderIndex + 1}/{orders.length}
        </span>
        <div className="flex items-center gap-1">
          <span className="text-white/40 text-xs font-medium uppercase tracking-wider">Score</span>
          <span className="text-white font-bold text-lg tabular-nums">{score}</span>
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

      {/* Tray */}
      <div className="px-4 py-2 shrink-0">
        <Tray
          slots={currentOrder.items.length}
          packedItems={packedItems}
          sessionStatus={sessionStatus}
          onRemove={handleRemove}
        />
      </div>

      {/* Send button */}
      <div className="px-4 py-2 shrink-0">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleSubmit}
          disabled={packedItems.length === 0 || sessionStatus !== null}
          className={`w-full py-3 rounded-xl font-bold text-base transition-all ${
            packedItems.length === currentOrder.items.length && !sessionStatus
              ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25 active:bg-orange-600'
              : 'bg-white/10 text-white/30'
          }`}
        >
          SEND IT!
        </motion.button>
      </div>

      {/* Food grid */}
      <FoodGrid
        palette={palette}
        packedItemIds={packedItemIds}
        onTap={handleTap}
      />
    </div>
  )
}
