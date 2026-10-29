"""API endpoint for comparing traditional and modern planetary longitudes."""

from typing import Literal
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, ConfigDict, Field
from datetime import date, datetime, time, timedelta
from zoneinfo import ZoneInfo

from app.astronomy.calculator import calculate_planetary_positions
from app.services.traditional_service import calculate_solar_position_for_date

from app.services.comparison_service import compare_planetary_positions

router = APIRouter(prefix="/comparison", tags=["Comparison"])


class ComparisonRequest(BaseModel):
    """Input data for comparing planetary longitudes."""

    model_config = ConfigDict(extra="forbid")

    traditional_positions: dict[str, float] = Field(
        description="Planet names mapped to traditional longitudes in degrees."
    )
    modern_positions: dict[str, float] = Field(
        description="Planet names mapped to modern longitudes in degrees."
    )
    traditional_method: str = Field(min_length=1)
    modern_method: str = Field(min_length=1)
    modern_data_source: Literal["mock", "provider"] = "mock"
    coordinate_system: str = Field(default="unspecified", min_length=1)
    instant: str | None = None


@router.post("/compare")
def compare_positions(request: ComparisonRequest) -> dict:
    """Compare matching planetary positions from two supplied datasets."""

    try:
        return compare_planetary_positions(
            traditional_positions=request.traditional_positions,
            modern_positions=request.modern_positions,
            traditional_method=request.traditional_method,
            modern_method=request.modern_method,
            modern_data_source=request.modern_data_source,
            coordinate_system=request.coordinate_system,
            instant=request.instant,
        )
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
@router.get("/solar")
def compare_solar_positions(
    target_date: date = Query(
        alias="date",
        description="Gregorian date in YYYY-MM-DD format",
    ),
) -> dict:
    """
    Compare preliminary traditional mean solar longitude with
    modern DE421 sidereal apparent solar longitude.

    This is an exploratory comparison, not a validated accuracy test.
    """
    from fastapi import HTTPException

    from app.astronomy.ephemeris import (
        DateOutOfRangeError,
        EphemerisLoadError,
        EphemerisNotFoundError,
    )

    # The traditional date-based method interprets dates at midnight.
    # Use the same civil date and midnight in Ujjain/Indian time.
    instant = datetime.combine(
        target_date,
        time.min,
        tzinfo=ZoneInfo("Asia/Kolkata"),
    )

    try:
        traditional = calculate_solar_position_for_date(target_date)

        modern = calculate_planetary_positions(
            instant,
            auto_download=True,
        )

        traditional_positions = {
            "Sun": traditional["longitude_deg"],
        }

        modern_positions = {
            "Sun": modern["positions_sidereal_deg"]["Sun"],
        }

        result = compare_planetary_positions(
            traditional_positions=traditional_positions,
            modern_positions=modern_positions,
            traditional_method=(
                "Preliminary Surya Siddhanta-based mean solar longitude"
            ),
            modern_method=(
                "Skyfield JPL DE421 apparent geocentric "
                "ecliptic longitude, Lahiri sidereal"
            ),
            modern_data_source="provider",
            coordinate_system=(
                "Traditional convention not fully validated; "
                "modern value is Lahiri sidereal"
            ),
            instant=instant.isoformat(),
        )

        result["comparison_basis"] = {
            "date": target_date.isoformat(),
            "traditional_calculation_type": "mean_longitude",
            "traditional_is_true_longitude": False,
            "modern_coordinate_system": "Lahiri sidereal",
            "traditional_reference_date": traditional["reference_date"],
            "scientific_validation": "preliminary",
        }

        result["limitations"] = list(result["limitations"]) + [
            "The traditional method is preliminary and has not been "
            "independently validated.",
            "Compatibility of the historical traditional reference "
            "with the modern Lahiri sidereal convention is not established.",
            "The result must not be interpreted as a validated accuracy score.",
        ]

        return result

    except (ValueError, DateOutOfRangeError) as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    except EphemerisNotFoundError as exc:
        raise HTTPException(
            status_code=503,
            detail="The DE421 ephemeris file is unavailable.",
        ) from exc
    except EphemerisLoadError as exc:
        raise HTTPException(
            status_code=500,
            detail="Failed to load the DE421 ephemeris.",
        ) from exc


@router.get("/solar-time-series")
def compare_solar_time_series(
    start_date: date = Query(
        description="Starting Gregorian date in YYYY-MM-DD format",
    ),
    days: int = Query(
        default=14,
        ge=2,
        le=60,
        description="Number of consecutive days to calculate",
    ),
    step_days: int = Query(
        default=1,
        ge=1,
        le=10,
        description="Step interval between calculations in days",
    ),
) -> dict:
    """Compare traditional mean solar longitude with modern DE421 sidereal longitude over a time series."""
    import statistics

    points = []
    diffs = []

    for i in range(0, days, step_days):
        current_date = start_date + timedelta(days=i)
        instant = datetime.combine(current_date, time.min, tzinfo=ZoneInfo("Asia/Kolkata"))
        try:
            trad = calculate_solar_position_for_date(current_date)
            mod = calculate_planetary_positions(instant, auto_download=True)
            trad_deg = trad["longitude_deg"]
            mod_deg = mod["positions_sidereal_deg"]["Sun"]
            comp = compare_planetary_positions(
                traditional_positions={"Sun": trad_deg},
                modern_positions={"Sun": mod_deg},
                traditional_method="Preliminary Surya Siddhanta-based mean solar longitude",
                modern_method="Skyfield JPL DE421 apparent geocentric ecliptic longitude, Lahiri sidereal",
                modern_data_source="provider",
                coordinate_system="Traditional convention not fully validated; modern value is Lahiri sidereal",
                instant=instant.isoformat(),
            )
            res = comp["results"][0]
            points.append({
                "date": current_date.isoformat(),
                "traditional_longitude_deg": res["traditional_longitude_deg"],
                "modern_longitude_deg": res["modern_longitude_deg"],
                "signed_difference_deg": res["signed_difference_deg"],
                "absolute_difference_deg": res["absolute_difference_deg"],
                "units": "degrees",
            })
            diffs.append(res["absolute_difference_deg"])
        except Exception:
            continue

    if not points:
        raise HTTPException(status_code=422, detail="Unable to compute time series for requested date range.")

    return {
        "status": "time_series_comparison",
        "start_date": start_date.isoformat(),
        "end_date": points[-1]["date"],
        "total_points": len(points),
        "time_series": points,
        "summary_statistics": {
            "mean_absolute_difference_deg": statistics.mean(diffs),
            "max_absolute_difference_deg": max(diffs),
            "min_absolute_difference_deg": min(diffs),
            "std_deviation_deg": statistics.stdev(diffs) if len(diffs) > 1 else 0.0,
        },
        "traditional_method": "Preliminary Surya Siddhanta-based mean solar longitude",
        "modern_method": "Skyfield JPL DE421 apparent geocentric ecliptic longitude, Lahiri sidereal",
        "units": "degrees",
        "limitations": [
            "Traditional method computes mean solar longitude without true-position (Mandaphala) correction.",
            "Modern values use JPL DE421 apparent coordinates with Lahiri Chitrapaksha Ayanamsha.",
            "Periodic variations represent orbital eccentricity (equation of the center) not modeled in mean motion.",
        ],
    }
