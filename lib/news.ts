import { getTrustedSource, normalizeDomain } from './trustedSources'

export type NewsArticle = {
  title: string
  description: string | null
  sourceName: string
  sourceDomain: string
  url: string
  publishedAt: string | null
  content: string | null
  weight: number
}

type NewsApiArticle = {
  title?: string | null
  description?: string | null
  content?: string | null
  url?: string | null
  publishedAt?: string | null
  source?: { name?: string | null }
}

function validDate(value: string | null | undefined) {
  return value && !Number.isNaN(Date.parse(value)) ? value : null
}

export async function searchNews(query: string): Promise<NewsArticle[]> {
  const key = process.env.NEWS_API_KEY
  if (!key) return []
  const params = new URLSearchParams({ q: query.slice(0, 300), language: 'en', sortBy: 'relevancy', pageSize: '20', apiKey: key })
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 8000)
  try {
    const response = await fetch(`https://newsapi.org/v2/everything?${params}`, { signal: controller.signal, cache: 'no-store' })
    if (!response.ok) return []
    const data = (await response.json()) as { status?: string; articles?: NewsApiArticle[] }
    if (data.status !== 'ok' || !Array.isArray(data.articles)) return []
    return data.articles.flatMap((article) => {
      if (!article.url || !article.title) return []
      const domain = normalizeDomain(article.url)
      const trusted = getTrustedSource(article.url)
      if (!domain || !trusted) return []
      return [{ title: article.title, description: article.description ?? null, sourceName: article.source?.name || trusted.name, sourceDomain: domain, url: article.url, publishedAt: validDate(article.publishedAt), content: article.content ?? null, weight: trusted.weight }]
    })
  } catch {
    return []
  } finally {
    clearTimeout(timeout)
  }
}
