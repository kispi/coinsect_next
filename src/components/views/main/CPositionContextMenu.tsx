'use client'

import React, { useState, useRef } from 'react'
import { Home, Pencil } from 'lucide-react'
import { useI18n } from '@/hooks/useI18n'
import type { RealTimePosition } from '@/types'
import { ui } from '@/lib/ui'
import { useRouter } from 'next/navigation'
import { useClickOutside } from '@/hooks/useClickOutside'

import ModalPositionRequestEdit from '@/components/modals/ModalPositionRequestEdit'

interface Props {
  position: RealTimePosition
  triggerRef: React.RefObject<HTMLElement | null>
}

export default function CPositionContextMenu({ position, triggerRef }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [pos, setPos] = useState({ top: 0, left: 0 })
  const menuRef = useRef<HTMLDivElement>(null)
  const { i18n } = useI18n()
  const router = useRouter()

  useClickOutside(menuRef, () => setIsOpen(false), [triggerRef])

  const handleOpen = (e: React.MouseEvent | React.TouchEvent) => {
    if ((e.target as HTMLElement).closest('.c-position-context-menu-item')) return
    if ((e.target as HTMLElement).classList.contains('disabled')) return

    if (isOpen) {
      setIsOpen(false)
      return
    }

    e.preventDefault()
    e.stopPropagation()

    let clientX, clientY
    if ('touches' in e && (e as React.TouchEvent).touches?.[0]) {
      clientX = (e as React.TouchEvent).touches[0].clientX
      clientY = (e as React.TouchEvent).touches[0].clientY
    } else {
      clientX = (e as React.MouseEvent).clientX
      clientY = (e as React.MouseEvent).clientY
    }

    const remainWidth = window.innerWidth - clientX
    setPos({
      top: clientY,
      left: remainWidth > 140 ? clientX : window.innerWidth - 140,
    })
    setIsOpen(true)
  }

  // Attach event listener to triggerRef manually or via effect
  React.useEffect(() => {
    const el = triggerRef.current
    if (!el) return

    const onCtx = (e: any) => handleOpen(e)
    el.addEventListener('contextmenu', onCtx)
    el.addEventListener('click', onCtx)

    return () => {
      el.removeEventListener('contextmenu', onCtx)
      el.removeEventListener('click', onCtx)
    }
  }, [triggerRef, isOpen])

  if (!isOpen) return null

  const handleGoToPlatform = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    e.nativeEvent.stopImmediatePropagation()

    if (!position.link) return

    if (position.link.startsWith('http')) {
      window.open(position.link, '_blank', 'noreferrer')
    } else {
      router.push(position.link)
    }
    setIsOpen(false)
  }

  const handleRequestEdit = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    e.nativeEvent.stopImmediatePropagation()

    ui.modal.custom(ModalPositionRequestEdit, { position })
    setIsOpen(false)
  }

  return (
    <div className="c-position-context-menu fixed inset-0 z-50 pointer-events-none">
      <div
        ref={menuRef}
        style={{ top: pos.top, left: pos.left }}
        className="absolute w-[120px] bg-background-base border border-border-base rounded shadow-xl overflow-hidden pointer-events-auto animate-in fade-in zoom-in-95 duration-150"
      >
        <div
          onClick={handleGoToPlatform}
          className={`c-position-context-menu-item flex items-center gap-2 px-3 py-2 text-xs text-text-stress cursor-pointer transition-colors ${!position.link ? 'opacity-30 cursor-not-allowed' : 'hover:bg-background-light'}`}
        >
          <Home className="w-3.5 h-3.5" />
          {i18n('COMMON.GO_TO_PLATFORM_SHORT') || '바로가기'}
        </div>
        {position.editable && (
          <div
            onClick={handleRequestEdit}
            className="c-position-context-menu-item flex items-center gap-2 px-3 py-2 text-xs text-text-stress cursor-pointer hover:bg-background-light transition-colors border-t border-border-base/50"
          >
            <Pencil className="w-3.5 h-3.5" />
            {i18n('COMMON.REQUEST_EDIT')}
          </div>
        )}
      </div>
    </div>
  )
}
