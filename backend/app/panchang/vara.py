"""Weekday (Vara) calculation helpers for Panchang."""

from datetime import date, datetime
from zoneinfo import ZoneInfo, ZoneInfoNotFoundError


VARA_NAMES = (
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
)


def calculate_civil_vara(local_date: date) -> dict[str, object]:
    """Return the civil weekday for a local calendar date."""
    if not isinstance(local_date, date) or isinstance(local_date, datetime):
        raise ValueError("local_date must be a datetime.date value.")

    index = local_date.weekday()
    return {
        "index": index + 1,
        "name": VARA_NAMES[index],
        "basis": "civil_calendar_date",
    }


def calculate_vara_at_sunrise(sunrise_local: str, timezone_str: str) -> dict[str, object]:
    """Return Vara anchored to the local sunrise instant."""
    if not isinstance(sunrise_local, str) or not sunrise_local.strip():
        raise ValueError("sunrise_local must be a non-empty ISO-8601 timestamp.")

    try:
        sunrise = datetime.fromisoformat(sunrise_local)
        zone = ZoneInfo(timezone_str)
    except (ValueError, TypeError, ZoneInfoNotFoundError) as exc:
        raise ValueError("Invalid sunrise timestamp or IANA timezone.") from exc

    if sunrise.tzinfo is None or sunrise.utcoffset() is None:
        raise ValueError("sunrise_local must include a timezone offset.")

    local_sunrise = sunrise.astimezone(zone)
    index = local_sunrise.weekday()

    return {
        "index": index + 1,
        "name": VARA_NAMES[index],
        "basis": "local_sunrise",
        "sunrise_local": local_sunrise.isoformat(),
        "timezone": timezone_str,
    }
