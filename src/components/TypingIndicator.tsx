import { cn } from '@/lib/utils'

export function TypingIndicator() {
  return (
    <div className="flex w-full items-end gap-2 justify-start">
      <div
        className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#E7F3FF] text-lg shadow-sm ring-1 ring-[#CCD0D5]"
        aria-hidden
      >
        😊
      </div>
      <div
        className={cn(
          'flex items-center gap-1 rounded-2xl rounded-bl-md border border-[#E4E6EB] bg-[#F0F2F5] px-4 py-3 shadow-sm',
        )}
        aria-label="Bot is typing"
      >
        <span className="typing-dot size-2 rounded-full bg-[#65676B]" />
        <span className="typing-dot size-2 rounded-full bg-[#65676B]" />
        <span className="typing-dot size-2 rounded-full bg-[#65676B]" />
      </div>
    </div>
  )
}
