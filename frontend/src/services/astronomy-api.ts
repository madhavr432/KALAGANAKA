/**
 * KalaGanaka - Astronomy & Solar API Client
 * Interfaces with the FastAPI backend for solar position, solar events, and traditional calculations.
 */

export interface SolarObserver {
  latitude: number;
  longitude: number;
  elevation_m: number;
  timezone?: string;
}

export interface SolarPositionResponse {
  instant: string;
  observer: SolarObserver;
  altitude_deg: number;
  altitude_refracted_deg: number;
  azimuth_deg: number;
  distance_au: number;
  distance_km: number;
  is_sun_up: boolean;
  conventions?: {
    altitude_convention?: string;
    azimuth_convention?: string;
    refraction_model?: string;
  };
}

export interface SolarEventItem {
  time_local: string | null;
  time_utc: string | null;
  available: boolean;
  reason: string | null;
}

export interface SolarEventsResponse {
  date: string;
  observer: SolarObserver;
  sunrise: SolarEventItem;
  sunset: SolarEventItem;
  solar_noon: SolarEventItem;
  day_length_hours: number | null;
  conventions?: Record<string, string>;
  assumptions?: string[];
}

export interface TraditionalSolarResponse {
  body: string;
  date: string;
  longitude_deg: number;
  calculation_type: string;
  is_true_longitude: boolean;
  reference_date: string;
  reference_location: string;
  source: string;
  limitations: string[];
}

export interface ComparisonItem {
  body: string;
  traditional_deg: number;
  modern_deg: number;
  difference_deg: number;
  wrapped_difference_deg: number;
  magnitude_deg: number;
}

export interface SolarComparisonResult {
  planet: string;
  traditional_longitude_deg: number;
  modern_longitude_deg: number;
  signed_difference_deg: number;
  absolute_difference_deg: number;
}

export interface SolarComparisonResponse {
  status: string;
  is_mock: boolean;
  traditional_method: string;
  modern_method: string;
  modern_data_source: string;
  coordinate_system: string;
  instant: string;
  compared_planets: string[];
  unmatched_traditional_planets: string[];
  unmatched_modern_planets: string[];
  results: SolarComparisonResult[];
  chart_data?: Array<{
    planet: string;
    traditional_longitude_deg: number;
    modern_longitude_deg: number;
    absolute_difference_deg: number;
  }>;
  limitations: string[];
  comparison_basis?: Record<string, unknown>;
}

export interface SolarTimeSeriesPoint {
  date: string;
  traditional_longitude_deg: number;
  modern_longitude_deg: number;
  signed_difference_deg: number;
  absolute_difference_deg: number;
  units: string;
}

export interface SolarTimeSeriesResponse {
  status: string;
  start_date: string;
  end_date: string;
  total_points: number;
  time_series: SolarTimeSeriesPoint[];
  summary_statistics: {
    mean_absolute_difference_deg: number;
    max_absolute_difference_deg: number;
    min_absolute_difference_deg: number;
    std_deviation_deg: number;
  };
  traditional_method: string;
  modern_method: string;
  units: string;
  limitations: string[];
}

export interface ComparisonResponse {
  traditional_method: string;
  modern_method: string;
  coordinate_system: string;
  instant: string | null;
  comparisons: ComparisonItem[];
  mean_absolute_difference_deg: number;
  max_absolute_difference_deg: number;
}

export interface ModernPlanetsResponse {
  instant: string;
  julian_date_tt: number;
  ayanamsha_name: string;
  ayanamsha_deg: number;
  planets?: Array<{
    name: string;
    tropical_longitude_deg: number;
    sidereal_longitude_deg: number;
    latitude_deg: number;
    distance_au: number;
    distance_km: number;
  }>;
  positions_tropical_deg: Record<string, number>;
  positions_sidereal_deg: Record<string, number>;
  ephemeris?: string;
  reference_frame?: string;
  coordinate_system?: string;
  units?: Record<string, string>;
  assumptions?: string[];
}

export interface TithiItem {
  index: number;
  name: string;
  paksha: "Shukla" | "Krishna";
  tithi_in_paksha: number;
  angular_separation_deg: number;
  elapsed_deg_in_tithi: number;
  fraction_elapsed: number;
  boundary_convention?: string;
}

export interface NakshatraItem {
  index: number;
  name: string;
  sidereal_longitude_deg: number;
  elapsed_deg_in_nakshatra: number;
  fraction_elapsed: number;
  sector_span_deg: number;
  boundary_convention?: string;
}

