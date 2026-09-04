import { useState } from 'react'
import { Menu, MessageSquarePlus, X } from 'lucide-react'
import { ChatMode } from '@/components/ChatMode'
import { cn } from '@/lib/utils'
import { WELCOME } from '@/lib/responses'
import type { ChatMessage } from '@/components/MessageBubble'

export type Conversation = {
  id: string
  title: string
  messages: ChatMessage[]
  updatedAt: number
}

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function createConversation(): Conversation {
  return {
    id: uid(),
    title: 'New chat',
    messages: [{ id: 'welcome', role: 'bot', text: WELCOME }],
    updatedAt: Date.now(),
  }
}

function titleFromMessages(messages: ChatMessage[]): string {
  const firstUser = messages.find((m) => m.role === 'user')
  if (!firstUser) return 'New chat'
  const t = firstUser.text.replace(/\s+/g, ' ').trim()
  return t.length > 36 ? `${t.slice(0, 36)}…` : t
}

export default function App() {
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const first = createConversation()
    return [first]
  })
  const [activeId, setActiveId] = useState(() => conversations[0].id)
  const [mobileNav, setMobileNav] = useState(false)

  const active =
    conversations.find((c) => c.id === activeId) ?? conversations[0]

  function newChat() {
    const c = createConversation()
    setConversations((prev) => [c, ...prev])
    setActiveId(c.id)
    setMobileNav(false)
  }

  function selectChat(id: string) {
    setActiveId(id)
    setMobileNav(false)
  }

  function updateActive(messages: ChatMessage[]) {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeId
          ? {
              ...c,
              messages,
              title: titleFromMessages(messages),
              updatedAt: Date.now(),
            }
          : c,
      ),
    )
  }

  return (
    <div className="flex h-svh max-h-svh w-full overflow-hidden bg-[#F7F8FA]">
      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/40 transition-opacity md:hidden',
          mobileNav ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={() => setMobileNav(false)}
        aria-hidden={!mobileNav}
      />

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-[min(100%,280px)] flex-col border-r border-[#E4E6EB] bg-[#F0F2F5] transition-transform duration-200 md:static md:z-0 md:w-64 md:translate-x-0 lg:w-72',
          mobileNav ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
        )}
      >
        <div className="flex h-14 shrink-0 items-center justify-between gap-2 border-b border-[#E4E6EB] px-3">
          <div className="flex min-w-0 items-center gap-2">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#E7F3FF] text-base ring-1 ring-[#CCD0D5]">
              😊
            </span>
            <span className="truncate font-semibold text-[#1877F2]">BeBot</span>
          </div>
          <button
            type="button"
            className="rounded-lg p-2 text-[#65676B] hover:bg-[#E4E6EB] md:hidden"
            onClick={() => setMobileNav(false)}
            aria-label="Close menu"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="p-3">
          <button
            type="button"
            onClick={newChat}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1877F2] px-3 py-2.5 text-sm font-semibold text-white hover:bg-[#166FE5]"
          >
            <MessageSquarePlus className="size-4" />
            New chat
          </button>
        </div>

        <nav className="min-h-0 flex-1 overflow-y-auto px-2 pb-4">
          <p className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-wide text-[#8A8D91]">
            History
          </p>
          <ul className="space-y-0.5">
            {conversations.map((c) => (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => selectChat(c.id)}
                  className={cn(
                    'w-full truncate rounded-lg px-3 py-2.5 text-left text-sm transition-colors',
                    c.id === active.id
                      ? 'bg-white font-medium text-[#1877F2] shadow-sm ring-1 ring-[#E4E6EB]'
                      : 'text-[#050505] hover:bg-white/70',
                  )}
                >
                  {c.title}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col bg-white">
        <header className="flex h-14 shrink-0 items-center gap-3 border-b border-[#E4E6EB] px-3 sm:px-4">
          <button
            type="button"
            className="rounded-lg p-2 text-[#65676B] hover:bg-[#F0F2F5] md:hidden"
            onClick={() => setMobileNav(true)}
            aria-label="Open chat history"
          >
            <Menu className="size-5" />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-sm font-semibold sm:text-base">
              {active.title}
            </h1>
            <p className="truncate text-xs text-[#65676B]">
              Practice to be · present & past
            </p>
          </div>
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#E7F3FF] text-lg ring-1 ring-[#CCD0D5]">
            😊
          </div>
        </header>

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <ChatMode
            key={active.id}
            initialMessages={active.messages}
            onMessagesChange={updateActive}
          />
        </div>
      </div>
    </div>
  )
}
