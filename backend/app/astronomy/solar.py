"""Calculations for solar events (sunrise, sunset, solar noon) and solar coordinates."""

import math
import re
from datetime import date, datetime, time, timedelta, timezone, tzinfo
from typing import Any
from zoneinfo import ZoneInfo

from skyfield import almanac
from skyfield.api import wgs84

from app.astronomy.calculator import parse_timezone_aware_instant
from app.astronomy.constants import (
    DE421_END_DATE_STR,
    DE421_END_JD,
    DE421_START_DATE_STR,
    DE421_START_JD,
    EPHEMERIS_NAME,
)
from app.astronomy.ephemeris import (
    DateOutOfRangeError,
    get_timescale,
    load_ephemeris,
)
from app.traditional.angle_utils import normalize_angle

# Astronomical conventions for sunrise and sunset
# Center of Sun at -0.8333 degrees (-50 arcminutes) below horizon:
# - 16 arcminutes for average solar semidiameter (upper limb)
# - 34 arcminutes for standard atmospheric refraction at the horizon
SOLAR_EVENT_CONVENTIONS = {
    "standard_altitude_deg": "-0.8333 degrees below horizon",
    "solar_limb_convention": "Upper limb of Sun touching apparent horizon (16 arcminutes semidiameter)",
    "refraction_convention": "Standard atmospheric refraction of 34 arcminutes at sea level",
    "observer_model": "WGS84 ellipsoidal surface with specified elevation above sea level",
}

SOLAR_EVENT_ASSUMPTIONS = [
    "Sunrise and sunset occur when the Sun's upper limb touches the apparent horizon.",
    "Accounts for standard atmospheric refraction of 34 arcminutes at the horizon and 16 arcminutes solar semidiameter (-50' center depression).",
    "Topocentric coordinates account for observer geographic latitude, longitude, and elevation above the WGS84 ellipsoid.",
    "Solar noon is defined as the upper meridian transit (maximum solar altitude of the day).",
    "In polar regions during polar day (midnight sun) or polar night, sunrise/sunset events do not occur and are explicitly flagged.",
]


def validate_observer(
    latitude: float,
    longitude: float,
    elevation_m: float = 0.0,
) -> tuple[float, float, float]:
    """Validate observer coordinates and elevation."""
    if (
        isinstance(latitude, bool)
        or not isinstance(latitude, (int, float))
        or not math.isfinite(latitude)
    ):
        raise ValueError("Latitude must be a finite number.")

    if not (-90.0 <= latitude <= 90.0):
        raise ValueError(
            f"Latitude {latitude} is out of bounds. Must be between -90.0 and +90.0 degrees."
        )

    if (
        isinstance(longitude, bool)
        or not isinstance(longitude, (int, float))
        or not math.isfinite(longitude)
    ):
        raise ValueError("Longitude must be a finite number.")

    if not (-180.0 <= longitude <= 180.0):
        raise ValueError(
            f"Longitude {longitude} is out of bounds. Must be between -180.0 and +180.0 degrees."
        )

    if (
        isinstance(elevation_m, bool)
        or not isinstance(elevation_m, (int, float))
        or not math.isfinite(elevation_m)
    ):
        raise ValueError("Elevation must be a finite number.")

    if not (-500.0 <= elevation_m <= 12000.0):
        raise ValueError(
            f"Elevation {elevation_m} is out of bounds. Must be between -500.0 and 12,000.0 meters."
        )

    return float(latitude), float(longitude), float(elevation_m)


def parse_timezone(tz_identifier: str) -> tzinfo:
    """Parse an IANA timezone name or UTC offset string into a tzinfo object."""
    if not isinstance(tz_identifier, str) or not tz_identifier.strip():
        raise ValueError("Timezone must be a non-empty string.")

    cleaned = tz_identifier.strip()

    # Special aliases for UTC
    if cleaned.upper() in ("UTC", "Z", "+00:00", "-00:00", "+0000", "-0000"):
        return timezone.utc

    # Try ZoneInfo (handles IANA names like 'Asia/Kolkata', 'America/New_York')
    try:
        return ZoneInfo(cleaned)
    except Exception:
        pass

    # Try fixed numeric offset pattern: +/-HH:MM or +/-HHMM or +/-HH
    pattern = r"^([+-])(\d{1,2})(?::?(\d{2}))?$"
    match = re.match(pattern, cleaned)
    if match:
        sign, hours, minutes = match.groups()
        h = int(hours)
        m = int(minutes) if minutes else 0
        if 0 <= h <= 23 and 0 <= m <= 59:
            delta = timedelta(hours=h, minutes=m)
            if sign == "-":
                delta = -delta
            return timezone(delta)

    raise ValueError(
        f"Invalid timezone '{tz_identifier}'. Expected an IANA timezone name "
        "(e.g. 'Asia/Kolkata', 'UTC', 'America/New_York') or offset (e.g. '+05:30', '-04:00')."
    )


