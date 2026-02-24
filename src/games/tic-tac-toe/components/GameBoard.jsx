import { motion } from 'framer-motion'
import useTicTacToeStore from '../store'
import Button from '../../../components/ui/Button'
import useAppStore from '../../../store/appStore'

function XMark() {
  return (
    <motion.svg
      viewBox="0 0 50 50"
      className="w-full h-full"
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
    >
      <motion.line
        x1="12" y1="12" x2="38" y2="38"
        stroke="#818cf8" strokeWidth="5" strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.3 }}
      />
      <motion.line
        x1="38" y1="12" x2="12" y2="38"
        stroke="#818cf8" strokeWidth="5" strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      />
    </motion.svg>
  )
}

function OMark() {
  return (
    <motion.svg
      viewBox="0 0 50 50"
      className="w-full h-full"
      initial={{ scale: 0, rotate: 180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
    >
      <motion.circle
        cx="25" cy="25" r="14"
        fill="none" stroke="#fb7185" strokeWidth="5" strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.4 }}
      />
    </motion.svg>
  )
}

export default function GameBoard() {
  const board = useTicTacToeStore((s) => s.board)
  const currentPlayer = useTicTacToeStore((s) => s.currentPlayer)
  const winner = useTicTacToeStore((s) => s.winner)
  const winLine = useTicTacToeStore((s) => s.winLine)
  const gameOver = useTicTacToeStore((s) => s.gameOver)
  const aiThinking = useTicTacToeStore((s) => s.aiThinking)
  const makeMove = useTicTacToeStore((s) => s.makeMove)
  const showResults = useTicTacToeStore((s) => s.showResults)
  const goToDifficulty = useTicTacToeStore((s) => s.goToDifficulty)
  const backToMenu = useAppStore((s) => s.backToMenu)

  const statusText = gameOver
    ? winner === 'X'
      ? 'You Win!'
      : winner === 'O'
        ? 'AI Wins!'
        : "It's a Draw!"
    : aiThinking
      ? 'AI is thinking...'
      : 'Your turn'

  return (
    <div className="h-full w-full flex flex-col px-6 pt-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="sm" onClick={goToDifficulty}>
          ← Back
        </Button>
        <Button variant="ghost" size="sm" onClick={backToMenu}>
          Menu
        </Button>
      </div>

      {/* Status */}
      <motion.div
        key={statusText}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <div className="flex items-center justify-center gap-3 mb-1">
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4">
              <svg viewBox="0 0 50 50">
                <line x1="12" y1="12" x2="38" y2="38" stroke="#818cf8" strokeWidth="5" strokeLinecap="round" />
                <line x1="38" y1="12" x2="12" y2="38" stroke="#818cf8" strokeWidth="5" strokeLinecap="round" />
              </svg>
            </div>
            <span className="text-indigo-400 text-sm font-bold">You</span>
          </div>
          <span className="text-white/20 text-sm">vs</span>
          <div className="flex items-center gap-1.5">
            <span className="text-rose-400 text-sm font-bold">AI</span>
            <div className="w-4 h-4">
              <svg viewBox="0 0 50 50">
                <circle cx="25" cy="25" r="14" fill="none" stroke="#fb7185" strokeWidth="5" />
              </svg>
            </div>
          </div>
        </div>
        <p className={`text-lg font-bold ${gameOver ? (winner === 'X' ? 'text-indigo-400' : winner === 'O' ? 'text-rose-400' : 'text-amber-400') : 'text-white/70'}`}>
          {statusText}
        </p>
        {aiThinking && (
          <motion.div
            className="flex justify-center gap-1 mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full bg-rose-400/60"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
              />
            ))}
          </motion.div>
        )}
      </motion.div>

      {/* Board */}
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-xs aspect-square">
          <div className="grid grid-cols-3 gap-2 w-full h-full">
            {board.map((cell, index) => {
              const isWinCell = winLine?.includes(index)
              return (
                <motion.button
                  key={index}
                  onClick={() => makeMove(index)}
                  disabled={!!cell || gameOver || aiThinking}
                  className={`
                    aspect-square rounded-xl flex items-center justify-center p-3
                    transition-colors duration-200
                    ${isWinCell
                      ? 'bg-amber-400/20 border-2 border-amber-400/50'
                      : cell
                        ? 'bg-white/10 border border-white/10'
                        : 'bg-white/5 border border-white/10 hover:bg-white/15 active:scale-95'
                    }
                    disabled:cursor-default
                  `}
                  whileTap={!cell && !gameOver && !aiThinking ? { scale: 0.92 } : {}}
                >
                  {cell === 'X' && <XMark />}
                  {cell === 'O' && <OMark />}
                </motion.button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Game over actions */}
      {gameOver && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="pb-8 pt-4"
        >
          <Button variant="primary" size="lg" className="w-full" onClick={showResults}>
            See Results
          </Button>
        </motion.div>
      )}

      {!gameOver && <div className="pb-8" />}
    </div>
  )
}
