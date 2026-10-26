
"""API endpoints for preliminary traditional astronomy calculations."""

from datetime import date

from fastapi import APIRouter, HTTPException, Query

from app.services.traditional_service import (
    calculate_solar_position_for_date,
)

router = APIRouter(prefix="/traditional", tags=["Traditional Astronomy"])


@router.get("/solar-position")
def get_solar_position(
    target_date: date = Query(alias="date", description="Gregorian date, YYYY-MM-DD"),
) -> dict:
    """Return preliminary mean solar longitude for a Gregorian date."""
    try:
        return calculate_solar_position_for_date(target_date)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
