import { useEffect, useRef, useState } from 'react'
import { MessageBubble, type ChatMessage } from '@/components/MessageBubble'
import { Composer } from '@/components/Composer'
import { TypingIndicator } from '@/components/TypingIndicator'
import { WELCOME } from '@/lib/responses'
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

export function ChatMode() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'welcome', role: 'bot', text: WELCOME },
  ])
  const [typing, setTyping] = useState(false)
  const [awaitingContinue, setAwaitingContinue] = useState(false)
  const [session, setSession] = useState<SessionEntry[]>([])
  const bottomRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const awaitingRef = useRef(awaitingContinue)
  const sessionRef = useRef(session)

  awaitingRef.current = awaitingContinue
  sessionRef.current = session

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  function handleSend(text: string) {
    const result = handleUserMessage(
      text,
      awaitingRef.current,
      sessionRef.current,
    )

    setMessages((prev) => [...prev, { id: uid(), role: 'user', text }])
    setTyping(true)

    timerRef.current = setTimeout(() => {
      setTyping(false)
      setAwaitingContinue(result.nextAwaiting)
      setSession(result.nextSession)
      setMessages((prev) => [
        ...prev,
        { id: uid(), role: 'bot', text: result.reply.text },
      ])
    }, typingDelayMs(result.reply.text))
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {messages.map((m) => (
          <MessageBubble key={m.id} message={m} />
        ))}
        {typing ? <TypingIndicator /> : null}
        <div ref={bottomRef} />
      </div>
      <Composer
        onSend={handleSend}
        placeholder={
          awaitingContinue
            ? 'yes / no…'
            : 'Hi, or try: I am a student.'
        }
        disabled={typing}
      />
    </div>
  )
}
