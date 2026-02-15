import { motion } from 'framer-motion'

export default function JungleScene({ children, className = '' }) {
  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      {/* Sky gradient */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="jungle-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0f4c3a" />
            <stop offset="40%" stopColor="#1a6b4a" />
            <stop offset="70%" stopColor="#2d8659" />
            <stop offset="100%" stopColor="#1a3a2a" />
          </linearGradient>
          <radialGradient id="jungle-sun" cx="0.7" cy="0.1" r="0.3">
            <stop offset="0%" stopColor="#fde68a" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#fde68a" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="jungle-ground" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5c3d1e" />
            <stop offset="100%" stopColor="#3d2810" />
          </linearGradient>
        </defs>

        {/* Sky */}
        <rect width="400" height="800" fill="url(#jungle-sky)" />
        <rect width="400" height="800" fill="url(#jungle-sun)" />

        {/* Far trees */}
        <g opacity="0.3">
          <ellipse cx="50" cy="280" rx="60" ry="80" fill="#0d5c3a" />
          <ellipse cx="150" cy="260" rx="50" ry="90" fill="#0a4f32" />
          <ellipse cx="280" cy="270" rx="70" ry="85" fill="#0d5c3a" />
          <ellipse cx="370" cy="250" rx="55" ry="95" fill="#0a4f32" />
        </g>

        {/* Mid trees */}
        <g opacity="0.5">
          <rect x="60" y="200" width="12" height="150" rx="4" fill="#5c3d1e" />
          <ellipse cx="66" cy="200" rx="45" ry="60" fill="#1e8c52" />
          <ellipse cx="66" cy="180" rx="35" ry="50" fill="#22a05e" />

          <rect x="300" y="180" width="14" height="170" rx="4" fill="#5c3d1e" />
          <ellipse cx="307" cy="180" rx="50" ry="65" fill="#1e8c52" />
          <ellipse cx="307" cy="160" rx="40" ry="50" fill="#22a05e" />
        </g>

        {/* Hanging vines */}
        <path d="M 0 120 Q 20 200 10 280" stroke="#2d8a4e" strokeWidth="3" fill="none" opacity="0.6" />
        <path d="M 380 100 Q 400 180 390 260" stroke="#2d8a4e" strokeWidth="3" fill="none" opacity="0.6" />
        <path d="M 120 80 Q 130 150 115 220" stroke="#3a9960" strokeWidth="2" fill="none" opacity="0.4" />

        {/* Foreground leaves (left) */}
        <ellipse cx="-10" cy="350" rx="80" ry="40" fill="#1a7045" transform="rotate(-20 -10 350)" />
        <ellipse cx="10" cy="380" rx="60" ry="30" fill="#22884f" transform="rotate(-10 10 380)" />

        {/* Foreground leaves (right) */}
        <ellipse cx="410" cy="320" rx="80" ry="40" fill="#1a7045" transform="rotate(15 410 320)" />
        <ellipse cx="390" cy="360" rx="60" ry="30" fill="#22884f" transform="rotate(10 390 360)" />

        {/* Ground */}
        <path d="M 0 680 Q 100 660 200 670 Q 300 680 400 665 L 400 800 L 0 800 Z" fill="url(#jungle-ground)" />
        <path d="M 0 690 Q 80 680 160 685 Q 250 690 350 682 Q 400 678 400 680 L 400 800 L 0 800 Z" fill="#4a3018" opacity="0.5" />

        {/* Grass tufts */}
        <g fill="#2d8a4e" opacity="0.8">
          <path d="M 30 680 Q 35 660 40 680" />
          <path d="M 35 682 Q 42 658 48 680" />
          <path d="M 120 672 Q 125 652 130 672" />
          <path d="M 200 676 Q 208 650 215 675" />
          <path d="M 300 670 Q 305 648 312 670" />
          <path d="M 350 678 Q 358 655 365 676" />
        </g>

        {/* Treasure chest on ground */}
        <g transform="translate(170 695) scale(0.8)">
          <rect x="0" y="15" width="60" height="40" rx="5" fill="#8B4513" />
          <rect x="0" y="15" width="60" height="14" rx="5" fill="#A0522D" />
          <rect x="-3" y="10" width="66" height="12" rx="4" fill="#6d3410" />
          <rect x="25" y="20" width="10" height="8" rx="2" fill="#FFD700" />
          <circle cx="30" cy="24" r="2.5" fill="#DAA520" />
          {/* Glow */}
          <ellipse cx="30" cy="15" rx="25" ry="10" fill="#FFD700" opacity="0.15" />
        </g>

        {/* Fireflies / particles */}
        <circle cx="80" cy="400" r="2" fill="#fde68a" opacity="0.6">
          <animate attributeName="opacity" values="0.6;0.2;0.6" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="320" cy="350" r="1.5" fill="#fde68a" opacity="0.4">
          <animate attributeName="opacity" values="0.4;0.1;0.4" dur="3s" repeatCount="indefinite" />
        </circle>
        <circle cx="200" cy="300" r="2" fill="#fde68a" opacity="0.5">
          <animate attributeName="opacity" values="0.5;0.15;0.5" dur="2.5s" repeatCount="indefinite" />
        </circle>
      </svg>

      {/* Floating leaf particles */}
      <motion.div
        className="absolute top-20 left-10 text-green-500/40 text-lg pointer-events-none"
        animate={{ y: [0, 300], x: [0, 40, -20, 60], rotate: [0, 180, 360] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      >
        🍃
      </motion.div>
      <motion.div
        className="absolute top-10 right-20 text-green-400/30 text-sm pointer-events-none"
        animate={{ y: [0, 350], x: [0, -30, 20, -40], rotate: [0, -180, -360] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'linear', delay: 3 }}
      >
        🍃
      </motion.div>

      {/* Content overlay */}
      <div className="relative z-10 h-full w-full">
        {children}
      </div>
    </div>
  )
}
