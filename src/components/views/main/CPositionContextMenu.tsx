'use client';

import React, { useState, useRef } from 'react';
import { Home, Pencil } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';
import type { RealTimePosition } from '@/types';
import { useClickOutside } from '@/hooks/useClickOutside';

interface Props {
  position: RealTimePosition;
  triggerRef: React.RefObject<HTMLElement | null>;
}

export default function CPositionContextMenu({ position, triggerRef }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const menuRef = useRef<HTMLDivElement>(null);
  const { i18n } = useI18n();

  useClickOutside(menuRef, () => setIsOpen(false), [triggerRef]);

  const handleOpen = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();

    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const remainWidth = window.innerWidth - clientX;
    setPos({
      top: clientY,
      left: remainWidth > 120 ? clientX : window.innerWidth - 120,
    });
    setIsOpen(true);
  };

  // Attach event listener to triggerRef manually or via effect
  React.useEffect(() => {
    const el = triggerRef.current;
    if (!el) return;

    const onCtx = (e: any) => handleOpen(e);
    el.addEventListener('contextmenu', onCtx);
    el.addEventListener('click', onCtx);

    return () => {
      el.removeEventListener('contextmenu', onCtx);
      el.removeEventListener('click', onCtx);
    };
  }, [triggerRef]);

  if (!isOpen) return null;

  const handleGoToPlatform = () => {
    if (!position.link) return;
    window.open(position.link, '_blank', 'noreferrer');
    setIsOpen(false);
  };

  const handleRequestEdit = () => {
    // helpers.modal.custom placeholder
    alert('Request Edit Modal placeholder');
    setIsOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      <div 
        ref={menuRef}
        style={{ top: pos.top, left: pos.left }}
        className="absolute w-[140px] bg-background-base border border-border-base rounded shadow-xl overflow-hidden pointer-events-auto animate-in fade-in zoom-in-95 duration-150"
      >
        <div 
          onClick={handleGoToPlatform}
          className={`flex items-center gap-2 p-2 text-xs text-text-stress transition-colors ${!position.link ? 'opacity-30 cursor-not-allowed' : 'hover:bg-brand-primary hover:text-white cursor-pointer'}`}
        >
          <Home className="w-3.5 h-3.5" />
          {i18n('GO_TO_PLATFORM')}
        </div>
        {position.editable && (
          <div 
            onClick={handleRequestEdit}
            className="flex items-center gap-2 p-2 text-xs text-text-stress hover:bg-brand-primary hover:text-white cursor-pointer transition-colors"
          >
            <Pencil className="w-3.5 h-3.5" />
            {i18n('REQUEST_EDIT')}
          </div>
        )}
      </div>
    </div>
  );
}
