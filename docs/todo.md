# Universal Key Generator - Implementation TODOs

## Guiding constraints
- Retain current frontend stack: Vite + React + TypeScript + Tailwind
- No Next.js migration
- Keep all generation client-side; do not send keys to servers

## Phase 1 — Core correctness and foundations
- Real cryptographic keypair generation for SSL (RSA/ECDSA) and SSH (Ed25519/RSA/ECDSA)
- Real JWT RS256 keypair support
- Export in valid PEM; add DER export where applicable
- Refactor `src/utils/keyGenerator.ts` into modular generators per key type
- Add unit tests for generators (pure functions) and download helpers

## Phase 2 — UX improvements and accessibility
- Add syntax highlighting for outputs (language auto based on key type)
- Add visual strength indicators for secret/API/JWT-HS keys
- Add keyboard shortcuts (e.g., Ctrl/Cmd+G to generate, Ctrl/Cmd+C to copy)
- Add quick stats (session: keys generated, types used)
- Add bulk generation (n keys at once) with downloadable zip
- Improve copy/download affordances and aria labels

## Phase 3 — State, history, and offline
- Introduce Zustand for app state (selected type, config, history, stats)
- Add session-only history (in-memory; cleared on refresh)
- Service worker for offline usage; cache shell and fonts
- Optional: persist UI preferences (theme, advanced toggle) in localStorage

## Phase 4 — Education and help
- Add FAQ accordion and security best practices section
- Add tooltips for each option in `ConfigurationPanel`
- Add use-case examples per key type

## Phase 5 — Animations and polish
- Add Framer Motion micro-interactions (buttons, cards, output reveal)
- Subtle transitions for tab/selector changes and generation result

## Phase 6 — Validation and forms
- Integrate React Hook Form in `ConfigurationPanel` for robust validation
- Enforce numeric ranges, required fields, and conditional rules

## Phase 7 — Exports and interop
- Ensure PEM/DER exports round-trip with OpenSSL/ssh-keygen
- Add QR code export for short keys (API, secrets); warn for long payloads
- Add multi-file export formats (.pem, .pub, .key, .der) as applicable

## Technical notes
- Use Web Crypto API for randomness and supported key pairs
- For formats not natively supported in Web Crypto, use well-vetted libs (minimal footprint):
  - jose (JWK/PEM conversions for RSA/ECDSA/Ed25519) or tweetnacl for Ed25519
  - asn1/PKCS#8 utilities for DER/PEM if needed
- Keep heavy deps optional and code-split if bundle grows

## Milestones & acceptance checklist
- Core generators pass tests and produce valid PEM/DER
- UI supports bulk generate and keyboard shortcuts
- History and quick stats visible and resettable
- Offline build works; app loads without network after first visit
- Documentation updated for all features and constraints
