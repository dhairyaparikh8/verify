export type Verdict = 'verified' | 'mixed' | 'unsupported' | 'insufficient'

export interface Evidence {
  source: string
  url?: string
  text: string
  timestamp?: string
  supports?: boolean
  contradicts?: boolean
}

export interface CredibilityResult {
  verdict: Verdict
  confidence: number
  confidenceReason: string
  evidence: Evidence[]
  summary: string
  uncertainty?: string
  sourceCount: number
  verificationTimestamp: string
}

export interface ScoringInput {
  claim: string
  evidence: Evidence[]
  specificityScore: number
}

export function calculateCredibilityScore(input: ScoringInput): CredibilityResult {
  const { claim, evidence, specificityScore } = input

  // If no evidence was gathered, return insufficient
  if (!evidence || evidence.length === 0) {
    return {
      verdict: 'insufficient',
      confidence: 0,
      confidenceReason:
        'No evidence sources were available or able to be verified. This does not indicate the claim is false.',
      evidence: [],
      summary:
        'Insufficient evidence. Unable to complete verification. Consider consulting primary sources directly.',
      sourceCount: 0,
      verificationTimestamp: new Date().toISOString(),
      uncertainty:
        'This result is not a judgment on claim truth; it indicates an inability to verify with available sources.',
    }
  }

  // Count supporting and contradicting evidence
  const supportingCount = evidence.filter((e) => e.supports).length
  const contradictingCount = evidence.filter((e) => e.contradicts).length
  const neutralCount = evidence.length - supportingCount - contradictingCount

  // Determine verdict based on evidence distribution
  let verdict: Verdict = 'insufficient'
  let confidence = 0
  let confidenceReason = ''

  if (supportingCount > contradictingCount * 2 && supportingCount >= 2) {
    verdict = 'verified'
    confidence = Math.min(0.95, 0.6 + supportingCount * 0.1 + specificityScore * 0.15)
    confidenceReason = `Multiple authoritative sources support this claim (${supportingCount} supporting sources found)`
  } else if (contradictingCount > supportingCount * 2 && contradictingCount >= 2) {
    verdict = 'unsupported'
    confidence = Math.min(0.95, 0.6 + contradictingCount * 0.1 + specificityScore * 0.15)
    confidenceReason = `Available evidence does not support this claim (${contradictingCount} contradicting sources found)`
  } else if (supportingCount > 0 && contradictingCount > 0) {
    verdict = 'mixed'
    confidence = Math.min(0.85, 0.4 + Math.max(supportingCount, contradictingCount) * 0.08)
    confidenceReason = `Evidence both supports and contradicts this claim (${supportingCount} supporting, ${contradictingCount} contradicting)`
  } else if (supportingCount > 0) {
    verdict = 'verified'
    confidence = 0.65 + supportingCount * 0.08 + specificityScore * 0.1
    confidenceReason = `Some sources support this claim, though coverage may be limited`
  } else if (contradictingCount > 0) {
    verdict = 'unsupported'
    confidence = 0.65 + contradictingCount * 0.08
    confidenceReason = `Available sources contradict this claim`
  } else if (neutralCount > 0) {
    verdict = 'insufficient'
    confidence = 0.3
    confidenceReason =
      'Sources mention related topics but do not directly address this specific claim'
  }

  // Adjust confidence based on claim specificity
  if (specificityScore < 0.3) {
    confidence = Math.max(confidence * 0.7, 0.2)
    confidenceReason +=
      '. Note: Claim lacks specificity, limiting verification certainty.'
  }

  const summary = generateSummary(verdict, supportingCount, contradictingCount, neutralCount)
  const uncertainty = generateUncertainty(verdict, confidence, evidence.length)

  return {
    verdict,
    confidence: Math.round(confidence * 100) / 100,
    confidenceReason,
    evidence,
    summary,
    uncertainty,
    sourceCount: evidence.length,
    verificationTimestamp: new Date().toISOString(),
  }
}

function generateSummary(
  verdict: Verdict,
  supporting: number,
  contradicting: number,
  neutral: number
): string {
  switch (verdict) {
    case 'verified':
      return `This claim is supported by ${supporting} authoritative source${supporting === 1 ? '' : 's'}. Multiple independent sources corroborate the key facts.`
    case 'mixed':
      return `Evidence presents a mixed picture: ${supporting} source${supporting === 1 ? '' : 's'} support the claim while ${contradicting} contradict it. Further research may be needed.`
    case 'unsupported':
      return `Available evidence does not support this claim. ${contradicting} source${contradicting === 1 ? '' : 's'} provide contradicting information.`
    case 'insufficient':
      return `Insufficient evidence available for verification. Sources were either unavailable or could not be accessed.`
    default:
      return 'Unable to determine verdict.'
  }
}

function generateUncertainty(verdict: Verdict, confidence: number, sourceCount: number): string {
  const uncertaintyFactors: string[] = []

  if (sourceCount < 2) {
    uncertaintyFactors.push('Limited source diversity')
  }

  if (confidence < 0.6) {
    uncertaintyFactors.push('Low confidence in verdict')
  }

  if (sourceCount > 0 && sourceCount <= 3) {
    uncertaintyFactors.push('Small evidence base may not capture full picture')
  }

  if (uncertaintyFactors.length === 0) {
    return undefined
  }

  return `Limitations: ${uncertaintyFactors.join('; ')}. This analysis reflects available sources and may change as new evidence emerges.`
}

export function assessClaimSpecificity(claim: string): number {
  let score = 0.5

  // Check for concrete details
  const hasNumbers = /\d+/.test(claim)
  if (hasNumbers) score += 0.15

  // Check for time references
  const hasDateReferences = /(20\d{2}|January|February|March|April|May|June|July|August|September|October|November|December|today|yesterday|tomorrow|week|month|year)/i.test(
    claim
  )
  if (hasDateReferences) score += 0.15

  // Check for specific entities
  const hasProperNouns = /[A-Z][a-z]+\s+[A-Z]/.test(claim)
  if (hasProperNouns) score += 0.1

  // Check for vague language (reduces score)
  const vagueTerms =
    /(many|some|few|several|seems|appears|might|could|probably|possibly|allegedly|reportedly)/i
  if (vagueTerms.test(claim)) score -= 0.1

  return Math.min(Math.max(score, 0), 1)
}
