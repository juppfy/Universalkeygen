import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { KeyType } from './KeyTypeSelector';

interface ConfigurationPanelProps {
  keyType: KeyType;
  config: Record<string, any>;
  onConfigChange: (config: Record<string, any>) => void;
}

export default function ConfigurationPanel({ keyType, config, onConfigChange }: ConfigurationPanelProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const updateConfig = (key: string, value: any) => {
    onConfigChange({ ...config, [key]: value });
  };

  const renderSecretConfig = () => (
    <>
      <div>
        <label className="block text-sm text-zinc-400 mb-2" title="Number of random bytes to generate">
          Key Length: {config.length || 32} bytes
        </label>
        <div className="border border-zinc-800 bg-zinc-950 p-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Decrease length"
              onClick={() => updateConfig('length', Math.max(16, (config.length || 32) - 16))}
              className="px-2 py-1 border border-zinc-700 text-zinc-300 hover:bg-zinc-800"
            >
              −
            </button>
            <input
              type="range"
              min="16"
              max="256"
              step="16"
              value={config.length || 32}
              onChange={(e) => updateConfig('length', parseInt(e.target.value))}
              className="flex-1 h-2 bg-zinc-800 appearance-none cursor-pointer slider"
              aria-label="Secret key length"
            />
            <button
              type="button"
              aria-label="Increase length"
              onClick={() => updateConfig('length', Math.min(256, (config.length || 32) + 16))}
              className="px-2 py-1 border border-zinc-700 text-zinc-300 hover:bg-zinc-800"
            >
              +
            </button>
            <input
              type="number"
              min={16}
              max={256}
              step={16}
              value={config.length || 32}
              onChange={(e) => updateConfig('length', Math.max(16, Math.min(256, parseInt(e.target.value || '32', 10))))}
              className="w-20 bg-zinc-900 border border-zinc-800 text-zinc-200 px-2 py-1 text-sm"
              aria-label="Length value"
            />
          </div>
          <div className="flex justify-between text-xs text-zinc-600 mt-2">
            <span>16</span>
            <span>128</span>
            <span>256</span>
          </div>
        </div>
      </div>
      <div>
        <label className="block text-sm text-zinc-400 mb-2" title="Encoding used for the output string">Format</label>
        <select
          value={config.format || 'hex'}
          onChange={(e) => updateConfig('format', e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-800 text-zinc-200 px-4 py-2 focus:outline-none focus:border-green-500"
        >
          <option value="hex">Hexadecimal</option>
          <option value="base64">Base64</option>
          <option value="alphanumeric">Alphanumeric</option>
        </select>
      </div>
    </>
  );

  const renderBase64Config = () => (
    <>
      <div>
        <label className="block text-sm text-zinc-400 mb-2" title="Number of bytes before Base64 encoding">
          Byte Length: {config.byteLength || 32}
        </label>
        <input
          type="range"
          min="16"
          max="128"
          step="8"
          value={config.byteLength || 32}
          onChange={(e) => updateConfig('byteLength', parseInt(e.target.value))}
          className="w-full h-2 bg-zinc-800 appearance-none cursor-pointer slider"
        />
      </div>
      <div className="flex items-center">
        <input
          type="checkbox"
          id="urlSafe"
          checked={config.urlSafe || false}
          onChange={(e) => updateConfig('urlSafe', e.target.checked)}
          className="w-4 h-4 bg-zinc-900 border-zinc-800 text-green-500 focus:ring-green-500"
        />
        <label htmlFor="urlSafe" className="ml-2 text-sm text-zinc-400">URL-safe encoding</label>
      </div>
    </>
  );

  const renderSSLConfig = () => (
    <>
      <div>
        <label className="block text-sm text-zinc-400 mb-2" title="Choose RSA for compatibility or ECDSA for smaller keys">Algorithm</label>
        <select
          value={config.algorithm || 'rsa'}
          onChange={(e) => updateConfig('algorithm', e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-800 text-zinc-200 px-4 py-2 focus:outline-none focus:border-green-500"
        >
          <option value="rsa">RSA</option>
          <option value="ecdsa">ECDSA</option>
          <option value="ed25519">Ed25519</option>
        </select>
      </div>
      {config.algorithm === 'rsa' && (
        <div>
          <label className="block text-sm text-zinc-400 mb-2" title="Larger keys are slower to generate but stronger">Key Size</label>
          <select
            value={config.keySize || '2048'}
            onChange={(e) => updateConfig('keySize', e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 text-zinc-200 px-4 py-2 focus:outline-none focus:border-green-500"
          >
            <option value="2048">2048 bits</option>
            <option value="3072">3072 bits</option>
            <option value="4096">4096 bits</option>
          </select>
        </div>
      )}
      {config.algorithm === 'ecdsa' && (
        <div>
          <label className="block text-sm text-zinc-400 mb-2" title="P-256 is widely supported and recommended">Curve</label>
          <select
            value={config.curve || 'P-256'}
            onChange={(e) => updateConfig('curve', e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 text-zinc-200 px-4 py-2 focus:outline-none focus:border-green-500"
          >
            <option value="P-256">P-256</option>
            <option value="P-384">P-384</option>
            <option value="P-521">P-521</option>
          </select>
        </div>
      )}
    </>
  );

  const renderAPIConfig = () => (
    <>
      <div>
        <label className="block text-sm text-zinc-400 mb-2" title="Choose the API key scheme">Format</label>
        <select
          value={config.format || 'uuid'}
          onChange={(e) => updateConfig('format', e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-800 text-zinc-200 px-4 py-2 focus:outline-none focus:border-green-500"
        >
          <option value="uuid">UUID v4</option>
          <option value="nanoid">Nanoid</option>
          <option value="prefixed">Prefixed Key</option>
        </select>
      </div>
      {config.format === 'nanoid' && (
        <div>
          <label className="block text-sm text-zinc-400 mb-2" title="Length of the Nanoid string">
            Length: {config.length || 21}
          </label>
          <input
            type="range"
            min="16"
            max="64"
            value={config.length || 21}
            onChange={(e) => updateConfig('length', parseInt(e.target.value))}
            className="w-full h-2 bg-zinc-800 appearance-none cursor-pointer slider"
          />
        </div>
      )}
      {config.format === 'prefixed' && (
        <div>
          <label className="block text-sm text-zinc-400 mb-2" title="Prefix added to the generated key">Prefix</label>
          <input
            type="text"
            value={config.prefix || 'sk_live_'}
            onChange={(e) => updateConfig('prefix', e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 text-zinc-200 px-4 py-2 focus:outline-none focus:border-green-500"
            placeholder="sk_live_"
          />
        </div>
      )}
    </>
  );

  const renderJWTConfig = () => (
    <>
      <div>
        <label className="block text-sm text-zinc-400 mb-2" title="HS are shared secrets; RS generates a key pair">Algorithm</label>
        <select
          value={config.algorithm || 'HS256'}
          onChange={(e) => updateConfig('algorithm', e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-800 text-zinc-200 px-4 py-2 focus:outline-none focus:border-green-500"
        >
          <option value="HS256">HS256 (HMAC SHA-256)</option>
          <option value="HS384">HS384 (HMAC SHA-384)</option>
          <option value="HS512">HS512 (HMAC SHA-512)</option>
          <option value="RS256">RS256 (RSA SHA-256)</option>
        </select>
      </div>
    </>
  );

  const renderEncryptionConfig = () => (
    <>
      <div>
        <label className="block text-sm text-zinc-400 mb-2" title="Select symmetric encryption algorithm">Algorithm</label>
        <select
          value={config.algorithm || 'aes-256'}
          onChange={(e) => updateConfig('algorithm', e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-800 text-zinc-200 px-4 py-2 focus:outline-none focus:border-green-500"
        >
          <option value="aes-128">AES-128</option>
          <option value="aes-192">AES-192</option>
          <option value="aes-256">AES-256</option>
          <option value="chacha20">ChaCha20</option>
        </select>
      </div>
      <div>
        <label className="block text-sm text-zinc-400 mb-2" title="Encoding for the generated key bytes">Output Format</label>
        <select
          value={config.format || 'hex'}
          onChange={(e) => updateConfig('format', e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-800 text-zinc-200 px-4 py-2 focus:outline-none focus:border-green-500"
        >
          <option value="hex">Hexadecimal</option>
          <option value="base64">Base64</option>
          <option value="raw">Raw Bytes</option>
        </select>
      </div>
    </>
  );

  const renderSSHConfig = () => (
    <>
      <div>
        <label className="block text-sm text-zinc-400 mb-2" title="Ed25519 recommended for SSH keys">Algorithm</label>
        <select
          value={config.algorithm || 'ed25519'}
          onChange={(e) => updateConfig('algorithm', e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-800 text-zinc-200 px-4 py-2 focus:outline-none focus:border-green-500"
        >
          <option value="ed25519">Ed25519</option>
          <option value="rsa">RSA</option>
          <option value="ecdsa">ECDSA</option>
        </select>
      </div>
      {config.algorithm === 'rsa' && (
        <div>
          <label className="block text-sm text-zinc-400 mb-2" title="RSA SSH keys: 2048 or 4096 bits">Key Size</label>
          <select
            value={config.keySize || '4096'}
            onChange={(e) => updateConfig('keySize', e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 text-zinc-200 px-4 py-2 focus:outline-none focus:border-green-500"
          >
            <option value="2048">2048 bits</option>
            <option value="4096">4096 bits</option>
          </select>
        </div>
      )}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="passphrase"
          checked={config.withPassphrase || false}
          onChange={(e) => updateConfig('withPassphrase', e.target.checked)}
          className="w-4 h-4 bg-zinc-900 border-zinc-800 text-green-500 focus:ring-green-500"
        />
        <label htmlFor="passphrase" className="ml-2 text-sm text-zinc-400">Protect with passphrase</label>
      </div>
    </>
  );

  const renderConfig = () => {
    switch (keyType) {
      case 'secret':
        return renderSecretConfig();
      case 'base64':
        return renderBase64Config();
      case 'ssl':
        return renderSSLConfig();
      case 'api':
        return renderAPIConfig();
      case 'jwt':
        return renderJWTConfig();
      case 'encryption':
        return renderEncryptionConfig();
      case 'ssh':
        return renderSSHConfig();
      default:
        return null;
    }
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 p-6">
      <div className="space-y-4">
        {renderConfig()}
      </div>

      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="flex items-center gap-2 text-zinc-500 hover:text-zinc-300 text-sm mt-6 transition-colors"
      >
        {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        Advanced Settings
      </button>

      {showAdvanced && (
        <div className="mt-4 pt-4 border-t border-zinc-800 space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="includeTimestamp"
              checked={config.includeTimestamp || false}
              onChange={(e) => updateConfig('includeTimestamp', e.target.checked)}
              className="w-4 h-4 bg-zinc-900 border-zinc-800 text-green-500 focus:ring-green-500"
            />
            <label htmlFor="includeTimestamp" className="ml-2 text-sm text-zinc-400">
              Include generation timestamp
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
