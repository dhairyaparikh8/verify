/*
 * COMPLETE CLIENT-SIDE SOURCE EXPORT
 *
 * This file is a standalone, copyable client-side version of the configurable
 * credibility analyzer UI. It includes the theme/config shape, landing-page
 * sections, customization modal, and analyzer display. For production live
 * verification, connect the analyze request to the server route at
 * /api/analyze and keep evidence adapters server-side.
 *
 * Copy this file into a Next.js App Router project as a page or component.
 */
'use client'

import { useEffect, useState } from 'react'
import { AlertCircle, CheckCircle, HelpCircle, Loader, Menu, Settings, X, XCircle } from 'lucide-react'

type Verdict = 'verified' | 'mixed' | 'unsupported' | 'insufficient'

type Evidence = {
  source: string
  text: string
  supports?: boolean
  contradicts?: boolean
  timestamp?: string
}

type Result = {
  verdict: Verdict
  confidence: number
  confidenceReason: string
  summary: string
  uncertainty?: string
  evidence: Evidence[]
  sourceCount: number
  verificationTimestamp: string
}

type Config = {
  appName: string
  tagline: string
  heroTitle: string
  heroSubtitle: string
  heroDescription: string
  primary: string
  accent: string
  demoTitle: string
  demoDescription: string
  placeholder: string
}

const defaultConfig: Config = {
  appName: 'Credibility Analyzer',
  tagline: 'Evidence-based claim verification',
  heroTitle: 'Verify Claims with Evidence',
  heroSubtitle: 'Transparent, source-backed analysis',
  heroDescription: 'Analyze claims and articles with a clear methodology that shows evidence, citations, and confidence levels. No guessing. No fabricated scores.',
  primary: '#0f172a',
  accent: '#3b82f6',
  demoTitle: 'Try the Analyzer',
  demoDescription: 'Paste a URL or enter a claim to see how evidence shapes credibility',
  placeholder: 'Enter a URL or claim...',
}

export default function SourceExport() {
  const [config, setConfig] = useState<Config>(defaultConfig)
  const [input, setInput] = useState('')
  const [result, setResult] = useState<Result | null>(null)
  const [loading, setLoading] = useState(false)
  const [customizing, setCustomizing] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const saved = window.localStorage.getItem('credibility-export-config')
    if (saved) {
      try { setConfig(JSON.parse(saved)) } catch { /* keep defaults */ }
    }
  }, [])

  function updateConfig(next: Config) {
    setConfig(next)
    window.localStorage.setItem('credibility-export-config', JSON.stringify(next))
  }

  async function analyze() {
    if (!input.trim()) return
    setLoading(true)
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input, isUrl: input.startsWith('http') }),
      })
      if (!response.ok) throw new Error('Analysis failed')
      setResult(await response.json())
    } catch {
      setResult({
        verdict: 'insufficient',
        confidence: 0,
        confidenceReason: 'The evidence service was unavailable.',
        summary: 'No trustworthy score was produced.',
        uncertainty: 'This is an abstention, not a claim that the input is false.',
        evidence: [],
        sourceCount: 0,
        verificationTimestamp: new Date().toISOString(),
      })
    } finally { setLoading(false) }
  }

  const color = result?.verdict === 'verified' ? '#10b981' : result?.verdict === 'mixed' ? '#f59e0b' : result?.verdict === 'unsupported' ? '#ef4444' : '#8b5cf6'

  return (
    <main style={{ minHeight: '100vh', color: config.primary, background: '#fff', fontFamily: 'system-ui, sans-serif' }}>
      <nav style={{ borderBottom: '1px solid #e2e8f0', padding: '16px 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: '#fff', zIndex: 2 }}>
        <strong>{config.appName}</strong>
        <button onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu" style={{ border: 0, background: 'transparent' }}>{menuOpen ? <X /> : <Menu />}</button>
      </nav>
      {menuOpen && <div style={{ padding: 20, borderBottom: '1px solid #e2e8f0' }}>Evidence · Methodology · Try It</div>}

      <section style={{ padding: '100px 5%', textAlign: 'center', background: 'linear-gradient(135deg,#eff6ff,#f8fafc)' }}>
        <p style={{ color: config.accent, fontWeight: 700 }}>{config.tagline}</p>
        <h1 style={{ fontSize: 'clamp(40px,7vw,72px)', lineHeight: 1.05, margin: '16px auto', maxWidth: 850 }}>{config.heroTitle}</h1>
        <h2 style={{ fontWeight: 500, color: '#64748b' }}>{config.heroSubtitle}</h2>
        <p style={{ maxWidth: 650, margin: '20px auto 32px', color: '#64748b', fontSize: 18 }}>{config.heroDescription}</p>
        <button onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })} style={{ background: config.accent, color: '#fff', border: 0, borderRadius: 8, padding: '14px 24px', fontWeight: 700 }}>Analyze Now</button>
      </section>

      <section style={{ padding: '80px 5%', maxWidth: 1050, margin: 'auto' }}>
        <h2>Transparent by design</h2>
        <p style={{ color: '#64748b' }}>Every result separates verdict, confidence, evidence coverage, and uncertainty.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(190px,1fr))', gap: 16, marginTop: 28 }}>
          {['Extract claims', 'Gather sources', 'Assess coverage', 'Show conflicts'].map((item, i) => <article key={item} style={{ padding: 22, border: '1px solid #e2e8f0', borderRadius: 10 }}><b>{i + 1}</b><h3>{item}</h3><p style={{ color: '#64748b' }}>Clear steps with no hidden certainty.</p></article>)}
        </div>
      </section>

      <section id="demo" style={{ padding: '80px 5%', background: '#f8fafc' }}>
        <div style={{ maxWidth: 850, margin: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 20, alignItems: 'center' }}><div><h2>{config.demoTitle}</h2><p style={{ color: '#64748b' }}>{config.demoDescription}</p></div><button onClick={() => setCustomizing(true)} aria-label="Customize UI" style={{ border: '1px solid #cbd5e1', background: '#fff', borderRadius: 8, padding: 10 }}><Settings size={18} /></button></div>
          <div style={{ marginTop: 20, padding: 22, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10 }}>
            <div style={{ display: 'flex', gap: 8 }}><input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.nativeEvent.isComposing) analyze() }} placeholder={config.placeholder} style={{ flex: 1, padding: 13, border: '1px solid #cbd5e1', borderRadius: 8 }} /><button onClick={analyze} disabled={!input.trim() || loading} style={{ background: config.accent, color: '#fff', border: 0, borderRadius: 8, padding: '0 18px' }}>{loading ? <Loader className="animate-spin" size={18} /> : 'Analyze'}</button></div>
            {result && <div style={{ marginTop: 22, border: `2px solid ${color}`, borderRadius: 10, padding: 20 }}><div style={{ display: 'flex', gap: 10, alignItems: 'center', color }}><VerdictIcon verdict={result.verdict} /><h3>{result.verdict === 'verified' ? 'Verified' : result.verdict === 'mixed' ? 'Mixed Evidence' : result.verdict === 'unsupported' ? 'Unsupported' : 'Insufficient Evidence'}</h3></div><p>{result.summary}</p><strong>Confidence: {Math.round(result.confidence * 100)}%</strong><p style={{ color: '#64748b', fontSize: 14 }}>{result.confidenceReason}</p>{result.uncertainty && <p style={{ background: '#fffbeb', padding: 12, borderRadius: 8, fontSize: 14 }}>{result.uncertainty}</p>}</div>}
          </div>
        </div>
      </section>

      {customizing && <Customizer config={config} onSave={updateConfig} onClose={() => setCustomizing(false)} />}
    </main>
  )
}

