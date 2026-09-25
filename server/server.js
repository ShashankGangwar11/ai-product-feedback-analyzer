const express = require('express')
const cors = require('cors')
require('dotenv').config()
const { GoogleGenAI } = require('@google/genai')

const app = express()

const PORT = process.env.PORT || 5000

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
})
// const ai = new GoogleGenAI({
//   apiKey: process.env.GEMINI_API_KEY,
// })
app.use(cors())
app.use(express.json())

const generateWithRetry = async (request, maxRetries = 3) => {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await ai.models.generateContent(request)
    } catch (error) {
      const status = error.status
      const message = error.message || ''

      const dailyQuotaExceeded =
        message.includes('GenerateRequestsPerDayPerProject') ||
        message.includes('exceeded your current quota')

      // Daily quota exhausted -> do NOT retry
      if (dailyQuotaExceeded) {
        const quotaError = new Error(
          'Daily AI analysis limit reached. Please try again later.'
        )

        quotaError.status = 429
        quotaError.isDailyQuotaExceeded = true

        throw quotaError
      }

      const isRetryable =
        status === 429 ||
        status === 503 ||
        message.includes('429') ||
        message.includes('503') ||
        message.toLowerCase().includes('high demand')

      if (!isRetryable || attempt === maxRetries) {
        throw error
      }

      const delay = 1500 * 2 ** attempt

      console.log(
        `Gemini request failed (${status}). Retrying in ${delay / 1000}s...`
      )

      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }
}

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'AI Feedback Analyzer backend is running!',
  })
})

app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'Test route is working!',
  })
})
app.get('/api/ai-test', async (req, res) => {
  try {
    const response = await generateWithRetry({
  model: 'gemini-3.6-flash',
  contents: 'Reply with exactly: Gemini AI connection successful.',
})

    res.json({
      success: true,
      message: response.text,
    })
  } catch (error) {
    console.error('Gemini API error:', error)

    res.status(500).json({
      success: false,
      message: 'Gemini API request failed.',
      error: error.message,
    })
  }
})

app.post('/api/analyze', async (req, res) => {
  const { reviews } = req.body

  if (!reviews || !Array.isArray(reviews) || reviews.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'No reviews were provided.',
    })
  }

  try {
    const prompt = `
You are an AI product feedback analyst.

Analyze the following customer reviews:

${reviews.map((review, index) => `${index + 1}. ${review}`).join('\n')}

Identify the main recurring themes across the reviews. Include the approximate number of reviews mentioning each theme. Only include meaningful themes that appear in the feedback.
Based on the key issues and recurring themes, provide practical product improvement recommendations. Each recommendation should be specific and actionable. Assign an impact level of High, Medium, or Low.
Classify each individual customer review as Positive, Neutral, or Negative. Preserve the original review text in the result and return one classification for every review.
Return the analysis in this exact JSON format:

{
  "overallSentiment": "Positive | Neutral | Negative",
  "summary": "A short summary of the overall feedback",
  "keyIssues": ["issue 1", "issue 2"],
  "positiveFeedback": ["positive point 1", "positive point 2"],
  "priority": "High | Medium | Low",
  "themes": [
    {
      "name": "Theme name",
      "mentions": 2,
      "description": "Short explanation of what customers are saying about this theme"
    }
  ],
  "recommendations": [
    {
      "title": "Recommendation title",
      "description": "Specific product improvement based on the feedback",
      "impact": "High | Medium | Low"
    }
  ],
  "reviewSentiments": [
    {
      "review": "Original customer review",
      "sentiment": "Positive | Neutral | Negative"
    }
  ]
}
  
Return ONLY valid JSON. Do not include markdown or any extra text.
`

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
    })

    const result = JSON.parse(response.text)

    res.json({
      success: true,
      analysis: result,
    })
  } catch (error) {
  console.error('Analysis error:', error)

  const statusCode = error.status === 429 ? 429 : 500

  res.status(statusCode).json({
    success: false,
    message:
      error.isDailyQuotaExceeded
        ? 'Daily AI analysis limit reached. Please try again later.'
        : 'Failed to analyze reviews.',
    error: error.message,
  })
}
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`)
})