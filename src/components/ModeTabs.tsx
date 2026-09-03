import { cn } from '@/lib/utils'

type Mode = 'chat' | 'quiz'

type ModeTabsProps = {
  mode: Mode
  onChange: (mode: Mode) => void
}

export function ModeTabs({ mode, onChange }: ModeTabsProps) {
  return (
    <div
      className="inline-flex rounded-full bg-[#E4E6EB] p-1"
      role="tablist"
      aria-label="App mode"
    >
      {(
        [
          ['chat', 'Chat'],
          ['quiz', 'Quiz'],
        ] as const
      ).map(([id, label]) => (
        <button
          key={id}
          type="button"
          role="tab"
          aria-selected={mode === id}
          onClick={() => onChange(id)}
          className={cn(
            'rounded-full px-4 py-1.5 text-sm font-semibold transition-colors',
            mode === id
              ? 'bg-white text-[#1877F2] shadow-sm'
              : 'text-[#65676B] hover:text-[#050505]',
          )}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
