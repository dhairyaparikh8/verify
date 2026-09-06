export type Verdict = 'verified' | 'mixed' | 'unsupported' | 'insufficient'

export interface Evidence { source: string; url?: string; text: string; timestamp?: string; supports?: boolean; contradicts?: boolean }
export interface CredibilityResult { verdict: Verdict; confidence: number; confidenceReason: string; evidence: Evidence[]; summary: string; uncertainty?: string; sourceCount: number; verificationTimestamp: string }

export function calculateCredibilityScore(input: { evidence: Evidence[]; sourceCount: number }): CredibilityResult {
  const { evidence, sourceCount } = input
  const supporting = new Set(evidence.filter((item) => item.supports).map((item) => item.source)).size
  const contradicting = new Set(evidence.filter((item) => item.contradicts).map((item) => item.source)).size
  const relevant = evidence.filter((item) => item.supports || item.contradicts).length
  const base = { evidence, sourceCount, verificationTimestamp: new Date().toISOString() }
  if (!relevant) return { ...base, verdict: 'insufficient', confidence: 0, confidenceReason: 'No relevant evidence was found.', summary: 'No reliable reporting was found for this claim.', uncertainty: 'This means there is insufficient evidence, not that the claim is false.' }
  if (supporting > 0 && contradicting > 0) return { ...base, verdict: contradicting >= supporting ? 'unsupported' : 'mixed', confidence: Math.min(0.78, 0.42 + Math.max(supporting, contradicting) * 0.08), confidenceReason: `Trusted sources disagree: ${supporting} support and ${contradicting} contradict.`, summary: `Evidence is conflicting across ${sourceCount} independent publisher${sourceCount === 1 ? '' : 's'}.`, uncertainty: 'The disagreement may concern a central claim or a detail; review the cited articles.' }
  if (supporting >= 2) return { ...base, verdict: 'verified', confidence: Math.min(0.95, 0.68 + supporting * 0.08), confidenceReason: `${supporting} independent trusted publishers provide relevant supporting evidence.`, summary: `The claim is supported by reporting from ${supporting} independent trusted publishers.`, uncertainty: sourceCount < 3 ? 'The evidence base is limited and may change as new reporting emerges.' : undefined }
  if (contradicting >= 2) return { ...base, verdict: 'unsupported', confidence: Math.min(0.9, 0.68 + contradicting * 0.08), confidenceReason: `${contradicting} independent trusted publishers provide relevant contradictory evidence.`, summary: `Multiple independent sources contradict the central claim.`, uncertainty: 'This result reflects the retrieved reporting and is not a substitute for reviewing primary evidence.' }
  return { ...base, verdict: 'insufficient', confidence: 0.35, confidenceReason: 'Only one independent publisher provided relevant evidence, which is not enough for a strong determination.', summary: 'Some related reporting was found, but there is insufficient independent evidence for a reliable verdict.', uncertainty: 'A single report is not treated as independent corroboration.' }
}
