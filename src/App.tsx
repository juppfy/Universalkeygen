import { useEffect, useState } from 'react';
import HeroSection from './components/HeroSection';
import KeyTypeSelector, { KeyType } from './components/KeyTypeSelector';
import ConfigurationPanel from './components/ConfigurationPanel';
import OutputDisplay from './components/OutputDisplay';
import FeaturesGrid from './components/FeaturesGrid';
import { generateKey } from './utils/keyGenerator';
import { Sparkles } from 'lucide-react';
import FAQ from './components/FAQ';
import InfoSections from './components/InfoSections';

function App() {
  const [selectedType, setSelectedType] = useState<KeyType>('secret');
  const [config, setConfig] = useState<Record<string, any>>({});
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<{ total: number; byType: Record<string, number> }>({ total: 0, byType: {} });
  const [bulkCount, setBulkCount] = useState<number>(1);
  const [bulkResults, setBulkResults] = useState<string[] | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const key = await generateKey(selectedType, config);
      setOutput(key);
      setBulkResults(null);
    } finally {
      setLoading(false);
    }
  };

  const handleTypeChange = (type: KeyType) => {
    setSelectedType(type);
    setConfig({});
    setOutput('');
  };

  const handleBulkGenerate = async () => {
    if (bulkCount <= 1) return handleGenerate();
    setLoading(true);
    try {
      const results: string[] = [];
      for (let i = 0; i < bulkCount; i++) {
        // eslint-disable-next-line no-await-in-loop
        results.push(await generateKey(selectedType, config));
      }
      setOutput(results.join('\n\n')); // display concatenated; ZIP handled in OutputDisplay
      setBulkResults(results);
      setStats(prev => ({
        total: prev.total + bulkCount,
        byType: { ...prev.byType, [selectedType]: (prev.byType[selectedType] || 0) + bulkCount },
      }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const isMeta = navigator.platform.toLowerCase().includes('mac') ? e.metaKey : e.ctrlKey;
      if (isMeta && e.key.toLowerCase() === 'g') {
        e.preventDefault();
        handleBulkGenerate();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedType, config, bulkCount]);

  return (
    <div className="min-h-screen bg-black text-white">
      <HeroSection />

      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Select Key Type</h2>
            <KeyTypeSelector selectedType={selectedType} onSelect={handleTypeChange} />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Configuration</h2>
            <ConfigurationPanel
              keyType={selectedType}
              config={config}
              onConfigChange={setConfig}
            />
          </div>

          <div className="flex flex-col items-center gap-3">
            <div className="text-sm text-zinc-500">
              <span className="mr-4">Session total: <span className="text-zinc-300">{stats.total}</span></span>
              <span>
                {Object.entries(stats.byType).map(([t, c], idx) => (
                  <span key={t} className="mr-3">{t}:{' '}{c}{idx < Object.keys(stats.byType).length - 1 ? '' : ''}</span>
                ))}
              </span>
            </div>
            <button
              onClick={handleBulkGenerate}
              disabled={loading}
              className={`flex items-center gap-3 ${loading ? 'bg-green-600/60 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'} text-black font-semibold px-8 py-4 transition-colors text-lg`}
            >
              <Sparkles className="w-5 h-5" />
              {loading ? 'Generating…' : bulkCount > 1 ? `Generate ${bulkCount}` : 'Generate Key'}
            </button>
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <label>Count</label>
              <input
                type="number"
                min={1}
                max={50}
                value={bulkCount}
                onChange={(e) => setBulkCount(Math.max(1, Math.min(50, parseInt(e.target.value || '1', 10))))}
                className="w-20 bg-zinc-900 border border-zinc-800 text-zinc-200 px-3 py-1"
              />
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Output</h2>
            <OutputDisplay output={output} keyType={selectedType} bulk={bulkResults} />
          </div>
        </div>
      </main>

      <FeaturesGrid />
      <InfoSections />
      <FAQ />

      <footer className="border-t border-zinc-800 bg-black">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center text-zinc-600 text-sm">
            <p className="mb-2">All keys are generated client-side using the Web Crypto API</p>
            <p>No data is transmitted to any server. Your keys never leave your browser.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
