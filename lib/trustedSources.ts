export type TrustedSource = { domain: string; name: string; weight: number }

export const TRUSTED_SOURCES: TrustedSource[] = [
  { domain: 'reuters.com', name: 'Reuters', weight: 1 },
  { domain: 'apnews.com', name: 'Associated Press', weight: 1 },
  { domain: 'bbc.com', name: 'BBC', weight: 0.95 },
  { domain: 'theguardian.com', name: 'The Guardian', weight: 0.95 },
  { domain: 'nytimes.com', name: 'The New York Times', weight: 0.95 },
  { domain: 'thehindu.com', name: 'The Hindu', weight: 0.95 },
  { domain: 'indianexpress.com', name: 'The Indian Express', weight: 0.95 },
  { domain: 'aljazeera.com', name: 'Al Jazeera', weight: 0.9 },
  { domain: 'cnn.com', name: 'CNN', weight: 0.9 },
  { domain: 'npr.org', name: 'NPR', weight: 0.9 },
  { domain: 'hindustantimes.com', name: 'Hindustan Times', weight: 0.9 },
  { domain: 'indiatoday.in', name: 'India Today', weight: 0.9 },
]

export function normalizeDomain(value: string): string | null {
  try {
    const hostname = new URL(value).hostname.toLowerCase().replace(/^www\./, '')
    return hostname || null
  } catch {
    return null
  }
}

export function getTrustedSource(value: string): TrustedSource | null {
  const domain = normalizeDomain(value)
  if (!domain) return null
  return TRUSTED_SOURCES.find((source) => domain === source.domain || domain.endsWith(`.${source.domain}`)) ?? null
}