export interface YogaItem {
  index: number;
  name: string;
  combined_longitude_deg: number;
  elapsed_deg_in_yoga: number;
  fraction_elapsed: number;
  sector_span_deg: number;
  boundary_convention?: string;
}

export interface KaranaItem {
  half_tithi_index: number;
  name: string;
  canonical_name: string;
  display_name: string;
  alias?: string | null;
  karana_type: string;
  angular_separation_deg: number;
  elapsed_deg_in_karana: number;
  fraction_elapsed: number;
  boundary_convention?: string;
}

export interface PanchangInstantResponse {
  instant_requested: string;
  instant_local: string;
  instant_utc: string;
  julian_date_tt: number;
  ayanamsha_deg: number;
  sun_sidereal_longitude_deg: number;
  moon_sidereal_longitude_deg: number;
  sun_tropical_longitude_deg: number;
  moon_tropical_longitude_deg: number;
  tithi: TithiItem;
  nakshatra: NakshatraItem;
  yoga: YogaItem;
  karana: KaranaItem;
  longitude_conventions?: {
    tithi_and_karana?: string;
    nakshatra?: string;
    yoga?: string;
    ayanamsha?: string;
    tithi_principle?: string;
  };
  metadata?: {
    ephemeris?: string;
    ayanamsha?: string;
    reference_frame?: string;
    precision_seconds?: number;
    assumptions?: string[];
  };
}

export interface AngaTransitionInfo {
  anga_type: string;
  boundary_deg: number;
  transition_time_utc: string;
  transition_time_local: string;
  from_index: number;
  from_name: string;
  to_index: number;
  to_name: string;
  confirmed_change: boolean;
  precision_achieved_seconds?: number;
}

export interface NextTransitionResponse {
  instant_requested: string;
  instant_local: string;
  instant_utc: string;
  anga_type: string;
  current_anga: Record<string, unknown>;
  next_transition: AngaTransitionInfo;
  seconds_remaining: number;
  hours_remaining: number;
  metadata?: Record<string, unknown>;
}

export interface TransitionsIntervalResponse {
  start_utc: string;
  end_utc: string;
  start_local: string;
  end_local: string;
  anga_types_requested: string[];
  total_transitions: number;
  transitions: AngaTransitionInfo[];
  metadata?: Record<string, unknown>;
}

export interface FestivalRule {
  id: string;
  name: string;
  names?: {
    english?: string;
    hindi?: string;
  };
  rule_type: string;
  rule: {
    lunar_month?: string;
    paksha?: string;
    tithi?: string;
    solar_month?: string;
    notes?: string;
  };
  region?: string;
  notes?: string;
  source?: string | null;
  verification_status?: string;
}

export interface FestivalsResponse {
  dataset_version: string;
  verification_status: string;
  count: number;
  festivals: FestivalRule[];
  notice?: string;
}

export interface FestivalDetailResponse {
  dataset_version: string;
  festival: FestivalRule;
}

export interface AssistantChatResponse {
  answer: string;
  model: string;
  provider: string;
  fallback_used: boolean;
}

export interface DailyPanchangRequest {
  date: string;
  latitude: number;
  longitude: number;
  elevation_m?: number;
  timezone?: string;
}

export interface DailyPanchangResponse {
  date: string;
  observer: SolarObserver;
  sunrise: {
    time_utc: string | null;
    time_local: string | null;
    available: boolean;
    reason: string | null;
  };
  vara: {
    index: number;
    name_english: string;
    name_sanskrit: string;
    ruling_planet: string;
    deity?: string;
  };
  panchang: PanchangInstantResponse | null;
  status: string;
  message?: string | null;
}

export class AstronomyApiError extends Error {
  public status?: number;
  public details?: unknown;

  constructor(message: string, status?: number, details?: unknown) {
    super(message);
    this.name = "AstronomyApiError";
    this.status = status;
    this.details = details;
  }
}