def parse_date(date_input: str | date) -> date:
    """Parse and validate a date object or ISO-8601 date string (YYYY-MM-DD)."""
    if isinstance(date_input, date):
        if isinstance(date_input, datetime):
            return date_input.date()
        return date_input

    if not isinstance(date_input, str) or not date_input.strip():
        raise ValueError("Date must be a non-empty string in YYYY-MM-DD format.")

    try:
        return date.fromisoformat(date_input.strip())
    except ValueError as exc:
        raise ValueError(
            f"Invalid date format '{date_input}': {exc}. Expected 'YYYY-MM-DD'."
        ) from exc


def calculate_solar_events(
    date_input: str | date,
    latitude: float,
    longitude: float,
    elevation_m: float = 0.0,
    timezone_str: str = "UTC",
    *,
    auto_download: bool = True,
) -> dict[str, Any]:
    """
    Calculate sunrise, sunset, and solar noon for a local date and observer location.

    Handles polar day and polar night gracefully by returning explicit unavailable
    statuses with human-readable explanations.
    """
    target_date = parse_date(date_input)
    lat, lon, elev = validate_observer(latitude, longitude, elevation_m)
    tz = parse_timezone(timezone_str)

    # Local day bounds in observer timezone
    local_midnight_start = datetime.combine(target_date, time.min, tzinfo=tz)
    local_midnight_end = datetime.combine(
        target_date + timedelta(days=1), time.min, tzinfo=tz
    )

    ts = get_timescale()
    t0 = ts.from_datetime(local_midnight_start)
    t1 = ts.from_datetime(local_midnight_end)

    if float(t0.tt) < DE421_START_JD or float(t1.tt) > DE421_END_JD:
        raise DateOutOfRangeError(
            f"Date '{target_date.isoformat()}' is outside supported range "
            f"of {EPHEMERIS_NAME} ({DE421_START_DATE_STR} to {DE421_END_DATE_STR})."
        )

    eph = load_ephemeris("de421.bsp", auto_download=auto_download)
    topos = wgs84.latlon(latitude_degrees=lat, longitude_degrees=lon, elevation_m=elev)

    # 1. Sunrise and Sunset search
    f_sun = almanac.sunrise_sunset(eph, topos)
    times_sun, events_sun = almanac.find_discrete(t0, t1, f_sun)

    sunrise_dt: datetime | None = None
    sunset_dt: datetime | None = None
    sunrise_utc: str | None = None
    sunset_utc: str | None = None

    for t_event, event_type in zip(times_sun, events_sun):
        dt_local = t_event.astimezone(tz)
        if event_type == 1 and sunrise_dt is None:
            sunrise_dt = dt_local
            sunrise_utc = t_event.utc_iso()
        elif event_type == 0 and sunset_dt is None:
            sunset_dt = dt_local
            sunset_utc = t_event.utc_iso()

    # Determine availability and polar reasons
    is_sun_up_at_start = bool(f_sun(t0))

    if sunrise_dt is not None:
        sunrise_res = {
            "time_local": sunrise_dt.isoformat(),
            "time_utc": sunrise_utc,
            "available": True,
            "reason": None,
        }
    else:
        if is_sun_up_at_start and len(times_sun) == 0:
            reason = "Polar day (midnight sun): Sun remains continuously above the horizon throughout the day."
        elif not is_sun_up_at_start and len(times_sun) == 0:
            reason = "Polar night: Sun remains continuously below the horizon throughout the day."
        else:
            reason = "No sunrise occurs during this local calendar day."
        sunrise_res = {
            "time_local": None,
            "time_utc": None,
            "available": False,
            "reason": reason,
        }

    if sunset_dt is not None:
        sunset_res = {
            "time_local": sunset_dt.isoformat(),
            "time_utc": sunset_utc,
            "available": True,
            "reason": None,
        }
    else:
        if is_sun_up_at_start and len(times_sun) == 0:
            reason = "Polar day (midnight sun): Sun remains continuously above the horizon throughout the day."
        elif not is_sun_up_at_start and len(times_sun) == 0:
            reason = "Polar night: Sun remains continuously below the horizon throughout the day."
        else:
            reason = "No sunset occurs during this local calendar day."
        sunset_res = {
            "time_local": None,
            "time_utc": None,
            "available": False,
            "reason": reason,
        }

    # Day length in hours
    day_length_hours: float | None = None
    if sunrise_dt is not None and sunset_dt is not None:
        if sunset_dt >= sunrise_dt:
            day_length_hours = round(
                (sunset_dt - sunrise_dt).total_seconds() / 3600.0, 4
            )
        else:
            # Polar transition day where sunset precedes sunrise
            day_length_hours = round(
                (24.0 * 3600.0 - (sunrise_dt - sunset_dt).total_seconds()) / 3600.0, 4
            )
    elif is_sun_up_at_start and len(times_sun) == 0:
        day_length_hours = 24.0
    elif not is_sun_up_at_start and len(times_sun) == 0:
        day_length_hours = 0.0

    # 2. Solar Noon (Upper meridian transit) search
    f_noon = almanac.meridian_transits(eph, eph["sun"], topos)
    times_noon, events_noon = almanac.find_discrete(t0, t1, f_noon)

    solar_noon_dt: datetime | None = None
    solar_noon_utc: str | None = None

    for t_event, event_type in zip(times_noon, events_noon):
        if event_type == 1:  # Upper culmination = Solar Noon
            solar_noon_dt = t_event.astimezone(tz)
            solar_noon_utc = t_event.utc_iso()
            break

    if solar_noon_dt is not None:
        solar_noon_res = {
            "time_local": solar_noon_dt.isoformat(),
            "time_utc": solar_noon_utc,
            "available": True,
            "reason": None,
        }
    else:
        solar_noon_res = {
            "time_local": None,
            "time_utc": None,
            "available": False,
            "reason": "No upper meridian transit occurs within this local calendar day.",
        }

    return {
        "date": target_date.isoformat(),
        "observer": {
            "latitude": lat,
            "longitude": lon,
            "elevation_m": elev,
            "timezone": timezone_str.strip(),
        },
        "sunrise": sunrise_res,
        "sunset": sunset_res,
        "solar_noon": solar_noon_res,
        "day_length_hours": day_length_hours,
        "conventions": SOLAR_EVENT_CONVENTIONS.copy(),
        "assumptions": SOLAR_EVENT_ASSUMPTIONS.copy(),
    }


