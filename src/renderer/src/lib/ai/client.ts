import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { generateObject, LanguageModel } from 'ai'
import { z } from 'zod'
import { useSettingsStore } from '@/store/settings-store'

// Create a function to get the model on demand so we always use the latest API key
export const getAIModel = (): LanguageModel => {
  const apiKey = useSettingsStore.getState().geminiApiKey
  
  if (!apiKey) {
    throw new Error('API Key não configurada. Por favor, adicione sua chave nas configurações.')
  }

  const google = createGoogleGenerativeAI({
    apiKey,
  })

  // Using the latest Gemini 1.5 Pro model for best vision performance
  return google('gemini-1.5-pro-latest')
}

// Wrapper for generateObject to ensure we catch API key errors gracefully
export const generateAIObject = async <T>(params: {
  schema: z.Schema<T>
  messages: any[]
}): Promise<T> => {
  try {
    const model = getAIModel()
    const result = await generateObject({
      model,
      schema: params.schema,
      messages: params.messages
    })
    return result.object
  } catch (error: any) {
    console.error('AI Generation Error:', error)
    if (error.message.includes('API Key')) {
      throw new Error('Chave de API inválida ou ausente.')
    }
    throw new Error('Falha ao processar imagem. Tente novamente.')
  }
}
