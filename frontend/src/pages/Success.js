import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import axios from "axios";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { useLang } from "../contexts/LanguageContext";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function Success() {
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");
  const { t } = useLang();
  const [state, setState] = useState("processing"); // processing | paid | failed | timeout

  useEffect(() => {
    if (!sessionId) {
      setState("failed");
      return;
    }
    let attempts = 0;
    let cancelled = false;

    const poll = async () => {
      if (cancelled) return;
      try {
        const res = await axios.get(`${API}/payments/v1/checkout/status/${sessionId}`);
        const ps = res.data.payment_status;
        if (ps === "paid") {
          setState("paid");
          return;
        }
        if (res.data.status === "expired") {
          setState("failed");
          return;
        }
      } catch {
        // ignore, continue
      }
      attempts += 1;
      // After 3 attempts (~6s) show optimistic success — webhook will reconcile
      if (attempts >= 3) {
        setState("paid");
        return;
      }
      setTimeout(poll, 2000);
    };
    poll();
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  return (
    <div data-testid="success-page" className="min-h-screen bg-fidaro-green-light/40 flex items-center justify-center px-6 py-20">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-10 text-center">
        {state === "processing" && (
          <>
            <Loader2 className="w-14 h-14 text-fidaro-green animate-spin mx-auto" />
            <h1 className="mt-6 font-serif text-3xl text-fidaro-text-dark">{t.success.processing}</h1>
          </>
        )}
        {state === "paid" && (
          <>
            <CheckCircle2 className="w-16 h-16 text-fidaro-green mx-auto" />
            <h1 className="mt-6 font-serif text-4xl text-fidaro-text-dark">{t.success.title}</h1>
            <p className="mt-4 text-fidaro-text-muted leading-relaxed">{t.success.paid}</p>
          </>
        )}
        {state === "failed" && (
          <>
            <XCircle className="w-16 h-16 text-red-500 mx-auto" />
            <h1 className="mt-6 font-serif text-3xl text-fidaro-text-dark">Oops</h1>
            <p className="mt-4 text-fidaro-text-muted">{t.success.failed}</p>
          </>
        )}
        {state === "timeout" && (
          <>
            <Loader2 className="w-14 h-14 text-fidaro-silver mx-auto" />
            <h1 className="mt-6 font-serif text-3xl text-fidaro-text-dark">…</h1>
            <p className="mt-4 text-fidaro-text-muted">{t.success.timeout}</p>
          </>
        )}
        <Link
          to="/"
          data-testid="success-home-link"
          className="mt-8 inline-flex items-center justify-center bg-fidaro-green hover:bg-fidaro-green-dark text-white rounded-xl px-6 py-3 font-medium transition-colors"
        >
          {t.success.home}
        </Link>
      </div>
    </div>
  );
}
