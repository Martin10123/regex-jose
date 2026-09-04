export function TypingIndicator() {
  return (
    <div className="flex w-full items-end gap-2.5 justify-start sm:gap-3">
      <div
        className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#E7F3FF] text-base shadow-sm ring-1 ring-[#CCD0D5] sm:size-9 sm:text-lg"
        aria-hidden
      >
        😊
      </div>
      <div
        className="flex items-center gap-1 rounded-2xl rounded-bl-md border border-[#E4E6EB] bg-[#F0F2F5] px-4 py-3"
        aria-label="Bot is typing"
      >
        <span className="typing-dot size-2 rounded-full bg-[#65676B]" />
        <span className="typing-dot size-2 rounded-full bg-[#65676B]" />
        <span className="typing-dot size-2 rounded-full bg-[#65676B]" />
      </div>
    </div>
  )
}
