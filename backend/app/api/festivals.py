
"""Festival knowledge lookup endpoints."""

from fastapi import APIRouter, HTTPException, Query

from app.services.festival_service import get_festival, list_festivals

router = APIRouter(prefix="/festivals", tags=["Festivals"])


@router.get("")
def festivals(
    region: str | None = Query(default=None, min_length=1, max_length=80),
):
    """List curated festival rules, optionally filtered by region."""
    try:
        return list_festivals(region)
    except RuntimeError as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@router.get("/{festival_id}")
def festival_detail(festival_id: str):
    """Return one festival rule by ID."""
    try:
        result = get_festival(festival_id)
    except RuntimeError as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc

    if result is None:
        raise HTTPException(status_code=404, detail="Festival not found.")

    return result
