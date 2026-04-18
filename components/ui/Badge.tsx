import { clsx } from 'clsx'

type Variant = 'cyan' | 'blue' | 'purple' | 'green' | 'amber' | 'red' | 'gray'

const variantStyles: Record<Variant, string> = {
  cyan:   'bg-accent-cyan/10 text-accent-cyan border-accent-cyan/20',
  blue:   'bg-accent-blue/10 text-accent-blue border-accent-blue/20',
  purple: 'bg-accent-purple/10 text-accent-purple border-accent-purple/20',
  green:  'bg-accent-green/10 text-accent-green border-accent-green/20',
  amber:  'bg-accent-amber/10 text-accent-amber border-accent-amber/20',
  red:    'bg-accent-red/10 text-accent-red border-accent-red/20',
  gray:   'bg-gray-700/40 text-gray-400 border-gray-600/30',
}

interface BadgeProps {
  children: React.ReactNode
  variant?: Variant
  className?: string
}

export function Badge({ children, variant = 'gray', className }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium',
        variantStyles[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}