const getBaseUrl = (): string => {
  // Support both client and SSR environments
  const envUrl =
    typeof import.meta !== "undefined" && import.meta.env?.VITE_API_BASE_URL
      ? String(import.meta.env.VITE_API_BASE_URL)
      : "http://127.0.0.1:8000";
  return envUrl.replace(/\/+$/, "");
};

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = `API request failed with status ${response.status}`;
    let errorDetails: unknown = null;
    try {
      const errorJson = await response.json();
      errorDetails = errorJson;
      if (typeof errorJson.detail === "string") {
        errorMessage = errorJson.detail;
      } else if (Array.isArray(errorJson.detail)) {
        errorMessage = errorJson.detail
          .map((err: { msg?: string; loc?: string[] }) => err.msg || JSON.stringify(err))
          .join("; ");
      } else if (errorJson.message) {
        errorMessage = String(errorJson.message);
      }
    } catch {
      // Non-JSON error body (e.g. 502 Bad Gateway)
      const text = await response.text().catch(() => "");
      if (text) {
        errorMessage = `${errorMessage}: ${text.slice(0, 150)}`;
      }
    }
    throw new AstronomyApiError(errorMessage, response.status, errorDetails);
  }
  return response.json() as Promise<T>;
}

/**
 * Fetch topocentric apparent solar altitude and azimuth.
 */
export async function fetchSolarPosition(params: {
  instant: string; // ISO-8601 with tz offset
  latitude: number;
  longitude: number;
  elevation_m?: number;
}): Promise<SolarPositionResponse> {
  const baseUrl = getBaseUrl();
  const queryParams = new URLSearchParams({
    instant: params.instant,
    latitude: params.latitude.toString(),
    longitude: params.longitude.toString(),
    elevation_m: (params.elevation_m ?? 0).toString(),
  });

  try {
    const res = await fetch(`${baseUrl}/solar/position?${queryParams.toString()}`, {
      method: "GET",
      headers: { Accept: "application/json" },
    });
    return await handleResponse<SolarPositionResponse>(res);
  } catch (error) {
    if (error instanceof AstronomyApiError) throw error;
    throw new AstronomyApiError(
      `Unable to reach KalaGanaka backend server at ${baseUrl}. Ensure backend is running.`,
      0,
      error,
    );
  }
}

/**
 * Fetch civil/astronomical sunrise, sunset, and solar noon for a given date and location.
 */
export async function fetchSolarEvents(params: {
  date: string; // YYYY-MM-DD
  latitude: number;
  longitude: number;
  elevation_m?: number;
  timezone?: string;
}): Promise<SolarEventsResponse> {
  const baseUrl = getBaseUrl();
  const queryParams = new URLSearchParams({
    date: params.date,
    latitude: params.latitude.toString(),
    longitude: params.longitude.toString(),
    elevation_m: (params.elevation_m ?? 0).toString(),
    timezone: params.timezone ?? "Asia/Kolkata",
  });

  try {
    const res = await fetch(`${baseUrl}/solar/events?${queryParams.toString()}`, {
      method: "GET",
      headers: { Accept: "application/json" },
    });
    return await handleResponse<SolarEventsResponse>(res);
  } catch (error) {
    if (error instanceof AstronomyApiError) throw error;
    throw new AstronomyApiError(
      `Unable to reach KalaGanaka backend server at ${baseUrl}. Ensure backend is running.`,
      0,
      error,
    );
  }
}

/**
 * Fetch traditional Surya Siddhanta preliminary mean solar position for date.
 */
export async function fetchTraditionalSolarPosition(
  date: string,
): Promise<TraditionalSolarResponse> {
  const baseUrl = getBaseUrl();
  const queryParams = new URLSearchParams({ date });

  try {
    const res = await fetch(`${baseUrl}/traditional/solar-position?${queryParams.toString()}`, {
      method: "GET",
      headers: { Accept: "application/json" },
    });
    return await handleResponse<TraditionalSolarResponse>(res);
  } catch (error) {
    if (error instanceof AstronomyApiError) throw error;
    throw new AstronomyApiError(
      `Unable to reach KalaGanaka backend server at ${baseUrl}. Ensure backend is running.`,
      0,
      error,
    );
  }
}

/**
 * Fetch modern apparent planetary positions from JPL DE421 ephemeris.
 */
export async function fetchModernPlanets(instant: string): Promise<ModernPlanetsResponse> {
  const baseUrl = getBaseUrl();
  const queryParams = new URLSearchParams({ instant });

  try {
    const res = await fetch(`${baseUrl}/astronomy/planets?${queryParams.toString()}`, {
      method: "GET",
      headers: { Accept: "application/json" },
    });
    return await handleResponse<ModernPlanetsResponse>(res);
  } catch (error) {
    if (error instanceof AstronomyApiError) throw error;
    throw new AstronomyApiError(
      `Unable to reach KalaGanaka backend server at ${baseUrl}. Ensure backend is running.`,
      0,
      error,
    );
  }
}

