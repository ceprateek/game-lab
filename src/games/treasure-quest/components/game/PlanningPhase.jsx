import { useState } from 'react'
import { DndContext, closestCenter, PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { motion, AnimatePresence } from 'framer-motion'
import useGameStore from '../../store'
import { getLevelById } from '../../data/levels'
import Button from '../../../../components/ui/Button'
import Character from '../illustrations/Character'

function SortableStep({ id, text, index, onRemove }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 0,
  }

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      className={`flex items-center gap-2 ${isDragging ? 'relative z-50' : ''}`}
    >
      <span className="text-amber-300/50 text-xs font-bold w-5 text-right">{index + 1}</span>
      <div
        {...attributes}
        {...listeners}
        className={`flex-1 flex items-center gap-3 bg-gradient-to-r from-amber-500 to-amber-600 text-amber-950 font-semibold px-4 py-3 rounded-xl shadow-lg
          ${isDragging ? 'opacity-90 scale-105 shadow-2xl ring-2 ring-amber-300' : 'shadow-amber-500/20'}`}
      >
        <span className="text-amber-700/50 text-base select-none">⠿</span>
        <span className="flex-1 text-sm">{text}</span>
        <button
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation()
            onRemove(id)
          }}
          className="w-6 h-6 rounded-full bg-amber-950/20 text-amber-950/60 flex items-center justify-center text-xs font-bold hover:bg-red-500/40 hover:text-white transition-colors"
        >
          ×
        </button>
      </div>
    </motion.div>
  )
}

function AvailableStep({ step, onAdd }) {
  return (
    <motion.button
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.15 } }}
      onClick={() => onAdd(step.id)}
      className="bg-white/10 hover:bg-white/20 active:bg-white/5 border border-white/15
        text-white font-medium px-4 py-3 rounded-xl text-left transition-all active:scale-[0.97] w-full
        flex items-center gap-3"
    >
      <span className="text-white/30 text-lg">+</span>
      <span className="text-sm">{step.text}</span>
    </motion.button>
  )
}

export default function PlanningPhase() {
  const {
    currentLevelId,
    playerPlan,
    availableSteps,
    addStepToPlan,
    removeStepFromPlan,
    reorderPlan,
    lockInPlan,
  } = useGameStore()

  const level = getLevelById(currentLevelId)
  const [rushWarning, setRushWarning] = useState(false)
  const allStepsPlaced = availableSteps.length === 0 && playerPlan.length > 0

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } })
  )

  if (!level) return null

  const planSteps = playerPlan.map((id) => {
    const allSteps = [...level.steps, ...level.distractors]
    return allSteps.find((s) => s.id === id)
  }).filter(Boolean)

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    reorderPlan(active.id, over.id)
  }

  const handleLockIn = () => {
    const result = lockInPlan()
    if (result?.rushing) {
      setRushWarning(true)
      setTimeout(() => setRushWarning(false), 3000)
    }
  }

  return (
    <div className="flex flex-col h-full relative">
      {/* Header with character */}
      <div className="px-4 pt-3 pb-2">
        <div className="flex items-start gap-3">
          <Character pose="thinking" size={60} className="shrink-0 -mt-1" />
          <div className="flex-1 bg-white/5 rounded-xl px-3 py-2 border border-white/10">
            <h2 className="text-base font-bold text-white mb-0.5">{level.title}</h2>
            <p className="text-amber-200/60 text-xs leading-relaxed">{level.description}</p>
          </div>
        </div>
      </div>

      {/* Scrollable plan + available area */}
      <div className="flex-1 overflow-y-auto px-4 pb-2">
        {/* Plan area */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-amber-400" />
            <h3 className="text-amber-400 text-xs font-bold uppercase tracking-wider">
              Your Plan
            </h3>
            <span className="text-white/20 text-xs">({playerPlan.length} steps)</span>
          </div>

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={playerPlan} strategy={verticalListSortingStrategy}>
              <div className="space-y-2 min-h-[56px]">
                {planSteps.length === 0 ? (
                  <div className="border-2 border-dashed border-white/10 rounded-xl p-5 text-center">
                    <p className="text-white/30 text-sm">Tap steps below to build your plan</p>
                    <p className="text-white/15 text-xs mt-1">Think carefully about the order!</p>
                  </div>
                ) : (
                  planSteps.map((step, index) => (
                    <SortableStep
                      key={step.id}
                      id={step.id}
                      text={step.text}
                      index={index}
                      onRemove={removeStepFromPlan}
                    />
                  ))
                )}
              </div>
            </SortableContext>
          </DndContext>
        </div>

        {/* Available steps */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-white/30" />
            <h3 className="text-white/40 text-xs font-bold uppercase tracking-wider">
              Available Steps
            </h3>
          </div>
          <div className="space-y-2">
            <AnimatePresence>
              {availableSteps.map((step) => (
                <AvailableStep key={step.id} step={step} onAdd={addStepToPlan} />
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Lock In Popup — appears when all steps are placed */}
      <AnimatePresence>
        {allStepsPlaced && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-40 flex items-end justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => {
              const lastStepId = playerPlan[playerPlan.length - 1]
              if (lastStepId) removeStepFromPlan(lastStepId)
            }}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-gradient-to-b from-slate-800 to-slate-900 border-t border-amber-400/30 rounded-t-3xl px-5 pt-5 pb-6 shadow-2xl"
            >
              <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-4" />

              <div className="flex items-center gap-3 mb-4">
                <Character pose="excited" size={48} className="shrink-0" />
                <div>
                  <h3 className="text-white font-bold text-base">Ready to go?</h3>
                  <p className="text-amber-200/50 text-xs">Review your plan before locking in!</p>
                </div>
              </div>

              {/* Plan summary */}
              <div className="bg-white/5 rounded-xl border border-white/10 p-3 mb-4 max-h-48 overflow-y-auto">
                {planSteps.map((step, i) => (
                  <div key={step.id} className="flex items-center gap-2 py-1.5">
                    <span className="text-amber-400 text-xs font-bold w-5 text-right">{i + 1}.</span>
                    <span className="text-white/80 text-sm">{step.text}</span>
                  </div>
                ))}
              </div>

              {/* Rush warning */}
              <AnimatePresence>
                {rushWarning && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-orange-500/20 border border-orange-400/30 rounded-xl px-4 py-3 text-center mb-4"
                  >
                    <p className="text-orange-200 text-sm font-medium">
                      Slow down! Great adventurers plan carefully first.
                    </p>
                    <p className="text-orange-200/50 text-xs mt-1">
                      Take your time and review each step.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  size="md"
                  className="flex-1"
                  onClick={() => {
                    const lastStepId = playerPlan[playerPlan.length - 1]
                    if (lastStepId) removeStepFromPlan(lastStepId)
                  }}
                >
                  Keep Editing
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  className="flex-1"
                  onClick={handleLockIn}
                >
                  Lock In Plan
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