function VerdictIcon({ verdict }: { verdict: Verdict }) { return verdict === 'verified' ? <CheckCircle /> : verdict === 'unsupported' ? <XCircle /> : verdict === 'insufficient' ? <HelpCircle /> : <AlertCircle /> }

function Customizer({ config, onSave, onClose }: { config: Config; onSave: (c: Config) => void; onClose: () => void }) {
  const [draft, setDraft] = useState(config)
  const field = (key: keyof Config, label: string) => <label style={{ display: 'grid', gap: 6 }}><span>{label}</span><input value={draft[key] as string} onChange={e => setDraft({ ...draft, [key]: e.target.value })} style={{ padding: 9, border: '1px solid #cbd5e1', borderRadius: 6 }} /></label>
  return <div style={{ position: 'fixed', inset: 0, background: '#0008', display: 'grid', placeItems: 'center', zIndex: 3 }}><div style={{ background: '#fff', maxWidth: 560, width: '92%', maxHeight: '90vh', overflow: 'auto', padding: 24, borderRadius: 12 }}><div style={{ display: 'flex', justifyContent: 'space-between' }}><h2>Customize UI</h2><button onClick={onClose} aria-label="Close"><X /></button></div><div style={{ display: 'grid', gap: 14 }}>{field('appName', 'App name')}{field('tagline', 'Tagline')}{field('heroTitle', 'Hero title')}{field('heroSubtitle', 'Hero subtitle')}{field('heroDescription', 'Hero description')}{field('demoTitle', 'Demo title')}{field('demoDescription', 'Demo description')}{field('placeholder', 'Input placeholder')}<label>Accent color <input type="color" value={draft.accent} onChange={e => setDraft({ ...draft, accent: e.target.value })} /></label></div><button onClick={() => { onSave(draft); onClose() }} style={{ marginTop: 20, background: draft.accent, color: '#fff', border: 0, padding: 12, borderRadius: 8, width: '100%' }}>Save changes</button></div></div>
}

export { defaultConfig }

// End of complete client-side source export.
// The live scoring implementation belongs in app/api/analyze/route.ts.
// Never replace it with fabricated client-side scores.
