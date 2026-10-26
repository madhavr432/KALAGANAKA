"""Core calculation engine for modern planetary positions using Skyfield and JPL DE421."""

from datetime import datetime, timezone
from typing import Any

from skyfield.errors import EphemerisRangeError

from app.astronomy.ayanamsha import calculate_lahiri_ayanamsha
from app.astronomy.constants import (
    AYANAMSHA_NAME,
    CALCULATION_ASSUMPTIONS,
    COORDINATE_SYSTEM,
    DE421_END_DATE_STR,
    DE421_END_JD,
    DE421_START_DATE_STR,
    DE421_START_JD,
    EPHEMERIS_NAME,
    PLANET_EPHEMERIS_TARGETS,
    REFERENCE_FRAME,
    SUPPORTED_PLANETS,
    TIME_STANDARD,
)
from app.astronomy.ephemeris import (
    DateOutOfRangeError,
    get_timescale,
    load_ephemeris,
)
from app.traditional.angle_utils import normalize_angle


def parse_timezone_aware_instant(instant_str: str) -> datetime:
    """
    Parse an ISO-8601 string into a timezone-aware datetime object.

    Rejects empty, malformed, or timezone-naive inputs.
    """
    if not isinstance(instant_str, str) or not instant_str.strip():
        raise ValueError("instant must be a non-empty ISO-8601 string.")

    cleaned = instant_str.strip()
    try:
        dt = datetime.fromisoformat(cleaned)
    except (ValueError, TypeError) as exc:
        raise ValueError(
            f"Invalid ISO-8601 instant '{instant_str}': {exc}. "
            "Expected format like 'YYYY-MM-DDTHH:MM:SSZ' or 'YYYY-MM-DDTHH:MM:SS+HH:MM'."
        ) from exc

    if dt.tzinfo is None or dt.tzinfo.utcoffset(dt) is None:
        raise ValueError(
            f"Instant '{instant_str}' is timezone-naive. "
            "Please provide an explicit timezone offset or 'Z' (e.g. '2026-10-26T12:00:00Z')."
        )

    return dt


def calculate_planetary_positions(
    instant: str | datetime,
    *,
    auto_download: bool = True,
) -> dict[str, Any]:
    """
    Calculate apparent geocentric ecliptic positions for the 7 classical planets.

    Parameters:
    - instant: An ISO-8601 string or timezone-aware datetime.
    - auto_download: If True, allows downloading DE421 if not present locally.

    Returns:
    - A dictionary containing individual planet coordinates (tropical and sidereal),
      mappings suitable for comparison services, and detailed calculation metadata.
    """
    if isinstance(instant, str):
        dt = parse_timezone_aware_instant(instant)
    elif isinstance(instant, datetime):
        if instant.tzinfo is None or instant.tzinfo.utcoffset(instant) is None:
            raise ValueError(
                "Supplied datetime is timezone-naive. Must have tzinfo."
            )
        dt = instant
    else:
        raise ValueError("instant must be an ISO-8601 string or datetime object.")

    ts = get_timescale()
    t = ts.from_datetime(dt)

    jd_tt = float(t.tt)
    if jd_tt < DE421_START_JD or jd_tt > DE421_END_JD:
        raise DateOutOfRangeError(
            f"Date '{dt.isoformat()}' (JD_TT {jd_tt:.2f}) is outside supported "
            f"range of {EPHEMERIS_NAME} ({DE421_START_DATE_STR} to {DE421_END_DATE_STR})."
        )

    eph = load_ephemeris("de421.bsp", auto_download=auto_download)
    earth = eph["earth"]

    ayanamsha_deg = calculate_lahiri_ayanamsha(t)

    planet_results: list[dict[str, Any]] = []
    positions_tropical: dict[str, float] = {}
    positions_sidereal: dict[str, float] = {}

    for planet in SUPPORTED_PLANETS:
        target_name = PLANET_EPHEMERIS_TARGETS[planet]
        target_body = eph[target_name]

        try:
            apparent = earth.at(t).observe(target_body).apparent()
            lat, lon, dist = apparent.ecliptic_latlon("date")
        except EphemerisRangeError as exc:
            raise DateOutOfRangeError(
                f"Ephemeris range error for {planet} on {dt.isoformat()}: {exc}"
            ) from exc

        tropical_lon = normalize_angle(float(lon.degrees))
        sidereal_lon = normalize_angle(tropical_lon - ayanamsha_deg)
        latitude_deg = float(lat.degrees)
        distance_au = float(dist.au)
        distance_km = float(dist.km)

        planet_results.append({
            "name": planet,
            "tropical_longitude_deg": tropical_lon,
            "sidereal_longitude_deg": sidereal_lon,
            "latitude_deg": latitude_deg,
            "distance_au": distance_au,
            "distance_km": distance_km,
        })

        positions_tropical[planet] = tropical_lon
        positions_sidereal[planet] = sidereal_lon

    return {
        "instant": dt.isoformat(),
        "julian_date_tt": jd_tt,
        "ayanamsha_name": AYANAMSHA_NAME,
        "ayanamsha_deg": ayanamsha_deg,
        "planets": planet_results,
        "positions_tropical_deg": positions_tropical,
        "positions_sidereal_deg": positions_sidereal,
        "ephemeris": EPHEMERIS_NAME,
        "reference_frame": REFERENCE_FRAME,
        "coordinate_system": COORDINATE_SYSTEM,
        "time_standard": TIME_STANDARD,
        "units": {
            "longitude": "degrees in range [0, 360)",
            "latitude": "degrees in range [-90, +90]",
            "distance": "Astronomical Units (au) and Kilometers (km)",
            "ayanamsha": "degrees",
        },
        "assumptions": CALCULATION_ASSUMPTIONS.copy(),
    }
