import { NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

const SYSTEM_PROMPT = `You are a knowledgeable Indian wellness assistant for the FitLife India app. You help users with:
1. Traditional Indian nutrition advice (Ayurvedic food combinations, seasonal eating)
2. Yoga asana recommendations based on user needs
3. Pranayama breathing techniques
4. Indian dietary tips for specific health goals
5. Traditional Indian home remedies
Keep responses concise, warm, and culturally appropriate. Use Hindi/Sanskrit terms where relevant with English explanations.`

const FALLBACK_RESPONSE = `I appreciate your question! While I'm unable to connect to my full knowledge base right now, here are some general Indian wellness tips:

- **Morning Routine**: Start with warm water with lemon (Nimbu Pani) and a few minutes of Pranayama.
- **Balanced Diet**: Include all six rasas (tastes) in your meals as per Ayurveda - sweet, sour, salty, pungent, bitter, and astringent.
- **Yoga**: Even 15 minutes of Surya Namaskar can transform your day.

Please try again shortly for a more personalized response! 🙏`

export async function POST(request: Request) {
  try {
    const bodyText = await request.text()
    const body = JSON.parse(bodyText)
    const { message } = body

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Missing required field: message' },
        { status: 400 }
      )
    }

    let aiResponse: string

    try {
      const zai = await ZAI.create()
      const response = await zai.chat.completions.create({
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: message },
        ],
      })

      // Extract the assistant's message from the response
      const content =
        response?.choices?.[0]?.message?.content ||
        response?.content ||
        response?.message ||
        null

      if (typeof content === 'string' && content.trim()) {
        aiResponse = content.trim()
      } else if (typeof response === 'string') {
        aiResponse = response.trim()
      } else {
        aiResponse = FALLBACK_RESPONSE
      }
    } catch (sdkError) {
      console.error('AI SDK error:', sdkError)
      aiResponse = FALLBACK_RESPONSE
    }

    return NextResponse.json({ message: aiResponse })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    )
  }
}
