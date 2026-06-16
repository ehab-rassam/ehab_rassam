import React from "react";
import { motion } from "framer-motion";
import { useContactSubmission } from "./useContactSubmission.js";

/**
 * Contact form wired to the secure relay (Telegram token stays server-side).
 * Uses a native <form> so submit/onSubmit behave reliably; motion wraps for animation only.
 */
export function ContactForm({ inView }) {
  const {
    form,
    fieldErrors,
    banner,
    busy,
    setField,
    submit,
  } = useContactSubmission();

  const onSubmit = (e) => {
    e.preventDefault();
    void submit();
  };

  const inputClass =
    "w-full bg-black/40 border rounded-lg p-3 transition-colors text-start " +
    "focus:outline-none focus:ring-2 focus:ring-red-600/40";

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      className="min-w-0"
    >
      <form
        dir="rtl"
        lang="ar"
        onSubmit={onSubmit}
        className="space-y-4"
        noValidate
      >
        {banner.type ? (
          <div
            role="alert"
            className={
              "rounded-lg border px-4 py-3 text-start text-sm " +
              (banner.type === "success"
                ? "border-emerald-700/60 bg-emerald-950/40 text-emerald-100"
                : "border-red-700/60 bg-red-950/30 text-red-100")
            }
          >
            {banner.text}
          </div>
        ) : null}

        {/* Honeypot: hidden from users, bots often fill */}
        <div
          className="sr-only"
          aria-hidden="true"
        >
          <label htmlFor="contact-company">Company</label>
          <input
            id="contact-company"
            type="text"
            name="_hp"
            tabIndex={-1}
            autoComplete="off"
            value={form._hp}
            onChange={(e) => setField("_hp", e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="contact-name" className="mb-1 block text-sm text-gray-300">
            الاسم <span className="text-red-500">*</span>
          </label>
          <input
            id="contact-name"
            type="text"
            name="name"
            placeholder="الاسم"
            value={form.name}
            onChange={(e) => setField("name", e.target.value)}
            disabled={busy}
            className={
              inputClass +
              (fieldErrors.name ? " border-red-600" : " border-gray-700 focus:border-red-600")
            }
            autoComplete="name"
          />
          {fieldErrors.name ? (
            <p className="mt-1 text-start text-sm text-red-400">{fieldErrors.name}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="contact-email" className="mb-1 block text-sm text-gray-300">
            البريد الإلكتروني <span className="text-red-500">*</span>
          </label>
          <input
            id="contact-email"
            type="email"
            name="email"
            placeholder="البريد الإلكتروني"
            value={form.email}
            onChange={(e) => setField("email", e.target.value)}
            disabled={busy}
            className={
              inputClass +
              (fieldErrors.email ? " border-red-600" : " border-gray-700 focus:border-red-600")
            }
            autoComplete="email"
            inputMode="email"
          />
          {fieldErrors.email ? (
            <p className="mt-1 text-start text-sm text-red-400">{fieldErrors.email}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="contact-phone" className="mb-1 block text-sm text-gray-300">
            رقم الهاتف <span className="text-gray-500">(اختياري)</span>
          </label>
          <input
            id="contact-phone"
            type="tel"
            name="phone"
            placeholder="رقم الهاتف"
            value={form.phone}
            onChange={(e) => setField("phone", e.target.value)}
            disabled={busy}
            className={inputClass + " border-gray-700 focus:border-red-600"}
            autoComplete="tel"
            inputMode="tel"
          />
        </div>

        <div>
          <label htmlFor="contact-subject" className="mb-1 block text-sm text-gray-300">
            الموضوع <span className="text-red-500">*</span>
          </label>
          <input
            id="contact-subject"
            type="text"
            name="subject"
            placeholder="الموضوع"
            value={form.subject}
            onChange={(e) => setField("subject", e.target.value)}
            disabled={busy}
            className={
              inputClass +
              (fieldErrors.subject ? " border-red-600" : " border-gray-700 focus:border-red-600")
            }
          />
          {fieldErrors.subject ? (
            <p className="mt-1 text-start text-sm text-red-400">{fieldErrors.subject}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="contact-message" className="mb-1 block text-sm text-gray-300">
            الرسالة <span className="text-red-500">*</span>
          </label>
          <textarea
            id="contact-message"
            name="message"
            placeholder="الرسالة"
            rows={5}
            value={form.message}
            onChange={(e) => setField("message", e.target.value)}
            disabled={busy}
            className={
              inputClass +
              (fieldErrors.message ? " border-red-600" : " border-gray-700 focus:border-red-600")
            }
          />
          {fieldErrors.message ? (
            <p className="mt-1 text-start text-sm text-red-400">{fieldErrors.message}</p>
          ) : null}
        </div>

        <button
          type="submit"
          disabled={busy}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 py-3 font-bold text-white transition-all duration-300 hover:scale-[1.02] hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
        >
          {busy ? (
            <>
              <span
                className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"
                aria-hidden
              />
              <span>جاري الإرسال...</span>
            </>
          ) : (
            "أرسل رسالة"
          )}
        </button>
      </form>
    </motion.div>
  );
}
