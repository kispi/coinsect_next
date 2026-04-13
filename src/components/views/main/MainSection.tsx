import React from 'react'
import Link from 'next/link'
import { ChevronRight, HelpCircle } from 'lucide-react'
import { useT } from '@/hooks/useT'

interface MainSectionProps {
  title: string
  link?: string
  image?: string
  tooltip?: string
  children: React.ReactNode
}

export default function MainSection({ title, link, image, tooltip, children }: MainSectionProps) {
  const { t } = useT()
  // Attempt translation mapping if needed. Just rendering title for now.
  const translatedTitle = (() => {
    try {
      return t(title)
    } catch (_e) {
      return title
    }
  })()

  const content = (
    <div className="flex justify-between items-center p-2 mb-2 text-text-stress border-b border-border-base text-xs hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
      {image && <img src={image} className="w-4 h-4 mr-1 rounded-full" alt="Icon" />}
      <div className="font-bold flex-1 flex items-center">
        <span>{translatedTitle}</span>
        {tooltip && (
          <span title={t(tooltip)} className="flex items-center">
            <HelpCircle className="w-3 h-3 ml-1 cursor-pointer text-text-light hover:text-text-base" />
          </span>
        )}
      </div>
      <div className="ml-auto flex items-center text-[10px]">
        {t('COMMON.SEE_MORE')} <ChevronRight className="w-3 h-3 ml-1" />
      </div>
    </div>
  )

  return (
    <div className="main-section rounded-lg bg-background-light flex flex-col h-full shadow-sm overflow-hidden">
      {link ? (
        <Link href={link} className="block group">
          <div className="group-hover:underline decoration-text-stress">{content}</div>
        </Link>
      ) : (
        <div className="cursor-pointer">{content}</div>
      )}
      <div className="relative px-2 pb-2 flex-1 flex flex-col">
        <div className="max-h-[336px] overflow-y-auto flex-1 pretty-scrollbar">{children}</div>
      </div>
    </div>
  )
}
