import { getAntiSpamAnchorMs } from "./antiSpamAnchor.js";
import { CONTACT_LIMITS, MIN_MS_BEFORE_SUBMIT } from "./constants.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function trimSlice(s, max) {
  if (typeof s !== "string") return "";
  const t = s.trim();
  return t.length > max ? t.slice(0, max) : t;
}

/**
 * @param {Record<string, string>} raw
 * @returns {{ ok: boolean, data?: object, errors?: Record<string, string>, honeypotTrip?: boolean, tooFast?: boolean }}
 */
export function validateContactForm(raw) {
  const errors = {};

  if (raw._hp != null && String(raw._hp).trim() !== "") {
    return { ok: false, honeypotTrip: true };
  }

  if (Date.now() - getAntiSpamAnchorMs() < MIN_MS_BEFORE_SUBMIT) {
    return { ok: false, tooFast: true };
  }

  const name = trimSlice(raw.name ?? "", CONTACT_LIMITS.name);
  const email = trimSlice(raw.email ?? "", CONTACT_LIMITS.email).toLowerCase();
  const phone = trimSlice(raw.phone ?? "", CONTACT_LIMITS.phone);
  const subject = trimSlice(raw.subject ?? "", CONTACT_LIMITS.subject);
  const message = trimSlice(raw.message ?? "", CONTACT_LIMITS.message);

  if (name.length < 2) errors.name = "أدخل الاسم (حرفان على الأقل).";
  if (!email || !EMAIL_RE.test(email) || email.length > CONTACT_LIMITS.email) {
    errors.email = "أدخل بريداً إلكترونياً صالحاً.";
  }
  if (subject.length < 2) errors.subject = "أدخل موضوعاً واضحاً.";
  if (message.length < 10) errors.message = "الرسالة قصيرة جداً (10 أحرف على الأقل).";

  if (Object.keys(errors).length) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    data: { name, email, phone, subject, message, _hp: "" },
  };
}
