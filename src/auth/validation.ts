export function isValidEmail(raw: string) {
  const email = raw.trim();
  // Reasonable client-side check (not RFC-complete).
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

export type PasswordCheck = {
  ok: boolean;
  reason?: string;
};

export function passwordRules(raw: string) {
  return {
    minLen: raw.length >= 8,
    lower: /[a-z]/.test(raw),
    upper: /[A-Z]/.test(raw),
    number: /\d/.test(raw),
    special: /[^A-Za-z0-9]/.test(raw),
  };
}

export function checkPassword(raw: string): PasswordCheck {
  const rules = passwordRules(raw);
  if (!rules.minLen) return { ok: false, reason: 'Password must be at least 8 characters.' };
  if (!rules.lower) return { ok: false, reason: 'Password must include a lowercase letter.' };
  if (!rules.upper) return { ok: false, reason: 'Password must include an uppercase letter.' };
  if (!rules.number) return { ok: false, reason: 'Password must include a number.' };
  if (!rules.special) return { ok: false, reason: 'Password must include a special character.' };
  return { ok: true };
}
