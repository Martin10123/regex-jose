import type { Rule } from './patterns'

export type QuizQuestion = {
  id: string
  prompt: string
  hint: string
  extraRules: Rule[]
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1-present-be',
    prompt:
      'Write a present sentence with am / is / are. End with a period.\nEscribe una oración en presente con am / is / are. Termina con punto.',
    hint: 'Example / Ejemplo: "I am twenty years old."',
    extraRules: [
      {
        id: 'quizPresentBe',
        name: 'Present be',
        pattern: /\b(?:am|is|are)\b|(?:I'm|You're|He's|She's|It's|We're|They're)\b/i,
        tip: 'Need am/is/are (or I\'m). / Falta am/is/are (o I\'m).',
      },
    ],
  },
  {
    id: 'q2-present-action',
    prompt:
      'Write a present action sentence (any verb). End with a period.\nOración de acción en presente (cualquier verbo). Con punto.',
    hint: 'Example / Ejemplo: "She speaks English every day."',
    extraRules: [
      {
        id: 'quizPresentAction',
        name: 'Present action',
        pattern:
          /^(?:(?:I'm|You're|He's|She's|It's|We're|They're)\b|(?:I|You|We|They)\s+(?!was\b|were\b|did\b|had\b)[a-z]{2,}\b|(?:He|She|It|[A-Z][a-z]+|(?:A|An|The)\s+[a-z]+)\s+(?:am|is|are|do|does|have|has|[a-z]{2,}(?:s|es|ies))\b).+\.$/,
        tip: 'Need present action (subject + verb). / Falta acción en presente.',
      },
    ],
  },
  {
    id: 'q3-past-be',
    prompt:
      'Write a past sentence with was or were. End with a period.\nOración en pasado con was o were. Con punto.',
    hint: 'Example / Ejemplo: "We were at home yesterday."',
    extraRules: [
      {
        id: 'quizPastBe',
        name: 'Past be',
        pattern: /\b(?:was|were)\b/,
        tip: 'Need was/were. / Falta was/were.',
      },
    ],
  },
  {
    id: 'q4-past-ed',
    prompt:
      'Write a past sentence with an -ed verb. End with a period.\nOración en pasado con verbo en -ed. Con punto.',
    hint: 'Example / Ejemplo: "He walked to school."',
    extraRules: [
      {
        id: 'quizPastEd',
        name: 'Past -ed',
        pattern: /\b[a-z]{2,}ed\b/,
        tip: 'Need a verb ending in -ed. / Falta un verbo en -ed.',
      },
    ],
  },
  {
    id: 'q5-past-simple',
    prompt:
      'Write any affirmative past-tense sentence. End with a period.\nCualquier oración afirmativa en pasado. Con punto.',
    hint: 'Example / Ejemplo: "They went to the park."',
    extraRules: [
      {
        id: 'quizPastSimple',
        name: 'Past tense',
        pattern:
          /\b(?:was|were|did|had)\b|\b[a-z]{2,}ed\b|^(?:I|You|He|She|It|We|They|[A-Z][a-z]+|(?:A|An|The)\s+[a-z]+)\s+[a-z]{2,}\b/,
        tip: 'Need past tense. / Falta tiempo pasado.',
      },
    ],
  },
  {
    id: 'q6-two-sentences',
    prompt:
      'Write two sentences: one present, one past. Each with a period.\nDos oraciones: una presente, una pasado. Cada una con punto.',
    hint: 'Example / Ejemplo: "I am tired. I worked all day."',
    extraRules: [
      {
        id: 'quizHasPeriod',
        name: 'Period',
        pattern: /\.$/,
        tip: 'Each sentence needs a period. / Cada oración necesita punto.',
      },
    ],
  },
]
