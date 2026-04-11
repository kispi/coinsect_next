import React from 'react';
import Link from 'next/link';
import { ChevronRight, HelpCircle } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';

interface MainSectionProps {
  title: string;
  link?: string;
  image?: string;
  tooltip?: string;
  children: React.ReactNode;
}

export default function MainSection({ title, link, image, tooltip, children }: MainSectionProps) {
  const { i18n } = useI18n();
  // Attempt translation mapping if needed. Just rendering title for now.
  const translatedTitle = i18n(title) === title ? title : i18n(title); 

  const content = (
    <div className="flex justify-between items-center p-2 mb-2 text-text-stress border-b border-border-base text-xs hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
      {image && <img src={image} className="w-4 h-4 mr-1 rounded-full" alt="Icon" />}
      <div className="font-bold flex-1 flex items-center">
        <span>{translatedTitle}</span>
        {tooltip && (
          <span title={i18n(tooltip)} className="flex items-center">
            <HelpCircle className="w-3 h-3 ml-1 cursor-pointer text-text-muted hover:text-text-base" />
          </span>
        )}
      </div>
      <div className="ml-auto flex items-center text-[10px]">
        {i18n('SEE_MORE')} <ChevronRight className="w-3 h-3 ml-1" />
      </div>
    </div>
  );

  return (
    <div className="rounded-lg bg-background-light dark:bg-zinc-900 flex flex-col h-full shadow-sm">
      {link ? (
        <Link href={link} className="block group">
          <div className="group-hover:underline">
            {content}
          </div>
        </Link>
      ) : (
        <div className="cursor-pointer">{content}</div>
      )}
      <div className="relative px-2 pb-2 flex-1 flex flex-col">
        <div className="max-h-[336px] overflow-y-auto flex-1 pretty-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
}
