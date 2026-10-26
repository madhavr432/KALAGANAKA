"""API endpoints for modern astronomical planetary-position calculations."""

from fastapi import APIRouter, HTTPException, Query

from app.astronomy.ephemeris import (
    DateOutOfRangeError,
    EphemerisLoadError,
    EphemerisNotFoundError,
)
from app.schemas.astronomy import (
    PlanetaryPositionsRequest,
    PlanetaryPositionsResponse,
)
from app.services.astronomy_service import get_planetary_positions

router = APIRouter(prefix="/astronomy", tags=["Modern Astronomy"])


@router.get(
    "/planets",
    response_model=PlanetaryPositionsResponse,
    summary="Get planetary positions via GET",
)
def get_planets(
    instant: str = Query(
        ...,
        description="Timezone-aware ISO-8601 timestamp string (e.g. '2026-10-26T12:00:00+05:30' or '2026-10-26T06:30:00Z').",
        min_length=1,
    ),
) -> dict:
    """Return apparent geocentric planetary positions for the 7 classical bodies."""
    try:
        return get_planetary_positions(instant)
    except (ValueError, DateOutOfRangeError) as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    except EphemerisNotFoundError as exc:
        raise HTTPException(
            status_code=503,
            detail="Required planetary ephemeris kernel (de421.bsp) is unavailable on the server.",
        ) from exc
    except EphemerisLoadError as exc:
        raise HTTPException(
            status_code=500,
            detail="Failed to load planetary ephemeris kernel on the server.",
        ) from exc
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail="An internal calculation error occurred while processing the request.",
        ) from exc


@router.post(
    "/planets",
    response_model=PlanetaryPositionsResponse,
    summary="Get planetary positions via POST",
)
def post_planets(request: PlanetaryPositionsRequest) -> dict:
    """Return apparent geocentric planetary positions for the 7 classical bodies."""
    try:
        return get_planetary_positions(request.instant)
    except (ValueError, DateOutOfRangeError) as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    except EphemerisNotFoundError as exc:
        raise HTTPException(
            status_code=503,
            detail="Required planetary ephemeris kernel (de421.bsp) is unavailable on the server.",
        ) from exc
    except EphemerisLoadError as exc:
        raise HTTPException(
            status_code=500,
            detail="Failed to load planetary ephemeris kernel on the server.",
        ) from exc
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail="An internal calculation error occurred while processing the request.",
        ) from exc
