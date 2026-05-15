import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  Info,
  RefreshCw,
} from "lucide-react";
import { useLang } from "../contexts/LanguageContext";
import { wwsT } from "../wws/translations";
import {
  calculateTotalWWS,
  determineRentCategory,
  suggestImprovementLevers,
} from "../wws/calculator";
import {
  KITCHEN_EXTRAS,
  BATHROOM_EXTRAS,
  ENERGY_LABEL_POINTS,
} from "../wws/config";
import Footer from "../components/Footer";

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

// Convert string-numeric inputs to numbers for calculation only
const numerizeInput = (state) => {
  const out = { ...state };
  const numericKeys = [
    "year",
    "current_rent",
    "living_m2",
    "bed1_m2",
    "bed2_m2",
    "bed3_m2",
    "kitchen_m2",
    "bathroom_m2",
    "other_rooms_m2",
    "other_indoor_m2",
    "storage_m2",
    "garage_indoor_m2",
    "private_outdoor_m2",
    "shared_outdoor_m2",
    "shared_outdoor_addresses",
    "shared_indoor_room_m2",
    "shared_other_indoor_m2",
    "shared_indoor_addresses",
    "ep2",
    "woz_value",
    "usable_floor_area",
    "extra_cupboards_60cm",
    "heated_rooms",
    "heated_other_spaces",
    "cooled_rooms",
    "accessibility_amount",
    "shared_parking_addresses",
  ];
  for (const k of numericKeys) {
    out[k] = out[k] === "" || out[k] == null ? 0 : parseFloat(out[k]) || 0;
  }
  return out;
};

