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
   content: 'Olá! Sou seu assistente de banca.\nMe envie um print das suas contas para eu atualizar seus saldos automaticamente.',
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
    // Text-only response (mocked for now)
    // In a real app, this would call a LLM for text generation
    await new Promise(resolve => setTimeout(resolve, 1000)) // Fake delay
    const aiMessage: ChatMessage = {
     id: uuidv4(),
     role: 'assistant',
     content: 'Entendi. Por enquanto meu foco é analisar imagens de banca. Tem algum print para me enviar?',
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
  <div className="flex h-full w-full flex-col bg-background">
   <div className="flex-1 overflow-hidden">
    <ScrollArea className="h-full px-4" ref={scrollRef}>
     <div className="mx-auto flex max-w-3xl flex-col gap-6 py-8">
      {messages.map((msg) => (
       <ChatBubble
        key={msg.id}
        message={msg}
        onActionClick={handleActionClick}
       />
      ))}
      {isLoading && (
       <div className="flex items-center gap-2 px-4 text-xs text-muted-foreground">
        <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground delay-75" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground delay-150" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground delay-200" />
       </div>
      )}
      <div className="h-4" /> {/* Spacer for bottom scroll */}
     </div>
    </ScrollArea>
   </div>

   <div className="border-t bg-background/50 p-4 pb-6 backdrop-blur-sm supports-[backdrop-filter]:bg-background/20">
    <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
   </div>
  </div>
 )
}