/**
 * Compare traditional and modern planetary longitudes via the comparison endpoint.
 */
export async function comparePlanetaryPositions(payload: {
  traditional_positions: Record<string, number>;
  modern_positions: Record<string, number>;
  traditional_method: string;
  modern_method: string;
  modern_data_source?: "mock" | "provider";
  coordinate_system?: string;
  instant?: string;
}): Promise<ComparisonResponse> {
  const baseUrl = getBaseUrl();

  try {
    const res = await fetch(`${baseUrl}/comparison/compare`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });
    return await handleResponse<ComparisonResponse>(res);
  } catch (error) {
    if (error instanceof AstronomyApiError) throw error;
    throw new AstronomyApiError(
      `Unable to compare positions via ${baseUrl}/comparison/compare.`,
      0,
      error,
    );
  }
}

/**
 * Compare preliminary traditional mean solar longitude with modern DE421 sidereal longitude.
 */
export async function fetchSolarComparison(date: string): Promise<SolarComparisonResponse> {
  const baseUrl = getBaseUrl();
  const queryParams = new URLSearchParams({ date });

  try {
    const res = await fetch(`${baseUrl}/comparison/solar?${queryParams.toString()}`, {
      method: "GET",
      headers: { Accept: "application/json" },
    });
    return await handleResponse<SolarComparisonResponse>(res);
  } catch (error) {
    if (error instanceof AstronomyApiError) throw error;
    throw new AstronomyApiError(
      `Unable to fetch solar comparison from ${baseUrl}/comparison/solar.`,
      0,
      error,
    );
  }
}

/**
 * Fetch comparative time-series between traditional and modern solar longitudes over N days.
 */
export async function fetchSolarTimeSeries(params: {
  start_date: string;
  days?: number;
  step_days?: number;
}): Promise<SolarTimeSeriesResponse> {
  const baseUrl = getBaseUrl();
  const queryParams = new URLSearchParams({
    start_date: params.start_date,
    days: String(params.days ?? 14),
    step_days: String(params.step_days ?? 1),
  });

  try {
    const res = await fetch(`${baseUrl}/comparison/solar-time-series?${queryParams.toString()}`, {
      method: "GET",
      headers: { Accept: "application/json" },
    });
    return await handleResponse<SolarTimeSeriesResponse>(res);
  } catch (error) {
    if (error instanceof AstronomyApiError) throw error;
    throw new AstronomyApiError(
      `Unable to fetch solar time series comparison from ${baseUrl}.`,
      0,
      error,
    );
  }
}

/**
 * Fetch instantaneous Panchang Angas (Tithi, Nakshatra, Yoga, Karana).
 */
export async function fetchDailyPanchang(
  payload: DailyPanchangRequest,
): Promise<DailyPanchangResponse> {
  const baseUrl = getBaseUrl();
  try {
    const res = await fetch(`${baseUrl}/panchang/daily`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        date: payload.date,
        latitude: payload.latitude,
        longitude: payload.longitude,
        elevation_m: payload.elevation_m ?? 0.0,
        timezone: payload.timezone ?? "Asia/Kolkata",
      }),
    });
    return await handleResponse<DailyPanchangResponse>(res);
  } catch (error) {
    if (error instanceof AstronomyApiError) throw error;
    throw new AstronomyApiError(
      `Unable to fetch daily Panchang from ${baseUrl}. Ensure backend is running.`,
      0,
      error,
    );
  }
}

/**
 * Fetch instantaneous Panchang Angas (Tithi, Nakshatra, Yoga, Karana).
 */
export async function fetchPanchangInstant(params: {
  instant: string;
  timezone?: string;
}): Promise<PanchangInstantResponse> {
  const baseUrl = getBaseUrl();
  const queryParams = new URLSearchParams({
    instant: params.instant,
    timezone: params.timezone ?? "Asia/Kolkata",
  });

  try {
    const res = await fetch(`${baseUrl}/panchang/instant?${queryParams.toString()}`, {
      method: "GET",
      headers: { Accept: "application/json" },
    });
    return await handleResponse<PanchangInstantResponse>(res);
  } catch (error) {
    if (error instanceof AstronomyApiError) throw error;
    throw new AstronomyApiError(
      `Unable to fetch instantaneous Panchang from ${baseUrl}. Ensure backend is running.`,
      0,
      error,
    );
  }
}

