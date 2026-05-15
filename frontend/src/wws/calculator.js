// =============================================================================
// WWS 2025 calculator — pure calculation functions for "zelfstandige woonruimte".
// All point tables come from ./config so this file contains only logic.
// All functions accept a single `input` object and return numbers (or composed
// objects). Empty/undefined fields are treated as 0 to avoid crashes.
// =============================================================================

import {
  ENERGY_LABEL_POINTS,
  CONSTRUCTION_YEAR_POINTS,
  KITCHEN_COUNTERTOP,
  KITCHEN_EXTRAS,
  KITCHEN_CUPBOARD_PER_60CM,
  SANITARY_POINTS,
  BATHROOM_EXTRAS,
  PARKING_SHARED,
  WOZ_FORMULA,
  WOZ_MIN_VALUE,
  ACCESSIBILITY_EUR_PER_POINT,
  FREE_SECTOR_THRESHOLD,
  SOCIAL_RENT_LIMIT,
  OUTDOOR_NONE_PENALTY,
  OUTDOOR_MAX,
  HEATED_OTHER_MAX,
  COOLING_MAX,
} from "./config";

// Round to nearest 0.25 (rounding half-up at exact 0.125 boundaries).
export const round025 = (x) => {
  if (typeof x !== "number" || Number.isNaN(x)) return 0;
  // Multiply by 4, add tiny epsilon for half-up at 0.125 → 0.25 boundary
  const v = Math.floor(x * 4 + 0.5 + 1e-9) / 4;
  return v;
};

const num = (v) => (typeof v === "number" && !Number.isNaN(v) ? v : 0);

// 1. Surface area for primary rooms (1 pt / m²).
export const calculateSurfacePoints = (input) => {
  const total =
    num(input.living_m2) +
    num(input.bed1_m2) +
    num(input.bed2_m2) +
    num(input.bed3_m2) +
    num(input.kitchen_m2) +
    num(input.bathroom_m2) +
    num(input.other_rooms_m2);
  return total * 1;
};

// 2. Other indoor spaces (storage / attic / utility / private garage when
//    counted as indoor space). 0.75 pt / m². To prevent double counting with
//    parking, the private garage is included here ONLY via `garage_indoor_m2`,
//    which the UI exclusively uses for the indoor-counted garage.
export const calculateOtherIndoorSpacePoints = (input) =>
  (num(input.other_indoor_m2) +
    num(input.storage_m2) +
    num(input.garage_indoor_m2)) *
  0.75;

// 3. Heating + cooling.
export const calculateHeatingCoolingPoints = (input) => {
  const heated = num(input.heated_rooms) * 2;
  const heatedOther = Math.min(num(input.heated_other_spaces) * 1, HEATED_OTHER_MAX);
  const cooling = Math.min(num(input.cooled_rooms) * 1, COOLING_MAX);
  return heated + heatedOther + cooling;
};

// Helper: lookup construction-year points
const yearPointsLookup = (year, dwellingKey) => {
  const tbl =
    CONSTRUCTION_YEAR_POINTS[dwellingKey] || CONSTRUCTION_YEAR_POINTS.apartment;
  if (!year || Number.isNaN(year)) return 0;
  for (const r of tbl) {
    const fromOk = r.from === undefined || year >= r.from;
    const toOk = r.to === undefined || year <= r.to;
    if (fromOk && toOk) return r.points;
  }
  return 0;
};

// 4. Energy: prefer valid energy label, otherwise construction year.
//    Monument exception: any negative result is treated as 0.
export const calculateEnergyPoints = (input) => {
  const dwelling =
    input.energy_dwelling_type === "single_family" ? "single_family" : "apartment";
  let pts = 0;
  const lbl = input.energy_label;
  const hasValidLabel = lbl && lbl !== "no_label" && !!input.energy_label_validity_date;
  if (hasValidLabel) {
    pts = ENERGY_LABEL_POINTS[dwelling][lbl] ?? 0;
  } else {
    const year = parseInt(input.year, 10);
    pts = yearPointsLookup(year, dwelling);
  }
  const isMonument = input.monument && input.monument !== "none";
  if (isMonument && pts < 0) return 0;
  return pts;
};

