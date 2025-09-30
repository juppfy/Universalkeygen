import { useMemo, useState } from 'react';
import { Copy, Download, Eye, EyeOff, Check } from 'lucide-react';
import { estimateStrength } from '../utils/strength';
import { pemToDerArrayBuffer } from '../utils/pem';
import QRCode from 'qrcode';

interface OutputDisplayProps {
  output: string;
  keyType: string;
  bulk?: string[] | null;
}

export default function OutputDisplay({ output, keyType, bulk }: OutputDisplayProps) {
  const [copied, setCopied] = useState(false);
  const [hidden, setHidden] = useState(false);

  const strength = useMemo(() => estimateStrength(output, keyType), [output, keyType]);

  const highlighted = useMemo(() => {
    if (!output) return '';
    if (hidden) return '•'.repeat(output.length > 100 ? 100 : output.length);
    // Minimal PEM highlighting: emphasize headers/footers
    if (output.includes('-----BEGIN') && output.includes('-----END')) {
      return output
        .replaceAll('-----BEGIN', '<span class="text-green-400">-----BEGIN')
        .replaceAll('-----END', '<span class="text-green-400">-----END')
        .replaceAll('-----', '-----</span>');
    }
    return output;
  }, [output, hidden]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const extension = keyType === 'ssl' || keyType === 'ssh' ? '.pem' : '.txt';
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${keyType}-key-${Date.now()}${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadDer = () => {
    const der = pemToDerArrayBuffer(output);
    if (!der) return;
    const blob = new Blob([der], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${keyType}-key-${Date.now()}.der`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleQr = async () => {
    if (!output || output.length > 2048) return; // avoid huge QR
    const dataUrl = await QRCode.toDataURL(output, { width: 256, errorCorrectionLevel: 'M' });
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `${keyType}-qr-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDownloadZip = async () => {
    if (!bulk || bulk.length === 0) return;
    const { default: JSZip } = await import('jszip');
    const zip = new JSZip();
    bulk.forEach((v, i) => {
      const ext = keyType === 'ssl' || keyType === 'ssh' ? 'pem' : 'txt';
      zip.file(`${keyType}-${i + 1}.${ext}`, v);
    });
    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${keyType}-keys-${bulk.length}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!output) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 p-8 text-center">
        <div className="text-zinc-600 text-sm">
          Configure your key settings and click "Generate Key" to create a secure key
        </div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800">
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
        <div className="text-sm text-zinc-400">Generated Key</div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setHidden(!hidden)}
            className="p-2 hover:bg-zinc-800 transition-colors text-zinc-400 hover:text-zinc-200"
            title={hidden ? 'Show key' : 'Hide key'}
          >
            {hidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
          <button
            onClick={handleCopy}
            className="p-2 hover:bg-zinc-800 transition-colors text-zinc-400 hover:text-zinc-200"
            title="Copy to clipboard"
          >
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
          </button>
          <button
            onClick={handleDownload}
            className="p-2 hover:bg-zinc-800 transition-colors text-zinc-400 hover:text-zinc-200"
            title="Download key"
          >
            <Download className="w-4 h-4" />
          </button>
          {(keyType === 'ssl' || keyType === 'ssh') && output.includes('BEGIN') && (
            <button
              onClick={handleDownloadDer}
              className="px-3 py-1 text-xs bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 text-zinc-200"
              title="Download DER"
            >
              DER
            </button>
          )}
          {bulk && bulk.length > 1 && (
            <button
              onClick={handleDownloadZip}
              className="px-3 py-1 text-xs bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 text-zinc-200"
              title="Download ZIP of generated keys"
            >
              Download ZIP ({bulk.length})
            </button>
          )}
          {output && output.length <= 2048 && (
            <button
              onClick={handleQr}
              className="px-3 py-1 text-xs bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 text-zinc-200"
              title="Download QR image of this key"
            >
              QR
            </button>
          )}
        </div>
      </div>
      <div className="p-4">
        {(keyType === 'secret' || keyType === 'api' || keyType === 'jwt') && (
          <div className="mb-3 flex items-center gap-3 text-xs">
            <div className="text-zinc-500">Strength:</div>
            <div className="flex-1 h-1 bg-zinc-800">
              <div
                className={`${strength.level === 'Strong' ? 'bg-green-500' : strength.level === 'Medium' ? 'bg-yellow-500' : 'bg-red-500'}`}
                style={{ width: `${Math.max(8, strength.score)}%`, height: '0.25rem' }}
              />
            </div>
            <div className={`uppercase ${strength.level === 'Strong' ? 'text-green-500' : strength.level === 'Medium' ? 'text-yellow-500' : 'text-red-500'}`}>
              {strength.level}
            </div>
          </div>
        )}
        <pre className="text-sm text-zinc-200 whitespace-pre-wrap break-all font-mono" dangerouslySetInnerHTML={{ __html: highlighted }} />
      </div>
    </div>
  );
}
