"""Service layer for solar events and solar position calculations."""

from datetime import date, datetime
from typing import Any

from app.astronomy.solar import (
    calculate_solar_events,
    calculate_solar_position,
)


def get_solar_events(
    date_input: str | date,
    latitude: float,
    longitude: float,
    elevation_m: float = 0.0,
    timezone_str: str = "UTC",
    *,
    auto_download: bool = True,
) -> dict[str, Any]:
    """Calculate and return sunrise, sunset, and solar noon for a local date and observer location."""
    return calculate_solar_events(
        date_input=date_input,
        latitude=latitude,
        longitude=longitude,
        elevation_m=elevation_m,
        timezone_str=timezone_str,
        auto_download=auto_download,
    )


def get_solar_position(
    instant: str | datetime,
    latitude: float,
    longitude: float,
    elevation_m: float = 0.0,
    *,
    auto_download: bool = True,
) -> dict[str, Any]:
    """Calculate and return topocentric solar altitude and azimuth for an instant and observer location."""
    return calculate_solar_position(
        instant=instant,
        latitude=latitude,
        longitude=longitude,
        elevation_m=elevation_m,
        auto_download=auto_download,
    )
