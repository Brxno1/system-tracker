import { Bot, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
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
        <span className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
          {message.content}
        </span>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'group flex w-full gap-4 px-4 py-2 hover:bg-muted/30 transition-colors',
        isUser ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      <Avatar className="h-8 w-8 shrink-0 border">
        {isUser ? (
          <AvatarFallback className="bg-primary/10 text-primary">
            <User className="h-4 w-4" />
          </AvatarFallback>
        ) : (
          <AvatarFallback className="bg-emerald-500/10 text-emerald-600">
            <Bot className="h-4 w-4" />
          </AvatarFallback>
        )}
      </Avatar>

      <div className={cn('flex max-w-[85%] flex-col gap-2', isUser && 'items-end')}>
        {message.content && (
          <div
            className={cn(
              'relative rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ring-1 ring-inset',
              isUser
                ? 'bg-primary text-primary-foreground ring-primary/20 rounded-br-none'
                : 'bg-background text-foreground ring-border rounded-bl-none'
            )}
          >
            {message.content.split('\n').map((line, i) => (
              <p key={i} className="min-h-[1.2em]">
                {line}
              </p>
            ))}
          </div>
        )}

        {message.attachments && message.attachments.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {message.attachments.map((att, i) => (
              <div key={i} className="relative overflow-hidden rounded-xl border bg-muted/50">
                <img
                  src={att.content}
                  alt="Attachment"
                  className="max-h-64 object-contain"
                />
              </div>
            ))}
          </div>
        )}

        {message.action && message.action.type === 'review-bankroll' && (
          <Card className="flex w-fit flex-col gap-2 p-3 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/10">
                <Bot className="h-3 w-3 text-emerald-600" />
              </div>
              <span className="text-sm font-medium">Análise de Banca</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Identifiquei {message.action.data.houses.length} casas na imagem.
            </p>
            <Button
              size="sm"
              variant="default"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={() => onActionClick?.(message.action)}
            >
              Revisar Dados
            </Button>
          </Card>
        )}
      </div>
    </div>
  )
}
