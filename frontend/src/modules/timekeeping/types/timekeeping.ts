export type TimekeepingViewMode = "konark" | "modern" | "compare";

export type CalculationStatus =
  "idle" | "loading" | "calculated" | "illustrative" | "unavailable" | "error";

export interface LocationPreset {
  id: string;
  name: string;
  hindiName: string;
  latitude: number;
  longitude: number;
  elevation_m: number;
  timezone: string;
  description: string;
}

export interface SolarCalculatedData {
  altitude_deg: number;
  altitude_refracted_deg: number;
  azimuth_deg: number;
  distance_au: number;
  distance_km: number;
  is_sun_up: boolean;
  sunrise_local: string | null;
  sunset_local: string | null;
  solar_noon_local: string | null;
  day_length_hours: number | null;
  equation_of_time_min: number;
  local_mean_solar_time: string;
  local_apparent_solar_time: string;
  solar_declination_deg: number;
  solar_right_ascension_deg: number;
  hour_angle_deg: number;
  prahar_index: number; // 1 to 8
  prahar_name: string;
  prahar_hindi: string;
  ghati_elapsed: number; // 0 to 60
  pala_elapsed: number; // 0 to 60
  source: "backend" | "illustrative";
  method_name: string;
  conventions?: Record<string, string>;
  assumptions: string[];
}

export interface CalculationInfoMetric {
  key: string;
  title: string;
  hindiTitle?: string;
  plainSummary: string;
  formula: string;
  steps: string[];
  units: string;
  assumptions: string[];
  limitations: string[];
  source: string;
}

export interface EducationalHotspot {
  id: string;
  title: string;
  hindiTitle: string;
  subtitle: string;
  description: string;
  historicalContext: string;
  timekeepingRole: string;
  position: [number, number, number];
}
