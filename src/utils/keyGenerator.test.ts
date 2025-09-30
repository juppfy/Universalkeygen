import { describe, it, expect } from 'vitest';
import { generateKey } from './keyGenerator';

describe('keyGenerator', () => {
  it('generates secret hex of expected length', async () => {
    const out = await generateKey('secret', { length: 32, format: 'hex' });
    expect(out).toMatch(/^[0-9a-f]{64}$/);
  });

  it('generates base64 url-safe when requested', async () => {
    const out = await generateKey('base64', { byteLength: 24, urlSafe: true });
    expect(out).toMatch(/^[A-Za-z0-9_-]+$/);
  });

  it('generates RSA keypair PEM and fingerprint', async () => {
    const out = await generateKey('ssl', { algorithm: 'rsa', keySize: '2048' });
    expect(out).toContain('BEGIN PRIVATE KEY');
    expect(out).toContain('BEGIN PUBLIC KEY');
    expect(out).toContain('Fingerprint');
  });

  it('generates ECDSA keypair PEM', async () => {
    const out = await generateKey('ssl', { algorithm: 'ecdsa', curve: 'P-256' });
    expect(out).toContain('BEGIN PRIVATE KEY');
    expect(out).toContain('BEGIN PUBLIC KEY');
  });

  it('generates JWT HS secret', async () => {
    const out = await generateKey('jwt', { algorithm: 'HS256' });
    expect(typeof out).toBe('string');
    expect(out.length).toBeGreaterThan(0);
  });

  it('generates JWT RS256 keypair via RSA', async () => {
    const out = await generateKey('jwt', { algorithm: 'RS256' });
    expect(out).toContain('BEGIN PRIVATE KEY');
    expect(out).toContain('BEGIN PUBLIC KEY');
  });

  it('generates SSH ed25519 public line', async () => {
    const out = await generateKey('ssh', { algorithm: 'ed25519' });
    expect(out).toContain('ssh-ed25519 ');
    expect(out).toContain('BEGIN PRIVATE KEY');
  });
});


