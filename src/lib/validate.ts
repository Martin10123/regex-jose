import {
  BEBOT_PATTERNS,
  CHAT_INTENTS,
  ERROR_HINTS,
  LOOKS_LIKE_ENGLISH,
  MULTI_SPACE,
  NO_PATTERN,
  SENTENCE_SPLIT,
  TRAILING_PUNCT,
  TRIM_EDGES,
  YES_PATTERN,
  type Rule,
} from './patterns'

export type SessionEntry = {
  text: string
  passed: boolean
  tip: string
}

export type BotReply = {
  kind: 'chat' | 'practice' | 'continueYes' | 'continueAsk' | 'summary'
  text: string
}

function normalize(raw: string): string {
  return raw
    .replace(TRIM_EDGES, '')
    .replace(MULTI_SPACE, ' ')
    .replace(TRAILING_PUNCT, '')
}

export function splitSentences(raw: string): string[] {
  const trimmed = raw.replace(TRIM_EDGES, '')
  return trimmed
    .split(SENTENCE_SPLIT)
    .map((p) => p.replace(TRIM_EDGES, ''))
    .filter((p) => /\S/.test(p))
}

function matchAny(text: string, rules: Rule[]): Rule[] {
  return rules.filter((r) => r.pattern.test(text))
}

function shortTip(errors: Rule[]): string {
  const tips = [...new Set(errors.map((e) => e.tip))]
  return (
    tips.slice(0, 2)[0] ??
    'Check subject + to be + complement. / Revisa sujeto + to be + complemento.'
  )
}

/** Pass/fail from regex only (BeBot patterns). */
export function validateBeBot(raw: string): SessionEntry {
  const normalized = normalize(raw)
  const hits = matchAny(normalized, BEBOT_PATTERNS)
  const passed = hits.length > 0
  const tip = [
    shortTip(matchAny(normalized, ERROR_HINTS)),
    'Nice! Valid to-be sentence. / ¡Bien! Oración válida con to be.',
  ][Number(passed)]

  return { text: raw.replace(TRIM_EDGES, ''), passed, tip }
}

export function formatSummary(entries: SessionEntry[]): string {
  const lines = entries.map((e, i) => {
    const mark = ['✗', '✓'][Number(e.passed)]
    const extra = [' — ' + e.tip, ''][Number(e.passed)]
    return `${i + 1}) ${mark} “${e.text}”${extra}`
  })
  return [
    'Session summary / Resumen de la sesión:',
    ...(lines.length > 0 ? lines : ['(No sentences yet. / Sin oraciones aún.)']),
    '',
    'Say hi or write a new sentence to start again. / Saluda o escribe otra oración para empezar de nuevo.',
  ].join('\n')
}

const CONTINUE_ASK =
  'Do you want to continue? Reply yes or no.\n¿Quieres continuar? Responde yes o no.'

export function handleUserMessage(
  raw: string,
  awaitingContinue: boolean,
  session: SessionEntry[],
): { reply: BotReply; nextAwaiting: boolean; nextSession: SessionEntry[] } {
  const text = raw.replace(TRIM_EDGES, '')

  if (awaitingContinue) {
    if (NO_PATTERN.test(text)) {
      return {
        reply: { kind: 'summary', text: formatSummary(session) },
        nextAwaiting: false,
        nextSession: [],
      }
    }
    if (YES_PATTERN.test(text)) {
      return {
        reply: {
          kind: 'continueYes',
          text: 'Great — send another sentence with to be.\nGenial — mándame otra oración con to be. 😊',
        },
        nextAwaiting: false,
        nextSession: session,
      }
    }
    return {
      reply: {
        kind: 'continueAsk',
        text: 'Please reply yes or no.\nResponde yes o no, por favor.',
      },
      nextAwaiting: true,
      nextSession: session,
    }
  }

  const chatHit = CHAT_INTENTS.find((c) => c.pattern.test(text))
  if (chatHit) {
    return {
      reply: { kind: 'chat', text: chatHit.reply },
      nextAwaiting: false,
      nextSession: session,
    }
  }

  if (LOOKS_LIKE_ENGLISH.test(text)) {
    const parts = splitSentences(text)
    const entries = parts.map((p) => validateBeBot(p))
    const body = entries
      .map((e) => {
        const mark = ['✗', '✓'][Number(e.passed)]
        return `${mark} “${e.text}”\n${e.tip}`
      })
      .join('\n\n')

    return {
      reply: { kind: 'practice', text: `${body}\n\n${CONTINUE_ASK}` },
      nextAwaiting: true,
      nextSession: [...session, ...entries],
    }
  }

  return {
    reply: {
      kind: 'chat',
      text:
        "I'm BeBot 😊 Say hi, or practice: “I am a teacher.” / “She was happy.”\nSoy BeBot. Salúdame, o practica una oración con to be.",
    },
    nextAwaiting: false,
    nextSession: session,
  }
}
