// Ensure Web Crypto is available in tests
import 'vitest';

if (!globalThis.crypto || !globalThis.crypto.subtle) {
  // @ts-expect-error polyfill
  globalThis.crypto = require('node:crypto').webcrypto as unknown as Crypto;
}


