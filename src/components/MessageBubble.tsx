import { cn } from '@/lib/utils'

export type ChatMessage = {
  id: string
  role: 'user' | 'bot'
  text: string
}

type MessageBubbleProps = {
  message: ChatMessage
}

function BotAvatar() {
  return (
    <div
      className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-[#E7F3FF] text-base shadow-sm ring-1 ring-[#CCD0D5] sm:size-9 sm:text-lg"
      aria-hidden
    >
      😊
    </div>
  )
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user'

  return (
    <div
      className={cn(
        'flex w-full gap-2.5 sm:gap-3',
        isUser ? 'justify-end' : 'justify-start',
      )}
    >
      {!isUser && <BotAvatar />}
      <div
        className={cn(
          'max-w-[min(100%,42rem)] whitespace-pre-wrap break-words rounded-2xl px-3.5 py-2.5 text-[14px] leading-relaxed sm:text-[15px]',
          isUser
            ? 'rounded-br-md bg-[#1877F2] text-white shadow-sm'
            : 'rounded-bl-md border border-[#E4E6EB] bg-[#F0F2F5] text-[#050505]',
        )}
      >
        {message.text}
      </div>
    </div>
  )
}