// 5. Kitchen (countertop base + extras, extras capped at base).
export const calculateKitchenPoints = (input) => {
  const base = KITCHEN_COUNTERTOP[input.countertop] ?? 0;
  let extras = 0;
  for (const k of Object.keys(KITCHEN_EXTRAS)) {
    if (input.kitchen_extras && input.kitchen_extras[k]) {
      extras += KITCHEN_EXTRAS[k];
    }
  }
  extras += num(input.extra_cupboards_60cm) * KITCHEN_CUPBOARD_PER_60CM;
  const extrasCapped = Math.min(extras, base);
  return base + extrasCapped;
};

// Returns the bathroom base (and cap for extras): 7 / 6 / 4 / 0.
const bathBase = (input) => {
  if (input.bath_and_shower) return SANITARY_POINTS.bath_and_shower;
  if (input.bath) return SANITARY_POINTS.bath;
  if (input.shower) return SANITARY_POINTS.shower;
  return 0;
};

// 6. Sanitary points (toilets, washbasins, shower/bath base).
export const calculateSanitaryPoints = (input) => {
  let pts = 0;
  if (input.toilet_separate) pts += SANITARY_POINTS.toilet_separate;
  if (input.toilet_in_bathroom) pts += SANITARY_POINTS.toilet_in_bathroom;
  if (input.wallhung_toilet_separate)
    pts += SANITARY_POINTS.wallhung_toilet_separate;
  if (input.wallhung_toilet_bathroom)
    pts += SANITARY_POINTS.wallhung_toilet_bathroom;
  if (input.washbasin) pts += SANITARY_POINTS.washbasin;
  if (input.double_washbasin) pts += SANITARY_POINTS.double_washbasin;
  pts += bathBase(input);
  return pts;
};

// 7. Extra bathroom points (capped at base bathing/shower points).
export const calculateExtraBathroomPoints = (input) => {
  const cap = bathBase(input);
  if (cap === 0) return 0;
  let extras = 0;
  for (const k of Object.keys(BATHROOM_EXTRAS)) {
    if (input.bathroom_extras && input.bathroom_extras[k]) {
      extras += BATHROOM_EXTRAS[k];
    }
  }
  return Math.min(extras, cap);
};

// 8. Accessibility (1 point per €332 spent on qualifying disability adaptations).
export const calculateAccessibilityPoints = (input) =>
  num(input.accessibility_amount) / ACCESSIBILITY_EUR_PER_POINT;

// 9. Outdoor space (private + shared, capped at 15; -5 if none).
export const calculateOutdoorSpacePoints = (input) => {
  if (input.no_outdoor_space) return OUTDOOR_NONE_PENALTY;
  let pts = 0;
  const priv = num(input.private_outdoor_m2);
  if (priv > 0) pts += 2 + priv * 0.35;
  const shared = num(input.shared_outdoor_m2);
  const sharedAddrs = num(input.shared_outdoor_addresses);
  if (shared > 0 && sharedAddrs > 0) {
    pts += (shared * 0.75) / sharedAddrs;
  }
  return Math.min(pts, OUTDOOR_MAX);
};

// 10. Shared indoor spaces.
export const calculateSharedSpacePoints = (input) => {
  const n = num(input.shared_indoor_addresses);
  if (n <= 0) return 0;
  let pts = 0;
  if (input.shared_indoor_room_m2) pts += (num(input.shared_indoor_room_m2) * 1) / n;
  if (input.shared_other_indoor_m2)
    pts += (num(input.shared_other_indoor_m2) * 0.75) / n;
  return pts;
};

// 11. Shared parking + charging point. (Private garage is counted as
//     "other indoor space" via garage_indoor_m2 to avoid double counting.)
export const calculateParkingPoints = (input) => {
  const n = Math.max(num(input.shared_parking_addresses), 1);
  let pts = 0;
  if (input.shared_parking === "closed_garage")
    pts += PARKING_SHARED.closed_garage / n;
  else if (input.shared_parking === "covered")
    pts += PARKING_SHARED.covered / n;
  else if (input.shared_parking === "uncovered")
    pts += PARKING_SHARED.uncovered / n;
  if (input.charging_point) pts += PARKING_SHARED.charging_point / n;
  return pts;
};

// 12. WOZ uncapped points.
export const calculateUncappedWOZPoints = (input) => {
  if (!input.woz_value) return 0;
  const date = input.woz_date || "2023-01-01";
  const f = WOZ_FORMULA[date] || WOZ_FORMULA["2023-01-01"];
  const woz = Math.max(num(input.woz_value), WOZ_MIN_VALUE);
  const area = Math.max(num(input.usable_floor_area), 1); // avoid /0
  return woz / f.value_divisor + woz / area / f.density_divisor;
};

