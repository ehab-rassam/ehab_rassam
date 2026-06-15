/** Field length caps (aligned with server relay). */
export const CONTACT_LIMITS = {
  name: 120,
  email: 254,
  phone: 40,
  subject: 200,
  message: 4000,
};

/** Minimum time on page before submit (reduces drive-by spam). */
export const MIN_MS_BEFORE_SUBMIT = 2500;

/** Client-side cooldown between successful attempts (session). */
export const CLIENT_COOLDOWN_MS = 60_000;
