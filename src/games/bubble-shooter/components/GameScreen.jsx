import { useEffect, useRef, useCallback, useState } from 'react'
import useBubbleShooterStore from '../store'
import useAppStore from '../../../store/appStore'
import { difficulties, createBoard, createRow, findConnected, findFloating, getRandomColor } from '../data/config'
import Button from '../../../components/ui/Button'

const COLOR_STYLES = {
  '#ef4444': { h: '#fca5a5', s: '#b91c1c' },
  '#3b82f6': { h: '#93c5fd', s: '#1d4ed8' },
  '#22c55e': { h: '#86efac', s: '#15803d' },
  '#eab308': { h: '#fde047', s: '#a16207' },
  '#a855f7': { h: '#d8b4fe', s: '#7e22ce' },
  '#f97316': { h: '#fdba74', s: '#c2410c' },
}

function drawBubble(ctx, x, y, r, color) {
  const cs = COLOR_STYLES[color] || { h: '#ffffff', s: '#333333' }
  ctx.beginPath()
  ctx.arc(x, y, r, 0, Math.PI * 2)
  ctx.fillStyle = color
  ctx.fill()
  ctx.strokeStyle = cs.s
  ctx.lineWidth = 1.5
  ctx.stroke()
  // Highlight
  ctx.beginPath()
  ctx.arc(x - r * 0.3, y - r * 0.3, r * 0.32, 0, Math.PI * 2)
  ctx.fillStyle = cs.h + 'aa'
  ctx.fill()
}

const SHOOT_SPEED = 10

