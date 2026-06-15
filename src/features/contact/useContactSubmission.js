import { useCallback, useState } from "react";
import { CLIENT_COOLDOWN_MS } from "./constants.js";
import { validateContactForm } from "./validateContactForm.js";
import { submitContact } from "./submitContact.js";

const STORAGE_KEY = "portfolio_contact_last_ok";

function readLastOk() {
  try {
    const v = sessionStorage.getItem(STORAGE_KEY);
    return v ? Number(v) : 0;
  } catch {
    return 0;
  }
}

function writeLastOk(ts) {
  try {
    sessionStorage.setItem(STORAGE_KEY, String(ts));
  } catch {
    /* ignore */
  }
}

const initialForm = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
  _hp: "",
};

/** Form + submission state for the contact section. */
export function useContactSubmission() {
  const [form, setForm] = useState(initialForm);
  const [fieldErrors, setFieldErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [banner, setBanner] = useState({ type: null, text: "" });

  const setField = useCallback((name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  }, []);

  const resetBanner = useCallback(() => {
    setBanner({ type: null, text: "" });
  }, []);

  const submit = useCallback(async () => {
    resetBanner();

    const lastOk = readLastOk();
    if (lastOk && Date.now() - lastOk < CLIENT_COOLDOWN_MS) {
      const sec = Math.ceil((CLIENT_COOLDOWN_MS - (Date.now() - lastOk)) / 1000);
      setStatus("error");
      setBanner({
        type: "error",
        text: `يرجى الانتظار ${sec} ثانية قبل إرسال رسالة أخرى.`,
      });
      return;
    }

    const v = validateContactForm(form);
    if (v.honeypotTrip) {
      setStatus("success");
      setBanner({ type: "success", text: "تم إرسال رسالتك بنجاح." });
      return;
    }
    if (v.tooFast) {
      setStatus("error");
      setBanner({
        type: "error",
        text: "يرجى التحقق من الحقول والمحاولة بعد لحظات.",
      });
      return;
    }
    if (!v.ok) {
      setFieldErrors(v.errors || {});
      setStatus("error");
      setBanner({
        type: "error",
        text: "يرجى تصحيح الحقول المميزة أدناه.",
      });
      return;
    }

    setStatus("loading");
    setFieldErrors({});

    try {
      const { ok, status: httpStatus, body } = await submitContact(v.data);

      if (ok && body?.ok) {
        writeLastOk(Date.now());
        setStatus("success");
        setForm(initialForm);
        setBanner({
          type: "success",
          text: "تم إرسال رسالتك بنجاح. سنتواصل معك قريباً.",
        });
        return;
      }

      if (httpStatus === 429) {
        setStatus("error");
        setBanner({
          type: "error",
          text: "طلبات كثيرة من هذا المتصفح. حاول لاحقاً.",
        });
        return;
      }

      if (httpStatus === 400 && body?.fields) {
        const map = {};
        if (body.fields.name) map.name = "الاسم غير مقبول.";
        if (body.fields.email) map.email = "البريد غير مقبول.";
        if (body.fields.subject) map.subject = "الموضوع غير مقبول.";
        if (body.fields.message) map.message = "الرسالة غير مقبولة.";
        setFieldErrors(map);
        setStatus("error");
        setBanner({ type: "error", text: "تحقق من الحقول وأعد المحاولة." });
        return;
      }

      setStatus("error");
      setBanner({
        type: "error",
        text: "تعذر الإرسال حالياً. حاول مرة أخرى لاحقاً أو تواصل عبر البريد أو واتساب.",
      });
    } catch {
      setStatus("error");
      setBanner({
        type: "error",
        text: "خطأ في الاتصال. تحقق من الشبكة أو حاول لاحقاً.",
      });
    }
  }, [form, resetBanner]);

  const busy = status === "loading";

  return {
    form,
    fieldErrors,
    status,
    banner,
    busy,
    setField,
    submit,
    resetBanner,
  };
}
