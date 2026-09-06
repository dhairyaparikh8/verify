import type { NewsArticle } from './news'

const STOP_WORDS = new Set('the a an and or but is are was were to of in on for from with this that as at by about into it its be has have had new how why what when where who'.split(' '))

export function extractClaim(input: string, isUrl: boolean) {
  const cleaned = input.trim()
  if (isUrl) return { claim: cleaned, queries: [cleaned] }
  const claim = cleaned.replace(/https?:\/\/\S+/g, '').replace(/\s+/g, ' ').trim().slice(0, 500)
  const terms = claim.split(/[^A-Za-z0-9'-]+/).filter((term) => term.length > 2 && !STOP_WORDS.has(term.toLowerCase())).slice(0, 8)
  const query = terms.join(' ') || claim
  return { claim: claim || cleaned, queries: [query, terms.slice(0, 5).join(' ')].filter(Boolean).slice(0, 2) }
}

export function classifyArticle(claim: string, article: NewsArticle) {
  const text = `${article.title} ${article.description ?? ''} ${article.content ?? ''}`.toLowerCase()
  const terms = claim.toLowerCase().split(/[^a-z0-9]+/).filter((term) => term.length > 3 && !STOP_WORDS.has(term))
  const matches = terms.filter((term) => text.includes(term)).length
  const relevance = terms.length ? matches / Math.min(terms.length, 8) : 0
  const contradiction = /false|denied|did not|no evidence|debunk|incorrect|wrong|misleading|fabricated|untrue|not true/.test(text)
  if (relevance < 0.34) return { classification: 'IRRELEVANT' as const, reason: 'The article does not contain enough of the claim\'s identifying terms.' }
  if (contradiction) return { classification: 'CONTRADICTS' as const, reason: 'The article includes language indicating the claim or a key detail is disputed.' }
  if (relevance >= 0.6) return { classification: 'SUPPORTS' as const, reason: 'The article reports the same identifiable event or facts as the submitted claim.' }
  return { classification: 'MENTIONS' as const, reason: 'The article is related but does not directly establish the complete claim.' }
}
