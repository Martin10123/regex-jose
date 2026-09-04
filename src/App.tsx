import { ChatMode } from '@/components/ChatMode'

export default function App() {
  return (
    <div className="flex min-h-svh flex-col bg-[#F0F2F5]">
      <header className="sticky top-0 z-10 border-b border-[#E4E6EB] bg-white shadow-sm">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-[#E7F3FF] text-xl ring-1 ring-[#CCD0D5]">
            😊
          </div>
          <div>
            <h1 className="text-lg font-bold text-[#1877F2]">BeBot</h1>
            <p className="text-xs text-[#65676B]">
              Chat + practice · to be (present & past)
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col overflow-hidden bg-white shadow-sm sm:my-4 sm:min-h-[min(720px,calc(100svh-5rem))] sm:rounded-2xl sm:border sm:border-[#E4E6EB]">
        <ChatMode />
      </main>
    </div>
  )
}
