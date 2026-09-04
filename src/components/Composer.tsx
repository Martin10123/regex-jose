import { useLayoutEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { SendHorizonal } from 'lucide-react'
import { Button } from '@/components/ui/button'

type ComposerProps = {
  onSend: (text: string) => void
  placeholder?: string
  disabled?: boolean
}

const MAX_HEIGHT = 120

export function Composer({
  onSend,
  placeholder = 'Message BeBot…',
  disabled = false,
}: ComposerProps) {
  const [value, setValue] = useState('')
  const taRef = useRef<HTMLTextAreaElement>(null)

  useLayoutEffect(() => {
    const el = taRef.current
    if (!el) return
    el.style.height = '44px'
    const next = Math.min(el.scrollHeight, MAX_HEIGHT)
    el.style.height = `${next}px`
    el.style.overflowY = el.scrollHeight > MAX_HEIGHT ? 'auto' : 'hidden'
  }, [value])

  function submit() {
    const trimmed = value.trim()
    if (!trimmed || disabled) return
    onSend(trimmed)
    setValue('')
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    submit()
  }

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex items-end gap-2 rounded-2xl border border-[#CCD0D5] bg-[#F0F2F5] p-1.5 shadow-sm focus-within:border-[#1877F2] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#E7F3FF]"
    >
      <textarea
        ref={taRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        rows={1}
        className="max-h-[120px] min-h-[44px] flex-1 resize-none border-0 bg-transparent px-3 py-2.5 text-[15px] leading-snug text-[#050505] outline-none placeholder:text-[#8A8D91] disabled:opacity-60"
      />
      <Button
        type="submit"
        disabled={disabled || value.trim().length === 0}
        size="icon"
        className="mb-0.5 size-10 shrink-0 rounded-full bg-[#1877F2] text-white hover:bg-[#166FE5] disabled:opacity-40"
        aria-label="Send"
      >
        <SendHorizonal className="size-4" />
      </Button>
    </form>
  )
}
