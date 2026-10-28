"""Pydantic schemas for Panchang calculations and transitions API."""

from typing import Any
from pydantic import BaseModel, ConfigDict, Field


class TithiInfo(BaseModel):
    """Details for calculated Tithi."""

    model_config = ConfigDict(extra="forbid")

    index: int = Field(..., ge=1, le=30, description="1-based Tithi index (1 to 30).")
    name: str = Field(..., description="Tithi name (e.g. Pratipada, Purnima, Amavasya).")
    paksha: str = Field(..., description="Paksha ('Shukla' or 'Krishna').")
    tithi_in_paksha: int = Field(..., ge=1, le=15, description="1-based Tithi index within Paksha (1 to 15).")
    angular_separation_deg: float = Field(
        ...,
        description="Moon-Sun apparent ecliptic angular separation in degrees [0, 360).",
    )
    elapsed_deg_in_tithi: float = Field(
        ...,
        description="Degrees traversed by Moon-Sun separation in current Tithi [0, 12).",
    )
    fraction_elapsed: float = Field(
        ...,
        ge=0.0,
        le=1.0,
        description="Fraction of current Tithi elapsed [0.0, 1.0].",
    )
    boundary_convention: str = Field(
        default="[start, end) degrees, lower inclusive, upper exclusive",
        description="Mathematical boundary convention.",
    )


class NakshatraInfo(BaseModel):
    """Details for calculated Nakshatra."""

    model_config = ConfigDict(extra="forbid")

    index: int = Field(..., ge=1, le=27, description="1-based Nakshatra index (1 to 27).")
    name: str = Field(..., description="Nakshatra name (e.g. Ashwini, Bharani, Revati).")
    sidereal_longitude_deg: float = Field(
        ...,
        description="Moon's Lahiri sidereal longitude in degrees [0, 360).",
    )
    elapsed_deg_in_nakshatra: float = Field(
        ...,
        description="Degrees traversed in current Nakshatra [0, 13.3333).",
    )
    fraction_elapsed: float = Field(
        ...,
        ge=0.0,
        le=1.0,
        description="Fraction of current Nakshatra elapsed [0.0, 1.0].",
    )
    sector_span_deg: float = Field(
        default=13.333333333333334,
        description="Nakshatra sector span in degrees (13°20').",
    )
    boundary_convention: str = Field(
        default="[start, end) degrees, lower inclusive, upper exclusive",
        description="Mathematical boundary convention.",
    )


class YogaInfo(BaseModel):
    """Details for calculated Yoga."""

    model_config = ConfigDict(extra="forbid")

    index: int = Field(..., ge=1, le=27, description="1-based Yoga index (1 to 27).")
    name: str = Field(..., description="Yoga name (e.g. Vishkambha, Priti, Vaidhriti).")
    combined_longitude_deg: float = Field(
        ...,
        description="Sum of Sun and Moon Lahiri sidereal longitudes modulo 360 in degrees [0, 360).",
    )
    elapsed_deg_in_yoga: float = Field(
        ...,
        description="Degrees traversed in current Yoga [0, 13.3333).",
    )
    fraction_elapsed: float = Field(
        ...,
        ge=0.0,
        le=1.0,
        description="Fraction of current Yoga elapsed [0.0, 1.0].",
    )
    sector_span_deg: float = Field(
        default=13.333333333333334,
        description="Yoga sector span in degrees (13°20').",
    )
    boundary_convention: str = Field(
        default="[start, end) degrees, lower inclusive, upper exclusive",
        description="Mathematical boundary convention.",
    )


class KaranaInfo(BaseModel):
    """Details for calculated Karana (half-Tithi)."""

    model_config = ConfigDict(extra="forbid")

    half_tithi_index: int = Field(..., ge=1, le=60, description="1-based half-Tithi index (1 to 60).")
    name: str = Field(..., description="Karana name.")
    canonical_name: str = Field(..., description="Canonical Karana name (e.g. 'Kimstughna', 'Vishti').")
    display_name: str = Field(..., description="Preferred display label (e.g. 'Kimstughna', 'Vishti (Bhadra)').")
    alias: str | None = Field(
        default=None,
        description="Optional alias label (e.g. 'Kintughna' for Kimstughna, 'Bhadra' for Vishti).",
    )
    karana_type: str = Field(..., description="Karana classification ('fixed' or 'repeating').")
    angular_separation_deg: float = Field(
        ...,
        description="Moon-Sun apparent ecliptic angular separation in degrees [0, 360).",
    )
    elapsed_deg_in_karana: float = Field(
        ...,
        description="Degrees traversed in current Karana [0, 6.0).",
    )
    fraction_elapsed: float = Field(
        ...,
        ge=0.0,
        le=1.0,
        description="Fraction of current Karana elapsed [0.0, 1.0].",
    )
    boundary_convention: str = Field(
        default="[start, end) degrees, lower inclusive, upper exclusive",
        description="Mathematical boundary convention.",
    )


