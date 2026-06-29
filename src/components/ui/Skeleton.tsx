// Skeleton loading placeholder
interface SkeletonProps {
  className?: string
  lines?: number
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div className={`animate-pulse bg-dark-hover rounded-lg ${className}`} />
  )
}

// Skeleton para tarjetas
export function SkeletonCard() {
  return (
    <div className="glass rounded-2xl p-6 space-y-4">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-32 w-full" />
    </div>
  )
}

// Skeleton para avatares
export function SkeletonAvatar() {
  return <Skeleton className="w-10 h-10 rounded-full" />
}
