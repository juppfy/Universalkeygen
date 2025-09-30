import { Shield, Zap, FileCode, Download } from 'lucide-react';

export default function FeaturesGrid() {
  const features = [
    {
      icon: Shield,
      title: 'Client-Side Generation',
      description: 'All keys are generated in your browser using Web Crypto API. Nothing is sent to any server.',
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Generate cryptographically secure keys in milliseconds with modern browser APIs.',
    },
    {
      icon: FileCode,
      title: 'Multiple Formats',
      description: 'Support for PEM, DER, SSH, hex, base64, and custom formats for maximum compatibility.',
    },
    {
      icon: Download,
      title: 'Export Options',
      description: 'Download keys as .txt, .pem, .key files or copy directly to clipboard.',
    },
  ];

  return (
    <section className="bg-black border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="border border-zinc-800 p-6 bg-zinc-900/50">
              <feature.icon className="w-8 h-8 text-green-500 mb-4" strokeWidth={1.5} />
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-zinc-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
