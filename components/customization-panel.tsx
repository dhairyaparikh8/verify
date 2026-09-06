'use client'

import { useState, useEffect } from 'react'
import { CredibilityConfig, neutralStarterConfig } from '@/lib/credibility-config'
import { X, Download, Upload, RotateCcw } from 'lucide-react'

interface CustomizationPanelProps {
  config: CredibilityConfig
  onConfigChange: (config: CredibilityConfig) => void
  isOpen: boolean
  onClose: () => void
}

export function CustomizationPanel({
  config,
  onConfigChange,
  isOpen,
  onClose,
}: CustomizationPanelProps) {
  const [localConfig, setLocalConfig] = useState(config)
  const [activeTab, setActiveTab] = useState<'branding' | 'copy' | 'theme' | 'sections'>('branding')

  useEffect(() => {
    setLocalConfig(config)
  }, [config])

  const handleBrandingChange = (field: string, value: string) => {
    setLocalConfig({
      ...localConfig,
      branding: {
        ...localConfig.branding,
        [field]: value,
      },
    })
  }

  const handleHeroChange = (field: string, value: string) => {
    setLocalConfig({
      ...localConfig,
      hero: {
        ...localConfig.hero,
        [field]: value,
      },
    })
  }

  const handleDemoChange = (field: string, value: string) => {
    setLocalConfig({
      ...localConfig,
      demo: {
        ...localConfig.demo,
        [field]: value,
      },
    })
  }

  const handleThemeColorChange = (colorKey: string, value: string) => {
    setLocalConfig({
      ...localConfig,
      theme: {
        ...localConfig.theme,
        [colorKey]: value,
      },
    })
  }

  const handleSectionToggle = (section: keyof typeof localConfig.sections) => {
    setLocalConfig({
      ...localConfig,
      sections: {
        ...localConfig.sections,
        [section]: {
          ...localConfig.sections[section],
          enabled: !localConfig.sections[section].enabled,
        },
      },
    })
  }

  const handleApply = () => {
    onConfigChange(localConfig)
    localStorage.setItem('credibilityConfig', JSON.stringify(localConfig))
  }

  const handleReset = () => {
    setLocalConfig(neutralStarterConfig)
    localStorage.removeItem('credibilityConfig')
    onConfigChange(neutralStarterConfig)
  }

  const handleExport = () => {
    const dataStr = JSON.stringify(localConfig, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'credibility-config.json'
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const text = await file.text()
      const imported = JSON.parse(text) as CredibilityConfig
      setLocalConfig(imported)
    } catch (error) {
      alert('Failed to import config. Please check the file format.')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end md:items-center justify-center">
      <div className="bg-white dark:bg-slate-900 w-full md:w-2/3 lg:w-1/2 max-h-[90vh] overflow-y-auto rounded-t-lg md:rounded-lg shadow-xl">
        <div className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 p-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Customize UI</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex border-b border-slate-200 dark:border-slate-700">
          {(['branding', 'copy', 'theme', 'sections'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 px-4 text-center capitalize text-sm font-medium transition ${
                activeTab === tab
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === 'branding' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">App Name</label>
                <input
                  type="text"
                  value={localConfig.branding.appName}
                  onChange={(e) => handleBrandingChange('appName', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Tagline</label>
                <input
                  type="text"
                  value={localConfig.branding.tagline}
                  onChange={(e) => handleBrandingChange('tagline', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Hero Title</label>
                <input
                  type="text"
                  value={localConfig.hero.title}
                  onChange={(e) => handleHeroChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Hero Subtitle</label>
                <input
                  type="text"
                  value={localConfig.hero.subtitle}
                  onChange={(e) => handleHeroChange('subtitle', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800"
                />
              </div>
            </div>
          )}

          {activeTab === 'copy' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Hero Description</label>
                <textarea
                  value={localConfig.hero.description}
                  onChange={(e) => handleHeroChange('description', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 h-24"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">CTA Button Text</label>
                <input
                  type="text"
                  value={localConfig.hero.ctaText}
                  onChange={(e) => handleHeroChange('ctaText', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Demo Input Placeholder</label>
                <input
                  type="text"
                  value={localConfig.demo.inputPlaceholder}
                  onChange={(e) => handleDemoChange('inputPlaceholder', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Analyze Button Text</label>
                <input
                  type="text"
                  value={localConfig.demo.analyzeButtonText}
                  onChange={(e) => handleDemoChange('analyzeButtonText', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800"
                />
              </div>
            </div>
          )}

          {activeTab === 'theme' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(localConfig.theme).map(([key, value]) => {
                  if (key === 'verdictColors') return null
                  if (typeof value !== 'string') return null
                  return (
                    <div key={key}>
                      <label className="block text-sm font-medium mb-2 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={value}
                          onChange={(e) => handleThemeColorChange(key, e.target.value)}
                          className="w-10 h-10 rounded border border-slate-300 dark:border-slate-600 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={value}
                          onChange={(e) => handleThemeColorChange(key, e.target.value)}
                          className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-sm font-mono"
                        />
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                <h3 className="font-medium mb-3">Verdict Colors</h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(localConfig.theme.verdictColors).map(([verdict, color]) => (
                    <div key={verdict}>
                      <label className="block text-sm font-medium mb-2 capitalize">{verdict}</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={color}
                          onChange={(e) => {
                            setLocalConfig({
                              ...localConfig,
                              theme: {
                                ...localConfig.theme,
                                verdictColors: {
                                  ...localConfig.theme.verdictColors,
                                  [verdict]: e.target.value,
                                },
                              },
                            })
                          }}
                          className="w-10 h-10 rounded border border-slate-300 dark:border-slate-600 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={color}
                          onChange={(e) => {
                            setLocalConfig({
                              ...localConfig,
                              theme: {
                                ...localConfig.theme,
                                verdictColors: {
                                  ...localConfig.theme.verdictColors,
                                  [verdict]: e.target.value,
                                },
                              },
                            })
                          }}
                          className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-sm font-mono"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'sections' && (
            <div className="space-y-3">
              {Object.entries(localConfig.sections).map(([key, section]) => (
                <label key={key} className="flex items-center gap-3 p-3 border border-slate-200 dark:border-slate-700 rounded hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={section.enabled}
                    onChange={() => handleSectionToggle(key as keyof typeof localConfig.sections)}
                    className="w-5 h-5 rounded"
                  />
                  <span className="capitalize font-medium">{key}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 p-4 flex gap-3 flex-wrap justify-end">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition"
            title="Reset to defaults"
          >
            <RotateCcw size={18} />
            Reset
          </button>
          <label className="flex items-center gap-2 px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition cursor-pointer">
            <Upload size={18} />
            Import
            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
          </label>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition"
          >
            <Download size={18} />
            Export
          </button>
          <button
            onClick={handleApply}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded transition font-medium"
          >
            Apply Changes
          </button>
        </div>
      </div>
    </div>
  )
}
