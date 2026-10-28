"""Service for daily sunrise-based Panchang calculations."""

from datetime import date as Date
from typing import Any
from zoneinfo import ZoneInfo, ZoneInfoNotFoundError

from app.panchang.vara import calculate_vara_at_sunrise
from app.services.panchang_service import get_panchang_instant
from app.services.solar_service import get_solar_events


def get_daily_panchang(
    date_input: str,
    latitude: float,
    longitude: float,
    elevation_m: float = 0.0,
    timezone_str: str = "Asia/Kolkata",
    *,
    auto_download: bool = True,
) -> dict[str, Any]:
    """Calculate daily Panchang Angas at the local sunrise."""

    try:
        local_date = Date.fromisoformat(date_input)
        if local_date.isoformat() != date_input:
            raise ValueError
        ZoneInfo(timezone_str)
    except (ValueError, TypeError, ZoneInfoNotFoundError) as exc:
        raise ValueError(
            "Provide a valid YYYY-MM-DD date and IANA timezone, "
            "such as Asia/Kolkata."
        ) from exc

    solar = get_solar_events(
        date_input=local_date,
        latitude=latitude,
        longitude=longitude,
        elevation_m=elevation_m,
        timezone_str=timezone_str,
        auto_download=auto_download,
    )

    sunrise = solar["sunrise"]

    result: dict[str, Any] = {
        "date": local_date.isoformat(),
        "observer": {
            "latitude": latitude,
            "longitude": longitude,
            "elevation_m": elevation_m,
            "timezone": timezone_str,
        },
        "sunrise": sunrise,
        "vara": None,
        "panchang": None,
        "status": "unavailable",
        "message": None,
    }

    if not sunrise.get("available") or not sunrise.get("time_local"):
        result["message"] = (
            sunrise.get("reason")
            or "Sunrise is unavailable for the requested local date."
        )
        return result

    sunrise_local = sunrise["time_local"]

    result["vara"] = calculate_vara_at_sunrise(
        sunrise_local=sunrise_local,
        timezone_str=timezone_str,
    )

    result["panchang"] = get_panchang_instant(
        instant=sunrise_local,
        timezone_str=timezone_str,
        auto_download=auto_download,
    )

    result["status"] = "success"
    return result