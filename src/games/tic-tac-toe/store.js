import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { WIN_PATTERNS, DIFFICULTIES, SCORES } from './data/config'

function checkWinner(board) {
  for (const [a, b, c] of WIN_PATTERNS) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line: [a, b, c] }
    }
  }
  return null
}

function isDraw(board) {
  return board.every((cell) => cell !== null)
}

function minimax(board, isMaximizing) {
  const result = checkWinner(board)
  if (result) return result.winner === 'O' ? 10 : -10
  if (isDraw(board)) return 0

  if (isMaximizing) {
    let best = -Infinity
    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        board[i] = 'O'
        best = Math.max(best, minimax(board, false))
        board[i] = null
      }
    }
    return best
  } else {
    let best = Infinity
    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        board[i] = 'X'
        best = Math.min(best, minimax(board, true))
        board[i] = null
      }
    }
    return best
  }
}

function getOptimalMove(board) {
  let bestScore = -Infinity
  let bestMove = -1
  for (let i = 0; i < 9; i++) {
    if (!board[i]) {
      board[i] = 'O'
      const score = minimax(board, false)
      board[i] = null
      if (score > bestScore) {
        bestScore = score
        bestMove = i
      }
    }
  }
  return bestMove
}

function getRandomMove(board) {
  const empty = board.map((c, i) => (c === null ? i : -1)).filter((i) => i !== -1)
  return empty[Math.floor(Math.random() * empty.length)]
}

function getAIMove(board, difficulty) {
  const { optimalChance } = DIFFICULTIES[difficulty]
  if (Math.random() < optimalChance) {
    return getOptimalMove([...board])
  }
  return getRandomMove(board)
}

const useTicTacToeStore = create(
  persist(
    (set, get) => ({
      screen: 'difficulty',
      difficulty: null,
      board: Array(9).fill(null),
      currentPlayer: 'X',
      winner: null,
      winLine: null,
      gameOver: false,
      score: 0,
      stars: 0,
      aiThinking: false,
      bestScores: {},

      selectDifficulty: (difficulty) => {
        set({
          screen: 'playing',
          difficulty,
          board: Array(9).fill(null),
          currentPlayer: 'X',
          winner: null,
          winLine: null,
          gameOver: false,
          score: 0,
          stars: 0,
          aiThinking: false,
        })
      },

      makeMove: (index) => {
        const { board, currentPlayer, gameOver, aiThinking } = get()
        if (gameOver || board[index] || currentPlayer !== 'X' || aiThinking) return

        const newBoard = [...board]
        newBoard[index] = 'X'

        const result = checkWinner(newBoard)
        if (result) {
          set({
            board: newBoard,
            winner: 'X',
            winLine: result.line,
            gameOver: true,
            score: SCORES.win,
            stars: 3,
          })
          get()._saveBest(SCORES.win, 3)
          return
        }

        if (isDraw(newBoard)) {
          set({
            board: newBoard,
            gameOver: true,
            score: SCORES.draw,
            stars: 2,
          })
          get()._saveBest(SCORES.draw, 2)
          return
        }

        set({ board: newBoard, currentPlayer: 'O', aiThinking: true })

        setTimeout(() => {
          const { board: currentBoard, gameOver: over } = get()
          if (over) return

          const aiIndex = getAIMove(currentBoard, get().difficulty)
          const aiBoard = [...currentBoard]
          aiBoard[aiIndex] = 'O'

          const aiResult = checkWinner(aiBoard)
          if (aiResult) {
            set({
              board: aiBoard,
              winner: 'O',
              winLine: aiResult.line,
              gameOver: true,
              currentPlayer: 'X',
              aiThinking: false,
              score: SCORES.loss,
              stars: 1,
            })
            get()._saveBest(SCORES.loss, 1)
            return
          }

          if (isDraw(aiBoard)) {
            set({
              board: aiBoard,
              gameOver: true,
              currentPlayer: 'X',
              aiThinking: false,
              score: SCORES.draw,
              stars: 2,
            })
            get()._saveBest(SCORES.draw, 2)
            return
          }

          set({ board: aiBoard, currentPlayer: 'X', aiThinking: false })
        }, 500)
      },

      _saveBest: (score, stars) => {
        const { bestScores, difficulty } = get()
        const existing = bestScores[difficulty]
        if (!existing || score > existing.score || (score === existing.score && stars > existing.stars)) {
          set({
            bestScores: {
              ...bestScores,
              [difficulty]: { score, stars },
            },
          })
        }
      },

      showResults: () => set({ screen: 'results' }),

      resetGame: () => {
        const { difficulty } = get()
        if (difficulty) {
          get().selectDifficulty(difficulty)
        } else {
          set({ screen: 'difficulty' })
        }
      },

      goToDifficulty: () => set({ screen: 'difficulty' }),
    }),
    {
      name: 'tic-tac-toe-save',
      partialize: (state) => ({
        bestScores: state.bestScores,
      }),
    }
  )
)

export default useTicTacToeStore
