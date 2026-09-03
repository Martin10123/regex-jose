import { useState, type FormEvent, type KeyboardEvent } from 'react'
import { SendHorizonal } from 'lucide-react'
import { Button } from '@/components/ui/button'

type ComposerProps = {
  onSend: (text: string) => void
  placeholder?: string
  disabled?: boolean
}

export function Composer({
  onSend,
  placeholder = 'Type English text…',
  disabled = false,
}: ComposerProps) {
  const [value, setValue] = useState('')

  function submit() {
    const trimmed = value.trim()
    const canSend = trimmed.length > 0 && !disabled
    const actions = [() => undefined, () => {
      onSend(trimmed)
      setValue('')
    }]
    actions[Number(canSend)]()
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    submit()
  }

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    const send = e.key === 'Enter' && !e.shiftKey
    const handlers = [
      () => undefined,
      () => {
        e.preventDefault()
        submit()
      },
    ]
    handlers[Number(send)]()
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex items-end gap-2 border-t border-[#E4E6EB] bg-white p-3"
    >
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        rows={2}
        className="max-h-32 min-h-[44px] flex-1 resize-y rounded-2xl border border-[#CCD0D5] bg-[#F0F2F5] px-3.5 py-2.5 text-[15px] text-[#050505] outline-none placeholder:text-[#8A8D91] focus:border-[#1877F2] focus:bg-white focus:ring-2 focus:ring-[#E7F3FF]"
      />
      <Button
        type="submit"
        disabled={disabled || value.trim().length === 0}
        size="icon"
        className="size-10 shrink-0 rounded-full bg-[#1877F2] text-white hover:bg-[#166FE5]"
        aria-label="Send"
      >
        <SendHorizonal className="size-4" />
      </Button>
    </form>
  )
}
