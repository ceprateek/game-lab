import { motion } from 'framer-motion'

export default function StarRating({ stars = 0, maxStars = 3, size = 'md' }) {
  const sizeClass = size === 'lg' ? 'text-5xl' : size === 'md' ? 'text-3xl' : 'text-xl'

  return (
    <div className={`flex gap-2 justify-center ${sizeClass}`}>
      {Array.from({ length: maxStars }, (_, i) => (
        <motion.span
          key={i}
          initial={{ scale: 0, rotate: -180 }}
          animate={{
            scale: i < stars ? 1 : 0.8,
            rotate: 0,
            opacity: i < stars ? 1 : 0.3,
          }}
          transition={{
            delay: i * 0.2,
            type: 'spring',
            stiffness: 300,
            damping: 15,
          }}
          className={i < stars ? 'text-amber-400 drop-shadow-lg' : 'text-gray-600'}
        >
          ★
        </motion.span>
      ))}
    </div>
  )
}