// WOZ cap (33% of total → ≈49.25% of nonWOZ as upper bound on WOZ itself).
// NOTE: WOZ cap exceptions and special cases require manual review.
export const applyWOZCap = (uncappedWOZ, nonWOZPoints) => {
  if (nonWOZPoints <= 0) return { capped: 0, wasCapped: uncappedWOZ > 0 };
  const max = nonWOZPoints * 0.492537;
  const capped = Math.min(uncappedWOZ, max);
  return { capped, wasCapped: uncappedWOZ > max };
};

// Defect risk indicator (passes through).
export const calculateDefectRisk = (input) => input.defects || "none";

// ----- Aggregator ------------------------------------------------------------
export const calculateTotalWWS = (input) => {
  const surface = calculateSurfacePoints(input);
  const otherIndoor = calculateOtherIndoorSpacePoints(input);
  const heating = calculateHeatingCoolingPoints(input);
  const energy = calculateEnergyPoints(input);
  const kitchen = calculateKitchenPoints(input);
  const sanitary = calculateSanitaryPoints(input);
  const extraBath = calculateExtraBathroomPoints(input);
  const accessibility = calculateAccessibilityPoints(input);
  const outdoor = calculateOutdoorSpacePoints(input);
  const sharedSpace = calculateSharedSpacePoints(input);
  const parking = calculateParkingPoints(input);

  const nonWOZ =
    surface +
    otherIndoor +
    heating +
    energy +
    kitchen +
    sanitary +
    extraBath +
    accessibility +
    outdoor +
    sharedSpace +
    parking;

  const uncappedWOZ = calculateUncappedWOZPoints(input);
  const { capped: wozPts, wasCapped } = applyWOZCap(uncappedWOZ, nonWOZ);
  const total = nonWOZ + wozPts;

  return {
    breakdown: {
      surface: round025(surface),
      otherIndoor: round025(otherIndoor),
      heating: round025(heating),
      energy: round025(energy),
      kitchen: round025(kitchen),
      sanitary: round025(sanitary),
      extraBathroom: round025(extraBath),
      accessibility: round025(accessibility),
      outdoor: round025(outdoor),
      sharedSpace: round025(sharedSpace),
      parking: round025(parking),
      woz: round025(wozPts),
      wozUncapped: round025(uncappedWOZ),
      wozCapped: wasCapped,
    },
    total: round025(total),
    distanceTo187: round025(FREE_SECTOR_THRESHOLD - total),
    defectRisk: calculateDefectRisk(input),
    warnings: collectWarnings(input),
  };
};

// Determine indicative rent category based on the total.
export const determineRentCategory = (total) => {
  if (total < SOCIAL_RENT_LIMIT) return "social";
  if (total < FREE_SECTOR_THRESHOLD) return "middle";
  return "free";
};

// ----- Improvement levers ----------------------------------------------------
export const suggestImprovementLevers = (input, result) => {
  const levers = [];
  const total = result.total;
  if (total < FREE_SECTOR_THRESHOLD) {
    levers.push({ key: "distance", value: result.distanceTo187 });
  }
  const lbl = input.energy_label;
  if (!lbl || ["C", "D", "E", "F", "G", "no_label"].includes(lbl)) {
    levers.push({ key: "energy" });
  }
  const ctop = KITCHEN_COUNTERTOP[input.countertop] ?? 0;
  if (ctop > 0 && result.breakdown.kitchen < ctop * 1.5) {
    levers.push({ key: "kitchen" });
  }
  const bcap = bathBase(input);
  if (bcap > 0 && result.breakdown.extraBathroom < bcap * 0.5) {
    levers.push({ key: "bathroom" });
  }
  if (input.no_outdoor_space) levers.push({ key: "no_outdoor" });
  if (result.breakdown.wozCapped) levers.push({ key: "woz_capped" });
  if (total >= 180 && total < FREE_SECTOR_THRESHOLD) {
    levers.push({ key: "close_threshold" });
  }
  return levers;
};

// ----- Validation / warnings -------------------------------------------------
const collectWarnings = (input) => {
  const w = [];
  if (input.defects === "serious") w.push("serious_defects");
  if (!input.energy_label || input.energy_label === "no_label") w.push("no_label");
  if (!input.woz_value) w.push("no_woz");
  if (!input.year) w.push("no_year");
  if (!input.usable_floor_area) w.push("no_floor_area");
  return w;
};
