import { useCallback, useMemo, useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useLunchRushStore from '../store'
import { DIFFICULTIES, getPalette } from '../data/config'
import sounds from '../sounds'
import OrderTicket from './OrderTicket'
import Tray from './Tray'
import FoodGrid from './FoodGrid'
import PackingAnimation from './PackingAnimation'
import Tutorial from './Tutorial'

export default function GameScreen() {
  const difficulty = useLunchRushStore((s) => s.difficulty)
  const orders = useLunchRushStore((s) => s.orders)
  const currentOrderIndex = useLunchRushStore((s) => s.currentOrderIndex)
  const packedItems = useLunchRushStore((s) => s.packedItems)
  const lives = useLunchRushStore((s) => s.lives)
  const score = useLunchRushStore((s) => s.score)
  const orderStartTime = useLunchRushStore((s) => s.orderStartTime)
  const sessionStatus = useLunchRushStore((s) => s.sessionStatus)
  const streak = useLunchRushStore((s) => s.streak)
  const comboMultiplier = useLunchRushStore((s) => s.comboMultiplier)
  const tapFoodItem = useLunchRushStore((s) => s.tapFoodItem)
  const removeFromTray = useLunchRushStore((s) => s.removeFromTray)
  const submitOrder = useLunchRushStore((s) => s.submitOrder)
  const orderTimedOut = useLunchRushStore((s) => s.orderTimedOut)

  const config = DIFFICULTIES[difficulty]
  const currentOrder = orders[currentOrderIndex]
  const palette = useMemo(() => getPalette(difficulty), [difficulty])
  const packedItemIds = useMemo(() => new Set(packedItems.map((p) => p.id)), [packedItems])

  // Tutorial
  const [showTutorial, setShowTutorial] = useState(() => {
    return !localStorage.getItem('lunch-rush-tutorial-seen')
  })

  // Score popup
  const [scorePopup, setScorePopup] = useState(null)
  const prevScore = useRef(score)

  useEffect(() => {
    if (sessionStatus === 'success' && score > prevScore.current) {
      setScorePopup({ points: score - prevScore.current, key: Date.now() })
    }
    prevScore.current = score
  }, [sessionStatus, score])

  const handleTutorialComplete = useCallback(() => {
    setShowTutorial(false)
    // Reset timer so player gets full time after tutorial
    useLunchRushStore.setState({ orderStartTime: Date.now() })
  }, [])

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
    // Auto-submit if the tray is full when time runs out
    const { packedItems: currentPacked, orders: currentOrders, currentOrderIndex: idx } = useLunchRushStore.getState()
    const order = currentOrders[idx]
    if (order && currentPacked.length === order.items.length) {
      const requiredIds = [...order.items.map((i) => i.id)].sort()
      const packedIds = [...currentPacked.map((i) => i.id)].sort()
      const correct = requiredIds.length === packedIds.length && requiredIds.every((id, i) => id === packedIds[i])
      if (correct) {
        sounds.orderSuccess()
      } else {
        sounds.orderWrong()
      }
      useLunchRushStore.getState().submitOrder()
      return
    }
    sounds.orderWrong()
    orderTimedOut()
  }, [orderTimedOut])

  if (!currentOrder || !config) return null

  const maxLives = config.lives
  const isFull = packedItems.length === currentOrder.items.length
  const canSubmit = packedItems.length > 0 && !sessionStatus

  return (
    <div className="h-full w-full flex flex-col bg-gradient-to-b from-slate-950 via-amber-950/20 to-slate-950 relative overflow-hidden">
      {/* Kitchen ambient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-900/10 via-transparent to-amber-900/10" />
        <div className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>
      {/* Warm glow behind HUD */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* HUD */}
      <div className="flex items-center justify-between px-3 py-2 shrink-0 relative z-10 bg-slate-950/60 backdrop-blur-sm border-b border-white/5">
        <div className="flex items-center gap-0.5">
          {Array.from({ length: maxLives }, (_, i) => (
            <motion.span
              key={i}
              animate={i >= lives ? { scale: [1, 0.5], opacity: [1, 0.3] } : {}}
              className="text-2xl"
            >
              {i < lives ? '\u2764\uFE0F' : '\u{1F5A4}'}
            </motion.span>
          ))}
        </div>

        {/* Streak badge */}
        <AnimatePresence>
          {streak >= 2 && (
            <motion.div
              key={streak}
              initial={{ scale: 0, rotate: -15 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0 }}
              className="flex items-center gap-1 bg-gradient-to-r from-orange-500/30 to-red-500/30 border border-orange-500/40 rounded-full px-2 py-0.5"
            >
              <span className="text-base">{streak >= 5 ? '\u{1F525}' : '\u26A1'}</span>
              <span className="text-orange-300 text-sm font-bold">{comboMultiplier}x</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center gap-1.5 bg-white/5 rounded-full px-3 py-1">
          <span className="text-white/40 text-sm font-bold uppercase tracking-wider">
            Order
          </span>
          <span className="text-white text-base font-bold tabular-nums">
            {currentOrderIndex + 1}/{orders.length}
          </span>
        </div>

        <div className="relative flex items-center gap-1.5 bg-white/5 rounded-full px-3 py-1">
          <span className="text-amber-400 text-base">&#9733;</span>
          <span className="text-white font-bold text-lg tabular-nums">{score}</span>
          {/* Score popup */}
          <AnimatePresence>
            {scorePopup && (
              <motion.div
                key={scorePopup.key}
                initial={{ opacity: 1, y: 0 }}
                animate={{ opacity: 0, y: -28 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
                onAnimationComplete={() => setScorePopup(null)}
                className="absolute -top-7 right-0 text-amber-300 text-base font-bold whitespace-nowrap"
              >
                +{scorePopup.points}
              </motion.div>
            )}
          </AnimatePresence>
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
          packedItemIds={packedItemIds}
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
          className={`w-full py-3.5 rounded-xl font-bold text-lg transition-all relative overflow-hidden ${
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
            {isFull ? '\u{1F371} Pack & Send!' : `Pack it up (${packedItems.length}/${currentOrder.items.length})`}
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
            streak={streak}
          />
        )}
      </AnimatePresence>

      {/* Tutorial overlay */}
      <AnimatePresence>
        {showTutorial && (
          <Tutorial onComplete={handleTutorialComplete} />
        )}
      </AnimatePresence>
    </div>
  )
}
