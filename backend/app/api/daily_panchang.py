"""Daily sunrise-based Panchang API."""

from fastapi import APIRouter, HTTPException

from app.astronomy.ephemeris import (
    DateOutOfRangeError,
    EphemerisLoadError,
    EphemerisNotFoundError,
)
from app.schemas.panchang import (
    DailyPanchangRequest,
    DailyPanchangResponse,
)
from app.services.daily_panchang_service import get_daily_panchang

router = APIRouter(prefix="/panchang", tags=["Daily Panchang"])


@router.post(
    "/daily",
    response_model=DailyPanchangResponse,
    summary="Calculate daily Panchang at local sunrise",
)
def post_daily_panchang(
    payload: DailyPanchangRequest,
) -> dict:
    """Return sunrise, Vara, Tithi, Nakshatra, Yoga, and Karana."""

    try:
        return get_daily_panchang(
            date_input=payload.date,
            latitude=payload.latitude,
            longitude=payload.longitude,
            elevation_m=payload.elevation_m,
            timezone_str=payload.timezone,
        )
    except (ValueError, DateOutOfRangeError) as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    except EphemerisNotFoundError as exc:
        raise HTTPException(
            status_code=503,
            detail="Required planetary ephemeris kernel is unavailable.",
        ) from exc
    except EphemerisLoadError as exc:
        raise HTTPException(
            status_code=500,
            detail="Failed to load planetary ephemeris kernel.",
        ) from exc