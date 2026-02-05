import { generateAIObject } from './client'
import { ParsedBetSchema, type ParsedBet } from './schemas'
import { ANALYZE_BET_PROMPT } from './prompts'

export async function parseBetScreenshot(imageBase64: string): Promise<ParsedBet> {
  // Ensure the base64 string has the correct prefix
  const formattedImage = imageBase64.startsWith('data:image')
    ? imageBase64
    : `data:image/png;base64,${imageBase64}`

  const result = await generateAIObject({
    schema: ParsedBetSchema,
    messages: [
      {
        role: 'user',
        content: [
          { type: 'text', text: ANALYZE_BET_PROMPT },
          { type: 'image', image: formattedImage }
        ]
      }
    ]
  })

  return result
}
