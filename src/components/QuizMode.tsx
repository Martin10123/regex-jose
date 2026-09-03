import { useEffect, useRef, useState } from 'react'
import { Composer } from '@/components/Composer'
import { MessageBubble, type ChatMessage } from '@/components/MessageBubble'
import { ScoreSummary, type QuizMiss } from '@/components/ScoreSummary'
import { TypingIndicator } from '@/components/TypingIndicator'
import { QUIZ_QUESTIONS } from '@/lib/quiz'
import { QUIZ_PROGRESS, WELCOME_QUIZ } from '@/lib/responses'
import { formatQuizFeedback, validateInput } from '@/lib/validate'

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function typingDelayMs(reply: string) {
  return Math.min(2200, Math.max(900, 700 + reply.length * 18))
}

const TOTAL = QUIZ_QUESTIONS.length

export function QuizMode() {
  const [index, setIndex] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [incorrect, setIncorrect] = useState(0)
  const [misses, setMisses] = useState<QuizMiss[]>([])
  const [done, setDone] = useState(false)
  const [typing, setTyping] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'quiz-welcome', role: 'bot', text: WELCOME_QUIZ },
    {
      id: 'q0',
      role: 'bot',
      text: `${QUIZ_PROGRESS(1, TOTAL)}\n\n${QUIZ_QUESTIONS[0].prompt}\n\nHint: ${QUIZ_QUESTIONS[0].hint}`,
    },
  ])
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      const t = timerRef.current
      const clear = [() => undefined, () => clearTimeout(t!)][Number(t !== null)]
      clear()
    }
  }, [])

  function restart() {
    setIndex(0)
    setCorrect(0)
    setIncorrect(0)
    setMisses([])
    setDone(false)
    setTyping(false)
    setMessages([
      { id: uid(), role: 'bot', text: WELCOME_QUIZ },
      {
        id: uid(),
        role: 'bot',
        text: `${QUIZ_PROGRESS(1, TOTAL)}\n\n${QUIZ_QUESTIONS[0].prompt}\n\nHint: ${QUIZ_QUESTIONS[0].hint}`,
      },
    ])
  }

  function handleSend(text: string) {
    const question = QUIZ_QUESTIONS[index]
    const result = validateInput(text, question.extraRules)
    const passed = result.allPassed
    const feedback = formatQuizFeedback(result)

    const nextCorrect = correct + Number(passed)
    const nextIncorrect = incorrect + Number(!passed)
    const nextMisses = [
      misses,
      [
        ...misses,
        {
          questionId: question.id,
          prompt: question.prompt,
          answer: text,
          explanation: formatQuizFeedback(result),
        },
      ],
    ][Number(!passed)]

    const nextIndex = index + 1
    const finished = nextIndex >= TOTAL

    setMessages((prev) => [...prev, { id: uid(), role: 'user', text }])
    setTyping(true)

    timerRef.current = setTimeout(() => {
      const botBits: ChatMessage[] = [
        { id: uid(), role: 'bot', text: feedback },
      ]
      const nextPrompt = {
        id: uid(),
        role: 'bot' as const,
        text: `${QUIZ_PROGRESS(nextIndex + 1, TOTAL)}\n\n${QUIZ_QUESTIONS[nextIndex]?.prompt}\n\nHint: ${QUIZ_QUESTIONS[nextIndex]?.hint}`,
      }
      const withNext = [
        botBits,
        [...botBits, nextPrompt],
      ][Number(!finished)]

      setTyping(false)
      setMessages((prev) => [...prev, ...withNext])
      setCorrect(nextCorrect)
      setIncorrect(nextIncorrect)
      setMisses(nextMisses)
      setIndex(nextIndex)
      setDone(finished)
    }, typingDelayMs(feedback))
  }

  const panels = [
    <div key="quiz-active" className="flex h-full min-h-0 flex-col">
      <div className="flex items-center justify-between border-b border-[#E4E6EB] bg-[#E7F3FF] px-4 py-2 text-sm">
        <span className="font-semibold text-[#1877F2]">
          {QUIZ_PROGRESS(Math.min(index + 1, TOTAL), TOTAL)}
        </span>
        <span className="text-[#65676B]">
          Correct: {correct} · Incorrect: {incorrect}
        </span>
      </div>
      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {messages.map((m) => (
          <MessageBubble key={m.id} message={m} />
        ))}
        {[null, <TypingIndicator key="typing" />][Number(typing)]}
      </div>
      <Composer
        onSend={handleSend}
        placeholder="Affirmative present or past sentence…"
        disabled={done || typing}
      />
    </div>,
    <ScoreSummary
      key="quiz-done"
      correct={correct}
      incorrect={incorrect}
      misses={misses}
      onRestart={restart}
    />,
  ]

  return panels[Number(done)]
}
