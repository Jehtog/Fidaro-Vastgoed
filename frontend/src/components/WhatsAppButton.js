import { useLocation } from "react-router-dom";
import { useLang } from "../contexts/LanguageContext";

// Belgian WhatsApp number for Fidaro Vastgoed (no +, no spaces).
const WA_NUMBER = "32485069191";

const MESSAGES = {
  nl: "Hallo Fidaro Vastgoed, ik heb een vraag over...",
  en: "Hello Fidaro Vastgoed, I have a question about...",
};

export default function WhatsAppButton() {
  const { lang } = useLang();
  const { pathname } = useLocation();

  // Hide on admin pages — internal tool, not customer-facing.
  if (pathname.startsWith("/admin")) return null;

  const href = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
    MESSAGES[lang] || MESSAGES.nl
  )}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      data-testid="whatsapp-floating-btn"
      aria-label="Chat met Fidaro op WhatsApp"
      className="fixed z-40 bottom-6 right-6 group flex items-center gap-3 bg-[#25D366] hover:bg-[#1ebe5a] text-white pl-4 pr-5 py-3.5 rounded-full shadow-[0_10px_30px_-8px_rgba(37,211,102,0.55)] transition-all hover:scale-[1.03]"
    >
      {/* WhatsApp glyph */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        className="w-6 h-6 flex-shrink-0"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M19.11 17.205c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.315-.1c-.802-.402-1.504-.817-2.163-1.447-.545-.516-1.146-1.29-1.46-1.963a.426.426 0 0 1-.073-.215c0-.33.99-.945.99-1.49 0-.143-.73-2.09-.832-2.335-.143-.372-.214-.487-.6-.487-.187 0-.36-.043-.53-.043-.302 0-.53.115-.746.315-.688.645-1.032 1.318-1.06 2.264v.114c-.015.99.472 1.977 1.017 2.78 1.23 1.82 2.506 3.41 4.554 4.34.616.287 2.035.918 2.722.918.345 0 1.318-.13 1.616-.244.473-.187.79-.733.876-1.222.043-.215.043-.43.043-.616 0-.55-.072-.673-1.118-1.16zM16.115 27.605c-2.336 0-4.687-.687-6.673-1.948l-4.78 1.262 1.286-4.575a12.158 12.158 0 0 1-2.32-7.157C3.628 8.41 9.21 2.828 16.114 2.828c3.351 0 6.50 1.30 8.866 3.65 2.365 2.351 3.692 5.488 3.692 8.825-.014 6.904-5.596 12.302-12.557 12.302zm10.62-22.92C23.913 1.86 20.18.31 16.115.31 7.815.31 1.061 7.064 1.034 15.364c0 2.65.687 5.244 2.005 7.537L.906 30.873l7.93-2.077a15.045 15.045 0 0 0 7.265 1.85h.014c8.286 0 15.04-6.755 15.055-15.054 0-4.04-1.563-7.83-4.434-10.706z" />
      </svg>
      <span className="text-sm font-semibold leading-none whitespace-nowrap hidden sm:block">
        {lang === "nl" ? "Chat met ons" : "Chat with us"}
      </span>
    </a>
  );
}