export default function GameScreen() {
  const { difficulty, finishGame } = useBubbleShooterStore()
  const backToMenu = useAppStore((s) => s.backToMenu)
  const config = difficulties[difficulty]

  const canvasRef = useRef(null)
  const gameRef = useRef(null)
  const rafRef = useRef(null)
  const [score, setScore] = useState(0)

  const COLS = config.columns

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Use actual layout size
    const W = canvas.offsetWidth || 380
    const H = canvas.offsetHeight || 600
    canvas.width = W
    canvas.height = H

    // Compute cell size to fit both width and height
    const CELL = Math.floor(
      Math.min((W - 20) / COLS, (H - 160) / config.maxRows)
    )
    const R = Math.floor(CELL * 0.44)
    const boardW = COLS * CELL
    const offsetX = Math.floor((W - boardW) / 2)
    const gridOffsetY = 55
    const shooterY = H - 75
    const shooterX = Math.floor(W / 2)

    gameRef.current = {
      board: createBoard(config.startRows, COLS, config.colorCount),
      currentColor: getRandomColor(config.colorCount),
      nextColor: getRandomColor(config.colorCount),
      flying: null,
      aimAngle: -Math.PI / 2, // default: straight up
      score: 0,
      shootsSinceRow: 0,
      active: true,
      CELL, R, boardW, offsetX, gridOffsetY, shooterX, shooterY, W, H,
    }

    const ctx = canvas.getContext('2d')

    function render() {
      const g = gameRef.current
      if (!g) return
      const { CELL, R, W, H, offsetX, gridOffsetY, shooterX, shooterY, boardW } = g

      ctx.clearRect(0, 0, W, H)

      // Background
      const bg = ctx.createLinearGradient(0, 0, 0, H)
      bg.addColorStop(0, '#0f172a')
      bg.addColorStop(1, '#0c1845')
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, W, H)

      // Board grid cells (empty slot guides)
      ctx.fillStyle = 'rgba(255,255,255,0.03)'
      for (let r = 0; r < config.maxRows; r++) {
        for (let c = 0; c < COLS; c++) {
          const bx = offsetX + c * CELL + CELL / 2
          const by = gridOffsetY + r * CELL + CELL / 2
          ctx.beginPath()
          ctx.arc(bx, by, R, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      // Danger zone line
      const dangerY = gridOffsetY + (config.maxRows - 1) * CELL
      ctx.strokeStyle = 'rgba(239,68,68,0.25)'
      ctx.setLineDash([5, 7])
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(offsetX, dangerY)
      ctx.lineTo(offsetX + boardW, dangerY)
      ctx.stroke()
      ctx.setLineDash([])

      // Board bubbles
      for (let r = 0; r < g.board.length; r++) {
        for (let c = 0; c < COLS; c++) {
          const color = g.board[r][c]
          if (color) {
            const bx = offsetX + c * CELL + CELL / 2
            const by = gridOffsetY + r * CELL + CELL / 2
            drawBubble(ctx, bx, by, R, color)
          }
        }
      }

      // Aim arrow — always visible when not flying
      if (!g.flying) {
        const angle = g.aimAngle
        const ax = Math.cos(angle)
        const ay = Math.sin(angle)
        const alen = 180

        // Dashed aim line
        ctx.save()
        ctx.setLineDash([6, 9])
        ctx.strokeStyle = 'rgba(255,255,255,0.35)'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(shooterX, shooterY - R - 2)
        ctx.lineTo(shooterX + ax * alen, shooterY + ay * alen)
        ctx.stroke()
        ctx.restore()

        // Arrowhead
        const tipX = shooterX + ax * alen
        const tipY = shooterY + ay * alen
        ctx.save()
        ctx.translate(tipX, tipY)
        ctx.rotate(angle + Math.PI / 2)
        ctx.fillStyle = 'rgba(255,255,255,0.6)'
        ctx.beginPath()
        ctx.moveTo(0, -12)
        ctx.lineTo(-7, 4)
        ctx.lineTo(7, 4)
        ctx.closePath()
        ctx.fill()
        ctx.restore()
      }

      // Flying bubble
      if (g.flying) {
        drawBubble(ctx, g.flying.x, g.flying.y, R, g.flying.color)
      }

      // Shooter platform
      ctx.fillStyle = 'rgba(255,255,255,0.05)'
      ctx.beginPath()
      ctx.rect(offsetX, shooterY - R - 10, boardW, R * 2 + 20)
      ctx.fill()
      ctx.strokeStyle = 'rgba(255,255,255,0.08)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(offsetX, shooterY - R - 10)
      ctx.lineTo(offsetX + boardW, shooterY - R - 10)
      ctx.stroke()

      // Current bubble at shooter
      if (!g.flying) {
        drawBubble(ctx, shooterX, shooterY, R, g.currentColor)
      }

      // Next bubble preview
      const nextX = offsetX + boardW - R - 8
      ctx.fillStyle = 'rgba(255,255,255,0.3)'
      ctx.font = `bold ${Math.max(8, Math.floor(R * 0.55))}px sans-serif`
      ctx.textAlign = 'center'
      ctx.fillText('NEXT', nextX, shooterY - R - 2)
      drawBubble(ctx, nextX, shooterY, Math.floor(R * 0.72), g.nextColor)
    }

    function processLanding(row, col, color) {
      const g = gameRef.current
      if (!g) return

      // Ensure board is tall enough
      while (g.board.length <= row) {
        g.board.push(new Array(COLS).fill(null))
      }

      g.board[row][col] = color

      const connected = findConnected(g.board, row, col)
      if (connected.length >= 3) {
        for (const [r, c] of connected) g.board[r][c] = null
        g.score += connected.length * 10

        const floating = findFloating(g.board)
        for (const [r, c] of floating) g.board[r][c] = null
        g.score += floating.length * 5
      }

      setScore(g.score)
    }

    function findSnapCell(x, y) {
      const g = gameRef.current
      const { CELL, offsetX, gridOffsetY } = g
      let snapRow = Math.max(0, Math.floor((y - gridOffsetY) / CELL))
      let snapCol = Math.max(0, Math.min(COLS - 1, Math.floor((x - offsetX) / CELL)))

      // Ensure board row exists
      while (g.board.length <= snapRow) g.board.push(new Array(COLS).fill(null))

      if (!g.board[snapRow][snapCol]) return [snapRow, snapCol]

      // Try neighbors
      const neighbors = [
        [snapRow - 1, snapCol],
        [snapRow, snapCol - 1],
        [snapRow, snapCol + 1],
        [snapRow + 1, snapCol],
        [snapRow - 1, snapCol - 1],
        [snapRow - 1, snapCol + 1],
        [snapRow + 1, snapCol - 1],
        [snapRow + 1, snapCol + 1],
      ]
      for (const [nr, nc] of neighbors) {
        if (nr >= 0 && nc >= 0 && nc < COLS) {
          while (g.board.length <= nr) g.board.push(new Array(COLS).fill(null))
          if (!g.board[nr][nc]) return [nr, nc]
        }
      }

      // Fallback: top of column
      return [0, snapCol]
    }

    function gameLoop() {
      const g = gameRef.current
      if (!g || !g.active) return

      if (g.flying) {
        const { CELL, R, offsetX, boardW, gridOffsetY } = g
        let { x, y, vx, vy, color } = g.flying

        x += vx
        y += vy

        // Wall bounce
        if (x - R < offsetX) { x = offsetX + R; vx = -vx }
        if (x + R > offsetX + boardW) { x = offsetX + boardW - R; vx = -vx }

        // Collision detection
        let landed = false

        if (y - R <= gridOffsetY) {
          y = gridOffsetY + R
          landed = true
        }

        if (!landed) {
          outer: for (let r = 0; r < g.board.length; r++) {
            for (let c = 0; c < COLS; c++) {
              if (g.board[r][c]) {
                const bx = offsetX + c * CELL + CELL / 2
                const by = gridOffsetY + r * CELL + CELL / 2
                const dist = Math.sqrt((x - bx) ** 2 + (y - by) ** 2)
                if (dist < CELL * 0.95) {
                  landed = true
                  break outer
                }
              }
            }
          }
        }

        if (landed) {
          const [snapRow, snapCol] = findSnapCell(x, y)
          processLanding(snapRow, snapCol, color)
          g.flying = null

          // Maybe add a new row (at top, classic style)
          g.shootsSinceRow++
          if (g.shootsSinceRow >= config.newRowEvery) {
            g.board.unshift(createRow(COLS, config.colorCount))
            g.shootsSinceRow = 0
          }

          // Check win: board is empty
          const isEmpty = g.board.length === 0 || g.board.every(row => row.every(c => !c))
          if (isEmpty) {
            g.active = false
            render()
            finishGame({ score: g.score, won: true })
            return
          }

          // Check lose: board too tall
          if (g.board.length >= config.maxRows) {
            g.active = false
            render()
            finishGame({ score: g.score, won: false })
            return
          }
        } else {
          g.flying = { x, y, vx, vy, color }
        }
      }

      render()
      rafRef.current = requestAnimationFrame(gameLoop)
    }

    rafRef.current = requestAnimationFrame(gameLoop)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      if (gameRef.current) gameRef.current.active = false
    }
  }, [difficulty]) // eslint-disable-line react-hooks/exhaustive-deps

  const getCanvasPos = useCallback((clientX, clientY) => {
    const canvas = canvasRef.current
    if (!canvas) return [0, 0]
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    return [(clientX - rect.left) * scaleX, (clientY - rect.top) * scaleY]
  }, [])

  // Clamp aim angle to upward-only range (about 10° from horizontal on each side)
  const clampAngle = useCallback((angle) => {
    const MIN = -Math.PI + 0.18  // ~170° from right (far left)
    const MAX = -0.18             // ~10° from right (far right)
    return Math.max(MIN, Math.min(MAX, angle))
  }, [])

  const updateAim = useCallback((cx, cy) => {
    const g = gameRef.current
    if (!g || g.flying) return
    const { shooterX, shooterY } = g
    const dx = cx - shooterX
    const dy = cy - shooterY
    if (dy >= -10) return // below or level with shooter — ignore
    g.aimAngle = clampAngle(Math.atan2(dy, dx))
  }, [clampAngle])

  const shootCurrent = useCallback(() => {
    const g = gameRef.current
    if (!g || g.flying || !g.active) return
    const { shooterX, shooterY, aimAngle } = g
    g.flying = {
      x: shooterX,
      y: shooterY,
      vx: Math.cos(aimAngle) * SHOOT_SPEED,
      vy: Math.sin(aimAngle) * SHOOT_SPEED,
      color: g.currentColor,
    }
    g.currentColor = g.nextColor
    g.nextColor = getRandomColor(config.colorCount)
  }, [config.colorCount])

  const handleClick = useCallback((e) => {
    const [x, y] = getCanvasPos(e.clientX, e.clientY)
    updateAim(x, y)
    shootCurrent()
  }, [updateAim, shootCurrent, getCanvasPos])

  const handleMouseMove = useCallback((e) => {
    const [x, y] = getCanvasPos(e.clientX, e.clientY)
    updateAim(x, y)
  }, [updateAim, getCanvasPos])

  const handleTouchStart = useCallback((e) => {
    e.preventDefault()
    const touch = e.touches[0]
    const [x, y] = getCanvasPos(touch.clientX, touch.clientY)
    updateAim(x, y)
  }, [updateAim, getCanvasPos])

  const handleTouchMove = useCallback((e) => {
    e.preventDefault()
    const touch = e.touches[0]
    const [x, y] = getCanvasPos(touch.clientX, touch.clientY)
    updateAim(x, y)
  }, [updateAim, getCanvasPos])

  const handleTouchEnd = useCallback((e) => {
    e.preventDefault()
    shootCurrent()
  }, [shootCurrent])

  return (
    <div className="h-full w-full flex flex-col bg-slate-950">
      <div className="flex items-center justify-between px-4 py-2 shrink-0">
        <Button variant="ghost" size="sm" onClick={backToMenu}>← Games</Button>
        <div className="text-center">
          <p className="text-white font-bold text-lg leading-tight">{score}</p>
          <p className="text-white/30 text-xs">SCORE</p>
        </div>
        <div className="w-16" />
      </div>
      <canvas
        ref={canvasRef}
        className="flex-1 w-full cursor-crosshair touch-none"
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      />
    </div>
  )
}
