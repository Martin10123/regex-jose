import { useEffect, useRef, useState } from 'react'
import { MessageBubble, type ChatMessage } from '@/components/MessageBubble'
import { Composer } from '@/components/Composer'
import { TypingIndicator } from '@/components/TypingIndicator'
import {
  handleUserMessage,
  type SessionEntry,
} from '@/lib/validate'

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function typingDelayMs(reply: string) {
  return Math.min(2000, Math.max(800, 600 + reply.length * 12))
}

type ChatModeProps = {
  initialMessages: ChatMessage[]
  onMessagesChange: (messages: ChatMessage[]) => void
}

export function ChatMode({ initialMessages, onMessagesChange }: ChatModeProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [typing, setTyping] = useState(false)
  const [awaitingContinue, setAwaitingContinue] = useState(false)
  const [session, setSession] = useState<SessionEntry[]>([])
  const scrollRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const awaitingRef = useRef(awaitingContinue)
  const sessionRef = useRef(session)
  const onChangeRef = useRef(onMessagesChange)

  awaitingRef.current = awaitingContinue
  sessionRef.current = session
  onChangeRef.current = onMessagesChange

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages, typing])

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  function commitMessages(next: ChatMessage[]) {
    setMessages(next)
    onChangeRef.current(next)
  }

  function handleSend(text: string) {
    const result = handleUserMessage(
      text,
      awaitingRef.current,
      sessionRef.current,
    )

    const withUser = [...messages, { id: uid(), role: 'user' as const, text }]
    commitMessages(withUser)
    setTyping(true)

    timerRef.current = setTimeout(() => {
      setTyping(false)
      setAwaitingContinue(result.nextAwaiting)
      setSession(result.nextSession)
      commitMessages([
        ...withUser,
        { id: uid(), role: 'bot', text: result.reply.text },
      ])
    }, typingDelayMs(result.reply.text))
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div
        ref={scrollRef}
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain"
      >
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-3 py-4 sm:px-6 sm:py-6">
          {messages.map((m) => (
            <MessageBubble key={m.id} message={m} />
          ))}
          {typing ? <TypingIndicator /> : null}
          <div ref={bottomRef} className="h-px shrink-0" />
        </div>
      </div>

      <div className="shrink-0 border-t border-[#E4E6EB] bg-white">
        <div className="mx-auto w-full max-w-3xl px-3 py-3 sm:px-6 sm:py-4">
          <Composer
            onSend={handleSend}
            placeholder={
              awaitingContinue
                ? 'yes / no…'
                : 'Message BeBot…'
            }
            disabled={typing}
          />
          <p className="mt-2 text-center text-[11px] text-[#8A8D91]">
            Enter to send · Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  )
}
