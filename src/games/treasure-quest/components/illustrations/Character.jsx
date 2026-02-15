import { motion } from 'framer-motion'

const poses = {
  idle: { bodyY: 0, armRotate: 0, legSpread: 0 },
  walking: { bodyY: -2, armRotate: 15, legSpread: 8 },
  success: { bodyY: -10, armRotate: -30, legSpread: 5 },
  fail: { bodyY: 2, armRotate: 5, legSpread: 0 },
  thinking: { bodyY: 0, armRotate: -10, legSpread: 0 },
}

export default function Character({ pose = 'idle', size = 120, className = '' }) {
  const p = poses[pose] || poses.idle

  return (
    <motion.svg
      viewBox="0 0 100 140"
      width={size}
      height={size * 1.4}
      className={className}
      animate={{ y: pose === 'idle' ? [0, -3, 0] : p.bodyY }}
      transition={pose === 'idle' ? { repeat: Infinity, duration: 2, ease: 'easeInOut' } : { duration: 0.3 }}
    >
      {/* Shadow */}
      <ellipse cx="50" cy="135" rx="25" ry="5" fill="#000" opacity="0.15" />

      {/* Legs */}
      <motion.g animate={{ x: p.legSpread }}>
        <rect x="37" y="95" width="10" height="30" rx="5" fill="#4a3728" />
        <rect x="37" y="120" width="14" height="8" rx="3" fill="#6b4c2a" />
      </motion.g>
      <motion.g animate={{ x: -p.legSpread }}>
        <rect x="53" y="95" width="10" height="30" rx="5" fill="#4a3728" />
        <rect x="50" y="120" width="14" height="8" rx="3" fill="#6b4c2a" />
      </motion.g>

      {/* Body / shirt */}
      <rect x="32" y="55" width="36" height="45" rx="8" fill="#3b82f6" />
      <rect x="32" y="55" width="36" height="15" rx="8" fill="#60a5fa" />

      {/* Belt */}
      <rect x="32" y="85" width="36" height="6" rx="2" fill="#92400e" />
      <rect x="46" y="84" width="8" height="8" rx="2" fill="#fbbf24" />

      {/* Arms */}
      <motion.g
        style={{ originX: '42px', originY: '60px' }}
        animate={{ rotate: p.armRotate }}
      >
        <rect x="18" y="58" width="16" height="8" rx="4" fill="#3b82f6" />
        <circle cx="18" cy="62" r="6" fill="#d4a574" />
      </motion.g>
      <motion.g
        style={{ originX: '58px', originY: '60px' }}
        animate={{ rotate: -p.armRotate }}
      >
        <rect x="66" y="58" width="16" height="8" rx="4" fill="#3b82f6" />
        <circle cx="82" cy="62" r="6" fill="#d4a574" />
      </motion.g>

      {/* Neck */}
      <rect x="44" y="48" width="12" height="10" rx="4" fill="#d4a574" />

      {/* Head */}
      <circle cx="50" cy="35" r="22" fill="#d4a574" />

      {/* Hair */}
      <path d="M 28 30 Q 30 10 50 8 Q 70 10 72 30 Q 65 18 50 15 Q 35 18 28 30" fill="#4a2c1a" />
      <path d="M 30 28 Q 35 20 50 18 Q 65 20 70 28" fill="#5a3c2a" />

      {/* Explorer hat */}
      <ellipse cx="50" cy="20" rx="28" ry="6" fill="#92400e" />
      <path d="M 35 20 Q 37 5 50 3 Q 63 5 65 20" fill="#a0522d" />
      <rect x="35" y="18" width="30" height="4" rx="2" fill="#7c3810" />

      {/* Face */}
      {/* Eyes */}
      <g>
        {pose === 'success' ? (
          <>
            <path d="M 40 33 Q 43 30 46 33" stroke="#2a1a0a" strokeWidth="2" fill="none" />
            <path d="M 54 33 Q 57 30 60 33" stroke="#2a1a0a" strokeWidth="2" fill="none" />
          </>
        ) : pose === 'fail' ? (
          <>
            <circle cx="43" cy="33" r="3" fill="#fff" />
            <circle cx="43" cy="34" r="1.5" fill="#2a1a0a" />
            <circle cx="57" cy="33" r="3" fill="#fff" />
            <circle cx="57" cy="34" r="1.5" fill="#2a1a0a" />
          </>
        ) : (
          <>
            <circle cx="43" cy="33" r="3" fill="#fff" />
            <circle cx="43" cy="33" r="1.5" fill="#2a1a0a" />
            <circle cx="57" cy="33" r="3" fill="#fff" />
            <circle cx="57" cy="33" r="1.5" fill="#2a1a0a" />
          </>
        )}
      </g>

      {/* Mouth */}
      {pose === 'success' ? (
        <path d="M 43 42 Q 50 50 57 42" stroke="#2a1a0a" strokeWidth="1.5" fill="none" />
      ) : pose === 'fail' ? (
        <path d="M 44 46 Q 50 42 56 46" stroke="#2a1a0a" strokeWidth="1.5" fill="none" />
      ) : pose === 'thinking' ? (
        <circle cx="55" cy="44" r="3" fill="#2a1a0a" opacity="0.3" />
      ) : (
        <path d="M 44 43 Q 50 47 56 43" stroke="#2a1a0a" strokeWidth="1.5" fill="none" />
      )}

      {/* Blush */}
      <ellipse cx="37" cy="40" rx="5" ry="3" fill="#e88c8c" opacity="0.3" />
      <ellipse cx="63" cy="40" rx="5" ry="3" fill="#e88c8c" opacity="0.3" />

      {/* Backpack */}
      <rect x="20" y="58" width="10" height="25" rx="4" fill="#92400e" />
      <rect x="20" y="58" width="10" height="8" rx="3" fill="#a0522d" />
    </motion.svg>
  )
}
