import { SCORE_HEADLINE } from '@/lib/responses'

export type QuizMiss = {
  questionId: string
  prompt: string
  answer: string
  explanation: string
}

type ScoreSummaryProps = {
  correct: number
  incorrect: number
  misses: QuizMiss[]
  onRestart: () => void
}

export function ScoreSummary({
  correct,
  incorrect,
  misses,
  onRestart,
}: ScoreSummaryProps) {
  const total = correct + incorrect
  const perfect = Number(incorrect === 0 && total > 0)
  const percent = [0, Math.round((correct / Math.max(total, 1)) * 100)][
    Number(total > 0)
  ]

  return (
    <div className="flex h-full min-h-0 flex-col overflow-y-auto px-4 py-6">
      <div className="mx-auto w-full max-w-lg rounded-2xl border border-[#E4E6EB] bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-[#1877F2]">
          Mini evaluation complete
        </p>
        <h2 className="mt-2 text-2xl font-bold text-[#050505]">
          {SCORE_HEADLINE[perfect]}
        </h2>
        <div className="mt-6 grid grid-cols-3 gap-3 text-center">
          <div className="rounded-xl bg-[#E7F3FF] px-3 py-4">
            <p className="text-2xl font-bold text-[#1877F2]">{correct}</p>
            <p className="text-xs font-medium text-[#65676B]">Correct</p>
          </div>
          <div className="rounded-xl bg-[#F0F2F5] px-3 py-4">
            <p className="text-2xl font-bold text-[#050505]">{incorrect}</p>
            <p className="text-xs font-medium text-[#65676B]">Incorrect</p>
          </div>
          <div className="rounded-xl bg-[#F0F2F5] px-3 py-4">
            <p className="text-2xl font-bold text-[#050505]">{percent}%</p>
            <p className="text-xs font-medium text-[#65676B]">Score</p>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {misses.map((m) => (
            <div
              key={m.questionId}
              className="rounded-xl border border-[#E4E6EB] bg-[#F7F8FA] p-3 text-sm"
            >
              <p className="font-semibold text-[#050505]">{m.prompt}</p>
              <p className="mt-1 text-[#65676B]">
                Your answer: &ldquo;{m.answer}&rdquo;
              </p>
              <p className="mt-2 whitespace-pre-wrap text-[#050505]">
                {m.explanation}
              </p>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={onRestart}
          className="mt-6 w-full rounded-xl bg-[#1877F2] py-2.5 text-sm font-semibold text-white hover:bg-[#166FE5]"
        >
          Try quiz again
        </button>
      </div>
    </div>
  )
}
