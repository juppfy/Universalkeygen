import { describe, it, expect } from 'vitest';
import { arrayBufferToBase64, formatPem, sha256Hex, sha256ColonHex } from './pem';

function stringToArrayBuffer(s: string): ArrayBuffer {
  const bytes = new TextEncoder().encode(s);
  return bytes.buffer;
}

describe('pem utils', () => {
  it('arrayBufferToBase64 encodes correctly', () => {
    const ab = stringToArrayBuffer('test');
    expect(arrayBufferToBase64(ab)).toBe('dGVzdA==');
  });

  it('formatPem wraps with BEGIN/END and 64-char lines', () => {
    const data = new Uint8Array(80);
    crypto.getRandomValues(data);
    const pem = formatPem('PUBLIC KEY', data.buffer);
    expect(pem.startsWith('-----BEGIN PUBLIC KEY-----'));
    expect(pem.endsWith('-----END PUBLIC KEY-----'));
  });

  it('sha256Hex and sha256ColonHex produce consistent output', async () => {
    const ab = stringToArrayBuffer('hashme');
    const hex = await sha256Hex(ab);
    const colon = await sha256ColonHex(ab);
    expect(hex.length).toBe(64);
    expect(colon.split(':').length).toBe(32);
  });
});


