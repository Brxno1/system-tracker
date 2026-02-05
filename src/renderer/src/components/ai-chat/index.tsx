import { useState, useRef, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ChatInput } from './chat-input'
import { ChatBubble } from './chat-bubble'
import { parseBankrollScreenshot } from '@/lib/ai/parse-bankroll'
import type { ChatMessage, ChatAction } from '@/types/chat'
import type { ParsedBankroll } from '@/lib/ai/schemas'

interface ChatInterfaceProps {
 onBankrollDetected: (data: ParsedBankroll) => void
}

export function ChatInterface({ onBankrollDetected }: ChatInterfaceProps) {
 const [messages, setMessages] = useState<ChatMessage[]>([
  {
   id: 'welcome',
   role: 'assistant',
   content: 'Olá! Posso ajudar a atualizar sua banca. Me envie um print das suas contas.',
   timestamp: new Date()
  }
 ])
 const [isLoading, setIsLoading] = useState(false)
 const scrollRef = useRef<HTMLDivElement>(null)

 useEffect(() => {
  if (scrollRef.current) {
   scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }
 }, [messages])

 const handleSendMessage = async (content: string, attachments: string[]) => {
  // Add User Message
  const userMessage: ChatMessage = {
   id: uuidv4(),
   role: 'user',
   content,
   attachments: attachments.map((a) => ({ type: 'image', content: a })),
   timestamp: new Date()
  }
  setMessages((prev) => [...prev, userMessage])
  setIsLoading(true)

  try {
   // Logic to determine what to do. For now, if image exists, try Bankroll parsing.
   if (attachments.length > 0) {
    // Assume first image is bankroll for this MVP
    const result = await parseBankrollScreenshot(attachments[0])

    const aiMessage: ChatMessage = {
     id: uuidv4(),
     role: 'assistant',
     content: `Analisei sua imagem e encontrei ${result.houses.length} casas de aposta.`,
     action: {
      type: 'review-bankroll',
      data: result
     },
     timestamp: new Date()
    }
    setMessages((prev) => [...prev, aiMessage])
   } else {
    // Text-only response (mocked for now as we don't have a text-chat capability setup yet)
    const aiMessage: ChatMessage = {
     id: uuidv4(),
     role: 'assistant',
     content: 'Entendi. Por enquanto só consigo analisar imagens de banca. Tem algum print para me enviar?',
     timestamp: new Date()
    }
    setMessages((prev) => [...prev, aiMessage])
   }
  } catch (error) {
   console.error(error)
   const errorMessage: ChatMessage = {
    id: uuidv4(),
    role: 'system',
    content: 'Desculpe, tive um erro ao processar sua solicitação. Tente novamente.',
    timestamp: new Date()
   }
   setMessages((prev) => [...prev, errorMessage])
  } finally {
   setIsLoading(false)
  }
 }

 const handleActionClick = (action: ChatAction) => {
  if (action.type === 'review-bankroll') {
   onBankrollDetected(action.data)
  }
 }

 return (
  <div className="flex h-[600px] flex-col overflow-hidden rounded-xl border bg-background shadow-sm">
   <div className="flex-1 overflow-hidden p-4">
    <ScrollArea className="h-full pr-4" ref={scrollRef}>
     <div className="flex flex-col gap-4">
      {messages.map((msg) => (
       <ChatBubble
        key={msg.id}
        message={msg}
        onActionClick={handleActionClick}
       />
      ))}
      {isLoading && (
       <div className="flex items-center gap-2 p-4 text-xs text-muted-foreground">
        <span className="animate-pulse">Processando...</span>
       </div>
      )}
     </div>
    </ScrollArea>
   </div>
   <div className="border-t bg-muted/30 p-4">
    <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
   </div>
  </div>
 )
}
