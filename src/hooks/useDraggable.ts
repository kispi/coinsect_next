'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

interface DraggableOptions {
  toMoveSelector?: string
  toGrabSelector?: string
  initialPosition?: { x: number; y: number }
}

export function useDraggable(options: DraggableOptions = {}) {
  const [position, setPosition] = useState(options.initialPosition || { x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const dragRef = useRef<HTMLDivElement>(null)
  const offsetRef = useRef({ x: 0, y: 0 })

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      const target = e.target as HTMLElement
      if (options.toGrabSelector && !target.closest(options.toGrabSelector)) return

      setIsDragging(true)
      offsetRef.current = {
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      }
    },
    [options.toGrabSelector, position.x, position.y]
  )

  useEffect(() => {
    if (!isDragging) return

    const onMouseMove = (e: MouseEvent) => {
      const newX = e.clientX - offsetRef.current.x
      const newY = e.clientY - offsetRef.current.y
      setPosition({ x: newX, y: newY })
    }

    const onMouseUp = () => {
      setIsDragging(false)
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('mouseup', onMouseUp)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [isDragging])

  const dragStyle: React.CSSProperties = {
    left: `${position.x}px`,
    top: `${position.y}px`,
    willChange: isDragging ? 'left, top' : 'auto',
    position: 'fixed',
  }

  return { dragRef, position, setPosition, dragStyle, onMouseDown, isDragging }
}