const Section = ({ title, children, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-2xl border border-fidaro-green-light bg-white overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between px-6 py-4 text-left transition-colors ${
          open ? "bg-fidaro-green-light/40" : "hover:bg-fidaro-green-light/30"
        }`}
        data-testid={`wws-section-${title.split(" ")[0]}`}
      >
        <span className="font-serif text-xl text-fidaro-text-dark">{title}</span>
        <span className="text-fidaro-green text-2xl leading-none">{open ? "−" : "+"}</span>
      </button>
      {open && <div className="px-6 py-6 space-y-4 border-t border-fidaro-green-light">{children}</div>}
    </div>
  );
};

const Field = ({ label, children }) => (
  <label className="block">
    <span className="text-xs font-medium text-fidaro-text-muted uppercase tracking-wider">
      {label}
    </span>
    <div className="mt-1.5">{children}</div>
  </label>
);

const inputCls =
  "w-full bg-white border border-fidaro-green-light rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-fidaro-green focus:ring-2 focus:ring-fidaro-green/20";

const Toggle = ({ checked, onChange, label, testid }) => (
  <label className="flex items-center gap-2 cursor-pointer text-sm py-1">
    <input
      type="checkbox"
      checked={!!checked}
      onChange={(e) => onChange(e.target.checked)}
      data-testid={testid}
      className="w-4 h-4 accent-fidaro-green"
    />
    <span className="text-fidaro-text-dark">{label}</span>
  </label>
);

export default function WWSCalculator() {
  const { lang, setLang } = useLang();
  const T = wwsT[lang] || wwsT.nl;
  const [s, setS] = useState(initial);

  const set = (k) => (v) => setS((prev) => ({ ...prev, [k]: v }));
  const setNested = (group, k) => (v) =>
    setS((prev) => ({ ...prev, [group]: { ...prev[group], [k]: v } }));

  const result = useMemo(() => calculateTotalWWS(numerizeInput(s)), [s]);
  const category = determineRentCategory(result.total);
  const levers = suggestImprovementLevers(numerizeInput(s), result);

  const progressPct = Math.max(0, Math.min(100, (result.total / 187) * 100));

  const categoryStyle = {
    social: { bg: "bg-fidaro-silver/30", text: "text-fidaro-text-dark", dot: "bg-fidaro-silver" },
    middle: { bg: "bg-fidaro-green-light", text: "text-fidaro-green-dark", dot: "bg-fidaro-green" },
    free: { bg: "bg-fidaro-green", text: "text-white", dot: "bg-white" },
  }[category];

  const energyLabels = ["A++++", "A+++", "A++", "A+", "A", "B", "C", "D", "E", "F", "G", "no_label"];

  return (
    <div data-testid="wws-calculator-page" className="bg-fidaro-green-light/30 min-h-screen">
      {/* Header */}
      <header className="border-b border-fidaro-green-light bg-white sticky top-0 z-30 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
          <Link
            to="/"
            data-testid="wws-back-link"
            className="inline-flex items-center gap-2 text-sm text-fidaro-text-dark hover:text-fidaro-green"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-serif text-lg">
              fidaro <span className="text-fidaro-green">vastgoed</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <button
              data-testid="wws-reset-btn"
              onClick={() => setS(initial)}
              className="hidden md:inline-flex items-center gap-2 text-xs text-fidaro-text-muted hover:text-fidaro-green"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              {T.page.reset}
            </button>
            <div className="flex items-center text-xs border border-fidaro-green/30 rounded-full overflow-hidden">
              <button
                data-testid="wws-lang-nl"
                onClick={() => setLang("nl")}
                className={`px-3 py-1.5 ${
                  lang === "nl" ? "bg-fidaro-green text-white" : "text-fidaro-text-dark"
                }`}
              >
                NL
              </button>
              <button
                data-testid="wws-lang-en"
                onClick={() => setLang("en")}
                className={`px-3 py-1.5 ${
                  lang === "en" ? "bg-fidaro-green text-white" : "text-fidaro-text-dark"
                }`}
              >
                EN
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Intro */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 pt-12 pb-6">
        <div className="text-xs uppercase tracking-[0.2em] text-fidaro-green font-semibold">
          {T.page.eyebrow}
        </div>
        <h1 className="mt-3 font-serif text-4xl md:text-5xl text-fidaro-text-dark leading-tight">
          {T.page.title}
        </h1>
        <p className="mt-4 max-w-3xl text-fidaro-text-muted leading-relaxed">{T.page.intro}</p>
        <div className="mt-6 flex items-start gap-3 max-w-3xl bg-white border border-fidaro-green/20 rounded-xl p-4 text-xs text-fidaro-text-muted">
          <Info className="w-4 h-4 text-fidaro-green flex-shrink-0 mt-0.5" />
          <span>{T.page.disclaimer}</span>
        </div>
      </div>

      {/* Main grid */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 pb-20 grid lg:grid-cols-12 gap-8">
        {/* FORM */}
        <div className="lg:col-span-7 space-y-3">
          <Section title={T.sections.basics} defaultOpen>
            <div className="grid md:grid-cols-2 gap-4">
              <Field label={T.fields.address}>
                <input
                  data-testid="wws-address"
                  className={inputCls}
                  value={s.address}
                  onChange={(e) => set("address")(e.target.value)}
                />
              </Field>
              <Field label={T.fields.property_type}>
                <select
                  data-testid="wws-property-type"
                  className={inputCls}
                  value={s.property_type}
                  onChange={(e) => set("property_type")(e.target.value)}
                >
                  {Object.entries(T.fields.property_type_options).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label={T.fields.independent}>
                <select
                  className={inputCls}
                  value={s.independent}
                  onChange={(e) => set("independent")(e.target.value)}
                >
                  <option value="yes">{T.fields.yes}</option>
                  <option value="no">{T.fields.no}</option>
                </select>
              </Field>
              <Field label={T.fields.year}>
                <input
                  data-testid="wws-year"
                  type="number"
                  className={inputCls}
                  value={s.year}
                  onChange={(e) => set("year")(e.target.value)}
                />
              </Field>
              <Field label={T.fields.current_rent}>
                <input
                  type="number"
                  className={inputCls}
                  value={s.current_rent}
                  onChange={(e) => set("current_rent")(e.target.value)}
                />
              </Field>
              <Field label={T.fields.tenant_situation}>
                <select
                  className={inputCls}
                  value={s.tenant_situation}
                  onChange={(e) => set("tenant_situation")(e.target.value)}
                >
                  {Object.entries(T.fields.tenant_options).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
          </Section>

          <Section title={T.sections.surfaces} defaultOpen>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                "living_m2",
                "bed1_m2",
                "bed2_m2",
                "bed3_m2",
                "kitchen_m2",
                "bathroom_m2",
                "other_rooms_m2",
                "other_indoor_m2",
                "storage_m2",
                "garage_indoor_m2",
                "private_outdoor_m2",
                "shared_outdoor_m2",
                "shared_outdoor_addresses",
                "shared_indoor_room_m2",
                "shared_other_indoor_m2",
                "shared_indoor_addresses",
              ].map((k) => (
                <Field key={k} label={T.fields[k]}>
                  <input
                    data-testid={`wws-${k}`}
                    type="number"
                    className={inputCls}
                    value={s[k]}
                    onChange={(e) => set(k)(e.target.value)}
                  />
                </Field>
              ))}
            </div>
            <Toggle
              testid="wws-no-outdoor"
              checked={s.no_outdoor_space}
              onChange={set("no_outdoor_space")}
              label={T.fields.no_outdoor_space}
            />
          </Section>

          <Section title={T.sections.energy}>
            <div className="grid md:grid-cols-2 gap-4">
              <Field label={T.fields.energy_label}>
                <select
                  data-testid="wws-energy-label"
                  className={inputCls}
                  value={s.energy_label}
                  onChange={(e) => set("energy_label")(e.target.value)}
                >
                  <option value="">—</option>
                  {energyLabels.map((l) => (
                    <option key={l} value={l}>
                      {l === "no_label"
                        ? lang === "nl"
                          ? "Geen geldig label"
                          : "No valid label"
                        : l}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label={T.fields.energy_label_validity_date}>
                <input
                  type="date"
                  className={inputCls}
                  value={s.energy_label_validity_date}
                  onChange={(e) => set("energy_label_validity_date")(e.target.value)}
                />
              </Field>
              <Field label={T.fields.energy_dwelling_type}>
                <select
                  className={inputCls}
                  value={s.energy_dwelling_type}
                  onChange={(e) => set("energy_dwelling_type")(e.target.value)}
                >
                  {Object.entries(T.fields.energy_dwelling_options).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label={T.fields.ep2}>
                <input
                  type="number"
                  className={inputCls}
                  value={s.ep2}
                  onChange={(e) => set("ep2")(e.target.value)}
                />
              </Field>
              <Field label={T.fields.monument}>
                <select
                  data-testid="wws-monument"
                  className={inputCls}
                  value={s.monument}
                  onChange={(e) => set("monument")(e.target.value)}
                >
                  {Object.entries(T.fields.monument_options).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
          </Section>

          <Section title={T.sections.woz}>
            <div className="grid md:grid-cols-2 gap-4">
              <Field label={T.fields.woz_value}>
                <input
                  data-testid="wws-woz-value"
                  type="number"
                  className={inputCls}
                  value={s.woz_value}
                  onChange={(e) => set("woz_value")(e.target.value)}
                />
              </Field>
              <Field label={T.fields.woz_date}>
                <select
                  className={inputCls}
                  value={s.woz_date}
                  onChange={(e) => set("woz_date")(e.target.value)}
                >
                  <option value="2023-01-01">1 januari 2023</option>
                  <option value="2022-01-01">1 januari 2022</option>
                </select>
              </Field>
              <Field label={T.fields.usable_floor_area}>
                <input
                  data-testid="wws-floor-area"
                  type="number"
                  className={inputCls}
                  value={s.usable_floor_area}
                  onChange={(e) => set("usable_floor_area")(e.target.value)}
                />
              </Field>
              <Field label={T.fields.woz_decision}>
                <select
                  className={inputCls}
                  value={s.woz_decision}
                  onChange={(e) => set("woz_decision")(e.target.value)}
                >
                  <option value="yes">{T.fields.yes}</option>
                  <option value="no">{T.fields.no}</option>
                </select>
              </Field>
            </div>
          </Section>

          <Section title={T.sections.kitchen}>
            <Field label={T.fields.countertop}>
              <select
                data-testid="wws-countertop"
                className={inputCls}
                value={s.countertop}
                onChange={(e) => set("countertop")(e.target.value)}
              >
                {Object.entries(T.fields.countertop_options).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
            </Field>
            <div className="grid md:grid-cols-2 gap-x-4 gap-y-1 mt-2">
              {Object.keys(KITCHEN_EXTRAS).map((k) => (
                <Toggle
                  key={k}
                  testid={`wws-kitchen-${k}`}
                  checked={s.kitchen_extras[k]}
                  onChange={setNested("kitchen_extras", k)}
                  label={T.fields.kitchen_extras[k]}
                />
              ))}
            </div>
            <Field label={T.fields.extra_cupboards_60cm}>
              <input
                type="number"
                className={inputCls}
                value={s.extra_cupboards_60cm}
                onChange={(e) => set("extra_cupboards_60cm")(e.target.value)}
              />
            </Field>
          </Section>

          <Section title={T.sections.sanitary}>
            <div className="grid md:grid-cols-2 gap-x-4 gap-y-1">
              {[
                "toilet_separate",
                "toilet_in_bathroom",
                "wallhung_toilet_separate",
                "wallhung_toilet_bathroom",
                "washbasin",
                "double_washbasin",
                "shower",
                "bath",
                "bath_and_shower",
              ].map((k) => (
                <Toggle
                  key={k}
                  testid={`wws-sanitary-${k}`}
                  checked={s[k]}
                  onChange={set(k)}
                  label={T.fields.sanitary[k]}
                />
              ))}
            </div>
          </Section>

          <Section title={T.sections.bathroom_extras}>
            <div className="grid md:grid-cols-2 gap-x-4 gap-y-1">
              {Object.keys(BATHROOM_EXTRAS).map((k) => (
                <Toggle
                  key={k}
                  testid={`wws-bathroom-${k}`}
                  checked={s.bathroom_extras[k]}
                  onChange={setNested("bathroom_extras", k)}
                  label={T.fields.bathroom_extras[k]}
                />
              ))}
            </div>
          </Section>

          <Section title={T.sections.heating}>
            <div className="grid md:grid-cols-3 gap-4">
              <Field label={T.fields.heated_rooms}>
                <input
                  type="number"
                  className={inputCls}
                  value={s.heated_rooms}
                  onChange={(e) => set("heated_rooms")(e.target.value)}
                />
              </Field>
              <Field label={T.fields.heated_other_spaces}>
                <input
                  type="number"
                  className={inputCls}
                  value={s.heated_other_spaces}
                  onChange={(e) => set("heated_other_spaces")(e.target.value)}
                />
              </Field>
              <Field label={T.fields.cooled_rooms}>
                <input
                  type="number"
                  className={inputCls}
                  value={s.cooled_rooms}
                  onChange={(e) => set("cooled_rooms")(e.target.value)}
                />
              </Field>
            </div>
          </Section>

          <Section title={T.sections.accessibility}>
            <Field label={T.fields.accessibility_amount}>
              <input
                type="number"
                className={inputCls}
                value={s.accessibility_amount}
                onChange={(e) => set("accessibility_amount")(e.target.value)}
              />
            </Field>
          </Section>

          <Section title={T.sections.parking}>
            <div className="grid md:grid-cols-2 gap-4">
              <Field label={T.fields.shared_parking}>
                <select
                  className={inputCls}
                  value={s.shared_parking}
                  onChange={(e) => set("shared_parking")(e.target.value)}
                >
                  {Object.entries(T.fields.shared_parking_options).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label={T.fields.shared_parking_addresses}>
                <input
                  type="number"
                  className={inputCls}
                  value={s.shared_parking_addresses}
                  onChange={(e) => set("shared_parking_addresses")(e.target.value)}
                />
              </Field>
            </div>
            <Toggle
              testid="wws-charging"
              checked={s.charging_point}
              onChange={set("charging_point")}
              label={T.fields.charging_point}
            />
          </Section>

          <Section title={T.sections.defects}>
            <Field label={T.fields.defects}>
              <select
                data-testid="wws-defects"
                className={inputCls}
                value={s.defects}
                onChange={(e) => set("defects")(e.target.value)}
              >
                {Object.entries(T.fields.defects_options).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
            </Field>
            {s.defects === "serious" && (
              <div
                data-testid="wws-defect-warning"
                className="mt-3 flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-800"
              >
                <AlertTriangle className="w-4 h-4 mt-0.5" />
                <span>{T.results.warnings.serious_defects}</span>
              </div>
            )}
          </Section>
        </div>

        {/* RESULTS */}
        <aside className="lg:col-span-5">
          <div className="lg:sticky lg:top-24 space-y-4">
            <div
              data-testid="wws-results-card"
              className={`rounded-3xl p-7 shadow-xl border ${
                category === "free"
                  ? "bg-fidaro-green text-white border-fidaro-green-dark"
                  : "bg-white border-fidaro-green-light"
              }`}
            >
              <div
                className={`text-xs uppercase tracking-widest font-semibold ${
                  category === "free" ? "text-white/80" : "text-fidaro-green"
                }`}
              >
                {T.results.title}
              </div>
              <div
                data-testid="wws-total-points"
                className={`mt-2 font-serif text-7xl leading-none ${
                  category === "free" ? "text-white" : "text-fidaro-text-dark"
                }`}
              >
                {result.total}
              </div>
              <div
                className={`mt-1 text-sm ${
                  category === "free" ? "text-white/80" : "text-fidaro-text-muted"
                }`}
              >
                {lang === "nl" ? "indicatieve punten" : "indicative points"}
              </div>

              {/* Progress */}
              <div className="mt-6">
                <div
                  className={`text-xs flex justify-between ${
                    category === "free" ? "text-white/80" : "text-fidaro-text-muted"
                  }`}
                >
                  <span>{T.results.progress_label}</span>
                  <span>{Math.round(progressPct)}%</span>
                </div>
                <div
                  className={`mt-2 h-2 rounded-full overflow-hidden ${
                    category === "free" ? "bg-white/20" : "bg-fidaro-green-light"
                  }`}
                >
                  <div
                    className={`h-full ${category === "free" ? "bg-white" : "bg-fidaro-green"}`}
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>

              {/* Category */}
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div>
                  <div
                    className={`text-xs uppercase tracking-widest ${
                      category === "free" ? "text-white/70" : "text-fidaro-text-muted"
                    }`}
                  >
                    {T.results.category}
                  </div>
                  <div
                    data-testid="wws-category"
                    className={`mt-1 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${categoryStyle.bg} ${categoryStyle.text}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${categoryStyle.dot}`} />
                    {T.results.categories[category]}
                  </div>
                </div>
                <div>
                  <div
                    className={`text-xs uppercase tracking-widest ${
                      category === "free" ? "text-white/70" : "text-fidaro-text-muted"
                    }`}
                  >
                    {T.results.distance}
                  </div>
                  <div
                    data-testid="wws-distance"
                    className={`mt-1 font-serif text-2xl ${
                      category === "free" ? "text-white" : "text-fidaro-text-dark"
                    }`}
                  >
                    {result.distanceTo187 > 0 ? `${result.distanceTo187} pt` : "✓ ≥ 187"}
                  </div>
                </div>
              </div>

              {/* CTAs */}
              <div className="mt-7 flex flex-col gap-2">
                <Link
                  to="/#pricing"
                  data-testid="wws-cta-quickscan"
                  className={`text-center rounded-xl px-5 py-3 font-medium transition-colors ${
                    category === "free"
                      ? "bg-white text-fidaro-green hover:bg-fidaro-green-light"
                      : "bg-fidaro-green text-white hover:bg-fidaro-green-dark"
                  }`}
                >
                  {T.results.cta_quickscan}
                </Link>
                <Link
                  to="/#contact"
                  data-testid="wws-cta-plan"
                  className={`text-center rounded-xl px-5 py-3 font-medium transition-colors border ${
                    category === "free"
                      ? "border-white/40 text-white hover:bg-white/10"
                      : "border-fidaro-green/40 text-fidaro-green hover:bg-fidaro-green-light"
                  }`}
                >
                  {T.results.cta_plan}
                </Link>
              </div>
            </div>

            {/* Breakdown */}
            <div className="rounded-3xl bg-white p-6 border border-fidaro-green-light">
              <h3 className="font-serif text-xl text-fidaro-text-dark">{T.results.breakdown}</h3>
              <ul className="mt-4 space-y-1.5 text-sm" data-testid="wws-breakdown">
                {Object.entries(result.breakdown)
                  .filter(([k]) => k !== "wozUncapped" && k !== "wozCapped")
                  .map(([k, v]) => (
                    <li
                      key={k}
                      className="flex justify-between border-b border-fidaro-green-light/50 py-1.5"
                    >
                      <span className="text-fidaro-text-muted">
                        {T.results.breakdown_keys[k] || k}
                      </span>
                      <span
                        className={`font-medium ${
                          v < 0 ? "text-red-600" : "text-fidaro-text-dark"
                        }`}
                      >
                        {v > 0 ? "+" : ""}
                        {v}
                      </span>
                    </li>
                  ))}
              </ul>
            </div>

            {/* Improvements */}
            {levers.length > 0 && (
              <div className="rounded-3xl bg-fidaro-green-light/60 p-6 border border-fidaro-green/20">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-fidaro-green" />
                  <h3 className="font-serif text-xl text-fidaro-green-dark">
                    {T.results.improvements}
                  </h3>
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

            {/* Warnings */}
            {result.warnings.length > 0 && (
              <div className="rounded-3xl bg-amber-50 p-6 border border-amber-200">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-700" />
                  <h3 className="font-serif text-lg text-amber-800">
                    {lang === "nl" ? "Aandachtspunten" : "Notes"}
                  </h3>
                </div>
                <ul className="mt-3 space-y-1.5 text-sm text-amber-800">
                  {result.warnings.map((w, i) => (
                    <li key={i}>• {T.results.warnings[w]}</li>
                  ))}
                  {result.breakdown.wozCapped && (
                    <li>• {T.results.warnings.woz_capped}</li>
                  )}
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
