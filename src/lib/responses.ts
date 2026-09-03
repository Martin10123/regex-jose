export const WELCOME_CHAT =
  "Hi! I check affirmative present/past sentences. / ¡Hola! Reviso oraciones afirmativas en presente/pasado.\nExamples: “I am happy.” · “They walked home.”"

export const WELCOME_QUIZ =
  "Quiz time! Use affirmative present/past sentences. / ¡Quiz! Usa oraciones afirmativas en presente/pasado."

export const QUIZ_CORRECT = [
  'Not quite. / Casi.',
  'Correct! / ¡Correcto!',
] as const

export const QUIZ_PROGRESS = (current: number, total: number) =>
  `Question ${current} of ${total} · Pregunta ${current} de ${total}`

export const SCORE_HEADLINE = [
  'Review the notes and try again. / Revisa las notas e inténtalo de nuevo.',
  'Great job — all correct! / ¡Bien hecho — todo correcto!',
] as const
