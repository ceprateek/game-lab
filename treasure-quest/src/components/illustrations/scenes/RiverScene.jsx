import { motion } from 'framer-motion'

export default function RiverScene({ children, className = '' }) {
  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="river-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a4a7a" />
            <stop offset="30%" stopColor="#2563a8" />
            <stop offset="60%" stopColor="#4a9bd9" />
            <stop offset="100%" stopColor="#2a6a4a" />
          </linearGradient>
          <linearGradient id="river-water" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1e6091" />
            <stop offset="50%" stopColor="#1a5080" />
            <stop offset="100%" stopColor="#143d64" />
          </linearGradient>
          <linearGradient id="river-bank" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4a7a3a" />
            <stop offset="100%" stopColor="#3a6030" />
          </linearGradient>
        </defs>

        {/* Sky */}
        <rect width="400" height="800" fill="url(#river-sky)" />

        {/* Clouds */}
        <g opacity="0.3">
          <ellipse cx="80" cy="80" rx="50" ry="20" fill="#fff" />
          <ellipse cx="100" cy="75" rx="40" ry="18" fill="#fff" />
          <ellipse cx="300" cy="120" rx="45" ry="16" fill="#fff" />
          <ellipse cx="280" cy="115" rx="35" ry="14" fill="#fff" />
        </g>

        {/* Far bank - trees */}
        <path d="M 0 350 Q 100 330 200 345 Q 300 355 400 340 L 400 400 L 0 400 Z" fill="#3a6a30" />
        <ellipse cx="60" cy="330" rx="40" ry="50" fill="#2d7a3a" />
        <ellipse cx="150" cy="320" rx="35" ry="55" fill="#358442" />
        <ellipse cx="260" cy="325" rx="45" ry="50" fill="#2d7a3a" />
        <ellipse cx="350" cy="315" rx="38" ry="55" fill="#358442" />

        {/* River */}
        <path d="M 0 400 Q 100 390 200 400 Q 300 410 400 395 L 400 580 Q 300 590 200 580 Q 100 570 0 585 Z" fill="url(#river-water)" />

        {/* Water ripples */}
        <g opacity="0.3" stroke="#7ec8e3" strokeWidth="1.5" fill="none">
          <path d="M 30 440 Q 50 435 70 440 Q 90 445 110 440">
            <animate attributeName="d" values="M 30 440 Q 50 435 70 440 Q 90 445 110 440;M 30 442 Q 50 437 70 442 Q 90 447 110 442;M 30 440 Q 50 435 70 440 Q 90 445 110 440" dur="2s" repeatCount="indefinite" />
          </path>
          <path d="M 150 470 Q 180 465 210 470 Q 240 475 270 470">
            <animate attributeName="d" values="M 150 470 Q 180 465 210 470 Q 240 475 270 470;M 150 472 Q 180 467 210 472 Q 240 477 270 472;M 150 470 Q 180 465 210 470 Q 240 475 270 470" dur="2.5s" repeatCount="indefinite" />
          </path>
          <path d="M 200 510 Q 230 505 260 510 Q 290 515 320 510">
            <animate attributeName="d" values="M 200 510 Q 230 505 260 510 Q 290 515 320 510;M 200 512 Q 230 507 260 512 Q 290 517 320 512;M 200 510 Q 230 505 260 510 Q 290 515 320 510" dur="3s" repeatCount="indefinite" />
          </path>
          <path d="M 50 540 Q 80 535 110 540 Q 140 545 170 540">
            <animate attributeName="d" values="M 50 540 Q 80 535 110 540 Q 140 545 170 540;M 50 542 Q 80 537 110 542 Q 140 547 170 542;M 50 540 Q 80 535 110 540 Q 140 545 170 540" dur="2.8s" repeatCount="indefinite" />
          </path>
        </g>

        {/* Water shimmer */}
        <ellipse cx="100" cy="460" rx="4" ry="2" fill="#a0d8ef" opacity="0.4">
          <animate attributeName="opacity" values="0.4;0.1;0.4" dur="2s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="280" cy="500" rx="3" ry="1.5" fill="#a0d8ef" opacity="0.3">
          <animate attributeName="opacity" values="0.3;0.05;0.3" dur="3s" repeatCount="indefinite" />
        </ellipse>

        {/* Near bank (player side) */}
        <path d="M 0 580 Q 100 570 200 580 Q 300 590 400 575 L 400 800 L 0 800 Z" fill="url(#river-bank)" />
        <path d="M 0 600 Q 80 590 160 598 Q 250 605 350 595 Q 400 590 400 592 L 400 800 L 0 800 Z" fill="#345a28" opacity="0.6" />

        {/* Rocks on near bank */}
        <ellipse cx="50" cy="610" rx="20" ry="12" fill="#6b7280" />
        <ellipse cx="55" cy="608" rx="16" ry="9" fill="#7d8694" />
        <ellipse cx="340" cy="600" rx="25" ry="14" fill="#6b7280" />
        <ellipse cx="345" cy="597" rx="20" ry="10" fill="#7d8694" />

        {/* Wood logs on ground */}
        <g transform="translate(140 620) rotate(-15)">
          <rect x="0" y="0" width="50" height="10" rx="5" fill="#8B6914" />
          <rect x="0" y="0" width="50" height="4" rx="2" fill="#9B7924" />
        </g>
        <g transform="translate(180 640) rotate(8)">
          <rect x="0" y="0" width="45" height="9" rx="4" fill="#7B5904" />
          <rect x="0" y="0" width="45" height="3" rx="2" fill="#8B6914" />
        </g>

        {/* Grass */}
        <g fill="#4a9a3a" opacity="0.8">
          <path d="M 20 585 Q 25 565 30 585" />
          <path d="M 100 578 Q 105 558 110 578" />
          <path d="M 250 582 Q 258 558 265 580" />
          <path d="M 370 580 Q 375 560 380 580" />
        </g>
      </svg>

      {/* Animated water sparkle */}
      <motion.div
        className="absolute pointer-events-none"
        style={{ top: '55%', left: '30%' }}
        animate={{ opacity: [0, 0.8, 0], scale: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, delay: 0 }}
      >
        <div className="w-2 h-2 rounded-full bg-cyan-300/60" />
      </motion.div>
      <motion.div
        className="absolute pointer-events-none"
        style={{ top: '60%', left: '65%' }}
        animate={{ opacity: [0, 0.6, 0], scale: [0.5, 1, 0.5] }}
        transition={{ duration: 2.5, repeat: Infinity, delay: 1 }}
      >
        <div className="w-1.5 h-1.5 rounded-full bg-cyan-200/50" />
      </motion.div>

      {/* Content overlay */}
      <div className="relative z-10 h-full w-full">
        {children}
      </div>
    </div>
  )
}
