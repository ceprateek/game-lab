const variants = {
  primary:
    'bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-amber-950 shadow-lg shadow-amber-500/25',
  secondary:
    'bg-white/10 hover:bg-white/20 active:bg-white/5 text-white border border-white/20',
  danger:
    'bg-red-500/80 hover:bg-red-500 active:bg-red-600 text-white',
  ghost:
    'bg-transparent hover:bg-white/10 active:bg-white/5 text-amber-300',
}

const sizes = {
  sm: 'px-4 py-2 text-sm rounded-xl',
  md: 'px-6 py-3 text-base rounded-xl',
  lg: 'px-10 py-4 text-xl rounded-2xl',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  onClick,
  ...props
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        font-bold transition-all duration-150 active:scale-95
        disabled:opacity-40 disabled:pointer-events-none
        ${variants[variant]} ${sizes[size]} ${className}
      `}
      {...props}
    >
      {children}
    </button>
  )
}
