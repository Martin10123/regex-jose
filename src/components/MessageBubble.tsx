import { cn } from '@/lib/utils'

export type ChatMessage = {
  id: string
  role: 'user' | 'bot'
  text: string
}

type MessageBubbleProps = {
  message: ChatMessage
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user'

  return (
    <div
      className={cn('flex w-full', isUser ? 'justify-end' : 'justify-start')}
    >
      <div
        className={cn(
          'max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-[15px] leading-relaxed shadow-sm',
          isUser
            ? 'rounded-br-md bg-[#1877F2] text-white'
            : 'rounded-bl-md border border-[#E4E6EB] bg-[#F0F2F5] text-[#050505]',
        )}
      >
        {message.text}
      </div>
    </div>
  )
}
