"""Pydantic schemas for modern astronomical calculations."""

from pydantic import BaseModel, ConfigDict, Field


class PlanetPosition(BaseModel):
    """Coordinates and distance for a single celestial body."""

    model_config = ConfigDict(extra="forbid")

    name: str = Field(description="Name of the planet or luminary (e.g., Sun, Moon).")
    tropical_longitude_deg: float = Field(
        description="Apparent geocentric ecliptic longitude of date in degrees [0, 360)."
    )
    sidereal_longitude_deg: float = Field(
        description="Lahiri (Chitrapaksha) sidereal ecliptic longitude in degrees [0, 360)."
    )
    latitude_deg: float = Field(
        description="Apparent geocentric ecliptic latitude in degrees [-90, +90]."
    )
    distance_au: float = Field(
        description="Geocentric distance in Astronomical Units (AU)."
    )
    distance_km: float = Field(
        description="Geocentric distance in kilometers (km)."
    )


class PlanetaryPositionsRequest(BaseModel):
    """Request payload for planetary positions."""

    model_config = ConfigDict(extra="forbid")

    instant: str = Field(
        description="Timezone-aware ISO-8601 timestamp string (e.g. '2026-10-26T12:00:00+05:30' or '2026-10-26T06:30:00Z').",
        min_length=1,
    )


class PlanetaryPositionsResponse(BaseModel):
    """Detailed response schema for modern planetary positions."""

    model_config = ConfigDict(extra="forbid")

    instant: str = Field(description="Normalized ISO-8601 timestamp.")
    julian_date_tt: float = Field(description="Julian Date in Terrestrial Time (TT).")
    ayanamsha_name: str = Field(description="Name of the sidereal ayanamsha system used.")
    ayanamsha_deg: float = Field(description="Calculated Ayanamsha in degrees.")
    planets: list[PlanetPosition] = Field(description="List of calculated planet positions.")
    positions_tropical_deg: dict[str, float] = Field(
        description="Mapping of planet names to tropical longitudes in degrees."
    )
    positions_sidereal_deg: dict[str, float] = Field(
        description="Mapping of planet names to Lahiri sidereal longitudes in degrees."
    )
    ephemeris: str = Field(description="Name and version of the ephemeris kernel.")
    reference_frame: str = Field(description="Astronomical reference frame description.")
    coordinate_system: str = Field(description="Coordinate system convention.")
    time_standard: str = Field(description="Time standard used in calculations.")
    units: dict[str, str] = Field(description="Measurement units for output fields.")
    assumptions: list[str] = Field(description="Documented assumptions and limitations.")
