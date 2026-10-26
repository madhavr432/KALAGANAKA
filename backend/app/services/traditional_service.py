
"""Service layer for preliminary traditional astronomy calculations."""

from datetime import date

from app.traditional.solar_method import (
    calculate_mean_solar_longitude,
    calculate_mean_solar_longitude_for_date,
)


def calculate_solar_position(elapsed_days: float) -> dict:
    """Return a preliminary mean solar position from elapsed days."""
    longitude = calculate_mean_solar_longitude(elapsed_days)

    return {
        "body": "Sun",
        "longitude_deg": longitude,
        "calculation_type": "mean_longitude",
        "is_true_longitude": False,
        "elapsed_days": elapsed_days,
        "source": "Surya Siddhanta, preliminary implementation",
        "limitations": [
            "The elapsed-day epoch has not been mapped to a calendar date.",
            "The solar equation of the apsis has not been applied.",
            "This is not a validated true solar longitude.",
        ],
    }


def calculate_solar_position_for_date(target_date: date) -> dict:
    """Return a preliminary mean solar position for a Gregorian date."""
    longitude = calculate_mean_solar_longitude_for_date(target_date)

    return {
        "body": "Sun",
        "date": target_date.isoformat(),
        "longitude_deg": longitude,
        "calculation_type": "mean_longitude",
        "is_true_longitude": False,
        "reference_date": "1860-01-01",
        "reference_location": "Ujjain",
        "source": "Surya Siddhanta, Burgess translation (1860), reference-based implementation",
        "limitations": [
            "Uses Gregorian calendar day differences from the reference date.",
            "Uses a published reference position and configured mean daily motion.",
            "The complete historical epoch and traditional calculation have not been independently validated.",
            "The solar equation of the apsis has not been applied.",
            "This is not a validated true solar longitude.",
        ],
    }
