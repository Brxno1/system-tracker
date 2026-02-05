import { generateAIObject } from './client'
import { ParsedBankrollSchema, type ParsedBankroll } from './schemas'
import { ANALYZE_BANKROLL_PROMPT } from './prompts'

export async function parseBankrollScreenshot(imageBase64: string): Promise<ParsedBankroll> {
  // Ensure the base64 string has the correct prefix
  const formattedImage = imageBase64.startsWith('data:image')
    ? imageBase64
    : `data:image/png;base64,${imageBase64}`

  const result = await generateAIObject({
    schema: ParsedBankrollSchema,
    messages: [
      {
        role: 'user',
        content: [
          { type: 'text', text: ANALYZE_BANKROLL_PROMPT },
          { type: 'image', image: formattedImage }
        ]
      }
    ]
  })

  return result
}
