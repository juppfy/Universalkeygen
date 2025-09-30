import type { KeyType } from '../components/KeyTypeSelector';
import { exportPrivateKeyToPkcs8Pem, exportPublicKeyToSpkiPem, publicKeyFingerprintSha256, arrayBufferToBase64, formatPem } from './pem';
import nacl from 'tweetnacl';

export async function generateKey(keyType: KeyType, config: Record<string, any>): Promise<string> {
  switch (keyType) {
    case 'secret':
      return generateSecretKey(config);
    case 'base64':
      return generateBase64Key(config);
    case 'ssl':
      return await generateSSLKey(config);
    case 'api':
      return generateAPIKey(config);
    case 'jwt':
      return await generateJWTSecret(config);
    case 'encryption':
      return generateEncryptionKey(config);
    case 'ssh':
      return await generateSSHKey(config);
    default:
      return '';
  }
}

function generateSecretKey(config: Record<string, any>): string {
  const length = config.length || 32;
  const format = config.format || 'hex';

  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);

  switch (format) {
    case 'hex':
      return Array.from(bytes)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
    case 'base64':
      return btoa(String.fromCharCode(...bytes));
    case 'alphanumeric':
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      return Array.from(bytes)
        .map(b => chars[b % chars.length])
        .join('');
    default:
      return '';
  }
}

function generateBase64Key(config: Record<string, any>): string {
  const byteLength = config.byteLength || 32;
  const urlSafe = config.urlSafe || false;

  const bytes = new Uint8Array(byteLength);
  crypto.getRandomValues(bytes);

  let base64 = btoa(String.fromCharCode(...bytes));

  if (urlSafe) {
    base64 = base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  }

  return base64;
}

async function generateSSLKey(config: Record<string, any>): Promise<string> {
  const algorithm = (config.algorithm || 'rsa') as 'rsa' | 'ecdsa';

  if (algorithm === 'rsa') {
    const keySize = parseInt(config.keySize || '2048', 10);
    const keyPair = await crypto.subtle.generateKey(
      {
        name: 'RSASSA-PKCS1-v1_5',
        modulusLength: keySize,
        publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
        hash: 'SHA-256',
      },
      true,
      ['sign', 'verify']
    );
    const privPem = await exportPrivateKeyToPkcs8Pem(keyPair.privateKey);
    const pubPem = await exportPublicKeyToSpkiPem(keyPair.publicKey);
    const fp = await publicKeyFingerprintSha256(keyPair.publicKey);
    return `${privPem}\n\n${pubPem}\n\nFingerprint (SHA-256): ${fp}`;
  }

  // ECDSA
  const curve = (config.curve || 'P-256') as 'P-256' | 'P-384' | 'P-521';
  const keyPair = await crypto.subtle.generateKey(
    {
      name: 'ECDSA',
      namedCurve: curve,
    },
    true,
    ['sign', 'verify']
  );
  const privPem = await exportPrivateKeyToPkcs8Pem(keyPair.privateKey);
  const pubPem = await exportPublicKeyToSpkiPem(keyPair.publicKey);
  const fp = await publicKeyFingerprintSha256(keyPair.publicKey);
  return `${privPem}\n\n${pubPem}\n\nFingerprint (SHA-256): ${fp}`;
}

function generateAPIKey(config: Record<string, any>): string {
  const format = config.format || 'uuid';

  switch (format) {
    case 'uuid':
      return generateUUID();
    case 'nanoid':
      return generateNanoid(config.length || 21);
    case 'prefixed':
      const prefix = config.prefix || 'sk_live_';
      return prefix + generateNanoid(32);
    default:
      return '';
  }
}

async function generateJWTSecret(config: Record<string, any>): Promise<string> {
  const algorithm = config.algorithm || 'HS256';

  if (algorithm.startsWith('HS')) {
    const length = algorithm === 'HS256' ? 32 : algorithm === 'HS384' ? 48 : 64;
    return generateSecretKey({ length, format: 'base64' });
  } else {
    // RS256 keypair for JWT signing
    return await generateSSLKey({ algorithm: 'rsa', keySize: '2048' });
  }
}

function generateEncryptionKey(config: Record<string, any>): string {
  const algorithm = config.algorithm || 'aes-256';
  const format = config.format || 'hex';

  const lengths: Record<string, number> = {
    'aes-128': 16,
    'aes-192': 24,
    'aes-256': 32,
    'chacha20': 32,
  };

  const length = lengths[algorithm] || 32;
  return generateSecretKey({ length, format });
}

async function generateSSHKey(config: Record<string, any>): Promise<string> {
  const algorithm = (config.algorithm || 'ed25519') as 'ed25519' | 'rsa' | 'ecdsa';

  if (algorithm === 'ed25519') {
    const keyPair = nacl.sign.keyPair();
    // OpenSSH public key format: "ssh-ed25519 <base64(pubkey)> comment"
    const pubB64 = btoa(String.fromCharCode(...keyPair.publicKey));
    const publicLine = `ssh-ed25519 ${pubB64} user@host`;

    // Note: secretKey is 64 bytes (seed+public). The seed is the first 32 bytes.
    const rawSeed = keyPair.secretKey.slice(0, 32);
    const privPem = formatPem('PRIVATE KEY', Uint8Array.from(rawSeed).buffer);
    return `${privPem}\n\n${publicLine}`;
  }

  // For RSA OpenSSH, reuse SSL RSA generation and convert public SPKI to SSH format is non-trivial without ASN.1; provide PEMs
  if (algorithm === 'rsa') {
    const keySize = parseInt(config.keySize || '4096', 10);
    const keyPair = await crypto.subtle.generateKey(
      {
        name: 'RSASSA-PKCS1-v1_5',
        modulusLength: keySize,
        publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
        hash: 'SHA-256',
      },
      true,
      ['sign', 'verify']
    );
    const privPem = await exportPrivateKeyToPkcs8Pem(keyPair.privateKey);
    const pubPem = await exportPublicKeyToSpkiPem(keyPair.publicKey);
    return `${privPem}\n\n${pubPem}`;
  }

  // ECDSA SSH keys typically use secp256r1 (nistp256) with specific SSH encoding; provide PEMs as initial step
  const curve = (config.curve || 'P-256') as 'P-256' | 'P-384' | 'P-521';
  const keyPair = await crypto.subtle.generateKey(
    {
      name: 'ECDSA',
      namedCurve: curve,
    },
    true,
    ['sign', 'verify']
  );
  const privPem = await exportPrivateKeyToPkcs8Pem(keyPair.privateKey);
  const pubPem = await exportPublicKeyToSpkiPem(keyPair.publicKey);
  return `${privPem}\n\n${pubPem}`;
}

function generateRandomBase64(length: number): string {
  const bytes = new Uint8Array(Math.ceil(length * 3 / 4));
  crypto.getRandomValues(bytes);
  return btoa(String.fromCharCode(...bytes)).substring(0, length);
}

function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function generateNanoid(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-';
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map(b => chars[b % chars.length])
    .join('');
}

function generateFingerprint(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join(':');
}
