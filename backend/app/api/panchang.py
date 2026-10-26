"""API endpoints for Panchang instantaneous calculations and transitions."""

from fastapi import APIRouter, HTTPException, Query

from app.astronomy.ephemeris import (
    DateOutOfRangeError,
    EphemerisLoadError,
    EphemerisNotFoundError,
)
from app.schemas.panchang import (
    NextTransitionRequest,
    NextTransitionResponse,
    PanchangInstantRequest,
    PanchangInstantResponse,
    TransitionsIntervalRequest,
    TransitionsIntervalResponse,
)
from app.services.panchang_service import (
    get_panchang_instant,
    get_panchang_interval_transitions,
    get_panchang_next_transition,
)

router = APIRouter(prefix="/panchang", tags=["Panchang Engine"])


@router.get(
    "/instant",
    response_model=PanchangInstantResponse,
    summary="Calculate instantaneous Panchang Angas via GET",
)
def get_instant(
    instant: str = Query(
        ...,
        description="Timezone-aware ISO-8601 instant string (e.g. '2026-10-27T12:00:00+05:30' or '2026-10-27T06:30:00Z').",
        min_length=1,
    ),
    tz: str = Query(
        default="UTC",
        alias="timezone",
        description="Observer timezone (e.g. 'Asia/Kolkata', 'America/New_York', '+05:30').",
        min_length=1,
    ),
) -> dict:
    """Calculate the four core Panchang Angas at a specific timezone-aware instant."""
    try:
        return get_panchang_instant(instant=instant, timezone_str=tz)
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
    "/instant",
    response_model=PanchangInstantResponse,
    summary="Calculate instantaneous Panchang Angas via POST",
)
def post_instant(payload: PanchangInstantRequest) -> dict:
    """Calculate the four core Panchang Angas at a specific timezone-aware instant via JSON body."""
    try:
        return get_panchang_instant(instant=payload.instant, timezone_str=payload.timezone)
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
    "/next-transition",
    response_model=NextTransitionResponse,
    summary="Retrieve the next transition for a selected Anga via GET",
)
def get_next_transition_endpoint(
    instant: str = Query(
        ...,
        description="Timezone-aware ISO-8601 instant string (e.g. '2026-10-27T12:00:00+05:30').",
        min_length=1,
    ),
    anga_type: str = Query(
        ...,
        description="Type of Anga: 'tithi', 'nakshatra', 'yoga', or 'karana'.",
        min_length=1,
    ),
    tz: str = Query(
        default="UTC",
        alias="timezone",
        description="Observer timezone (e.g. 'Asia/Kolkata', '+05:30').",
        min_length=1,
    ),
) -> dict:
    """Retrieve the next boundary crossing ending the current Anga."""
    try:
        return get_panchang_next_transition(
            instant=instant,
            anga_type=anga_type.lower().strip(),
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
    "/next-transition",
    response_model=NextTransitionResponse,
    summary="Retrieve the next transition for a selected Anga via POST",
)
def post_next_transition_endpoint(payload: NextTransitionRequest) -> dict:
    """Retrieve the next boundary crossing ending the current Anga via JSON body."""
    try:
        return get_panchang_next_transition(
            instant=payload.instant,
            anga_type=payload.anga_type.lower().strip(),
            timezone_str=payload.timezone,
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
    "/transitions",
    response_model=TransitionsIntervalResponse,
    summary="Retrieve Panchang transitions over a time interval via GET",
)
def get_transitions_interval_endpoint(
    start: str = Query(
        ...,
        description="Start ISO-8601 timestamp (e.g. '2026-10-27T00:00:00Z').",
        min_length=1,
    ),
    end: str = Query(
        ...,
        description="End ISO-8601 timestamp (e.g. '2026-10-28T00:00:00Z').",
        min_length=1,
    ),
    anga_types: str | None = Query(
        default=None,
        description="Comma-separated list of Anga types (e.g. 'tithi,karana'). Default is all 4.",
    ),
    tz: str = Query(
        default="UTC",
        alias="timezone",
        description="Observer timezone.",
        min_length=1,
    ),
    limit: int | None = Query(
        default=None,
        ge=1,
        le=500,
        description="Optional maximum number of transitions to return (1 to 500).",
    ),
) -> dict:
    """Retrieve all boundary crossings for requested Angas over a time interval (up to 35 days)."""
    try:
        parsed_angas: list[str] | None = None
        if anga_types is not None:
            parsed_angas = [a.strip().lower() for a in anga_types.split(",") if a.strip()]

        return get_panchang_interval_transitions(
            start_instant=start,
            end_instant=end,
            anga_types=parsed_angas,
            timezone_str=tz,
            limit=limit,
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
    "/transitions",
    response_model=TransitionsIntervalResponse,
    summary="Retrieve Panchang transitions over a time interval via POST",
)
def post_transitions_interval_endpoint(payload: TransitionsIntervalRequest) -> dict:
    """Retrieve all boundary crossings for requested Angas over a time interval via JSON body."""
    try:
        parsed_angas = (
            [a.strip().lower() for a in payload.anga_types if a.strip()]
            if payload.anga_types is not None
            else None
        )
        return get_panchang_interval_transitions(
            start_instant=payload.start,
            end_instant=payload.end,
            anga_types=parsed_angas,
            timezone_str=payload.timezone,
            limit=payload.limit,
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
