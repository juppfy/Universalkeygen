// Minimal helpers to export ArrayBuffer keys to PEM strings

export function arrayBufferToBase64(data: ArrayBuffer): string {
  const bytes = new Uint8Array(data);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export function formatPem(label: string, der: ArrayBuffer): string {
  const base64 = arrayBufferToBase64(der);
  const lines = base64.match(/.{1,64}/g) || [];
  return `-----BEGIN ${label}-----\n${lines.join('\n')}\n-----END ${label}-----`;
}

export function pemToDerArrayBuffer(pem: string): ArrayBuffer | null {
  const match = pem.match(/-----BEGIN [^-]+-----([\s\S]*?)-----END [^-]+-----/);
  if (!match) return null;
  const base64 = match[1].replace(/\s+/g, '');
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

export async function exportPublicKeyToSpkiPem(key: CryptoKey): Promise<string> {
  const spki = await crypto.subtle.exportKey('spki', key);
  return formatPem('PUBLIC KEY', spki);
}

export async function exportPrivateKeyToPkcs8Pem(key: CryptoKey): Promise<string> {
  const pkcs8 = await crypto.subtle.exportKey('pkcs8', key);
  return formatPem('PRIVATE KEY', pkcs8);
}

export async function publicKeyFingerprintSha256(key: CryptoKey): Promise<string> {
  const spki = await crypto.subtle.exportKey('spki', key);
  return sha256ColonHex(spki);
}

export async function sha256Hex(data: ArrayBuffer): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', data);
  const bytes = new Uint8Array(digest);
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function sha256ColonHex(data: ArrayBuffer): Promise<string> {
  const hex = await sha256Hex(data);
  return hex.match(/.{1,2}/g)?.join(':') ?? hex;
}


