// =============================================================================
// PDF export for the indicative WWS report.
// Uses jsPDF + jspdf-autotable for crisp, vector text (selectable & searchable).
// All copy is rendered bilingually based on the active `lang`.
// =============================================================================

import { jsPDF } from "jspdf";
// Side-effect import: registers `autoTable` on jsPDF prototype.
import "jspdf-autotable";
// Also keep the function form available as a fallback.
import autoTableFn from "jspdf-autotable";

const callAutoTable = (doc, opts) => {
  if (typeof doc.autoTable === "function") {
    doc.autoTable(opts);
  } else if (typeof autoTableFn === "function") {
    autoTableFn(doc, opts);
  } else {
    throw new Error("autoTable not available");
  }
};

const LOGO_URL =
  "https://customer-assets.emergentagent.com/job_35e0d8c8-8484-434c-b0cb-1a5cfc9d3012/artifacts/p4sighyv_Untitled%20design%20%2811%29.png";

// Module-level logo cache (data URL, fetched lazily once with 2s timeout)
let _logoCache = null;
const fetchLogoDataUrl = async () => {
  if (_logoCache) return _logoCache;
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 2500);
    const res = await fetch(LOGO_URL, { mode: "cors", signal: ctrl.signal });
    clearTimeout(timer);
    if (!res.ok) return null;
    const blob = await res.blob();
    _logoCache = await new Promise((resolve, reject) => {
      const fr = new FileReader();
      fr.onload = () => resolve(fr.result);
      fr.onerror = reject;
      fr.readAsDataURL(blob);
    });
    return _logoCache;
  } catch (e) {
    console.warn("Fidaro PDF: logo fetch skipped:", e?.message || e);
    return null;
  }
};

const FIDARO_GREEN = [79, 111, 87]; // #4F6F57
const FIDARO_GREEN_DARK = [63, 92, 73]; // #3F5C49
const FIDARO_GREEN_LIGHT = [234, 241, 235]; // #EAF1EB
const FIDARO_TEXT_DARK = [30, 30, 30]; // #1E1E1E
const FIDARO_TEXT_MUTED = [111, 111, 111]; // #6F6F6F
const FIDARO_SILVER = [201, 201, 201]; // #C9C9C9