def calculate_solar_position(
    instant: str | datetime,
    latitude: float,
    longitude: float,
    elevation_m: float = 0.0,
    *,
    auto_download: bool = True,
) -> dict[str, Any]:
    """
    Calculate topocentric solar altitude and azimuth for a timezone-aware instant.

    Returns:
    - Geometric apparent altitude (degrees above horizon).
    - Refracted apparent altitude (accounting for standard atmospheric refraction).
    - Azimuth (degrees clockwise from True North: 0°=N, 90°=E, 180°=S, 270°=W).
    - Distance in AU and km.
    - Boolean is_sun_up indicating if upper limb is above apparent horizon.
    """
    if isinstance(instant, str):
        dt = parse_timezone_aware_instant(instant)
    elif isinstance(instant, datetime):
        if instant.tzinfo is None or instant.tzinfo.utcoffset(instant) is None:
            raise ValueError("Supplied datetime is timezone-naive. Must have tzinfo.")
        dt = instant
    else:
        raise ValueError("instant must be an ISO-8601 string or datetime object.")

    lat, lon, elev = validate_observer(latitude, longitude, elevation_m)

    ts = get_timescale()
    t = ts.from_datetime(dt)

    jd_tt = float(t.tt)
    if jd_tt < DE421_START_JD or jd_tt > DE421_END_JD:
        raise DateOutOfRangeError(
            f"Date '{dt.isoformat()}' (JD_TT {jd_tt:.2f}) is outside supported "
            f"range of {EPHEMERIS_NAME} ({DE421_START_DATE_STR} to {DE421_END_DATE_STR})."
        )

    eph = load_ephemeris("de421.bsp", auto_download=auto_download)
    observer = wgs84.latlon(latitude_degrees=lat, longitude_degrees=lon, elevation_m=elev)
    topos = eph["earth"] + observer

    apparent = topos.at(t).observe(eph["sun"]).apparent()

    # Geometric altitude and azimuth without refraction
    alt_geom, az_geom, dist = apparent.altaz()
    # Refracted altitude with standard atmosphere (15°C, 1013.25 mbar)
    alt_refr, _, _ = apparent.altaz(temperature_C=15.0, pressure_mbar=1013.25)

    altitude_deg = float(alt_geom.degrees)
    altitude_refracted_deg = float(alt_refr.degrees)
    azimuth_deg = normalize_angle(float(az_geom.degrees))
    distance_au = float(dist.au)
    distance_km = float(dist.km)

    # Sun is up if upper limb is on/above horizon (center >= -0.8333 deg)
    is_sun_up = altitude_deg >= -0.8333

    return {
        "instant": dt.isoformat(),
        "observer": {
            "latitude": lat,
            "longitude": lon,
            "elevation_m": elev,
            "timezone": dt.tzinfo.tzname(dt) or str(dt.tzinfo),
        },
        "altitude_deg": altitude_deg,
        "altitude_refracted_deg": altitude_refracted_deg,
        "azimuth_deg": azimuth_deg,
        "distance_au": distance_au,
        "distance_km": distance_km,
        "is_sun_up": is_sun_up,
        "conventions": {
            "altitude_units": "degrees, [-90.0, +90.0]",
            "azimuth_units": "degrees clockwise from True North [0.0, 360.0)",
            "standard_refraction": "15 deg C, 1013.25 mbar standard atmosphere",
            "horizon_threshold": "-0.8333 degrees (accounting for 16' radius + 34' refraction)",
        },
    }
