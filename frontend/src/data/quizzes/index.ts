import type { ModuleId } from '@/content/manifest'
import type { Question } from './types'
import { MODULO_1_QUIZ } from './modulo-1'
import { MODULO_2_QUIZ } from './modulo-2'
import { MODULO_3_QUIZ } from './modulo-3'
import { MODULO_4_QUIZ } from './modulo-4'

export const QUIZZES: Record<ModuleId, Question[]> = {
  'p2p-dht': MODULO_1_QUIZ,
  bitcoin: MODULO_2_QUIZ,
  ethereum: MODULO_3_QUIZ,
  apps: MODULO_4_QUIZ,
}
