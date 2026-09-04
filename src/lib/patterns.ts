export type Rule = {
  id: string
  name: string
  pattern: RegExp
  tip: string
}

export const SENTENCE_SPLIT = /(?<=[.!?])\s+|\n+/
export const TRIM_EDGES = /^\s+|\s+$/g
export const MULTI_SPACE = / {2,}/g
export const TRAILING_PUNCT = /[.!?]+$/

/** BeBot complement (no leading not / n't) */
export const COMPLEMENT =
  "(?!not\\b|n't\\b)[A-Za-z0-9]+(?:[ -](?!not\\b|n't\\b)[A-Za-z0-9]+)*"

const C = COMPLEMENT
const NAME = '(?!(?:I|You|He|She|It|We|They|This|That|These|Those)\\b)[A-Z][a-z]+'
const SG = `(?:He|She|It|This|That|${NAME})`
const PL = '(?:You|We|They|These|Those)'
/** Subjects after Am/Is/Are/Was/Were may be lowercase */
const SG_Q = `(?:I|He|She|It|This|That|he|she|it|this|that|${NAME})`
const PL_Q = '(?:You|We|They|These|Those|you|we|they|these|those)'

/**
 * Valid BeBot patterns (to be). Applied after normalize
 * (spaces collapsed; trailing .!? stripped). No /i so names stay capitalized.
 */
export const BEBOT_PATTERNS: Rule[] = [
  {
    id: 'presentAffirmative',
    name: 'Present affirmative',
    pattern: new RegExp(
      `^(?:I am|I'm|${SG} is|He's|She's|It's|${PL} are|You're|We're|They're)\\s+${C}$`,
    ),
    tip: 'Present: I am / he is / you are + complement. / Presente: I am / he is / you are + complemento.',
  },
  {
    id: 'presentNegative',
    name: 'Present negative',
    pattern: new RegExp(
      `^(?:I am not|I'm not|${SG} is not|${SG} isn't|He's not|She's not|It's not|${PL} are not|${PL} aren't|You're not|We're not|They're not)\\s+${C}$`,
    ),
    tip: 'Present negative: am not / is not / are not. / Negativo: am/is/are not.',
  },
  {
    id: 'pastAffirmative',
    name: 'Past affirmative',
    pattern: new RegExp(`^(?:(?:I|${SG}) was|${PL} were)\\s+${C}$`),
    tip: 'Past: I/he was · you/we/they were. / Pasado: was / were.',
  },
  {
    id: 'pastNegative',
    name: 'Past negative',
    pattern: new RegExp(
      `^(?:(?:I|${SG}) was not|(?:I|${SG}) wasn't|${PL} were not|${PL} weren't)\\s+${C}$`,
    ),
    tip: 'Past negative: was not / were not. / Negativo pasado: wasn\'t / weren\'t.',
  },
  {
    id: 'presentQuestion',
    name: 'Present interrogative',
    pattern: new RegExp(
      `^(?:Am I|Am i|Is ${SG_Q}|Are ${PL_Q})\\s+${C}\\??$`,
    ),
    tip: 'Question: Am I / Is she / Are they + complement? / Pregunta: Am/Is/Are + sujeto.',
  },
  {
    id: 'pastQuestion',
    name: 'Past interrogative',
    pattern: new RegExp(
      `^(?:Was ${SG_Q}|Were ${PL_Q})\\s+${C}\\??$`,
    ),
    tip: 'Past question: Was I/he / Were you? / Pregunta pasado: Was/Were + sujeto.',
  },
]

export const ERROR_HINTS: Rule[] = [
  {
    id: 'errI',
    name: 'I agreement',
    pattern: /\bI\s+(?:is|are|were)\b/,
    tip: 'With I use am or was. / Con I usa am o was.',
  },
  {
    id: 'errSingularAre',
    name: 'Singular agreement',
    pattern: /\b(?:He|She|It|This|That|[A-Z][a-z]+)\s+are\b/,
    tip: 'Singular subject → is / was. / Sujeto singular → is / was.',
  },
  {
    id: 'errPluralIs',
    name: 'Plural agreement',
    pattern: /\b(?:You|We|They|These|Those)\s+is\b/,
    tip: 'Plural subject → are / were. / Sujeto plural → are / were.',
  },
  {
    id: 'errNoBe',
    name: 'Missing to be',
    pattern:
      /^(?!.*\b(?:am|is|are|was|were|isn't|aren't|wasn't|weren't|I'm|You're|He's|She's|It's|We're|They're)\b).+/i,
    tip: 'Add a form of to be (am/is/are/was/were). / Agrega el verbo to be.',
  },
]

export const CHAT_INTENTS = [
  {
    id: 'greeting',
    pattern:
      /^(?:hola|hello|hi+|hey|buenas|buen\s+d[ií]a|good\s+(?:morning|afternoon|evening))(?:\s+.*)?[!?.]*$/i,
    reply:
      "Hi! I'm BeBot 😊 Ready to practice English with to be.\n¡Hola! Soy BeBot. ¿Practicamos oraciones con to be?",
  },
  {
    id: 'howAreYou',
    pattern:
      /^(?:c[oó]mo\s+est[aá]s|que\s+tal|qu[eé]\s+tal|how\s+are\s+you|what'?s\s+up)[!?.]*$/i,
    reply:
      "I'm great, thanks! Want to practice a sentence?\n¡Muy bien, gracias! ¿Practicamos una oración?",
  },
  {
    id: 'thanks',
    pattern: /^(?:thanks|thank\s+you|gracias|ty|thx)[!?.]*$/i,
    reply: "You're welcome! / ¡De nada! 😊",
  },
  {
    id: 'bye',
    pattern:
      /^(?:bye|goodbye|adios|adi[oó]s|chao|see\s+you|nos\s+vemos)[!?.]*$/i,
    reply: 'Bye! Come back soon. / ¡Chao! Vuelve pronto. 👋',
  },
  {
    id: 'help',
    pattern: /^(?:help|ayuda|que\s+hago|qu[eé]\s+hago)[!?.]*$/i,
    reply:
      'Try: “I am a student.” or “She was happy.” Then answer yes/no to continue.\nPrueba: “I am a student.” Luego responde yes/no para continuar.',
  },
] as const

export const YES_PATTERN =
  /^(?:yes|y|si|s[ií]|ok|okay|continuar|continue|claro|dale)[!?.]*$/i
export const NO_PATTERN =
  /^(?:no|n|nop|stop|salir|basta|enough|listo)[!?.]*$/i

/** English practice-ish (letters; preferably with to be or Subject Verb) */
export const LOOKS_LIKE_ENGLISH =
  /\b(?:am|is|are|was|were|I'm|You're|He's|She's|It's|We're|They're)\b|^[A-Z][a-z]+(?:\s+[A-Za-z0-9']+){1,}[.!?]?$/
