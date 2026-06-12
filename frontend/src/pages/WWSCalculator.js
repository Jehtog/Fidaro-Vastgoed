import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  ArrowRight,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  Info,
  RefreshCw,
  Download,
  Home,
  Ruler,
  Receipt,
  Sparkles,
  ShieldCheck,
  Phone,
} from "lucide-react";
import { useLang } from "../contexts/LanguageContext";
import { wwsT } from "../wws/translations";
import {
  calculateTotalWWS,
  determineRentCategory,
  suggestImprovementLevers,
} from "../wws/calculator";
import { KITCHEN_EXTRAS, BATHROOM_EXTRAS } from "../wws/config";
import { generateWWSReport } from "../wws/pdfExport";
import Footer from "../components/Footer";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const initial = {
  address: "",
  property_type: "apartment",
  independent: "yes",
  year: "",
  current_rent: "",
  tenant_situation: "vacant",
  living_m2: "",
  bed1_m2: "",
  bed2_m2: "",
  bed3_m2: "",
  kitchen_m2: "",
  bathroom_m2: "",
  other_rooms_m2: "",
  other_indoor_m2: "",
  storage_m2: "",
  garage_indoor_m2: "",
  private_outdoor_m2: "",
  shared_outdoor_m2: "",
  shared_outdoor_addresses: "",
  shared_indoor_room_m2: "",
  shared_other_indoor_m2: "",
  shared_indoor_addresses: "",
  no_outdoor_space: false,
  energy_label: "",
  energy_label_validity_date: "",
  energy_dwelling_type: "apartment",
  ep2: "",
  monument: "none",
  woz_value: "",
  woz_date: "2023-01-01",
  usable_floor_area: "",
  woz_decision: "yes",
  countertop: "<1m",
  kitchen_extras: {},
  extra_cupboards_60cm: "",
  toilet_separate: false,
  toilet_in_bathroom: false,
  wallhung_toilet_separate: false,
  wallhung_toilet_bathroom: false,
  washbasin: false,
  double_washbasin: false,
  shower: false,
  bath: false,
  bath_and_shower: false,
  bathroom_extras: {},
  heated_rooms: "",
  heated_other_spaces: "",
  cooled_rooms: "",
  accessibility_amount: "",
  shared_parking: "none",
  shared_parking_addresses: "",
  charging_point: false,
  defects: "none",
};

const numerizeInput = (state) => {
  const out = { ...state };
  const numericKeys = [
    "year", "current_rent", "living_m2", "bed1_m2", "bed2_m2", "bed3_m2",
    "kitchen_m2", "bathroom_m2", "other_rooms_m2", "other_indoor_m2",
    "storage_m2", "garage_indoor_m2", "private_outdoor_m2", "shared_outdoor_m2",
    "shared_outdoor_addresses", "shared_indoor_room_m2", "shared_other_indoor_m2",
    "shared_indoor_addresses", "ep2", "woz_value", "usable_floor_area",
    "extra_cupboards_60cm", "heated_rooms", "heated_other_spaces", "cooled_rooms",
    "accessibility_amount", "shared_parking_addresses",
  ];
  for (const k of numericKeys) {
    out[k] = out[k] === "" || out[k] == null ? 0 : parseFloat(out[k]) || 0;
  }
  return out;
};

const inputCls =
  "w-full bg-white border border-fidaro-green-light rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-fidaro-green focus:ring-2 focus:ring-fidaro-green/20 transition-colors";

const Field = ({ label, children }) => (
  <label className="block">
    <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-fidaro-text-muted">
      {label}
    </span>
    <div className="mt-1.5">{children}</div>
  </label>
);

const Toggle = ({ checked, onChange, label, testid }) => (
  <label
    className={`flex items-center gap-2.5 cursor-pointer text-sm rounded-xl border transition-colors px-3 py-2.5 ${
      checked
        ? "border-fidaro-green bg-fidaro-green-light/60 text-fidaro-ink"
        : "border-fidaro-green-light bg-white text-fidaro-ink hover:border-fidaro-green/40"
    }`}
  >
    <input
      type="checkbox"
      checked={!!checked}
      onChange={(e) => onChange(e.target.checked)}
      data-testid={testid}
      className="w-4 h-4 accent-fidaro-green"
    />
    <span>{label}</span>
  </label>
);