const COPY = {
  nl: {
    brand: "fidaro vastgoed",
    title: "Indicatief WWS-rapport",
    subtitle: "Validate before you invest",
    generated: "Gegenereerd op",
    address: "Adres",
    propertyDetails: "Pandgegevens",
    propertyType: "Woningtype",
    year: "Bouwjaar",
    floorArea: "Gebruiksopp. (m²)",
    energyLabel: "Energielabel",
    woz: "WOZ-waarde",
    rent: "Huidige/verwachte huur",
    summary: "Samenvatting",
    totalPoints: "Indicatieve WWS-punten",
    category: "Geschatte huurcategorie",
    distance: "Afstand tot 187",
    breakdown: "Verdeling per categorie",
    breakdownCol1: "Categorie",
    breakdownCol2: "Punten",
    levers: "Optimalisatie­hefbomen",
    warnings: "Aandachtspunten",
    disclaimer:
      "Deze calculator geeft een indicatieve WWS-schatting op basis van de regels van 2025 voor zelfstandige woonruimte. De uiteindelijke score kan afwijken afhankelijk van exacte metingen, documentatie, officiële Huurcommissie-interpretatie, juridische context en beleidsupdates. Aan dit resultaat kunnen geen rechten worden ontleend.",
    ctaTitle: "Volgende stap",
    ctaBody:
      "Vraag een €99 Fidaro Quick-Scan aan voor een onafhankelijke validatie of het volledige €750 Investment Plan voor een diepgaand rapport met scenario's.",
    ctaContact: "fidarovastgoed@gmail.com",
    pageOf: "Pagina",
    of: "van",
    categories: {
      social: "Gereguleerd / sociale huur",
      middle: "Middenhuur / regulering risico",
      free: "Vrije sector kansrijk",
    },
    propertyTypes: {
      single_family: "Eengezinswoning",
      apartment: "Appartement",
      duplex: "Duplex",
      other: "Anders",
    },
    levers: {
      distance: (v) => `Je staat ${v} punt(en) van de 187-puntsgrens (vrije sector).`,
      energy: "Een beter energielabel kan de WWS-score significant verhogen.",
      kitchen: "Keukenverbeteringen (inbouwapparatuur, langer aanrecht) kunnen punten toevoegen.",
      bathroom: "Badkamerupgrades (douchewand, handdoekradiator, sanitair) kunnen punten toevoegen.",
      no_outdoor: "Geen buitenruimte geeft puntenaftrek en beperkt het optimalisatiepotentieel.",
      woz_capped: "WOZ-impact afgetopt — focus op niet-WOZ-categorieën.",
      close_threshold:
        "Pand zit dicht bij 187. Een Fidaro Quick-Scan identificeert de meest efficiënte route.",
    },
    warningsMap: {
      serious_defects: "Serieuze gebreken kunnen de redelijke huur beïnvloeden — handmatige review vereist.",
      no_label: "Geen geldig energielabel — bouwjaar wordt gebruikt.",
      no_woz: "Geen WOZ-waarde ingevuld — WOZ-punten zijn 0.",
      no_year: "Geen bouwjaar ingevuld.",
      no_floor_area: "Geen gebruiksoppervlakte ingevuld.",
      woz_capped: "WOZ-punten zijn beperkt door de 33%-regel.",
    },
    breakdownLabels: {
      surface: "Oppervlakte",
      otherIndoor: "Overige binnenruimte",
      heating: "Verwarming & koeling",
      energy: "Energie",
      kitchen: "Keuken",
      sanitary: "Sanitair",
      extraBathroom: "Extra badkamer",
      accessibility: "Toegankelijkheid",
      outdoor: "Buitenruimte",
      sharedSpace: "Gedeelde ruimtes",
      parking: "Parkeren",
      woz: "WOZ",
    },
  },
  en: {
    brand: "fidaro vastgoed",
    title: "Indicative WWS Report",
    subtitle: "Validate before you invest",
    generated: "Generated on",
    address: "Address",
    propertyDetails: "Property details",
    propertyType: "Property type",
    year: "Year of construction",
    floorArea: "Usable floor area (m²)",
    energyLabel: "Energy label",
    woz: "WOZ value",
    rent: "Current / expected rent",
    summary: "Summary",
    totalPoints: "Indicative WWS points",
    category: "Estimated rent category",
    distance: "Distance to 187",
    breakdown: "Breakdown by category",
    breakdownCol1: "Category",
    breakdownCol2: "Points",
    levers: "Improvement levers",
    warnings: "Notes",
    disclaimer:
      "This calculator provides an indicative WWS estimate based on 2025 rules for zelfstandige woonruimte. The final score may differ depending on exact measurements, documentation, official Huurcommissie interpretation, legal context, and policy updates. No rights can be derived from this result.",
    ctaTitle: "Next step",
    ctaBody:
      "Request a €99 Fidaro Quick-Scan for an independent validation or the full €750 Investment Plan for an in-depth report with scenarios.",
    ctaContact: "fidarovastgoed@gmail.com",
    pageOf: "Page",
    of: "of",
    categories: {
      social: "Regulated / social rent",
      middle: "Middle rent / regulation risk",
      free: "Likely free-sector potential",
    },
    propertyTypes: {
      single_family: "Single-family house",
      apartment: "Apartment",
      duplex: "Duplex",
      other: "Other",
    },
    levers: {
      distance: (v) => `You are ${v} point(s) away from the 187-point free-sector threshold.`,
      energy: "Improving the energy label could significantly increase the WWS score.",
      kitchen: "Kitchen improvements (built-in appliances, longer countertop) may add points.",
      bathroom: "Bathroom upgrades (shower screen, towel radiator, sanitary) may add points.",
      no_outdoor: "No outdoor space creates a point deduction and limits optimisation.",
      woz_capped: "WOZ impact appears capped — focus on non-WOZ categories.",
      close_threshold:
        "Property is close to 187. A Fidaro Quick-Scan can identify the most efficient route.",
    },
    warningsMap: {
      serious_defects: "Serious defects may influence the reasonable rent — manual review required.",
      no_label: "No valid energy label — construction year is used.",
      no_woz: "No WOZ value entered — WOZ points are 0.",
      no_year: "No construction year entered.",
      no_floor_area: "No usable floor area entered.",
      woz_capped: "WOZ points were capped by the 33% rule.",
    },
    breakdownLabels: {
      surface: "Surface area",
      otherIndoor: "Other indoor space",
      heating: "Heating & cooling",
      energy: "Energy",
      kitchen: "Kitchen",
      sanitary: "Sanitary",
      extraBathroom: "Bathroom extras",
      accessibility: "Accessibility",
      outdoor: "Outdoor space",
      sharedSpace: "Shared spaces",
      parking: "Parking",
      woz: "WOZ",
    },
  },
};

const formatNumber = (n) => (typeof n === "number" ? n.toLocaleString("nl-NL") : n || "—");
const formatEuro = (n) =>
  n ? "€ " + Number(n).toLocaleString("nl-NL", { maximumFractionDigits: 0 }) : "—";

