"""API endpoints for solar events (sunrise, sunset, solar noon) and solar coordinates."""

from fastapi import APIRouter, HTTPException, Query

from app.astronomy.ephemeris import (
    DateOutOfRangeError,
    EphemerisLoadError,
    EphemerisNotFoundError,
)
from app.schemas.solar import (
    SolarEventsRequest,
    SolarEventsResponse,
    SolarPositionRequest,
    SolarPositionResponse,
)
from app.services.solar_service import (
    get_solar_events,
    get_solar_position,
)

router = APIRouter(prefix="/solar", tags=["Solar Astronomy"])


@router.get(
    "/events",
    response_model=SolarEventsResponse,
    summary="Get sunrise, sunset, and solar noon via GET",
)
def get_events(
    target_date: str = Query(
        ...,
        alias="date",
        description="Local Gregorian calendar date in 'YYYY-MM-DD' format.",
        min_length=10,
        max_length=10,
    ),
    latitude: float = Query(
        ...,
        description="Observer latitude in degrees [-90.0, +90.0].",
        ge=-90.0,
        le=90.0,
    ),
    longitude: float = Query(
        ...,
        description="Observer longitude in degrees [-180.0, +180.0].",
        ge=-180.0,
        le=180.0,
    ),
    elevation_m: float = Query(
        default=0.0,
        description="Observer elevation in meters above sea level [-500.0, 12000.0].",
        ge=-500.0,
        le=12000.0,
    ),
    tz: str = Query(
        default="UTC",
        alias="timezone",
        description="Observer timezone (e.g. 'Asia/Kolkata', 'America/New_York', '+05:30').",
        min_length=1,
    ),
) -> dict:
    """Calculate sunrise, sunset, and solar noon for a local date and observer location."""
    try:
        return get_solar_events(
            date_input=target_date,
            latitude=latitude,
            longitude=longitude,
            elevation_m=elevation_m,
            timezone_str=tz,
        )
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
    "/events",
    response_model=SolarEventsResponse,
    summary="Get sunrise, sunset, and solar noon via POST",
)
def post_events(request: SolarEventsRequest) -> dict:
    """Calculate sunrise, sunset, and solar noon for a local date and observer location."""
    try:
        return get_solar_events(
            date_input=request.date,
            latitude=request.latitude,
            longitude=request.longitude,
            elevation_m=request.elevation_m,
            timezone_str=request.timezone,
        )
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


@router.get(
    "/position",
    response_model=SolarPositionResponse,
    summary="Get solar altitude and azimuth via GET",
)
def get_position(
    instant: str = Query(
        ...,
        description="Timezone-aware ISO-8601 timestamp string (e.g. '2026-10-26T12:00:00+05:30').",
        min_length=1,
    ),
    latitude: float = Query(
        ...,
        description="Observer latitude in degrees [-90.0, +90.0].",
        ge=-90.0,
        le=90.0,
    ),
    longitude: float = Query(
        ...,
        description="Observer longitude in degrees [-180.0, +180.0].",
        ge=-180.0,
        le=180.0,
    ),
    elevation_m: float = Query(
        default=0.0,
        description="Observer elevation in meters above sea level [-500.0, 12000.0].",
        ge=-500.0,
        le=12000.0,
    ),
) -> dict:
    """Calculate topocentric solar altitude and azimuth for a timezone-aware instant."""
    try:
        return get_solar_position(
            instant=instant,
            latitude=latitude,
            longitude=longitude,
            elevation_m=elevation_m,
        )
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
    "/position",
    response_model=SolarPositionResponse,
    summary="Get solar altitude and azimuth via POST",
)
def post_position(request: SolarPositionRequest) -> dict:
    """Calculate topocentric solar altitude and azimuth for a timezone-aware instant."""
    try:
        return get_solar_position(
            instant=request.instant,
            latitude=request.latitude,
            longitude=request.longitude,
            elevation_m=request.elevation_m,
        )
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
