'use client'

interface AppSkeletonProps {
  width?: string | number
  height?: string | number
  className?: string
  circle?: boolean
  rounded?: string
}

export default function AppSkeleton({
  width,
  height,
  className = '',
  circle = false,
  rounded = 'rounded',
}: AppSkeletonProps) {
  const style: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  }

  return (
    <div
      className={`app-skeleton animate-pulse bg-background-light/50 ${
        circle ? 'rounded-full' : rounded
      } ${className}`}
      style={style}
    />
  )
}