const STEP_DEFS = [
  { id: "basics", icon: Home, key: "basics" },
  { id: "surface_energy", icon: Ruler, key: "surface_energy" },
  { id: "woz_facilities", icon: Receipt, key: "woz_facilities" },
  { id: "results", icon: Sparkles, key: "results" },
];

const STEP_LABELS = {
  nl: {
    basics: "Pandgegevens",
    surface_energy: "Oppervlakte & energie",
    woz_facilities: "WOZ & voorzieningen",
    results: "Resultaten",
    next: "Volgende",
    prev: "Vorige",
    finish: "Bekijk resultaat",
  },
  en: {
    basics: "Property basics",
    surface_energy: "Surface & energy",
    woz_facilities: "WOZ & facilities",
    results: "Results",
    next: "Next",
    prev: "Previous",
    finish: "View results",
  },
};

export default function WWSCalculator() {
  const { lang, setLang } = useLang();
  const T = wwsT[lang] || wwsT.nl;
  const SL = STEP_LABELS[lang];
  const [s, setS] = useState(initial);
  const [step, setStep] = useState(0);
  const [downloading, setDownloading] = useState(false);

  const set = (k) => (v) => setS((prev) => ({ ...prev, [k]: v }));
  const setNested = (group, k) => (v) =>
    setS((prev) => ({ ...prev, [group]: { ...prev[group], [k]: v } }));

  const result = useMemo(() => calculateTotalWWS(numerizeInput(s)), [s]);
  const category = determineRentCategory(result.total);
  const levers = suggestImprovementLevers(numerizeInput(s), result);
  const progressPct = Math.max(0, Math.min(100, (result.total / 187) * 100));

  // Auto-track: when user reaches step 3 (results) with a meaningful score, log it once.
  const [tracked, setTracked] = useState(false);
  useEffect(() => {
    if (tracked) return;
    if (step !== 3) return;
    if (!result.total || result.total <= 0) return;
    setTracked(true);
    axios
      .post(`${API}/wws-scores`, {
        total: result.total,
        category,
        language: lang,
        source: "calculator_auto",
      })
      .catch(() => {
        // Silent — analytics tracking failures must not surface to the user.
      });
  }, [step, result.total, category, lang, tracked]);

  const energyLabels = ["A++++", "A+++", "A++", "A+", "A", "B", "C", "D", "E", "F", "G", "no_label"];

  const handlePDF = async () => {
    setDownloading(true);
    try {
      await generateWWSReport(numerizeInput(s), result, lang);
    } catch (e) {
      console.error(e);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div data-testid="wws-calculator-page" className="bg-fidaro-green-light/30 min-h-screen">
      {/* Header */}
      <header className="border-b border-fidaro-green-light bg-white/80 backdrop-blur sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 md:px-10 h-24 flex items-center justify-between">
          <Link
            to="/"
            data-testid="wws-back-link"
            className="inline-flex items-center gap-3 text-sm text-fidaro-ink hover:text-fidaro-green transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <img
              src="https://customer-assets.emergentagent.com/job_35e0d8c8-8484-434c-b0cb-1a5cfc9d3012/artifacts/p4sighyv_Untitled%20design%20%2811%29.png"
              alt="Fidaro Vastgoed"
              className="h-20 w-20 object-contain"
            />
          </Link>
          <div className="flex items-center gap-3">
            <button
              data-testid="wws-reset-btn"
              onClick={() => { setS(initial); setStep(0); }}
              className="hidden md:inline-flex items-center gap-2 text-xs text-fidaro-text-muted hover:text-fidaro-green"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              {T.page.reset}
            </button>
            <div className="flex items-center text-[10px] font-mono border border-fidaro-green/30 rounded-full overflow-hidden">
              <button data-testid="wws-lang-nl" onClick={() => setLang("nl")} className={`px-2.5 py-1.5 ${lang === "nl" ? "bg-fidaro-green text-white" : "text-fidaro-ink"}`}>NL</button>
              <button data-testid="wws-lang-en" onClick={() => setLang("en")} className={`px-2.5 py-1.5 ${lang === "en" ? "bg-fidaro-green text-white" : "text-fidaro-ink"}`}>EN</button>
            </div>
          </div>
        </div>
      </header>

      {/* Intro */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 pt-12 pb-6">
        <div className="inline-block text-[11px] uppercase tracking-[0.22em] text-fidaro-green font-semibold px-3 py-1 rounded-full bg-fidaro-green-light">
          {T.page.eyebrow}
        </div>
        <h1 className="mt-4 font-display text-4xl md:text-5xl text-fidaro-ink leading-[1.05]">
          {T.page.title}
        </h1>
        <p className="mt-4 max-w-3xl text-fidaro-text-muted leading-relaxed">{T.page.intro}</p>
        <div className="mt-5 flex items-start gap-3 max-w-3xl bg-white border border-fidaro-green/15 rounded-2xl p-4 text-xs text-fidaro-text-muted">
          <Info className="w-4 h-4 text-fidaro-green flex-shrink-0 mt-0.5" />
          <span>{T.page.disclaimer}</span>
        </div>
      </div>

      {/* Step indicator */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-6">
        <div className="grid grid-cols-4 gap-3">
          {STEP_DEFS.map((sdef, i) => {
            const active = i === step;
            const done = i < step;
            const Icon = sdef.icon;
            return (
              <button
                key={sdef.id}
                onClick={() => setStep(i)}
                data-testid={`wws-step-${sdef.id}`}
                className={`text-left rounded-2xl p-4 transition-all border ${
                  active
                    ? "bg-fidaro-green-dark text-white border-fidaro-green-dark shadow-[0_12px_30px_-12px_rgba(63,92,73,0.45)]"
                    : done
                    ? "bg-fidaro-green-light/50 border-fidaro-green/30 text-fidaro-ink"
                    : "bg-white border-fidaro-green-light text-fidaro-ink hover:border-fidaro-green/40"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`font-mono text-[10px] tracking-widest ${
                      active ? "text-fidaro-green-bright" : "text-fidaro-text-muted"
                    }`}
                  >
                    0{i + 1}
                  </span>
                  <Icon
                    className={`w-3.5 h-3.5 ${
                      active ? "text-fidaro-green-bright" : "text-fidaro-text-muted"
                    }`}
                  />
                </div>
                <div
                  className={`mt-2 font-semibold text-sm tracking-tight ${
                    active ? "text-white" : "text-fidaro-ink"
                  }`}
                >
                  {SL[sdef.key]}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main grid */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 pb-20 grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-5">
          {step === 0 && (
            <StepCard title={SL.basics}>
              <div className="grid md:grid-cols-2 gap-4">
                <Field label={T.fields.address}>
                  <input data-testid="wws-address" className={inputCls} value={s.address} onChange={(e) => set("address")(e.target.value)} />
                </Field>
                <Field label={T.fields.property_type}>
                  <select data-testid="wws-property-type" className={inputCls} value={s.property_type} onChange={(e) => set("property_type")(e.target.value)}>
                    {Object.entries(T.fields.property_type_options).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </Field>
                <Field label={T.fields.independent}>
                  <select className={inputCls} value={s.independent} onChange={(e) => set("independent")(e.target.value)}>
                    <option value="yes">{T.fields.yes}</option>
                    <option value="no">{T.fields.no}</option>
                  </select>
                </Field>
                <Field label={T.fields.year}>
                  <input data-testid="wws-year" type="number" className={inputCls} value={s.year} onChange={(e) => set("year")(e.target.value)} />
                </Field>
                <Field label={T.fields.current_rent}>
                  <input type="number" className={inputCls} value={s.current_rent} onChange={(e) => set("current_rent")(e.target.value)} />
                </Field>
                <Field label={T.fields.tenant_situation}>
                  <select className={inputCls} value={s.tenant_situation} onChange={(e) => set("tenant_situation")(e.target.value)}>
                    {Object.entries(T.fields.tenant_options).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </Field>
              </div>
            </StepCard>
          )}

          {step === 1 && (
            <>
              <StepCard title={lang === "nl" ? "Oppervlaktes (m²)" : "Surface areas (m²)"}>
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    "living_m2", "bed1_m2", "bed2_m2", "bed3_m2",
                    "kitchen_m2", "bathroom_m2", "other_rooms_m2",
                    "other_indoor_m2", "storage_m2", "garage_indoor_m2",
                    "private_outdoor_m2", "shared_outdoor_m2", "shared_outdoor_addresses",
                    "shared_indoor_room_m2", "shared_other_indoor_m2", "shared_indoor_addresses",
                  ].map((k) => (
                    <Field key={k} label={T.fields[k]}>
                      <input data-testid={`wws-${k}`} type="number" className={inputCls} value={s[k]} onChange={(e) => set(k)(e.target.value)} />
                    </Field>
                  ))}
                </div>
                <div className="mt-2">
                  <Toggle testid="wws-no-outdoor" checked={s.no_outdoor_space} onChange={set("no_outdoor_space")} label={T.fields.no_outdoor_space} />
                </div>
              </StepCard>

              <StepCard title={lang === "nl" ? "Energie & monument" : "Energy & monument"}>
                <div className="grid md:grid-cols-2 gap-4">
                  <Field label={T.fields.energy_label}>
                    <select data-testid="wws-energy-label" className={inputCls} value={s.energy_label} onChange={(e) => set("energy_label")(e.target.value)}>
                      <option value="">—</option>
                      {energyLabels.map((l) => (
                        <option key={l} value={l}>{l === "no_label" ? (lang === "nl" ? "Geen geldig label" : "No valid label") : l}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label={T.fields.energy_label_validity_date}>
                    <input type="date" className={inputCls} value={s.energy_label_validity_date} onChange={(e) => set("energy_label_validity_date")(e.target.value)} />
                  </Field>
                  <Field label={T.fields.energy_dwelling_type}>
                    <select className={inputCls} value={s.energy_dwelling_type} onChange={(e) => set("energy_dwelling_type")(e.target.value)}>
                      {Object.entries(T.fields.energy_dwelling_options).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                    </select>
                  </Field>
                  <Field label={T.fields.monument}>
                    <select data-testid="wws-monument" className={inputCls} value={s.monument} onChange={(e) => set("monument")(e.target.value)}>
                      {Object.entries(T.fields.monument_options).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                    </select>
                  </Field>
                </div>
              </StepCard>

              <StepCard title={lang === "nl" ? "Verwarming & koeling" : "Heating & cooling"}>
                <div className="grid md:grid-cols-3 gap-4">
                  <Field label={T.fields.heated_rooms}>
                    <input type="number" className={inputCls} value={s.heated_rooms} onChange={(e) => set("heated_rooms")(e.target.value)} />
                  </Field>
                  <Field label={T.fields.heated_other_spaces}>
                    <input type="number" className={inputCls} value={s.heated_other_spaces} onChange={(e) => set("heated_other_spaces")(e.target.value)} />
                  </Field>
                  <Field label={T.fields.cooled_rooms}>
                    <input type="number" className={inputCls} value={s.cooled_rooms} onChange={(e) => set("cooled_rooms")(e.target.value)} />
                  </Field>
                </div>
              </StepCard>
            </>
          )}

          {step === 2 && (
            <>
              <StepCard title="WOZ">
                <div className="grid md:grid-cols-2 gap-4">
                  <Field label={T.fields.woz_value}>
                    <input data-testid="wws-woz-value" type="number" className={inputCls} value={s.woz_value} onChange={(e) => set("woz_value")(e.target.value)} />
                  </Field>
                  <Field label={T.fields.woz_date}>
                    <select className={inputCls} value={s.woz_date} onChange={(e) => set("woz_date")(e.target.value)}>
                      <option value="2023-01-01">1 januari 2023</option>
                      <option value="2022-01-01">1 januari 2022</option>
                    </select>
                  </Field>
                  <Field label={T.fields.usable_floor_area}>
                    <input data-testid="wws-floor-area" type="number" className={inputCls} value={s.usable_floor_area} onChange={(e) => set("usable_floor_area")(e.target.value)} />
                  </Field>
                </div>
              </StepCard>

              <StepCard title={lang === "nl" ? "Keuken" : "Kitchen"}>
                <Field label={T.fields.countertop}>
                  <select data-testid="wws-countertop" className={inputCls} value={s.countertop} onChange={(e) => set("countertop")(e.target.value)}>
                    {Object.entries(T.fields.countertop_options).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </Field>
                <div className="grid md:grid-cols-2 gap-2 mt-3">
                  {Object.keys(KITCHEN_EXTRAS).map((k) => (
                    <Toggle key={k} testid={`wws-kitchen-${k}`} checked={s.kitchen_extras[k]} onChange={setNested("kitchen_extras", k)} label={T.fields.kitchen_extras[k]} />
                  ))}
                </div>
                <div className="mt-3">
                  <Field label={T.fields.extra_cupboards_60cm}>
                    <input type="number" className={inputCls} value={s.extra_cupboards_60cm} onChange={(e) => set("extra_cupboards_60cm")(e.target.value)} />
                  </Field>
                </div>
              </StepCard>

              <StepCard title={lang === "nl" ? "Sanitair" : "Sanitary"}>
                <div className="grid md:grid-cols-2 gap-2">
                  {["toilet_separate", "toilet_in_bathroom", "wallhung_toilet_separate", "wallhung_toilet_bathroom", "washbasin", "double_washbasin", "shower", "bath", "bath_and_shower"].map((k) => (
                    <Toggle key={k} testid={`wws-sanitary-${k}`} checked={s[k]} onChange={set(k)} label={T.fields.sanitary[k]} />
                  ))}
                </div>
              </StepCard>

              <StepCard title={lang === "nl" ? "Extra badkamer" : "Bathroom extras"}>
                <div className="grid md:grid-cols-2 gap-2">
                  {Object.keys(BATHROOM_EXTRAS).map((k) => (
                    <Toggle key={k} testid={`wws-bathroom-${k}`} checked={s.bathroom_extras[k]} onChange={setNested("bathroom_extras", k)} label={T.fields.bathroom_extras[k]} />
                  ))}
                </div>
              </StepCard>

              <StepCard title={lang === "nl" ? "Parkeren & toegankelijkheid" : "Parking & accessibility"}>
                <div className="grid md:grid-cols-2 gap-4">
                  <Field label={T.fields.shared_parking}>
                    <select className={inputCls} value={s.shared_parking} onChange={(e) => set("shared_parking")(e.target.value)}>
                      {Object.entries(T.fields.shared_parking_options).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                    </select>
                  </Field>
                  <Field label={T.fields.shared_parking_addresses}>
                    <input type="number" className={inputCls} value={s.shared_parking_addresses} onChange={(e) => set("shared_parking_addresses")(e.target.value)} />
                  </Field>
                  <Field label={T.fields.accessibility_amount}>
                    <input type="number" className={inputCls} value={s.accessibility_amount} onChange={(e) => set("accessibility_amount")(e.target.value)} />
                  </Field>
                </div>
                <div className="mt-3">
                  <Toggle testid="wws-charging" checked={s.charging_point} onChange={set("charging_point")} label={T.fields.charging_point} />
                </div>
              </StepCard>

              <StepCard title={lang === "nl" ? "Gebreken" : "Defects"}>
                <Field label={T.fields.defects}>
                  <select data-testid="wws-defects" className={inputCls} value={s.defects} onChange={(e) => set("defects")(e.target.value)}>
                    {Object.entries(T.fields.defects_options).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </Field>
                {s.defects === "serious" && (
                  <div data-testid="wws-defect-warning" className="mt-3 flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-800">
                    <AlertTriangle className="w-4 h-4 mt-0.5" />
                    <span>{T.results.warnings.serious_defects}</span>
                  </div>
                )}
              </StepCard>
            </>
          )}

          {step === 3 && (
            <>
              <StepCard title={SL.results}>
                <p className="text-sm text-fidaro-text-muted">
                  {lang === "nl"
                    ? "Bekijk je indicatieve uitkomst rechts. Download het PDF-rapport of vraag een Quick-Scan aan voor een onafhankelijke validatie."
                    : "See your indicative outcome on the right. Download the PDF report or request a Quick-Scan for independent validation."}
                </p>
                <div className="mt-4 grid md:grid-cols-3 gap-3">
                  <MiniStat label={lang === "nl" ? "Bouwjaar" : "Year"} value={s.year || "—"} />
                  <MiniStat label={lang === "nl" ? "Energielabel" : "Energy label"} value={s.energy_label || "—"} />
                  <MiniStat label="WOZ" value={s.woz_value ? `€ ${Number(s.woz_value).toLocaleString("nl-NL")}` : "—"} />
                </div>
              </StepCard>

              {/* Pand-toetsen upsell banner — contextual to the score */}
              <UpsellBanner result={result} category={category} lang={lang} />
            </>
          )}

          {/* Step nav buttons */}
          <div className="flex items-center justify-between mt-2">
            <button
              data-testid="wws-prev-step"
              onClick={() => setStep(Math.max(0, step - 1))}
              disabled={step === 0}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold border border-fidaro-green-light text-fidaro-ink disabled:opacity-40 hover:bg-fidaro-green-light/40 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> {SL.prev}
            </button>
            {step < 3 ? (
              <button
                data-testid="wws-next-step"
                onClick={() => setStep(Math.min(3, step + 1))}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold bg-fidaro-ink hover:bg-black text-white transition-colors"
              >
                {step === 2 ? SL.finish : SL.next}
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                data-testid="wws-download-pdf-btn"
                onClick={handlePDF}
                disabled={downloading}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold bg-fidaro-green hover:bg-fidaro-green-dark text-white shadow-[0_8px_30px_rgba(79,111,87,0.45)] transition-colors disabled:opacity-60"
              >
                <Download className="w-4 h-4" />
                {downloading ? "…" : lang === "nl" ? "Download PDF" : "Download PDF"}
              </button>
            )}
          </div>
        </div>

        {/* RESULTS sidebar */}
        <aside className="lg:col-span-5">
          <div className="lg:sticky lg:top-20 space-y-4">
            <div
              data-testid="wws-results-card"
              className={`rounded-3xl p-7 border relative overflow-hidden ${
                category === "free"
                  ? "bg-fidaro-green text-white border-fidaro-green-dark"
                  : "bg-fidaro-green-dark text-white border-fidaro-green-dark"
              }`}
            >
              <div className="absolute -top-20 -right-20 w-56 h-56 bg-fidaro-green-bright/20 rounded-full blur-3xl" />
              <div className="relative">
                <div className="text-[10px] uppercase tracking-[0.22em] font-mono text-fidaro-green-bright">
                  {T.results.title}
                </div>
                <div data-testid="wws-total-points" className="mt-3 font-display text-7xl tabular leading-none text-white">
                  {result.total}
                </div>
                <div className="mt-1 text-sm text-white/55">
                  {lang === "nl" ? "indicatieve punten" : "indicative points"}
                </div>

                <div className="mt-6">
                  <div className="text-xs flex justify-between text-white/55">
                    <span>{T.results.progress_label}</span>
                    <span className="font-mono">{Math.round(progressPct)}%</span>
                  </div>
                  <div className="mt-2 h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full bg-fidaro-green-bright" style={{ width: `${progressPct}%` }} />
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-white/5 border border-white/8 p-3">
                    <div className="text-[10px] uppercase tracking-widest text-white/45">{T.results.category}</div>
                    <div data-testid="wws-category" className="mt-1 text-sm font-semibold text-fidaro-green-bright">
                      {T.results.categories[category]}
                    </div>
                  </div>
                  <div className="rounded-xl bg-white/5 border border-white/8 p-3">
                    <div className="text-[10px] uppercase tracking-widest text-white/45">{T.results.distance}</div>
                    <div data-testid="wws-distance" className="mt-1 text-sm font-semibold text-white tabular">
                      {result.distanceTo187 > 0 ? `${result.distanceTo187} pt` : "✓ ≥ 187"}
                    </div>
                  </div>
                </div>

                <div className="mt-7 flex flex-col gap-2">
                  <button
                    type="button"
                    data-testid="wws-download-pdf-sidebar"
                    onClick={handlePDF}
                    disabled={downloading}
                    className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold bg-white/10 hover:bg-white/20 border border-white/15 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    {downloading ? "…" : lang === "nl" ? "Download PDF-rapport" : "Download PDF report"}
                  </button>
                  <Link to="/#pricing" data-testid="wws-cta-quickscan" className="text-center rounded-full px-5 py-3 text-sm font-semibold bg-fidaro-green-bright text-fidaro-ink hover:bg-white transition-colors">
                    {T.results.cta_quickscan}
                  </Link>
                  <Link to="/#contact" data-testid="wws-cta-plan" className="text-center rounded-full px-5 py-3 text-sm font-semibold border border-white/20 text-white hover:bg-white/5 transition-colors">
                    {T.results.cta_plan}
                  </Link>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 border border-fidaro-green-light">
              <h3 className="font-bold text-base text-fidaro-ink tracking-tight">{T.results.breakdown}</h3>
              <ul className="mt-4 space-y-1.5 text-sm" data-testid="wws-breakdown">
                {Object.entries(result.breakdown)
                  .filter(([k]) => k !== "wozUncapped" && k !== "wozCapped")
                  .map(([k, v]) => (
                    <li key={k} className="flex justify-between border-b border-fidaro-green-light/60 py-1.5">
                      <span className="text-fidaro-text-muted">{T.results.breakdown_keys[k] || k}</span>
                      <span className={`font-mono tabular ${v < 0 ? "text-red-600" : "text-fidaro-ink"}`}>
                        {v > 0 ? "+" : ""}{v}
                      </span>
                    </li>
                  ))}
              </ul>
            </div>

            {levers.length > 0 && (
              <div className="rounded-3xl bg-fidaro-green-light/60 p-6 border border-fidaro-green/20">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-fidaro-green" />
                  <h3 className="font-bold text-sm uppercase tracking-widest text-fidaro-green-dark">{T.results.improvements}</h3>
                </div>
                <ul className="mt-4 space-y-2 text-sm" data-testid="wws-improvements">
                  {levers.slice(0, 5).map((l, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-fidaro-green mt-0.5 flex-shrink-0" />
                      <span className="text-fidaro-green-dark">
                        {typeof T.results.levers[l.key] === "function"
                          ? T.results.levers[l.key](l.value)
                          : T.results.levers[l.key]}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {result.warnings.length > 0 && (
              <div className="rounded-3xl bg-amber-50 p-6 border border-amber-200">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-700" />
                  <h3 className="font-bold text-sm uppercase tracking-widest text-amber-800">
                    {lang === "nl" ? "Aandachtspunten" : "Notes"}
                  </h3>
                </div>
                <ul className="mt-3 space-y-1.5 text-sm text-amber-800">
                  {result.warnings.map((w, i) => <li key={i}>• {T.results.warnings[w]}</li>)}
                  {result.breakdown.wozCapped && <li>• {T.results.warnings.woz_capped}</li>}
                </ul>
              </div>
            )}
          </div>
        </aside>
      </div>

      <Footer />
    </div>
  );
}

function StepCard({ title, children }) {
  return (
    <div className="rounded-3xl bg-white border border-fidaro-green-light p-6 md:p-7">
      <h3 className="font-bold text-base tracking-tight text-fidaro-ink uppercase">{title}</h3>
      <div className="mt-5 space-y-4">{children}</div>
    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div className="rounded-xl border border-fidaro-green-light bg-fidaro-green-light/30 p-3">
      <div className="text-[10px] uppercase tracking-widest text-fidaro-text-muted">{label}</div>
      <div className="mt-1 text-sm font-bold tabular text-fidaro-ink">{value}</div>
    </div>
  );
}

// Contextual upsell banner shown on the results step.
// Copy adapts to the score range so it nudges the right next step.
function UpsellBanner({ result, category, lang }) {
  const total = result?.total || 0;
  const distance = result?.distanceTo187 || 0;

  let context;
  if (category === "free") {
    context = lang === "nl"
      ? {
          eyebrow: "Vrije sector kansrijk",
          title: "Je pand zit boven de 187-puntsgrens.",
          body: "Een Fidaro Quick-Scan bevestigt of je écht in de vrije sector kan verhuren en welke huurprijs realistisch is.",
        }
      : {
          eyebrow: "Free-sector potential",
          title: "Your property is above the 187-point threshold.",
          body: "A Fidaro Quick-Scan confirms whether you can actually rent in the free sector and what rent is realistic.",
        };
  } else if (total >= 180 && total < 187) {
    context = lang === "nl"
      ? {
          eyebrow: "Dicht bij 187",
          title: `Je zit slechts ${distance} punt(en) van de vrije sector.`,
          body: "Een Quick-Scan toont je hoe je deze marge overbrugt — vaak met één gerichte ingreep (energielabel, keuken, badkamer).",
        }
      : {
          eyebrow: "Close to 187",
          title: `You are only ${distance} point(s) from the free sector.`,
          body: "A Quick-Scan shows you how to close this gap — often with one targeted intervention (energy label, kitchen, bathroom).",
        };
  } else if (category === "middle") {
    context = lang === "nl"
      ? {
          eyebrow: "Middenhuur / reguleringsrisico",
          title: "Je pand zit in het reguleringsbereik.",
          body: "Een Fidaro validatie wijst de optimalisatie-hefbomen aan en berekent het ROI-scenario onder de huidige regels.",
        }
      : {
          eyebrow: "Mid-rent / regulation risk",
          title: "Your property sits within the regulated range.",
          body: "A Fidaro validation pinpoints the optimisation levers and calculates the ROI scenario under current rules.",
        };
  } else {
    context = lang === "nl"
      ? {
          eyebrow: "Sociale huur",
          title: "Je pand valt onder de sociale huurgrens.",
          body: "Een Fidaro Investment Plan brengt het potentieel én de risico's volledig in kaart vóór je investeert.",
        }
      : {
          eyebrow: "Social rent",
          title: "Your property falls under the social rent limit.",
          body: "A Fidaro Investment Plan maps the full potential and risks before you invest.",
        };
  }

  return (
    <div
      data-testid="wws-upsell-banner"
      className="relative rounded-3xl bg-gradient-to-br from-fidaro-green-dark via-fidaro-green-dark to-fidaro-green p-7 md:p-9 text-white overflow-hidden shadow-[0_20px_50px_-20px_rgba(63,92,73,0.5)]"
    >
      <div className="absolute -top-20 -right-16 w-64 h-64 bg-fidaro-green-bright/25 rounded-full blur-3xl pointer-events-none" />
      <div className="relative">
        <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-fidaro-green-bright font-mono px-2.5 py-1 rounded-full bg-white/10 border border-white/15">
          <ShieldCheck className="w-3 h-3" />
          {context.eyebrow}
        </div>
        <h3 className="mt-4 font-display text-2xl md:text-3xl tracking-tight leading-tight">
          {context.title}
        </h3>
        <p className="mt-3 text-sm md:text-base text-white/80 leading-relaxed max-w-xl">
          {context.body}
        </p>

        <div className="mt-6 grid sm:grid-cols-2 gap-3 max-w-2xl">
          <a
            href="/#pricing"
            data-testid="wws-upsell-quickscan"
            className="group rounded-2xl bg-white text-fidaro-green-dark p-5 hover:bg-fidaro-green-light transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-[0.22em] font-mono text-fidaro-green">Quick-Scan</span>
              <span className="font-display text-2xl tabular">€ 99</span>
            </div>
            <div className="mt-2 text-sm font-semibold flex items-center gap-1.5">
              {lang === "nl" ? "Laat dit pand valideren" : "Validate this property"}
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </div>
            <div className="mt-1 text-xs text-fidaro-text-muted">
              {lang === "nl" ? "Eerste validatie binnen 48u" : "First validation within 48h"}
            </div>
          </a>

          <a
            href="/#pricing"
            data-testid="wws-upsell-plan"
            className="group rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 p-5 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-[0.22em] font-mono text-fidaro-green-bright">Investment Plan</span>
              <span className="font-display text-2xl tabular">€ 750</span>
            </div>
            <div className="mt-2 text-sm font-semibold flex items-center gap-1.5">
              {lang === "nl" ? "Diepgaand rapport aanvragen" : "Request in-depth report"}
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </div>
            <div className="mt-1 text-xs text-white/55">
              {lang === "nl" ? "Volledige scenario-analyse" : "Full scenario analysis"}
            </div>
          </a>
        </div>

        <div className="mt-5 flex items-center gap-2 text-xs text-white/65">
          <Phone className="w-3.5 h-3.5" />
          {lang === "nl"
            ? "Liever even bellen? fidarovastgoed@gmail.com"
            : "Prefer a quick call? fidarovastgoed@gmail.com"}
        </div>
      </div>
    </div>
  );
}
