
"""Service layer for preliminary traditional astronomy calculations."""

from datetime import date

from app.traditional.solar_method import (
    calculate_mean_solar_longitude,
    calculate_mean_solar_longitude_for_date,
    calculate_solar_apsis_longitude_for_year,
)


def calculate_solar_position(elapsed_days: float) -> dict:
    """Return preliminary mean solar longitude from elapsed days."""
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
            "The solar-apsis estimate is not applied as a correction.",
            "This is not a validated true solar longitude.",
        ],
    }


def calculate_solar_position_for_date(target_date: date) -> dict:
    """Return preliminary mean longitude and apsis estimate for a date."""
    longitude = calculate_mean_solar_longitude_for_date(target_date)
    apsis_longitude = calculate_solar_apsis_longitude_for_year(
        target_date.year
    )

    return {
        "body": "Sun",
        "date": target_date.isoformat(),
        "longitude_deg": longitude,
        "calculation_type": "mean_longitude",
        "is_true_longitude": False,
        "solar_apsis_longitude_deg": apsis_longitude,
        "solar_apsis_estimate_year": target_date.year,
        "reference_date": "1860-01-01",
        "reference_location": "Ujjain",
        "source": (
            "Surya Siddhanta, Burgess translation (1860), "
            "preliminary reference-based implementation"
        ),
        "limitations": [
            "Uses Gregorian calendar day differences from the reference date.",
            "Uses a published reference position and configured mean daily motion.",
            "Solar apsis longitude is a preliminary linear estimate.",
            "The solar equation of the apsis has not been applied.",
            "The complete historical calculation has not been independently validated.",
            "This is not a validated true solar longitude.",
        ],
    }
