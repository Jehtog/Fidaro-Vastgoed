// =============================================================================
// WWS 2025 — Point tables and configuration for "zelfstandige woonruimte".
// All values are kept in this single config so that future updates (e.g. WWS
// 2026) only require changes here, not in calculator logic or UI.
// NOTE: This is an INDICATIVE engine. Final scores require Huurcommissie review.
// =============================================================================

// ----- Energy label points (when a valid label is present) -------------------
export const ENERGY_LABEL_POINTS = {
  single_family: {
    "A++++": 62,
    "A+++": 57,
    "A++": 52,
    "A+": 47,
    A: 41,
    B: 34,
    C: 22,
    D: 14,
    E: -4,
    F: -9,
    G: -15,
  },
  apartment: {
    "A++++": 58,
    "A+++": 53,
    "A++": 48,
    "A+": 43,
    A: 37,
    B: 30,
    C: 15,
    D: 11,
    E: -4,
    F: -9,
    G: -15,
  },
};

// ----- Construction-year fallback table (used when no valid energy label) ----
// Each entry is matched in order; first match wins.
export const CONSTRUCTION_YEAR_POINTS = {
  single_family: [
    { from: 2002, points: 41 },
    { from: 2000, to: 2001, points: 34 },
    { from: 1992, to: 1999, points: 22 },
    { from: 1984, to: 1991, points: 14 },
    { from: 1979, to: 1983, points: -4 },
    { from: 1977, to: 1978, points: -9 },
    { to: 1976, points: -15 },
  ],
  apartment: [
    { from: 2002, points: 37 },
    { from: 2000, to: 2001, points: 30 },
    { from: 1992, to: 1999, points: 15 },
    { from: 1984, to: 1991, points: 11 },
    { from: 1979, to: 1983, points: -4 },
    { from: 1977, to: 1978, points: -9 },
    { to: 1976, points: -15 },
  ],
};

// ----- Kitchen ---------------------------------------------------------------
export const KITCHEN_COUNTERTOP = {
  "<1m": 0,
  "1-2m": 4,
  ">=2m": 7,
};

// Built-in kitchen items (each toggleable). Cupboard space is handled per unit.
export const KITCHEN_EXTRAS = {
  builtin_extractor: 0.75,
  builtin_induction: 1.75,
  builtin_ceramic: 1,
  builtin_gas_hob: 0.5,
  builtin_fridge: 1,
  builtin_freezer: 0.75,
  builtin_electric_oven: 1,
  builtin_gas_oven: 0.5,
  builtin_microwave: 1,
  builtin_dishwasher: 1.5,
  single_lever_tap: 0.25,
  thermostatic_tap: 0.5,
  boiling_water: 0.5,
};
export const KITCHEN_CUPBOARD_PER_60CM = 0.75;

// ----- Sanitary base points --------------------------------------------------
export const SANITARY_POINTS = {
  toilet_separate: 3,
  toilet_in_bathroom: 2,
  wallhung_toilet_separate: 3.75,
  wallhung_toilet_bathroom: 2.75,
  washbasin: 1,
  double_washbasin: 1.5,
  // bath/shower base values are determined dynamically (see calculator)
  shower: 4,
  bath: 6,
  bath_and_shower: 7,
};

// ----- Bathroom extras (capped at base bath/shower points) -------------------
export const BATHROOM_EXTRAS = {
  bubble_bath: 1.5,
  shower_screen: 1.25,
  towel_radiator: 0.75,
  cabinet_with_basin: 1,
  bathroom_cupboard: 0.75,
  bathroom_socket: 0.25,
  single_lever_tap: 0.25,
  thermostatic_tap: 0.5,
};

// ----- Shared parking -------------------------------------------------------
export const PARKING_SHARED = {
  closed_garage: 9,
  covered: 6,
  uncovered: 4,
  charging_point: 2,
};

// ----- WOZ formula by reference date -----------------------------------------
export const WOZ_FORMULA = {
  "2023-01-01": { value_divisor: 14543, density_divisor: 229 },
  "2022-01-01": { value_divisor: 14146, density_divisor: 222 },
};
export const WOZ_MIN_VALUE = 73607;

// ----- Misc ------------------------------------------------------------------
export const ACCESSIBILITY_EUR_PER_POINT = 332;
export const FREE_SECTOR_THRESHOLD = 187;
export const SOCIAL_RENT_LIMIT = 144;
export const OUTDOOR_NONE_PENALTY = -5;
export const OUTDOOR_MAX = 15;
export const HEATED_OTHER_MAX = 4;
export const COOLING_MAX = 2;
