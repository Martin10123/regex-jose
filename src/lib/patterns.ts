export type Rule = {
  id: string
  name: string
  pattern: RegExp
  /** Short bilingual tip: English / Español */
  tip: string
}

export type Intent = {
  id: string
  name: string
  pattern: RegExp
  replies: [string, string]
}

/** Split after .!? or on newlines */
export const SENTENCE_SPLIT = /(?<=[.!?])\s+|\n+/

export const TRIM_EDGES = /^\s+|\s+$/g

/**
 * Subject + finite verb shape (any lexical verb welcome).
 * Auxiliaries are a closed set; other verbs = any lowercase word (2+ letters).
 */
const SUBJECT_VERB =
  /^(?:(?:I'm|You're|He's|She's|It's|We're|They're)\b|(?:I|You|He|She|It|We|They|[A-Z][a-z]+|(?:A|An|The)\s+[a-z]+)\s+(?:am|is|are|was|were|do|does|did|have|has|had|[a-z]{2,})\b).+\.$/

/** Affirmative sentences in present or past tense only */
export const WRITING_RULES: Rule[] = [
  {
    id: 'capitalStart',
    name: 'Capitalization',
    pattern: /^[A-Z]/,
    tip: 'Start with a capital. / Empieza con mayúscula.',
  },
  {
    id: 'endPeriod',
    name: 'Period',
    pattern: /\.$/,
    tip: 'End with a period (.). / Termina con punto (.).',
  },
  {
    id: 'affirmativeOnly',
    name: 'Affirmative form',
    pattern:
      /^(?!(?:Who|What|When|Where|Why|How|Do|Does|Did|Is|Are|Can|Could|Would|Will|Have|Has)\b).+\.$/,
    tip: 'Use a statement, not a question. / Usa una afirmación, no una pregunta.',
  },
  {
    id: 'noDoubleSpace',
    name: 'Spacing',
    pattern: /^(?!.* {2}).+$/,
    tip: 'Use single spaces only. / Solo un espacio entre palabras.',
  },
  {
    id: 'allowedChars',
    name: 'Characters',
    pattern: /^[A-Za-z0-9 ,.'\-]+$/,
    tip: 'Use normal English characters. / Usa caracteres normales en inglés.',
  },
  {
    id: 'minWords',
    name: 'Length',
    pattern: /^(?:\S+\s+)+\S+\.$/,
    tip: 'Write at least two words. / Escribe al menos dos palabras.',
  },
  {
    id: 'presentOrPast',
    name: 'Present or past tense',
    pattern: SUBJECT_VERB,
    tip: 'Need subject + verb (present/past). / Falta sujeto + verbo (presente/pasado).',
  },
]

export const INTENTS: Intent[] = [
  {
    id: 'present',
    name: 'Present',
    pattern:
      /(?:I'm|You're|He's|She's|It's|We're|They're)|\b(?:am|is|are|do|does|have|has)\b|(?:(?:I|You|We|They)\s+(?!was\b|were\b|did\b|had\b)[a-z]{2,}(?<!ed)\b)|(?:(?:He|She|It|[A-Z][a-z]+|(?:A|An|The)\s+[a-z]+)\s+(?:am|is|are|do|does|have|has|[a-z]{2,}(?:s|es|ies))\b)/,
    replies: [
      'Not present tense. / No es presente.',
      'Nice present tense! / ¡Buen presente!',
    ],
  },
  {
    id: 'past',
    name: 'Past',
    pattern:
      /\b(?:was|were|did|had)\b|\b[a-z]{2,}ed\b|(?:(?:I|You|He|She|It|We|They|[A-Z][a-z]+|(?:A|An|The)\s+[a-z]+)\s+[a-z]{2,}\b)/,
    replies: [
      'Not past tense. / No es pasado.',
      'Nice past tense! / ¡Buen pasado!',
    ],
  },
  {
    id: 'statement',
    name: 'Statement',
    pattern: /^.+$/,
    replies: [
      'Could not classify that. / No pude clasificarlo.',
      'Looks good! / ¡Se ve bien!',
    ],
  },
]
