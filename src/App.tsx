import { useState } from 'react'
import { ChatMode } from '@/components/ChatMode'
import { ModeTabs } from '@/components/ModeTabs'
import { QuizMode } from '@/components/QuizMode'

type Mode = 'chat' | 'quiz'

export default function App() {
  const [mode, setMode] = useState<Mode>('chat')

  const panels = {
    chat: <ChatMode />,
    quiz: <QuizMode />,
  }

  return (
    <div className="flex min-h-svh flex-col bg-[#F0F2F5]">
      <header className="sticky top-0 z-10 border-b border-[#E4E6EB] bg-white shadow-sm">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3">
          <div>
            <h1 className="text-lg font-bold text-[#1877F2]">Regex Coach</h1>
            <p className="text-xs text-[#65676B]">
              Affirmative sentences · present & past tense
            </p>
          </div>
          <ModeTabs mode={mode} onChange={setMode} />
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col overflow-hidden bg-white shadow-sm sm:my-4 sm:min-h-[min(720px,calc(100svh-5rem))] sm:rounded-2xl sm:border sm:border-[#E4E6EB]">
        {panels[mode]}
      </main>
    </div>
  )
}
