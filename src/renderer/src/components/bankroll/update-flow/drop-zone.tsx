import { useState, useCallback } from 'react'
import { Upload, ImageIcon, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

// Since I don't want to install extra deps if not needed, I'll implement a simple native drag-and-drop first.
// If complex, I'll recommend react-dropzone. For now, native onDragOver/onDrop is sufficient for a single file.

interface DropZoneProps {
 onImageDropped: (base64: string) => Promise<void>
 isProcessing: boolean
}

export function DropZone({ onImageDropped, isProcessing }: DropZoneProps) {
 const [isDragActive, setIsDragActive] = useState(false)

 const handleDragOver = useCallback((e: React.DragEvent) => {
  e.preventDefault()
  setIsDragActive(true)
 }, [])

 const handleDragLeave = useCallback((e: React.DragEvent) => {
  e.preventDefault()
  setIsDragActive(false)
 }, [])

 const processFile = useCallback((file: File) => {
  if (!file.type.startsWith('image/')) return

  const reader = new FileReader()
  reader.onload = (e) => {
   const result = e.target?.result as string
   if (result) onImageDropped(result)
  }
  reader.readAsDataURL(file)
 }, [onImageDropped])

 const handleDrop = useCallback((e: React.DragEvent) => {
  e.preventDefault()
  setIsDragActive(false)

  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
   processFile(e.dataTransfer.files[0])
  }
 }, [processFile])

 const handlePaste = useCallback((e: React.ClipboardEvent) => {
  if (e.clipboardData.files && e.clipboardData.files[0]) {
   processFile(e.clipboardData.files[0])
  }
 }, [processFile])

 return (
  <div
   className={cn(
    'relative flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors',
    isDragActive ? 'border-primary bg-primary/10' : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50',
    isProcessing && 'pointer-events-none opacity-50'
   )}
   onDragOver={handleDragOver}
   onDragLeave={handleDragLeave}
   onDrop={handleDrop}
   // Make it focusable to catch paste events if desired, though normally paste is on window or input. 
   // For now, let's attach paste to a wrapper or assume global paste handling might be added later.
   // A common pattern is a hidden input or just listening on the container if it has focus.
   tabIndex={0}
   onPaste={handlePaste}
  >
   {isProcessing ? (
    <div className="flex flex-col items-center gap-2 text-muted-foreground">
     <Loader2 className="h-8 w-8 animate-spin" />
     <p className="text-sm font-medium">Processando com IA...</p>
    </div>
   ) : (
    <div className="flex flex-col items-center gap-2 text-muted-foreground">
     <div className="rounded-full bg-background p-2 shadow-sm ring-1 ring-border">
      {isDragActive ? <Upload className="h-5 w-5" /> : <ImageIcon className="h-5 w-5" />}
     </div>
     <div className="text-center text-sm">
      <span className="font-semibold text-foreground">Clique para enviar</span> ou arraste uma imagem
      <br />
      <span className="text-xs text-muted-foreground">(Prints de saldos ou tabelas)</span>
     </div>
    </div>
   )}

   {/* Hidden input for click-to-upload */}
   <input
    type="file"
    className="absolute inset-0 cursor-pointer opacity-0"
    accept="image/*"
    onChange={(e) => {
     if (e.target.files?.[0]) processFile(e.target.files[0])
    }}
    disabled={isProcessing}
   />
  </div>
 )
}
