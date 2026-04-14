'use client'

import React, { useRef, useState, useEffect } from 'react'
import { useChatStore, useConfigStore, useT } from '@/store/StoreProvider'
import EmojiPicker from './EmojiPicker'
import { Image as ImageIcon, Send, X, Smile } from 'lucide-react'

export default function AppChatInput() {
  const { t } = useT()
  const sendMessage = useChatStore((s) => s.sendMessage)
  const writingReplyTo = useChatStore((s) => s.writingReplyTo)
  const setWritingReplyTo = useChatStore((s) => s.setWritingReplyTo)
  const config = useConfigStore((s) => s.config)

  const [text, setText] = useState('')
  const [showEmojis, setShowEmojis] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const onPickEmoji = (type: string) => {
    if (!config?.emojis) return
    const emoji = config.emojis[type]?.emoji || ''
    if (!textareaRef.current) return

    const start = textareaRef.current.selectionStart
    const end = textareaRef.current.selectionEnd
    const newText = text.substring(0, start) + emoji + text.substring(end)
    setText(newText)
    setShowEmojis(false)

    // Focus back and set cursor position after render
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus()
        const newPos = start + emoji.length
        textareaRef.current.setSelectionRange(newPos, newPos)
      }
    }, 0)
  }

  const handleSend = (incomingText: string, type = 'text') => {
    const trimmed = (incomingText || '').trim()
    if (!trimmed) return

    let meta: any = null
    if (writingReplyTo) {
      meta = {
        replyTo: {
          id: writingReplyTo.id,
          text: writingReplyTo.text,
          nickname: writingReplyTo.user.profile.nickname,
        },
      }
      setWritingReplyTo(null)
    }

    sendMessage(trimmed, type, meta)

    setText('')
    if (textareaRef.current) textareaRef.current.focus()
  }

  const onKeydown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      if (e.nativeEvent.isComposing) return
      if (e.shiftKey) return

      e.preventDefault()
      handleSend(text)
    }
  }

  const chatFunctions = {
    image: async () => {
      // Replicating Vue logic: ModalUploadImage (Placeholder for now)
      // In real app, this would open a modal and return a URL
      console.log('Image upload clicked')
    },
  }

  useEffect(() => {
    if (textareaRef.current) textareaRef.current.focus()
  }, [])

  return (
    <div className="app-chat-input p-2 pb-4 relative">
      {showEmojis && (
        <EmojiPicker
          onPick={onPickEmoji}
          onClose={() => setShowEmojis(false)}
          className="absolute bottom-[70px] left-2 right-2 z-10"
        />
      )}

      {writingReplyTo && (
        <div className="writing-reply-to absolute bottom-[72px] left-2 right-2 bg-background-base border border-border-base p-2 rounded-lg flex items-center gap-2 shadow-lg z-[5] animate-in slide-in-from-bottom-2 duration-200">
          <div className="flex-1 min-w-0">
            <div className="text-[10px] text-text-light font-bold opacity-60 uppercase">
              To: {writingReplyTo.user.profile.nickname}
            </div>
            <div
              className="text-xs text-text-stress truncate"
              dangerouslySetInnerHTML={{ __html: writingReplyTo.text }}
            />
          </div>
          <button
            onClick={() => setWritingReplyTo(null)}
            className="p-1 hover:bg-white/10 rounded transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="textarea-wrapper bg-background-light rounded-lg flex items-center p-2 gap-2 border border-transparent focus-within:border-primary/30 transition-colors">
        <div className="functions flex flex-col gap-2 border-r border-border-base pr-2 mr-1">
          <button
            onClick={chatFunctions.image}
            className="text-text-stress hover:opacity-60 transition-opacity cursor-pointer p-0.5"
            title="Image"
          >
            <ImageIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowEmojis(!showEmojis)}
            className="text-text-stress hover:opacity-60 transition-opacity cursor-pointer p-0.5"
            title="Emoji"
          >
            <Smile className="w-4 h-4" />
          </button>
        </div>

        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onKeydown}
          maxLength={255}
          placeholder={t('APP_CHAT.PLACEHOLDER')}
          className="flex-1 bg-transparent border-none outline-none resize-none text-xs text-text-stress h-11 no-scrollbar leading-relaxed"
        />

        {text.trim() && (
          <button
            onClick={() => handleSend(text)}
            className="p-2 text-primary hover:scale-110 transition-transform cursor-pointer"
          >
            <Send className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  )
}
