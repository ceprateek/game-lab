import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const STEPS = [
  {
    title: 'Read the Order',
    description: 'Each customer wants specific food items. Check the order ticket at the top!',
    emoji: '\u{1F4CB}',
  },
  {
    title: 'Pick the Food',
    description: 'Tap items from the food grid below to add them to your lunch box.',
    emoji: '\u{1F447}',
  },
  {
    title: 'Pack the Lunch Box',
    description: 'Items appear in your lunch box. Tap an item to remove it if you make a mistake!',
    emoji: '\u{1F371}',
  },
  {
    title: 'Send it Fast!',
    description: 'Hit "Pack & Send" before time runs out. Faster orders and streaks earn bonus points!',
    emoji: '\u{1F680}',
  },
]

export default function Tutorial({ onComplete }) {
  const [step, setStep] = useState(0)
  const current = STEPS[step]
  const isLast = step === STEPS.length - 1

  const handleNext = () => {
    if (isLast) {
      localStorage.setItem('lunch-rush-tutorial-seen', 'true')
      onComplete()
    } else {
      setStep(step + 1)
    }
  }

  const handleSkip = () => {
    localStorage.setItem('lunch-rush-tutorial-seen', 'true')
    onComplete()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-[100] bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center px-8"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.25 }}
          className="flex flex-col items-center text-center"
        >
          <motion.span
            className="text-6xl mb-4"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            {current.emoji}
          </motion.span>
          <h2 className="text-white text-2xl font-bold mb-2">{current.title}</h2>
          <p className="text-white/60 text-sm mb-8 max-w-xs leading-relaxed">{current.description}</p>

          {/* Step dots */}
          <div className="flex gap-2 mb-6">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === step ? 'bg-orange-400 w-6' : i < step ? 'bg-orange-400/50 w-2' : 'bg-white/20 w-2'
                }`}
              />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="flex gap-4 w-full max-w-xs">
        <button
          onClick={handleSkip}
          className="flex-1 py-3 text-white/40 text-sm font-medium active:text-white/60"
        >
          Skip
        </button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleNext}
          className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-xl active:from-orange-600 active:to-amber-600"
        >
          {isLast ? "Let's Go!" : 'Next'}
        </motion.button>
      </div>
    </motion.div>
  )
}