class PanchangInstantResponse(BaseModel):
    """Response payload for instantaneous Panchang Angas calculation."""

    model_config = ConfigDict(extra="forbid")

    instant_requested: str = Field(..., description="Requested input timestamp string.")
    instant_local: str = Field(..., description="Local ISO-8601 timestamp in observer timezone.")
    instant_utc: str = Field(..., description="UTC ISO-8601 timestamp.")
    julian_date_tt: float = Field(..., description="Terrestrial Time Julian Date.")
    ayanamsha_deg: float = Field(..., description="Lahiri Ayanamsha value at this instant.")
    sun_sidereal_longitude_deg: float = Field(
        ...,
        description="Apparent Sun Lahiri sidereal ecliptic longitude in degrees [0, 360).",
    )
    moon_sidereal_longitude_deg: float = Field(
        ...,
        description="Apparent Moon Lahiri sidereal ecliptic longitude in degrees [0, 360).",
    )
    sun_tropical_longitude_deg: float = Field(
        ...,
        description="Apparent Sun tropical ecliptic longitude of date in degrees [0, 360).",
    )
    moon_tropical_longitude_deg: float = Field(
        ...,
        description="Apparent Moon tropical ecliptic longitude of date in degrees [0, 360).",
    )
    tithi: TithiInfo = Field(..., description="Calculated Tithi.")
    nakshatra: NakshatraInfo = Field(..., description="Calculated Nakshatra.")
    yoga: YogaInfo = Field(..., description="Calculated Yoga.")
    karana: KaranaInfo = Field(..., description="Calculated Karana.")
    longitude_conventions: dict[str, str] = Field(..., description="Documentation of longitude coordinate conventions.")
    metadata: dict[str, Any] = Field(..., description="Astronomical calculation engine metadata.")


class TransitionBoundary(BaseModel):
    """Individual Anga boundary crossing event."""

    model_config = ConfigDict(extra="forbid")

    anga_type: str = Field(..., description="Type of Anga ('tithi', 'nakshatra', 'yoga', 'karana').")
    boundary_deg: float = Field(..., description="Normalized boundary angle crossed in degrees [0, 360).")
    transition_time_utc: str = Field(..., description="UTC ISO-8601 transition timestamp.")
    transition_time_local: str = Field(..., description="Local ISO-8601 transition timestamp in requested timezone.")
    from_index: int = Field(..., ge=1, description="1-based index of ending Anga.")
    from_name: str = Field(..., description="Name of ending Anga.")
    to_index: int = Field(..., ge=1, description="1-based index of beginning Anga.")
    to_name: str = Field(..., description="Name of beginning Anga.")
    confirmed_change: bool = Field(True, description="Confirmed that Anga changed across the transition.")
    precision_achieved_seconds: float = Field(
        default=1.0,
        description="Precision achieved by numerical refinement in seconds.",
    )


class NextTransitionResponse(BaseModel):
    """Response payload for next transition of a selected Anga."""

    model_config = ConfigDict(extra="forbid")

    instant_requested: str = Field(..., description="Requested input timestamp string.")
    instant_local: str = Field(..., description="Local ISO-8601 timestamp in observer timezone.")
    instant_utc: str = Field(..., description="UTC ISO-8601 timestamp.")
    anga_type: str = Field(..., description="Selected Anga type ('tithi', 'nakshatra', 'yoga', 'karana').")
    current_anga: dict[str, Any] = Field(..., description="Details of current Anga active at requested instant.")
    next_transition: TransitionBoundary = Field(..., description="Next boundary transition event ending current Anga.")
    seconds_remaining: float = Field(..., ge=0.0, description="Seconds remaining until transition.")
    hours_remaining: float = Field(..., ge=0.0, description="Hours remaining until transition.")
    metadata: dict[str, Any] = Field(..., description="Calculation engine metadata.")


