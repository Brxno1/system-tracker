import { useState, useRef, useEffect } from 'react'
import { Send, Paperclip, X, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

interface ChatInputProps {
 onSendMessage: (content: string, attachments: string[]) => void
 isLoading: boolean
}

export function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
 const [message, setMessage] = useState('')
 const [attachments, setAttachments] = useState<string[]>([]) // base64 strings
 const textareaRef = useRef<HTMLTextAreaElement>(null)
 const fileInputRef = useRef<HTMLInputElement>(null)

 // Auto-resize textarea
 useEffect(() => {
  if (textareaRef.current) {
   textareaRef.current.style.height = 'auto'
   textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`
  }
 }, [message])

 const handleKeyDown = (e: React.KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey) {
   e.preventDefault()
   handleSend()
  }
 }

 const handleSend = () => {
  if ((!message.trim() && attachments.length === 0) || isLoading) return
  onSendMessage(message, attachments)
  setMessage('')
  setAttachments([])
  if (textareaRef.current) {
   textareaRef.current.style.height = 'auto'
   textareaRef.current.focus()
  }
 }

 const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files && e.target.files[0]) {
   const file = e.target.files[0]
   if (!file.type.startsWith('image/')) return

   const reader = new FileReader()
   reader.onload = (e) => {
    const result = e.target?.result as string
    if (result) {
     setAttachments((prev) => [...prev, result])
    }
   }
   reader.readAsDataURL(file)
  }
  // Reset input so same file can be selected again if needed
  if (fileInputRef.current) fileInputRef.current.value = ''
 }

 const removeAttachment = (index: number) => {
  setAttachments((prev) => prev.filter((_, i) => i !== index))
 }

 const handlePaste = (e: React.ClipboardEvent) => {
  if (e.clipboardData.files && e.clipboardData.files[0]) {
   const file = e.clipboardData.files[0]
   if (file.type.startsWith('image/')) {
    e.preventDefault()
    const reader = new FileReader()
    reader.onload = (evt) => {
     const result = evt.target?.result as string
     if (result) {
      setAttachments((prev) => [...prev, result])
     }
    }
    reader.readAsDataURL(file)
   }
  }
 }

 return (
  <div className="rounded-lg border bg-background p-4 shadow-sm focus-within:ring-1 focus-within:ring-ring">
   {attachments.length > 0 && (
    <div className="mb-4 flex flex-wrap gap-2">
     {attachments.map((att, i) => (
      <div key={i} className="relative h-20 w-20 overflow-hidden rounded-md border">
       <img src={att} alt="Attachment" className="h-full w-full object-cover" />
       <Button
        size="icon"
        variant="destructive"
        className="absolute right-0 top-0 h-5 w-5 rounded-bl-md rounded-tr-md p-0"
        onClick={() => removeAttachment(i)}
       >
        <X className="h-3 w-3" />
       </Button>
      </div>
     ))}
    </div>
   )}

   <div className="flex gap-2">
    <input
     type="file"
     ref={fileInputRef}
     className="hidden"
     accept="image/*"
     onChange={handleFileSelect}
    />
    <Button
     variant="ghost"
     size="icon"
     className="h-10 w-10 shrink-0 text-muted-foreground hover:text-foreground"
     onClick={() => fileInputRef.current?.click()}
     disabled={isLoading}
    >
     <Paperclip className="h-5 w-5" />
    </Button>

    <Textarea
     ref={textareaRef}
     value={message}
     onChange={(e) => setMessage(e.target.value)}
     onKeyDown={handleKeyDown}
     onPaste={handlePaste}
     placeholder="Digite uma mensagem ou cole uma imagem..."
     className="min-h-[40px] w-full resize-none border-0 bg-transparent py-2 shadow-none focus-visible:ring-0"
     rows={1}
     disabled={isLoading}
    />

    <Button
     size="icon"
     className={cn('h-10 w-10 shrink-0', isLoading && 'opacity-50')}
     onClick={handleSend}
     disabled={(!message.trim() && attachments.length === 0) || isLoading}
    >
     <Send className="h-5 w-5" />
    </Button>
   </div>

   <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
    <div className="flex items-center gap-2">
     {/* Placeholder for model selection as requested */}
     <span className="flex items-center gap-1 rounded bg-muted px-2 py-1">
      <ImageIcon className="h-3 w-3" /> Gemini 1.5 Pro
     </span>
    </div>
    <span>Enter para enviar, Shift + Enter para quebra de linha</span>
   </div>
  </div>
 )
}
