
"""Preliminary mean solar longitude calculations.

The date-based calculation uses a published reference position from
Burgess's 1860 translation of the Surya Siddhanta. It is not a
complete implementation of the traditional true-position algorithm.
"""

import math
from datetime import date, datetime

from app.traditional.angle_utils import normalize_angle

REVOLUTIONS_PER_MAHAYUGA = 4_320_000
CIVIL_DAYS_PER_MAHAYUGA = 1_577_917_828

# Published reference: January 1, 1860, midnight at Ujjain.
REFERENCE_DATE = date(1860, 1, 1)
REFERENCE_MEAN_SOLAR_LONGITUDE_DEG = (
    257 + 48 / 60 + 7 / 3600
)


def _daily_solar_motion() -> float:
    """Return the preliminary mean solar motion in degrees per day."""
    return (
        360.0
        * REVOLUTIONS_PER_MAHAYUGA
        / CIVIL_DAYS_PER_MAHAYUGA
    )


def calculate_mean_solar_longitude(elapsed_days: float) -> float:
    """Calculate mean solar longitude from elapsed days from a zero-angle epoch."""
    if (
        isinstance(elapsed_days, bool)
        or not isinstance(elapsed_days, (int, float))
        or not math.isfinite(elapsed_days)
    ):
        raise ValueError("elapsed_days must be a finite number.")

    return normalize_angle(elapsed_days * _daily_solar_motion())


def calculate_mean_solar_longitude_for_date(
    target_date: date,
) -> float:
    """Estimate mean solar longitude for a date using the published reference.

    Dates are interpreted at midnight. This uses Gregorian date arithmetic
    and the reference longitude at Ujjain; it does not calculate true
    solar longitude or apply the solar apsis correction.
    """
    if (
        not isinstance(target_date, date)
        or isinstance(target_date, datetime)
    ):
        raise ValueError("target_date must be a datetime.date, not datetime.")

    elapsed_days = (target_date - REFERENCE_DATE).days

    return normalize_angle(
        REFERENCE_MEAN_SOLAR_LONGITUDE_DEG
        + elapsed_days * _daily_solar_motion()
    )
