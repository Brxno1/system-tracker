import { Bot, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import type { ChatMessage } from '@/types/chat'

interface ChatBubbleProps {
 message: ChatMessage
 onActionClick?: (action: any) => void
}

export function ChatBubble({ message, onActionClick }: ChatBubbleProps) {
 const isUser = message.role === 'user'
 const isSystem = message.role === 'system'

 if (isSystem) {
  return (
   <div className="flex justify-center py-4">
    <span className="text-xs text-muted-foreground">{message.content}</span>
   </div>
  )
 }

 return (
  <div
   className={cn(
    'flex w-full items-start gap-4 p-4',
    isUser ? 'flex-row-reverse' : 'flex-row'
   )}
  >
   <div
    className={cn(
     'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border',
     isUser ? 'bg-primary text-primary-foreground' : 'bg-muted'
    )}
   >
    {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
   </div>

   <div className={cn('flex max-w-[80%] flex-col gap-2', isUser && 'items-end')}>
    <div
     className={cn(
      'rounded-lg px-4 py-2 text-sm shadow-sm',
      isUser
       ? 'bg-primary text-primary-foreground'
       : 'bg-muted text-foreground'
     )}
    >
     {message.content.split('\n').map((line, i) => (
      <p key={i} className="min-h-[1.2em]">
       {line}
      </p>
     ))}
    </div>

    {message.attachments && message.attachments.length > 0 && (
     <div className="flex flex-wrap gap-2">
      {message.attachments.map((att, i) => (
       <img
        key={i}
        src={att.content}
        alt="Attachment"
        className="max-h-48 rounded-lg border object-cover"
       />
      ))}
     </div>
    )}

    {message.action && message.action.type === 'review-bankroll' && (
     <Card className="flex flex-col gap-2 p-3">
      <div className="text-sm font-medium">Banca Detectada</div>
      <p className="text-xs text-muted-foreground">
       {message.action.data.houses.length} casas identificadas.
      </p>
      <Button
       size="sm"
       variant="secondary"
       onClick={() => onActionClick?.(message.action)}
      >
       Revisar e Salvar
      </Button>
     </Card>
    )}
   </div>
  </div>
 )
}
