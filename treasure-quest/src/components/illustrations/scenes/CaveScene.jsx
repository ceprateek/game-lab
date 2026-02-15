import { motion } from 'framer-motion'

export default function CaveScene({ children, className = '' }) {
  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="cave-glow" cx="0.5" cy="0.35" r="0.5">
            <stop offset="0%" stopColor="#4a3a2a" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#1a1410" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#0a0806" />
          </radialGradient>
          <radialGradient id="crystal-glow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#34d399" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="cave-ground" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2a1f15" />
            <stop offset="100%" stopColor="#1a120a" />
          </linearGradient>
        </defs>

        {/* Dark background */}
        <rect width="400" height="800" fill="#0d0a07" />
        <rect width="400" height="800" fill="url(#cave-glow)" />

        {/* Cave ceiling stalactites */}
        <g fill="#2a1f15">
          <polygon points="30,0 45,80 15,80" />
          <polygon points="90,0 100,60 80,60" />
          <polygon points="160,0 175,100 145,100" />
          <polygon points="240,0 250,70 230,70" />
          <polygon points="310,0 325,90 295,90" />
          <polygon points="370,0 385,55 355,55" />
        </g>
        <g fill="#1f1710" opacity="0.7">
          <polygon points="60,0 70,50 50,50" />
          <polygon points="130,0 138,70 122,70" />
          <polygon points="200,0 212,80 188,80" />
          <polygon points="280,0 288,60 272,60" />
          <polygon points="350,0 360,45 340,45" />
        </g>

        {/* Cave walls */}
        <path d="M 0 0 L 0 800 Q 20 780 30 700 Q 50 500 35 300 Q 25 150 0 0" fill="#1a1410" opacity="0.8" />
        <path d="M 400 0 L 400 800 Q 380 780 370 700 Q 350 500 365 300 Q 375 150 400 0" fill="#1a1410" opacity="0.8" />

        {/* Rocky ground */}
        <path d="M 0 650 Q 50 640 100 648 Q 200 660 300 645 Q 350 640 400 650 L 400 800 L 0 800 Z" fill="url(#cave-ground)" />

        {/* Floor stalagmites */}
        <g fill="#2a1f15">
          <polygon points="50,800 65,720 80,800" />
          <polygon points="320,800 340,740 360,800" />
        </g>
        <g fill="#1f1710" opacity="0.6">
          <polygon points="130,800 140,760 150,800" />
          <polygon points="260,800 270,750 280,800" />
        </g>

        {/* Crystals on walls */}
        <g>
          {/* Left crystal cluster */}
          <polygon points="30,350 40,310 50,350" fill="#34d399" opacity="0.7" />
          <polygon points="20,360 32,325 44,360" fill="#6ee7b7" opacity="0.5" />
          <ellipse cx="37" cy="330" rx="20" ry="20" fill="url(#crystal-glow)" />

          {/* Right crystal cluster */}
          <polygon points="360,420 370,380 380,420" fill="#a78bfa" opacity="0.7" />
          <polygon points="350,430 365,395 378,430" fill="#c4b5fd" opacity="0.5" />
          <radialGradient id="crystal-glow-purple" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#a78bfa" stopOpacity="0" />
          </radialGradient>
          <ellipse cx="367" cy="400" rx="20" ry="20" fill="url(#crystal-glow-purple)" />

          {/* Ground crystal */}
          <polygon points="190,650 200,610 210,650" fill="#34d399" opacity="0.8" />
          <polygon points="200,655 210,620 220,655" fill="#6ee7b7" opacity="0.6" />
        </g>

        {/* Ancient wall drawings */}
        <g stroke="#5a4a3a" strokeWidth="1.5" fill="none" opacity="0.3">
          <circle cx="100" cy="280" r="12" />
          <line x1="100" y1="292" x2="100" y2="320" />
          <line x1="100" y1="300" x2="85" y2="310" />
          <line x1="100" y1="300" x2="115" y2="310" />
          <line x1="100" y1="320" x2="90" y2="340" />
          <line x1="100" y1="320" x2="110" y2="340" />
        </g>
        <g stroke="#5a4a3a" strokeWidth="1.5" fill="none" opacity="0.25">
          <path d="M 280 300 L 300 300 L 310 280 L 320 300 L 340 300" />
          <circle cx="310" cy="270" r="8" />
        </g>

        {/* Flint stones on ground */}
        <ellipse cx="150" cy="670" rx="12" ry="8" fill="#6b7280" />
        <ellipse cx="152" cy="668" rx="9" ry="5" fill="#8b929c" />
        <ellipse cx="250" cy="675" rx="10" ry="6" fill="#5b636d" />

        {/* Dry sticks on ground */}
        <g stroke="#8B6914" strokeWidth="3" strokeLinecap="round">
          <line x1="100" y1="680" x2="130" y2="670" />
          <line x1="110" y1="685" x2="140" y2="678" />
        </g>
      </svg>

      {/* Animated crystal glow */}
      <motion.div
        className="absolute pointer-events-none"
        style={{ top: '40%', left: '5%' }}
        animate={{ opacity: [0.3, 0.8, 0.3], scale: [0.9, 1.1, 0.9] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <div className="w-8 h-8 rounded-full bg-emerald-400/20 blur-md" />
      </motion.div>
      <motion.div
        className="absolute pointer-events-none"
        style={{ top: '50%', right: '3%' }}
        animate={{ opacity: [0.2, 0.6, 0.2], scale: [0.9, 1.1, 0.9] }}
        transition={{ duration: 4, repeat: Infinity, delay: 1 }}
      >
        <div className="w-6 h-6 rounded-full bg-purple-400/20 blur-md" />
      </motion.div>

      {/* Dust particles */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-amber-200/20 pointer-events-none"
          style={{
            top: `${20 + i * 15}%`,
            left: `${15 + i * 18}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.1, 0.4, 0.1],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.8,
          }}
        />
      ))}

      {/* Content overlay */}
      <div className="relative z-10 h-full w-full">
        {children}
      </div>
    </div>
  )
}
