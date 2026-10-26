"""Service layer for modern astronomical planetary-position calculations."""

from datetime import datetime
from typing import Any

from app.astronomy.calculator import calculate_planetary_positions


def get_planetary_positions(
    instant: str | datetime,
    *,
    auto_download: bool = True,
) -> dict[str, Any]:
    """Calculate and return modern planetary positions for a timezone-aware instant."""
    return calculate_planetary_positions(instant, auto_download=auto_download)
