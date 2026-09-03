export function TypingIndicator() {
  return (
    <div className="flex w-full justify-start">
      <div
        className="flex items-center gap-1 rounded-2xl rounded-bl-md border border-[#E4E6EB] bg-[#F0F2F5] px-4 py-3 shadow-sm"
        aria-label="Bot is typing"
      >
        <span className="typing-dot size-2 rounded-full bg-[#65676B]" />
        <span className="typing-dot size-2 rounded-full bg-[#65676B]" />
        <span className="typing-dot size-2 rounded-full bg-[#65676B]" />
      </div>
    </div>
  )
}
