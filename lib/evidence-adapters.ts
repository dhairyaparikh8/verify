import { Evidence } from './credibility-engine'

export interface EvidenceAdapter {
  name: string
  isConfigured: boolean
  searchForEvidence(query: string, context?: string): Promise<Evidence[]>
}

class DemoAdapter implements EvidenceAdapter {
  name = 'demo'
  isConfigured = true

  async searchForEvidence(query: string, context?: string): Promise<Evidence[]> {
    // Deterministic demo responses - same query always returns same evidence
    // This is explicitly labeled as simulated data in the UI

    // Normalize query for consistent demo responses
    const q = query.toLowerCase().trim()

    if (q.includes('climate') && q.includes('warming')) {
      return [
        {
          source: 'Scientific Community (Demo)',
          text: 'Global temperatures have risen approximately 1.1°C since pre-industrial times',
          timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          supports: true,
        },
        {
          source: 'Climate Research Institute (Demo)',
          text: 'Human activities are the dominant cause of observed warming',
          timestamp: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
          supports: true,
        },
      ]
    }

    if (q.includes('earth') && q.includes('flat')) {
      return [
        {
          source: 'Physics Department (Demo)',
          text: 'Earth is an oblate spheroid with strong gravitational evidence',
          timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          contradicts: true,
        },
        {
          source: 'Astronomy Society (Demo)',
          text: 'Satellite imagery and orbital mechanics confirm spherical shape',
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          contradicts: true,
        },
      ]
    }

    if (q.includes('vaccine')) {
      return [
        {
          source: 'Health Organization (Demo)',
          text: 'Vaccines undergo rigorous testing before approval',
          timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          supports: true,
        },
        {
          source: 'Medical Research (Demo)',
          text: 'Efficacy data shows strong safety profiles across millions of doses',
          timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          supports: true,
        },
      ]
    }

    // Default response for unknown queries
    return [
      {
        source: 'General Knowledge Base (Demo)',
        text: 'Limited specific information available for this query. More context needed.',
        timestamp: new Date().toISOString(),
      },
    ]
  }
}

class UnavailableAdapter implements EvidenceAdapter {
  name = 'unavailable'
  isConfigured = false

  async searchForEvidence(query: string, context?: string): Promise<Evidence[]> {
    // Return empty array to indicate no sources available
    return []
  }
}

const unavailableAdapter = new UnavailableAdapter()

export async function getEvidenceAdapters(): Promise<EvidenceAdapter[]> {
  // Real search adapters should be registered here only when their provider is
  // configured and their results include attributable source URLs. We abstain
  // by default rather than returning simulated evidence or an invented score.
  return [unavailableAdapter]
}

export async function searchAllAdapters(
  query: string,
  context?: string
): Promise<Evidence[]> {
  const adapters = await getEvidenceAdapters()
  const allEvidence: Evidence[] = []

  for (const adapter of adapters) {
    try {
      const evidence = await adapter.searchForEvidence(query, context)
      allEvidence.push(...evidence)
    } catch (error) {
      console.error(`Error from adapter ${adapter.name}:`, error)
    }
  }

  return allEvidence
}