class TransitionsIntervalResponse(BaseModel):
    """Response payload for transitions across a requested time interval."""

    model_config = ConfigDict(extra="forbid")

    start_utc: str = Field(..., description="Start of search interval in UTC ISO-8601.")
    end_utc: str = Field(..., description="End of search interval in UTC ISO-8601.")
    start_local: str = Field(..., description="Start of search interval in requested timezone.")
    end_local: str = Field(..., description="End of search interval in requested timezone.")
    anga_types_requested: list[str] = Field(..., description="List of Anga types searched.")
    total_transitions: int = Field(..., ge=0, description="Total number of transitions found.")
    transitions: list[TransitionBoundary] = Field(..., description="Chronologically sorted transition events.")
    metadata: dict[str, Any] = Field(..., description="Calculation engine metadata.")


class PanchangInstantRequest(BaseModel):
    """Request body payload for instantaneous Panchang Angas."""

    model_config = ConfigDict(extra="forbid")

    instant: str = Field(
        ...,
        description="Timezone-aware ISO-8601 instant string (e.g. '2026-10-27T12:00:00+05:30' or '2026-10-27T06:30:00Z').",
        min_length=1,
    )
    timezone: str = Field(
        default="UTC",
        description="Observer timezone (IANA e.g. 'Asia/Kolkata' or offset e.g. '+05:30').",
        min_length=1,
    )


class NextTransitionRequest(BaseModel):
    """Request body payload for next transition of a selected Anga."""

    model_config = ConfigDict(extra="forbid")

    instant: str = Field(
        ...,
        description="Timezone-aware ISO-8601 instant string (e.g. '2026-10-27T12:00:00+05:30').",
        min_length=1,
    )
    anga_type: str = Field(
        ...,
        description="Anga type: 'tithi', 'nakshatra', 'yoga', or 'karana'.",
        min_length=1,
    )
    timezone: str = Field(
        default="UTC",
        description="Observer timezone (IANA e.g. 'Asia/Kolkata' or offset e.g. '+05:30').",
        min_length=1,
    )


class TransitionsIntervalRequest(BaseModel):
    """Request body payload for transitions across an interval."""

    model_config = ConfigDict(extra="forbid")

    start: str = Field(
        ...,
        description="Timezone-aware ISO-8601 start timestamp.",
        min_length=1,
    )
    end: str = Field(
        ...,
        description="Timezone-aware ISO-8601 end timestamp (must be > start and duration <= 35 days).",
        min_length=1,
    )
    anga_types: list[str] | None = Field(
        default=None,
        min_length=1,
        description="Optional list of Anga types to include ('tithi', 'nakshatra', 'yoga', 'karana'). Default is all 4.",
    )
    timezone: str = Field(
        default="UTC",
        description="Observer timezone (IANA e.g. 'Asia/Kolkata' or offset e.g. '+05:30').",
        min_length=1,
    )
    limit: int | None = Field(
        default=None,
        ge=1,
        le=500,
        description="Optional limit on total transitions returned (1 to 500).",
    )
class DailyPanchangRequest(BaseModel):
    """Request for daily Panchang at a geographic location."""

    model_config = ConfigDict(extra="forbid")

    date: str = Field(
        ...,
        description="Local Gregorian date in YYYY-MM-DD format.",
        min_length=10,
        max_length=10,
        pattern=r"^\d{4}-\d{2}-\d{2}$",
    )
    latitude: float = Field(..., ge=-90.0, le=90.0)
    longitude: float = Field(..., ge=-180.0, le=180.0)
    elevation_m: float = Field(default=0.0, ge=-500.0, le=12000.0)
    timezone: str = Field(default="Asia/Kolkata", min_length=1)


class DailyPanchangResponse(BaseModel):
    """Daily Panchang calculated at local sunrise."""

    model_config = ConfigDict(extra="forbid")

    date: str
    observer: dict[str, Any]
    sunrise: dict[str, Any]
    vara: dict[str, Any]
    panchang: PanchangInstantResponse | None
    status: str
    message: str | None = None