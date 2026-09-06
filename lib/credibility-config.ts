export interface CredibilityConfig {
  branding: {
    appName: string
    tagline: string
    logo?: string
  }
  nav: {
    problem: string
    workflow: string
    insights: string
    vision: string
    demo: string
  }
  hero: {
    title: string
    subtitle: string
    description: string
    ctaText: string
  }
  sections: {
    problem: {
      enabled: boolean
      title: string
      description: string
      items: Array<{
        year: string
        title: string
        description: string
      }>
    }
    workflow: {
      enabled: boolean
      title: string
      description: string
      steps: Array<{
        number: string
        title: string
        description: string
      }>
    }
    heatmap: {
      enabled: boolean
      title: string
      description: string
      patterns: string[]
    }
    consensus: {
      enabled: boolean
      title: string
      description: string
    }
    vision: {
      enabled: boolean
      title: string
      description: string
      points: string[]
    }
  }
  demo: {
    title: string
    description: string
    inputPlaceholder: string
    samplesLabel: string
    samples: Array<{
      label: string
      url?: string
      claim?: string
    }>
    analyzeButtonText: string
    resetButtonText: string
    customizeButtonText: string
  }
  scoring: {
    verdictLabels: {
      verified: string
      mixed: string
      unsupported: string
      insufficient: string
    }
    verdictDescriptions: {
      verified: string
      mixed: string
      unsupported: string
      insufficient: string
    }
  }
  theme: {
    primary: string
    secondary: string
    accent: string
    background: string
    foreground: string
    card: string
    cardForeground: string
    muted: string
    mutedForeground: string
    border: string
    verdictColors: {
      verified: string
      mixed: string
      unsupported: string
      insufficient: string
    }
  }
}

export const neutralStarterConfig: CredibilityConfig = {
  branding: {
    appName: 'Credibility Analyzer',
    tagline: 'Evidence-based claim verification',
  },
  nav: {
    problem: 'Problem',
    workflow: 'How It Works',
    insights: 'Insights',
    vision: 'Vision',
    demo: 'Try It',
  },
  hero: {
    title: 'Verify Claims with Evidence',
    subtitle: 'Transparent, source-backed analysis',
    description:
      'Analyze claims and articles with a clear methodology that shows evidence, citations, and confidence levels. No guessing. No fabricated scores.',
    ctaText: 'Analyze Now',
  },
  sections: {
    problem: {
      enabled: true,
      title: 'The Problem with Trust',
      description:
        'Claims flood the internet every second. How do we know what to believe?',
      items: [
        {
          year: '2020',
          title: 'Misinformation Crisis',
          description: 'Rapid spread of unverified claims across platforms',
        },
        {
          year: '2021',
          title: 'Trust Erosion',
          description: 'Public confidence in media reaches historic lows',
        },
        {
          year: '2022',
          title: 'Verification Gap',
          description: 'Manual fact-checking cannot keep pace with content volume',
        },
        {
          year: '2024',
          title: 'AI-Generated Content',
          description: 'Synthetic media compounds the verification challenge',
        },
      ],
    },
    workflow: {
      enabled: true,
      title: 'Our Methodology',
      description: 'Transparent, step-by-step claim analysis',
      steps: [
        {
          number: '1',
          title: 'Extract Claims',
          description: 'Identify specific, verifiable assertions from the content',
        },
        {
          number: '2',
          title: 'Gather Evidence',
          description: 'Search authoritative sources for supporting or contradicting information',
        },
        {
          number: '3',
          title: 'Assess Coverage',
          description: 'Evaluate how thoroughly sources address each claim',
        },
        {
          number: '4',
          title: 'Determine Verdict',
          description: 'Show evidence support, conflicts, and confidence levels',
        },
      ],
    },
    heatmap: {
      enabled: true,
      title: 'Language Pattern Analysis',
      description: 'Identify rhetorical techniques that can mask or obscure claims',
      patterns: [
        'Appeals to emotion',
        'Loaded language',
        'Vague quantifiers',
        'Ad hominem',
        'Circular reasoning',
        'False dichotomy',
      ],
    },
    consensus: {
      enabled: true,
      title: 'Consensus vs. Friction',
      description: 'When sources disagree, we show the conflict rather than hide it',
    },
    vision: {
      enabled: true,
      title: 'Our Vision',
      description: 'A world where claims are transparent and evidence is accessible',
      points: [
        'All scores tied to verifiable sources',
        'Confidence intervals, not false certainty',
        'Visible methodology and assumptions',
        'Open feedback and continuous improvement',
      ],
    },
  },
  demo: {
    title: 'Try the Analyzer',
    description: 'Paste a URL or enter a claim to see how evidence shapes credibility',
    inputPlaceholder: 'Enter a URL or claim...',
    samplesLabel: 'Or try a sample:',
    samples: [
      {
        label: 'Sample Article 1',
        url: 'https://example.com/article1',
      },
      {
        label: 'Sample Article 2',
        url: 'https://example.com/article2',
      },
      {
        label: 'Sample Claim',
        claim: 'Example claim for verification',
      },
    ],
    analyzeButtonText: 'Analyze',
    resetButtonText: 'Reset',
    customizeButtonText: 'Customize UI',
  },
  scoring: {
    verdictLabels: {
      verified: 'Verified',
      mixed: 'Mixed Evidence',
      unsupported: 'Unsupported',
      insufficient: 'Insufficient Evidence',
    },
    verdictDescriptions: {
      verified: 'Claim is well-supported by multiple authoritative sources',
      mixed: 'Evidence both supports and contradicts the claim',
      unsupported: 'Available evidence does not support the claim',
      insufficient: 'Unable to gather sufficient evidence. Sources unavailable.',
    },
  },
  theme: {
    primary: '#0f172a',
    secondary: '#64748b',
    accent: '#3b82f6',
    background: '#ffffff',
    foreground: '#0f172a',
    card: '#f8fafc',
    cardForeground: '#0f172a',
    muted: '#e2e8f0',
    mutedForeground: '#64748b',
    border: '#e2e8f0',
    verdictColors: {
      verified: '#10b981',
      mixed: '#f59e0b',
      unsupported: '#ef4444',
      insufficient: '#8b5cf6',
    },
  },
}
