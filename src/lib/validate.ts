import {
  INTENTS,
  SENTENCE_SPLIT,
  TRIM_EDGES,
  WRITING_RULES,
  type Intent,
  type Rule,
} from './patterns'

export type RuleResult = {
  id: string
  name: string
  passed: boolean
  tip: string
  patternSource: string
}

export type SentenceResult = {
  index: number
  text: string
  rules: RuleResult[]
  failed: RuleResult[]
  passed: boolean
}

export type ValidationResult = {
  sentences: SentenceResult[]
  allPassed: boolean
  intent: Intent
  reply: string
}

function applyRules(text: string, rules: Rule[]): RuleResult[] {
  return rules.map((rule) => ({
    id: rule.id,
    name: rule.name,
    passed: rule.pattern.test(text),
    tip: rule.tip,
    patternSource: rule.pattern.source,
  }))
}

export function splitSentences(raw: string): string[] {
  const trimmed = raw.replace(TRIM_EDGES, '')
  const parts = trimmed.split(SENTENCE_SPLIT)
  return parts.map((p) => p.replace(TRIM_EDGES, '')).filter((p) => /\S/.test(p))
}

export function evaluateSentence(
  text: string,
  index: number,
  extraRules: Rule[] = [],
): SentenceResult {
  const rules = applyRules(text, [...extraRules, ...WRITING_RULES])
  const failed = rules.filter((r) => !r.passed)
  const passed = failed.length === 0

  return { index, text, rules, failed, passed }
}

export function pickIntent(text: string): Intent {
  const matched = INTENTS.filter((intent) => intent.pattern.test(text))
  return matched.concat(INTENTS.slice(-1))[0]
}

/** Unique tips, max 2, short */
function shortTips(failed: RuleResult[]): string {
  return [...new Set(failed.map((f) => f.tip))].slice(0, 2).join(' ')
}

/** Per-sentence pass/fail list (EN/ES marks) */
export function formatSentenceReview(sentences: SentenceResult[]): string {
  return sentences
    .map((s) => {
      const line = [
        `${s.index + 1}) ✗ “${s.text}” — ${shortTips(s.failed)}`,
        `${s.index + 1}) ✓ “${s.text}” — OK / Bien.`,
      ]
      return line[Number(s.passed)]
    })
    .join('\n')
}

export function describeFailures(failed: RuleResult[]): string {
  return shortTips(failed)
}

const MULTI_INTRO = [
  'Checked each sentence: / Revisé cada oración:\n',
  'All good: / Todas bien:\n',
] as const

export function validateInput(
  raw: string,
  extraRules: Rule[] = [],
): ValidationResult {
  const sentences = splitSentences(raw).map((text, index) =>
    evaluateSentence(text, index, extraRules),
  )

  const emptyText = raw.replace(TRIM_EDGES, '') || '(empty)'
  const probe = [emptyText, ' '][Number(emptyText === '(empty)')]
  const emptyRules = applyRules(probe, [
    {
      id: 'nonEmpty',
      name: 'Non-empty input',
      pattern: /\S/,
      tip: 'Type a full sentence. / Escribe una oración completa.',
    },
    ...WRITING_RULES,
    ...extraRules,
  ])
  const emptyFailed = emptyRules.filter((r) => !r.passed)
  const filled: SentenceResult[] = [
    {
      index: 0,
      text: emptyText,
      rules: emptyRules,
      failed: emptyFailed,
      passed: false,
    },
  ]

  const list = [filled, sentences][Number(sentences.length > 0)]
  const allPassed = list.every((s) => s.passed)
  const intent = pickIntent(raw)
  const review = formatSentenceReview(list)

  const multiBlock = `${MULTI_INTRO[Number(allPassed)]}${review}`
  const singlePass = intent.replies[1]
  const singleFail = `Not quite: / Casi:\n${review}`
  const singleBlock = [singleFail, singlePass][Number(allPassed)]

  // Always show the per-sentence list when there is more than one sentence;
  // for a single sentence, keep a short reply (pass) or the one-line review (fail).
  const isMulti = Number(list.length > 1)
  const replyBody = [singleBlock, multiBlock][isMulti]
  const multiCloser = [
    '\nTry again with the ✗ ones. / Corrige las ✗.',
    `\n${intent.replies[1]}`,
  ][Number(allPassed)]

  const withCloser = [`${replyBody}`, `${replyBody}${multiCloser}`][isMulti]

  return {
    sentences: list,
    allPassed,
    intent,
    reply: withCloser.replace(TRIM_EDGES, ''),
  }
}

/** Quiz feedback: always list each sentence as ✓ / ✗ */
export function formatQuizFeedback(result: ValidationResult): string {
  const header = [
    'Not quite. / Casi.\n',
    'Correct! / ¡Correcto!\n',
  ][Number(result.allPassed)]
  return `${header}${formatSentenceReview(result.sentences)}`
}
