import { Key, Shield, Zap } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="border-b border-zinc-800 bg-black">
      <div className="max-w-7xl mx-auto px-6 py-20 text-center">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <Key className="w-16 h-16 text-green-500" strokeWidth={1.5} />
            <div className="absolute inset-0 blur-xl bg-green-500/20"></div>
          </div>
        </div>

        <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight">
          Generate Any Key, Instantly Secure
        </h1>

        <p className="text-xl text-zinc-400 mb-12 max-w-2xl mx-auto">
          Create cryptographic keys, API secrets, and SSL certificates entirely in your browser.
          No data leaves your machine.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center w-12 h-12 bg-zinc-900 border border-zinc-800 mb-3">
              <Shield className="w-6 h-6 text-green-500" strokeWidth={1.5} />
            </div>
            <div className="text-2xl font-bold text-white mb-1">100% Client-Side</div>
            <div className="text-sm text-zinc-500">Zero server storage</div>
          </div>

          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center w-12 h-12 bg-zinc-900 border border-zinc-800 mb-3">
              <Zap className="w-6 h-6 text-green-500" strokeWidth={1.5} />
            </div>
            <div className="text-2xl font-bold text-white mb-1">Instant Generation</div>
            <div className="text-sm text-zinc-500">Sub-second creation</div>
          </div>

          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center w-12 h-12 bg-zinc-900 border border-zinc-800 mb-3">
              <Key className="w-6 h-6 text-green-500" strokeWidth={1.5} />
            </div>
            <div className="text-2xl font-bold text-white mb-1">12+ Key Types</div>
            <div className="text-sm text-zinc-500">All formats supported</div>
          </div>
        </div>
      </div>
    </section>
  );
}
