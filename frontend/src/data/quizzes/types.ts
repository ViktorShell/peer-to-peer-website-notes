export type Choice = {
  id: string
  text: string
}

export type MCQuestion = {
  kind: 'mc'
  question: string
  choices: Choice[]
  correctId: string
  explanation?: string
}

export type TFQuestion = {
  kind: 'tf'
  question: string
  answer: boolean
  explanation?: string
}

export type Question = MCQuestion | TFQuestion