/**
 * Fetch the next boundary transition for a specific Panchang Anga.
 */
export async function fetchNextTransition(params: {
  instant: string;
  anga_type: "tithi" | "nakshatra" | "yoga" | "karana";
  timezone?: string;
}): Promise<NextTransitionResponse> {
  const baseUrl = getBaseUrl();
  const queryParams = new URLSearchParams({
    instant: params.instant,
    anga_type: params.anga_type,
    timezone: params.timezone ?? "Asia/Kolkata",
  });

  try {
    const res = await fetch(`${baseUrl}/panchang/next-transition?${queryParams.toString()}`, {
      method: "GET",
      headers: { Accept: "application/json" },
    });
    return await handleResponse<NextTransitionResponse>(res);
  } catch (error) {
    if (error instanceof AstronomyApiError) throw error;
    throw new AstronomyApiError(
      `Unable to fetch next ${params.anga_type} transition from ${baseUrl}.`,
      0,
      error,
    );
  }
}

/**
 * Fetch all Panchang transitions over a time interval (up to 35 days).
 */
export async function fetchTransitionsInterval(params: {
  start: string;
  end: string;
  anga_types?: string[];
  timezone?: string;
  limit?: number;
}): Promise<TransitionsIntervalResponse> {
  const baseUrl = getBaseUrl();
  const payload: Record<string, unknown> = {
    start: params.start,
    end: params.end,
    timezone: params.timezone ?? "Asia/Kolkata",
  };
  if (params.anga_types) payload.anga_types = params.anga_types;
  if (params.limit) payload.limit = params.limit;

  try {
    const res = await fetch(`${baseUrl}/panchang/transitions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });
    return await handleResponse<TransitionsIntervalResponse>(res);
  } catch (error) {
    if (error instanceof AstronomyApiError) throw error;
    throw new AstronomyApiError(`Unable to fetch transitions interval from ${baseUrl}.`, 0, error);
  }
}

/**
 * Fetch festival rules, optionally filtered by region.
 */
export async function fetchFestivals(region?: string): Promise<FestivalsResponse> {
  const baseUrl = getBaseUrl();
  const queryParams = new URLSearchParams();
  if (region) queryParams.set("region", region);

  const url = queryParams.toString()
    ? `${baseUrl}/festivals?${queryParams.toString()}`
    : `${baseUrl}/festivals`;

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: { Accept: "application/json" },
    });
    return await handleResponse<FestivalsResponse>(res);
  } catch (error) {
    if (error instanceof AstronomyApiError) throw error;
    throw new AstronomyApiError(`Unable to fetch festivals list from ${baseUrl}.`, 0, error);
  }
}

/**
 * Fetch single festival rule by ID.
 */
export async function fetchFestivalDetail(festivalId: string): Promise<FestivalDetailResponse> {
  const baseUrl = getBaseUrl();
  try {
    const res = await fetch(`${baseUrl}/festivals/${encodeURIComponent(festivalId)}`, {
      method: "GET",
      headers: { Accept: "application/json" },
    });
    return await handleResponse<FestivalDetailResponse>(res);
  } catch (error) {
    if (error instanceof AstronomyApiError) throw error;
    throw new AstronomyApiError(
      `Unable to fetch festival '${festivalId}' from ${baseUrl}.`,
      0,
      error,
    );
  }
}

/**
 * Submit chat question to KalaGanaka AI Assistant.
 */
export async function fetchAssistantChat(params: {
  question: string;
  language?: "auto" | "english" | "hindi";
}): Promise<AssistantChatResponse> {
  const baseUrl = getBaseUrl();
  try {
    const res = await fetch(`${baseUrl}/assistant/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        question: params.question,
        language: params.language ?? "auto",
      }),
    });
    return await handleResponse<AssistantChatResponse>(res);
  } catch (error) {
    if (error instanceof AstronomyApiError) throw error;
    throw new AstronomyApiError(`Unable to reach KalaGanaka Assistant at ${baseUrl}.`, 0, error);
  }
}

/**
 * Health check endpoint.
 */
export async function checkBackendHealth(): Promise<boolean> {
  const baseUrl = getBaseUrl();
  try {
    const res = await fetch(`${baseUrl}/health`, {
      method: "GET",
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(3000),
    });
    return res.ok;
  } catch {
    return false;
  }
}
