import { NextRequest, NextResponse } from 'next/server'
import { calculateCredibilityScore, assessClaimSpecificity } from '@/lib/credibility-engine'
import { searchAllAdapters } from '@/lib/evidence-adapters'

export const runtime = 'nodejs'
export const maxDuration = 30

interface AnalyzeRequest {
  input: string
  isUrl?: boolean
}

export async function POST(request: NextRequest) {
  try {
    const body: AnalyzeRequest = await request.json()

    if (!body.input || typeof body.input !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid input field' },
        { status: 400 }
      )
    }

    const input = body.input.trim()
    const isUrl = body.isUrl !== false // Default to treating as URL/claim

    // For URLs, extract as claim context
    let claim = input
    let context = undefined

    if (isUrl && input.startsWith('http')) {
      // In a real implementation, fetch and extract claims from URL
      // For now, use URL as context
      context = `Article from: ${input}`
      claim = input // Fallback: use URL as claim
    }

    // Assess claim specificity (0-1 score)
    const specificityScore = assessClaimSpecificity(claim)

    // Search for evidence using configured adapters
    const evidence = await searchAllAdapters(claim, context)

    // Calculate credibility score
    const result = calculateCredibilityScore({
      claim,
      evidence,
      specificityScore,
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Analysis error:', error)
    return NextResponse.json(
      { error: 'Analysis failed. Please try again.' },
      { status: 500 }
    )
  }
}
