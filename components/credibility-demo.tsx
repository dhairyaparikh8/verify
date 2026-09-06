'use client'

import { useState } from 'react'
import { CredibilityConfig } from '@/lib/credibility-config'
import { CredibilityResult, Verdict } from '@/lib/credibility-engine'
import { AlertCircle, CheckCircle, XCircle, HelpCircle, Loader, Settings } from 'lucide-react'

interface CredibilityDemoProps {
  config: CredibilityConfig
  onCustomizeClick: () => void
}

export function CredibilityDemo({ config, onCustomizeClick }: CredibilityDemoProps) {
  const [input, setInput] = useState('')
  const [result, setResult] = useState<CredibilityResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAnalyze = async () => {
    if (!input.trim()) {
      setError('Please enter a URL or claim')
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: input.trim(),
          isUrl: input.trim().startsWith('http'),
        }),
      })

      if (!response.ok) {
        throw new Error('Analysis failed')
      }

      const data: CredibilityResult = await response.json()
      setResult(data)
    } catch (err) {
      setError('Unable to complete analysis. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSampleClick = (sample: (typeof config.demo.samples)[0]) => {
    setInput(sample.url || sample.claim || '')
    setError(null)
    setResult(null)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
      handleAnalyze()
    }
  }

  const getVerdictIcon = (verdict: Verdict) => {
    switch (verdict) {
      case 'verified':
        return <CheckCircle className="w-6 h-6" />
      case 'mixed':
        return <AlertCircle className="w-6 h-6" />
      case 'unsupported':
        return <XCircle className="w-6 h-6" />
      case 'insufficient':
        return <HelpCircle className="w-6 h-6" />
    }
  }

  const getVerdictColor = (verdict: Verdict): string => {
    return config.theme.verdictColors[verdict]
  }

  return (
    <section id="demo" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900/50">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-3xl font-bold mb-2">{config.demo.title}</h2>
            <p className="text-slate-600 dark:text-slate-400">{config.demo.description}</p>
          </div>
          <button
            onClick={onCustomizeClick}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition font-medium"
          >
            <Settings size={18} />
            {config.demo.customizeButtonText}
          </button>
        </div>

        <div className="mt-8 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={config.demo.inputPlaceholder}
              className="flex-1 px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
            <button
              onClick={handleAnalyze}
              disabled={loading || !input.trim()}
              className="px-6 py-3 bg-blue-600 text-white hover:bg-blue-700 disabled:bg-slate-400 rounded-lg transition font-medium flex items-center gap-2"
            >
              {loading ? <Loader className="w-4 h-4 animate-spin" /> : null}
              {config.demo.analyzeButtonText}
            </button>
          </div>

          {config.demo.samples.length > 0 && (
            <div className="mb-6 pb-4 border-b border-slate-200 dark:border-slate-700">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                {config.demo.samplesLabel}
              </p>
              <div className="flex flex-wrap gap-2">
                {config.demo.samples.map((sample, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSampleClick(sample)}
                    disabled={loading}
                    className="px-3 py-2 text-sm bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 disabled:opacity-50 rounded transition"
                  >
                    {sample.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {result && (
            <div className="space-y-6">
              {/* Verdict Card */}
              <div className="p-6 border-2 rounded-lg" style={{ borderColor: getVerdictColor(result.verdict) }}>
                <div className="flex items-start gap-4">
                  <div style={{ color: getVerdictColor(result.verdict) }}>
                    {getVerdictIcon(result.verdict)}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-1">
                      {config.scoring.verdictLabels[result.verdict]}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-3">
                      {config.scoring.verdictDescriptions[result.verdict]}
                    </p>
                    <p className="text-sm text-slate-700 dark:text-slate-300 mb-4">
                      {result.summary}
                    </p>

                    {/* Confidence Display */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium">Analysis Confidence</label>
                        <span className="text-sm font-mono font-bold">
                          {Math.round(result.confidence * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full transition-all duration-300"
                          style={{
                            width: `${result.confidence * 100}%`,
                            backgroundColor: getVerdictColor(result.verdict),
                          }}
                        />
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                        {result.confidenceReason}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Evidence Summary */}
              {result.sourceCount > 0 && (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    Evidence Summary
                  </h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                    Analysis based on {result.sourceCount} source{result.sourceCount === 1 ? '' : 's'}
                  </p>

                  {/* Evidence Items */}
                  <div className="space-y-3">
                    {result.evidence.map((evidence, idx) => (
                      <div
                        key={idx}
                        className="text-sm p-3 bg-white dark:bg-slate-800 border-l-4 rounded"
                        style={{ borderColor: evidence.supports ? '#10b981' : evidence.contradicts ? '#ef4444' : '#8b5cf6' }}
                      >
                        <div className="font-medium text-slate-900 dark:text-white mb-1">
                          {evidence.source}
                        </div>
                        <p className="text-slate-700 dark:text-slate-300">{evidence.text}</p>
                        {evidence.timestamp && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                            {new Date(evidence.timestamp).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Uncertainty Note */}
              {result.uncertainty && (
                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-amber-900 dark:text-amber-100 mb-1">
                        Important Limitations
                      </h4>
                      <p className="text-sm text-amber-800 dark:text-amber-200">{result.uncertainty}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Metadata */}
              <div className="text-xs text-slate-500 dark:text-slate-400 pt-4 border-t border-slate-200 dark:border-slate-700">
                Analysis completed on {new Date(result.verificationTimestamp).toLocaleString()}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
