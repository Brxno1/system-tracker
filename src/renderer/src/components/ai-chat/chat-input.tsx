import { useState, useRef, useEffect } from 'react'
import { ArrowUp, Paperclip, X, Image as ImageIcon } from 'lucide-react'
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
  <div className="mx-auto w-full max-w-3xl">
   <div className="relative flex w-full flex-col gap-2 rounded-xl border bg-background p-3 shadow-sm ring-1 ring-input transition-all focus-within:ring-2 focus-within:ring-primary/20">

    {attachments.length > 0 && (
     <div className="flex flex-wrap gap-2 px-1 pb-2">
      {attachments.map((att, i) => (
       <div key={i} className="group relative h-16 w-16 overflow-hidden rounded-lg border bg-muted">
        <img src={att} alt="Attachment" className="h-full w-full object-cover" />
        <Button
         size="icon"
         variant="destructive"
         className="absolute right-0 top-0 h-4 w-4 rounded-none rounded-bl-md opacity-0 transition-opacity group-hover:opacity-100"
         onClick={() => removeAttachment(i)}
        >
         <X className="h-2 w-2" />
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
      className="h-9 w-9 shrink-0 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      onClick={() => fileInputRef.current?.click()}
      disabled={isLoading}
      title="Anexar imagem"
     >
      <Paperclip className="h-5 w-5" />
     </Button>

     <Textarea
      ref={textareaRef}
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      onKeyDown={handleKeyDown}
      onPaste={handlePaste}
      placeholder="Pergunte algo ou envie um print da sua banca..."
      className="min-h-[36px] w-full resize-none border-0 bg-transparent py-2 text-base shadow-none focus-visible:ring-0 placeholder:text-muted-foreground/50"
      rows={1}
      disabled={isLoading}
     />

     <Button
      size="icon"
      className={cn(
       'h-9 w-9 shrink-0 rounded-lg transition-all',
       message.trim() || attachments.length > 0
        ? 'bg-primary text-primary-foreground hover:bg-primary/90'
        : 'bg-muted text-muted-foreground hover:bg-muted hover:text-muted-foreground'
      )}
      onClick={handleSend}
      disabled={(!message.trim() && attachments.length === 0) || isLoading}
     >
      <ArrowUp className="h-4 w-4" />
     </Button>
    </div>
   </div>

   <div className="mt-2 flex items-center justify-center gap-4 text-[10px] text-muted-foreground/60 sm:justify-end">
    <div className="flex items-center gap-1.5 rounded-full border bg-muted/20 px-2 py-0.5">
     <ImageIcon className="h-3 w-3" />
     <span className="font-medium">Gemini 1.5 Pro</span>
    </div>
   </div>
  </div>
 )
}
