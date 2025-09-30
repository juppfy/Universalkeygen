## Project Overview: Universal Key Generator Platform

### **Core Features**
1. **Secret Keys** - Random cryptographic keys (hex, base62, alphanumeric)
2. **Base64 Keys** - Encoded random data
3. **OpenSSL Keys** - RSA, ECDSA, Ed25519 key pairs
4. **API Keys** - UUID, nanoid, custom format keys
5. **JWT Secrets** - For authentication systems
6. **Encryption Keys** - AES, ChaCha20 compatible keys
7. **SSH Keys** - For secure shell access

### **Current Frontend (Vite + React)**

**Tech Stack:**
- Vite + React 18 + TypeScript
- Tailwind CSS for styling
- lucide-react for icons

**Implemented UI:**
- `HeroSection`, `KeyTypeSelector`, `ConfigurationPanel`, `OutputDisplay`, `FeaturesGrid`
- Client-side generation using Web Crypto for randomness
- Copy, hide/show, and download (.txt/.pem heuristic) in output panel

**Current Generators:**
- Secret, Base64, API keys, JWT HS, AES/ChaCha keys
- SSL/SSH/JWT RS outputs are mock PEM-like placeholders (not real keypairs yet)

---

## Frontend UI Plan

### **Layout Structure**

**1. Hero Section**
- Bold headline: "Generate Any Key, Instantly Secure"
- Subtitle explaining the purpose
- Quick stats (keys generated today, types supported)
- Animated key icon or visual

**2. Key Generator Dashboard**
```
┌─────────────────────────────────────────┐
│  Key Type Selector (Tabs/Cards)        │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐      │
│  │Secret│ │Base64│ │SSL │ │ API │      │
│  └─────┘ └─────┘ └─────┘ └─────┘      │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│  Configuration Panel                     │
│  • Key length slider                     │
│  • Format options (dropdown)             │
│  • Advanced settings (collapsible)       │
│  • Character set selection               │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│  [Generate Key Button - Primary CTA]    │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│  Output Display (with syntax highlight) │
│  • Copy button                           │
│  • Download options (.txt, .pem, .key)  │
│  • QR code option (for mobile transfer) │
│  • Show/Hide toggle for sensitive keys  │
└─────────────────────────────────────────┘
```

**3. Features Grid**
- Security badge (client-side generation note)
- Speed indicator
- Format compatibility list
- Export options

**4. Information Sections**
- Use case examples for each key type
- Security best practices
- FAQ accordion
- Integration guides

---

## Key Generation Specifications

### **1. Secret Keys**
- Lengths: 16, 32, 64, 128, 256 bytes
- Formats: hex, base64, alphanumeric
- Use: Session tokens, API secrets

### **2. Base64 Keys**
- Raw random bytes encoded in base64
- URL-safe option
- Configurable byte length

### **3. OpenSSL Keys**
- **RSA**: 2048, 3072, 4096 bits
- **ECDSA**: P-256, P-384, P-521 curves
- **Ed25519**: Modern elliptic curve
- Output: Private key, public key, fingerprint
- Formats: PEM, DER, SSH

### **4. API Keys**
- UUID v4
- Nanoid (customizable length)
- Prefixed keys (e.g., `sk_live_...`)
- Custom patterns

### **5. JWT Secrets**
- HS256, HS384, HS512 compatible
- RS256 key pairs
- Recommended lengths per algorithm

### **6. Encryption Keys**
- AES: 128, 192, 256-bit
- ChaCha20: 256-bit
- Raw bytes or encoded

### **7. SSH Keys**
- RSA, Ed25519, ECDSA
- With/without passphrase
- Public key formatting for authorized_keys

## UI/UX Features

### **Visual Design (present)**
- Dark theme, monospace display, minimal cards and borders

### **User Experience (present)**
- One-click copy, hide/show, basic download, responsive layout

### **Educational Elements (pending)**
- Tooltips, use cases, and security warnings to be added

---

## Planned Enhancements (see `docs/todo.md`)

### Cryptography
- Real cryptographic keypair generation for SSL (RSA/ECDSA) and SSH (Ed25519/RSA/ECDSA)
- Real JWT RS256 keypair support
- Valid PEM outputs and DER export where applicable

### UX and Functionality
- Quick stats, bulk generation, session history
- Keyboard shortcuts (Ctrl/Cmd+G, Ctrl/Cmd+C)
- Syntax highlighting for outputs and visual strength indicators
- FAQ/education sections with best practices and tooltips
- Service worker for offline usage

### State and Forms
- Introduce Zustand for app state
- Integrate React Hook Form for robust validation in configuration

### Exports
- Ensure PEM/DER round-trip with OpenSSL/ssh-keygen
- QR code export for short keys and multi-file export options