import type { ParsedBankroll } from '@/lib/ai/schemas'

export type MessageRole = 'user' | 'assistant' | 'system'

export interface ChatAttachment {
  type: 'image'
  content: string // base64
}

export interface ChatAction {
  type: 'review-bankroll'
  data: ParsedBankroll
}

export interface ChatMessage {
  id: string
  role: MessageRole
  content: string
  attachments?: ChatAttachment[]
  action?: ChatAction
  timestamp: Date
}
