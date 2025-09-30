export type StrengthLevel = 'Weak' | 'Medium' | 'Strong';

export function estimateStrength(output: string, keyType: string): { level: StrengthLevel; score: number } {
  if (!output) return { level: 'Weak', score: 0 };

  // Basic heuristic: length and character set diversity
  const length = output.length;
  const hasLower = /[a-z]/.test(output);
  const hasUpper = /[A-Z]/.test(output);
  const hasDigit = /\d/.test(output);
  const hasSymbol = /[^A-Za-z0-9]/.test(output);
  const variety = [hasLower, hasUpper, hasDigit, hasSymbol].filter(Boolean).length;

  let score = Math.min(100, Math.round((length / 64) * 60 + variety * 10));

  // Encourage base64/hex by not penalizing symbols absence for those
  if ((keyType === 'secret' || keyType === 'api' || keyType === 'jwt') && variety <= 1 && length < 32) {
    score = Math.min(score, 30);
  }

  const level: StrengthLevel = score >= 75 ? 'Strong' : score >= 45 ? 'Medium' : 'Weak';
  return { level, score };
}


