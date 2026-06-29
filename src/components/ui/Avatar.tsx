import Image from 'next/image'

// Componente Avatar
interface AvatarProps {
  src?: string | null
  alt?: string
  name?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizeStyles = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
}

export function Avatar({ src, alt = '', name, size = 'md', className = '' }: AvatarProps) {
  // Obtener iniciales del nombre
  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?'

  if (src) {
    return (
      <div className={`relative ${sizeStyles[size]} rounded-full overflow-hidden ${className}`}>
        <Image src={src} alt={alt || name || ''} fill className="object-cover" />
      </div>
    )
  }

  return (
    <div
      className={`
        ${sizeStyles[size]} rounded-full flex items-center justify-center
        bg-gradient-to-br from-primary-500 to-accent-500 text-white font-medium
        ${className}
      `}
    >
      {initials}
    </div>
  )
}
