import { NewsArticle, SentimentResult } from '@/types/sentiment'
import Anthropic from '@anthropic-ai/sdk'

export async function analyzeSentiment(
  companyName: string,
  articles: NewsArticle[]
): Promise<SentimentResult | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return null

  const globalArticles = articles.filter((a) => a.region === 'global')
  const japanArticles = articles.filter((a) => a.region === 'japan')

  if (globalArticles.length === 0 && japanArticles.length === 0) return null

  const client = new Anthropic({ apiKey })

  const articleList = articles
    .map((a) => `[${a.id}] (${a.region}) ${a.title} — ${a.snippet}`)
    .join('\n')

  const message = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: `Analyze the sentiment of recent news coverage about ${companyName}. The articles are divided into global (English) and Japan (Japanese) sources.

Articles:
${articleList}

Respond with ONLY valid JSON matching this exact structure:
{
  "globalSummary": "2-3 sentence summary of global coverage tone, grounded in the articles",
  "japanSummary": "2-3 sentence summary of Japanese coverage tone, noting any divergence from global",
  "globalSentiment": "positive" | "neutral" | "mixed" | "negative",
  "japanSentiment": "positive" | "neutral" | "mixed" | "negative",
  "globalThemes": ["theme1", "theme2", "theme3"],
  "japanThemes": ["theme1", "theme2", "theme3"],
  "articleSentiments": { "article-id": "positive" | "neutral" | "mixed" | "negative" }
}

Rules:
- Base summaries ONLY on the provided articles, not general knowledge
- globalThemes and japanThemes should be 2-3 short labels each
- articleSentiments must include an entry for every article ID
- If one lens has no articles, set its summary to "No recent coverage available" and sentiment to "neutral"`,
      },
    ],
  })

  try {
    const text = message.content[0].type === 'text' ? message.content[0].text : ''
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) return null
    return JSON.parse(jsonMatch[0]) as SentimentResult
  } catch {
    return null
  }
}
