import { NextRequest, NextResponse } from 'next/server'
import { extractClaim, classifyArticle } from '@/lib/claim-analysis'
import { searchNews } from '@/lib/news'
import { calculateCredibilityScore, type Evidence } from '@/lib/credibility-engine'

export const runtime = 'nodejs'
export const maxDuration = 30

const insufficient = (reason = 'No relevant evidence was found.') => NextResponse.json({ verdict: 'insufficient', confidence: 0, confidenceReason: reason, summary: 'No reliable reporting was found for this claim.', uncertainty: 'This means there is insufficient evidence, not that the claim is false.', evidence: [], sourceCount: 0, verificationTimestamp: new Date().toISOString() })

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { input?: unknown; isUrl?: boolean }
    if (typeof body.input !== 'string' || !body.input.trim()) return NextResponse.json({ error: 'Please provide a claim, headline, article text, or URL.' }, { status: 400 })
    const input = body.input.trim().slice(0, 2000)
    if (!process.env.NEWS_API_KEY) return insufficient('The evidence provider is not configured. No score was produced.')
    const { claim, queries } = extractClaim(input, body.isUrl === true)
    const articles = (await Promise.all(queries.map(searchNews))).flat().filter((article, index, all) => all.findIndex((item) => item.url === article.url) === index).slice(0, 30)
    if (!articles.length) return insufficient()
    const evidence: Evidence[] = []
    for (const article of articles) {
      const result = classifyArticle(claim, article)
      if (result.classification === 'IRRELEVANT') continue
      evidence.push({ source: article.sourceName, url: article.url, text: result.reason, timestamp: article.publishedAt ?? undefined, supports: result.classification === 'SUPPORTS', contradicts: result.classification === 'CONTRADICTS' })
    }
    const sourceCount = new Set(evidence.map((item) => item.source)).size
    return NextResponse.json(calculateCredibilityScore({ evidence, sourceCount }))
  } catch {
    return insufficient('The evidence service could not complete this check. No score was produced.')
  }
}
