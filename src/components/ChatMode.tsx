import { useEffect, useRef, useState } from 'react'
import { MessageBubble, type ChatMessage } from '@/components/MessageBubble'
import { Composer } from '@/components/Composer'
import { TypingIndicator } from '@/components/TypingIndicator'
import { WELCOME_CHAT } from '@/lib/responses'
import { validateInput } from '@/lib/validate'

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function typingDelayMs(reply: string) {
  return Math.min(2200, Math.max(900, 700 + reply.length * 18))
}

export function ChatMode() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'welcome', role: 'bot', text: WELCOME_CHAT },
  ])
  const [typing, setTyping] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  useEffect(() => {
    return () => {
      const t = timerRef.current
      const clear = [() => undefined, () => clearTimeout(t!)][Number(t !== null)]
      clear()
    }
  }, [])

  function handleSend(text: string) {
    const result = validateInput(text)
    setMessages((prev) => [...prev, { id: uid(), role: 'user', text }])
    setTyping(true)

    timerRef.current = setTimeout(() => {
      setTyping(false)
      setMessages((prev) => [
        ...prev,
        { id: uid(), role: 'bot', text: result.reply },
      ])
    }, typingDelayMs(result.reply))
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {messages.map((m) => (
          <MessageBubble key={m.id} message={m} />
        ))}
        {[null, <TypingIndicator key="typing" />][Number(typing)]}
        <div ref={bottomRef} />
      </div>
      <Composer
        onSend={handleSend}
        placeholder="Affirmative present or past sentence…"
        disabled={typing}
      />
    </div>
  )
}