export const generateWWSReport = async (input, result, lang = "nl") => {
  const L = COPY[lang] || COPY.nl;
  const doc = new jsPDF({ unit: "mm", format: "a4" });

  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 18;
  let y = 0;

  // ---- Header band ---------------------------------------------------------
  doc.setFillColor(...FIDARO_GREEN_DARK);
  doc.rect(0, 0, pageW, 34, "F");

  // Try to embed logo (async, best-effort)
  const logoDataUrl = await fetchLogoDataUrl();
  if (logoDataUrl) {
    try {
      doc.addImage(logoDataUrl, "PNG", margin, 7, 20, 20);
      // Wordmark next to logo
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(15);
      doc.text("fidaro", margin + 23, 16);
      doc.setTextColor(122, 164, 135); // green-bright
      doc.text("vastgoed", margin + 23 + 16, 16);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(234, 241, 235);
      doc.text(L.subtitle, margin + 23, 22);
    } catch (e) {
      // Fallback wordmark only
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.text(L.brand, margin, 16);
    }
  } else {
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text(L.brand, margin, 16);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(234, 241, 235);
    doc.text(L.subtitle, margin, 22);
  }

  // Date right
  const today = new Date().toLocaleDateString(lang === "nl" ? "nl-NL" : "en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.text(`${L.generated}: ${today}`, pageW - margin, 16, { align: "right" });

  y = 46;

  // ---- Title ----------------------------------------------------------------
  doc.setTextColor(...FIDARO_TEXT_DARK);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text(L.title, margin, y);
  y += 6;

  if (input.address) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(...FIDARO_TEXT_MUTED);
    doc.text(`${L.address}: ${input.address}`, margin, y);
    y += 4;
  }
  y += 4;

  // ---- Big total + category card ------------------------------------------
  // Card background
  doc.setFillColor(...FIDARO_GREEN_LIGHT);
  doc.roundedRect(margin, y, pageW - margin * 2, 32, 3, 3, "F");

  // Total label
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...FIDARO_GREEN_DARK);
  doc.text(L.totalPoints.toUpperCase(), margin + 6, y + 7);

  // Total value (large)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(36);
  doc.setTextColor(...FIDARO_GREEN_DARK);
  doc.text(String(result.total), margin + 6, y + 25);

  // Category right side
  const catText = L.categories[result.category] || "";
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...FIDARO_GREEN_DARK);
  doc.text(L.category.toUpperCase(), pageW - margin - 6, y + 7, { align: "right" });
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text(catText, pageW - margin - 6, y + 16, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...FIDARO_TEXT_MUTED);
  doc.text(L.distance.toUpperCase(), pageW - margin - 6, y + 23, { align: "right" });
  doc.setFontSize(11);
  doc.setTextColor(...FIDARO_TEXT_DARK);
  doc.setFont("helvetica", "bold");
  const distText = result.distanceTo187 > 0 ? `${result.distanceTo187} pt` : "≥ 187 ✓";
  doc.text(distText, pageW - margin - 6, y + 29, { align: "right" });

  y += 40;

  // ---- Property details ----------------------------------------------------
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(...FIDARO_TEXT_DARK);
  doc.text(L.propertyDetails, margin, y);
  y += 5;

  const NA = lang === "nl" ? "Niet ingevuld" : "Not provided";
  const propRows = [
    [L.address, input.address || NA],
    [L.propertyType, L.propertyTypes[input.property_type] || input.property_type || NA],
    [L.year, input.year ? String(input.year) : NA],
    [L.floorArea, input.usable_floor_area ? String(input.usable_floor_area) : NA],
    [L.energyLabel, input.energy_label && input.energy_label !== "no_label" ? input.energy_label : NA],
    [L.woz, input.woz_value ? formatEuro(input.woz_value) : NA],
    [L.rent, input.current_rent ? formatEuro(input.current_rent) + (lang === "nl" ? " /mnd" : " /mo") : NA],
  ];
  callAutoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [],
    body: propRows,
    theme: "plain",
    styles: { fontSize: 10, cellPadding: 1.5, textColor: FIDARO_TEXT_DARK },
    columnStyles: {
      0: { textColor: FIDARO_TEXT_MUTED, cellWidth: 60 },
      1: { fontStyle: "bold" },
    },
  });
  y = doc.lastAutoTable.finalY + 8;

  // ---- Breakdown table -----------------------------------------------------
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(...FIDARO_TEXT_DARK);
  doc.text(L.breakdown, margin, y);
  y += 4;

  const breakdownRows = Object.entries(result.breakdown)
    .filter(([k]) => k !== "wozUncapped" && k !== "wozCapped")
    .map(([k, v]) => {
      const valStr = (v > 0 ? "+" : "") + String(v);
      return [L.breakdownLabels[k] || k, valStr];
    });
  callAutoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [[L.breakdownCol1, L.breakdownCol2]],
    body: breakdownRows,
    theme: "striped",
    headStyles: {
      fillColor: FIDARO_GREEN,
      textColor: [255, 255, 255],
      fontSize: 10,
    },
    styles: { fontSize: 10, cellPadding: 2.4 },
    alternateRowStyles: { fillColor: [248, 250, 248] },
    columnStyles: { 1: { halign: "right", fontStyle: "bold" } },
  });
  y = doc.lastAutoTable.finalY + 8;

  // ---- Improvement levers --------------------------------------------------
  // Need to lazy-import suggestImprovementLevers to avoid circular ref —
  // but here we only consume `result` and known input flags directly.
  const leverList = buildLevers(input, result, L);
  if (leverList.length) {
    if (y > pageH - 80) {
      doc.addPage();
      y = 20;
    }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(...FIDARO_TEXT_DARK);
    doc.text(L.levers, margin, y);
    y += 5;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...FIDARO_TEXT_DARK);
    leverList.forEach((txt) => {
      const wrapped = doc.splitTextToSize("• " + txt, pageW - margin * 2);
      doc.text(wrapped, margin, y);
      y += wrapped.length * 4.6 + 1.5;
    });
    y += 4;
  }

  // ---- Warnings ------------------------------------------------------------
  const warnList = (result.warnings || []).map((w) => L.warningsMap[w]).filter(Boolean);
  if (result.breakdown.wozCapped) warnList.push(L.warningsMap.woz_capped);
  if (warnList.length) {
    if (y > pageH - 70) {
      doc.addPage();
      y = 20;
    }
    doc.setFillColor(255, 247, 222);
    const blockH = 6 + warnList.length * 6 + 4;
    doc.roundedRect(margin, y, pageW - margin * 2, blockH, 2, 2, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(146, 95, 12);
    doc.text(L.warnings, margin + 4, y + 6);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(120, 80, 10);
    let wy = y + 11;
    warnList.forEach((w) => {
      const wrapped = doc.splitTextToSize("• " + w, pageW - margin * 2 - 6);
      doc.text(wrapped, margin + 4, wy);
      wy += wrapped.length * 4 + 1.5;
    });
    y += blockH + 6;
  }

  // ---- CTA banner ----------------------------------------------------------
  if (y > pageH - 50) {
    doc.addPage();
    y = 20;
  }
  doc.setFillColor(...FIDARO_GREEN);
  doc.roundedRect(margin, y, pageW - margin * 2, 26, 3, 3, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(255, 255, 255);
  doc.text(L.ctaTitle, margin + 6, y + 8);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  const ctaWrapped = doc.splitTextToSize(L.ctaBody, pageW - margin * 2 - 12);
  doc.text(ctaWrapped, margin + 6, y + 14);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text(L.ctaContact, margin + 6, y + 23);
  y += 32;

  // ---- Footer disclaimer (every page) --------------------------------------
  drawFooters(doc, L);

  // Save
  const datePart = new Date().toISOString().slice(0, 10);
  const addrPart = (input.address || "").replace(/[^a-z0-9]+/gi, "-").replace(/^-+|-+$/g, "").slice(0, 40);
  const tail = addrPart || datePart;
  const filename = `Fidaro-WWS-Quickscan-${tail}.pdf`;
  doc.save(filename);
};

const buildLevers = (input, result, L) => {
  const out = [];
  if (result.distanceTo187 > 0) out.push(L.levers.distance(result.distanceTo187));
  const lbl = input.energy_label;
  if (!lbl || ["C", "D", "E", "F", "G", "no_label"].includes(lbl)) {
    out.push(L.levers.energy);
  }
  if (input.no_outdoor_space) out.push(L.levers.no_outdoor);
  if (result.breakdown.wozCapped) out.push(L.levers.woz_capped);
  if (result.total >= 180 && result.total < 187) out.push(L.levers.close_threshold);
  return out;
};

const drawFooters = (doc, L) => {
  const total = doc.internal.getNumberOfPages();
  for (let i = 1; i <= total; i++) {
    doc.setPage(i);
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    // Disclaimer bar
    doc.setFontSize(7.5);
    doc.setTextColor(...FIDARO_SILVER);
    const disc = doc.splitTextToSize(L.disclaimer, pageW - 36);
    const discY = pageH - 16 - (disc.length - 1) * 3;
    doc.text(disc, 18, discY);
    // Page number
    doc.setFontSize(8);
    doc.setTextColor(...FIDARO_TEXT_MUTED);
    doc.text(`${L.pageOf} ${i} ${L.of} ${total}`, pageW - 18, pageH - 8, { align: "right" });
    // Brand
    doc.setFont("helvetica", "bold");
    doc.text("fidaro vastgoed", 18, pageH - 8);
  }
};
