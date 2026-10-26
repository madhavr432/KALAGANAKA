"""Pydantic schemas for solar events and solar position API."""

from pydantic import BaseModel, ConfigDict, Field


class ObserverLocation(BaseModel):
    """Geographic observer location and timezone."""

    model_config = ConfigDict(extra="forbid")

    latitude: float = Field(
        description="Observer latitude in degrees [-90.0, +90.0].",
        ge=-90.0,
        le=90.0,
    )
    longitude: float = Field(
        description="Observer longitude in degrees [-180.0, +180.0].",
        ge=-180.0,
        le=180.0,
    )
    elevation_m: float = Field(
        default=0.0,
        description="Observer elevation in meters above sea level [-500.0, 12000.0].",
        ge=-500.0,
        le=12000.0,
    )
    timezone: str = Field(
        default="UTC",
        description="Observer timezone (IANA name e.g. 'Asia/Kolkata' or offset e.g. '+05:30').",
        min_length=1,
    )


class SolarEventResult(BaseModel):
    """Details for a single solar event (sunrise, sunset, or solar noon)."""

    model_config = ConfigDict(extra="forbid")

    time_local: str | None = Field(
        default=None,
        description="Local ISO-8601 timestamp with observer timezone offset, or None if unavailable.",
    )
    time_utc: str | None = Field(
        default=None,
        description="UTC ISO-8601 timestamp string, or None if unavailable.",
    )
    available: bool = Field(
        description="True if the event occurs within the requested local calendar day.",
    )
    reason: str | None = Field(
        default=None,
        description="Explanation if the event is unavailable (e.g. Polar Day or Polar Night).",
    )


class SolarEventsRequest(BaseModel):
    """Request payload for solar events on a local date."""

    model_config = ConfigDict(extra="forbid")

    date: str = Field(
        description="Local Gregorian calendar date in 'YYYY-MM-DD' format.",
        min_length=10,
        max_length=10,
    )
    latitude: float = Field(
        description="Observer latitude in degrees [-90.0, +90.0].",
        ge=-90.0,
        le=90.0,
    )
    longitude: float = Field(
        description="Observer longitude in degrees [-180.0, +180.0].",
        ge=-180.0,
        le=180.0,
    )
    elevation_m: float = Field(
        default=0.0,
        description="Observer elevation in meters above sea level [-500.0, 12000.0].",
        ge=-500.0,
        le=12000.0,
    )
    timezone: str = Field(
        default="UTC",
        description="Observer timezone (IANA name e.g. 'Asia/Kolkata' or offset e.g. '+05:30').",
        min_length=1,
    )


class SolarEventsResponse(BaseModel):
    """Response schema for sunrise, sunset, and solar noon calculations."""

    model_config = ConfigDict(extra="forbid")

    date: str = Field(description="Requested local calendar date in 'YYYY-MM-DD' format.")
    observer: ObserverLocation = Field(description="Observer geographic coordinates and timezone.")
    sunrise: SolarEventResult = Field(description="Sunrise event details.")
    sunset: SolarEventResult = Field(description="Sunset event details.")
    solar_noon: SolarEventResult = Field(description="Solar noon (upper meridian transit) details.")
    day_length_hours: float | None = Field(
        default=None,
        description="Total duration of daylight in decimal hours, or None if not applicable.",
    )
    conventions: dict[str, str] = Field(description="Astronomical conventions applied.")
    assumptions: list[str] = Field(description="Documented calculation assumptions.")


class SolarPositionRequest(BaseModel):
    """Request payload for instantaneous solar altitude and azimuth."""

    model_config = ConfigDict(extra="forbid")

    instant: str = Field(
        description="Timezone-aware ISO-8601 timestamp string (e.g. '2026-10-26T12:00:00+05:30').",
        min_length=1,
    )
    latitude: float = Field(
        description="Observer latitude in degrees [-90.0, +90.0].",
        ge=-90.0,
        le=90.0,
    )
    longitude: float = Field(
        description="Observer longitude in degrees [-180.0, +180.0].",
        ge=-180.0,
        le=180.0,
    )
    elevation_m: float = Field(
        default=0.0,
        description="Observer elevation in meters above sea level [-500.0, 12000.0].",
        ge=-500.0,
        le=12000.0,
    )


class SolarPositionResponse(BaseModel):
    """Response schema for topocentric solar altitude and azimuth."""

    model_config = ConfigDict(extra="forbid")

    instant: str = Field(description="Normalized ISO-8601 timestamp of calculation.")
    observer: ObserverLocation = Field(description="Observer location.")
    altitude_deg: float = Field(
        description="Geometric apparent solar altitude above horizon in degrees [-90.0, +90.0]."
    )
    altitude_refracted_deg: float = Field(
        description="Refracted apparent solar altitude in degrees (standard atmosphere)."
    )
    azimuth_deg: float = Field(
        description="Solar azimuth measured clockwise from True North in degrees [0.0, 360.0)."
    )
    distance_au: float = Field(description="Topocentric distance to Sun in Astronomical Units (AU).")
    distance_km: float = Field(description="Topocentric distance to Sun in kilometers (km).")
    is_sun_up: bool = Field(description="True if Sun's upper limb is above apparent horizon.")
    conventions: dict[str, str] = Field(description="Coordinate and refraction conventions.")
