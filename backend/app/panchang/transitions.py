"""Astronomical transition calculation engine for Panchang Angas.

Calculates boundary crossing timestamps for:
- Tithi (30 sectors of 12°)
- Nakshatra (27 sectors of 13°20' = 40/3°)
- Yoga (27 sectors of 13°20' = 40/3°)
- Karana (60 sectors of 6°)

Mathematical Foundation and Guarantees:
----------------------------------------
1. Supported Ephemeris Range: JPL DE421 (1900-01-01 to 2050-12-31).
2. Angular Motion Rates:
   - Apparent Sun motion: ~0.95°/day to ~1.03°/day (always direct).
   - Apparent Moon motion: ~11.5°/day to ~15.8°/day (always direct).
   - Relative Moon - Sun separation (Tithi, Karana): ~10.5°/day to ~14.8°/day.
   - Moon sidereal longitude (Nakshatra): ~11.5°/day to ~15.8°/day.
   - Combined Sun + Moon sidereal longitude (Yoga): ~12.5°/day to ~16.8°/day.
3. Sampling Interval:
   - A step size of 2 hours (1/12 day = 7200 s) is used for boundary bracket searching.
   - Maximum angular change over 2 hours for ANY Anga is < 2 * (16.8° / 24) = 1.40°.
   - Since the narrowest sector is 6.0° (Karana), 1.40° < 6.0° / 4.
   - Therefore, at most ONE boundary crossing can occur per 2-hour step. No crossing
     can ever be skipped or missed over the supported ephemeris range.
4. Continuous Phase Unwrapping:
   - Avoids branch cut discontinuities at 0°/360° by defining continuous unwrapped angle:
     theta_unwrapped(t) = theta_a + ((theta(t) - theta_a) % 360.0).
   - The root function f(t) = theta_unwrapped(t) - B_unwrapped is strictly continuous
     and monotonically increasing across each bracket [t_a, t_b].
5. Numerical Precision:
   - Bisection with bracket tolerance tol = 0.5 / 86400.0 days (0.5 seconds).
   - Bracket width halving guarantees root location within +/-0.25 seconds of true mathematical crossing.
   - Formatted timestamps achieve target 1-second precision.
6. Transition Confirmation:
   - Evaluates Anga state 2 seconds prior to and 2 seconds after the crossing to confirm
     that the element index increments cleanly across the transition.
"""

from datetime import datetime, timedelta, timezone, tzinfo
import math
from typing import Any, Final

from skyfield.timelib import Time

from app.astronomy.ayanamsha import calculate_lahiri_ayanamsha
from app.astronomy.calculator import parse_timezone_aware_instant
from app.astronomy.constants import (
    CALCULATION_ASSUMPTIONS,
    DE421_END_DATE_STR,
    DE421_END_JD,
    DE421_START_DATE_STR,
    DE421_START_JD,
    EPHEMERIS_NAME,
)
from app.astronomy.ephemeris import (
    DateOutOfRangeError,
    get_timescale,
    load_ephemeris,
)
from app.astronomy.solar import parse_timezone
from app.panchang.calculations import (
    calculate_karana,
    calculate_nakshatra,
    calculate_panchang_angas,
    calculate_tithi,
    calculate_yoga,
)
from app.panchang.constants import (
    KARANA_SPAN_DEG,
    LONGITUDE_CONVENTIONS,
    NAKSHATRA_NAMES,
    NAKSHATRA_SPAN_DEG,
    TITHI_NAMES,
    TITHI_SPAN_DEG,
    YOGA_NAMES,
    YOGA_SPAN_DEG,
)
from app.traditional.angle_utils import normalize_angle

# Search step size in days: 2 hours = 2.0 / 24.0 days
SEARCH_STEP_DAYS: Final[float] = 2.0 / 24.0

# Bisection tolerance in days: 0.5 seconds = 0.5 / 86400.0 days
BISECTION_TOLERANCE_DAYS: Final[float] = 0.5 / 86400.0

# Maximum permitted interval query duration: 35 days (covers full lunar synodic cycle)
MAX_INTERVAL_DAYS: Final[int] = 35

# Maximum transitions returned in a single interval request to prevent unreasonable workloads.
# For 35 days across all 4 Angas, the theoretical maximum is ~177 transitions.
# A ceiling of 500 provides a generous safety margin while preventing runaway loops.
MAX_TRANSITIONS_PER_REQUEST: Final[int] = 500

# Supported Anga types
SUPPORTED_ANGA_TYPES: Final[tuple[str, ...]] = (
    "tithi",
    "nakshatra",
    "yoga",
    "karana",
)

ANGA_SECTOR_SPANS: Final[dict[str, float]] = {
    "tithi": TITHI_SPAN_DEG,
    "nakshatra": NAKSHATRA_SPAN_DEG,
    "yoga": YOGA_SPAN_DEG,
    "karana": KARANA_SPAN_DEG,
}

ANGA_TOTAL_SECTORS: Final[dict[str, int]] = {
    "tithi": 30,
    "nakshatra": 27,
    "yoga": 27,
    "karana": 60,
}

# Canonical sorting priority for simultaneous transitions at the exact same timestamp
ANGA_ORDER_PRIORITY: Final[dict[str, int]] = {
    "tithi": 1,
    "karana": 2,
    "nakshatra": 3,
    "yoga": 4,
}


def round_datetime_to_second(dt: datetime) -> datetime:
    """Round a datetime to the nearest whole second."""
    if dt.microsecond >= 500_000:
        return dt.replace(microsecond=0) + timedelta(seconds=1)
    return dt.replace(microsecond=0)


def get_sun_moon_state(
    t: Time,
    eph: Any,
    earth: Any,
) -> tuple[float, float, float]:
    """
    Compute apparent geocentric ecliptic longitudes for Sun and Moon, and Lahiri ayanamsha.

    Returns:
    - (sun_tropical_deg, moon_tropical_deg, ayanamsha_deg)
    """
    ayanamsha_deg = calculate_lahiri_ayanamsha(t)

    sun_apparent = earth.at(t).observe(eph["sun"]).apparent()
    _, sun_lon, _ = sun_apparent.ecliptic_latlon("date")
    sun_deg = normalize_angle(float(sun_lon.degrees))

    moon_apparent = earth.at(t).observe(eph["moon"]).apparent()
    _, moon_lon, _ = moon_apparent.ecliptic_latlon("date")
    moon_deg = normalize_angle(float(moon_lon.degrees))

    return sun_deg, moon_deg, ayanamsha_deg


def compute_anga_angle(
    sun_deg: float,
    moon_deg: float,
    ayanamsha_deg: float,
    anga_type: str,
) -> float:
    """Compute the normalized reference angle [0, 360) for a specific Anga type."""
    if anga_type in ("tithi", "karana"):
        # Relative separation: Moon - Sun (ayanamsha cancels out identically)
        return normalize_angle(moon_deg - sun_deg)
    elif anga_type == "nakshatra":
        # Moon Lahiri sidereal longitude
        return normalize_angle(moon_deg - ayanamsha_deg)
    elif anga_type == "yoga":
        # Sum of Sun and Moon Lahiri sidereal longitudes
        sid_sun = normalize_angle(sun_deg - ayanamsha_deg)
        sid_moon = normalize_angle(moon_deg - ayanamsha_deg)
        return normalize_angle(sid_sun + sid_moon)
    else:
        raise ValueError(
            f"Invalid anga_type '{anga_type}'. Must be one of: {list(SUPPORTED_ANGA_TYPES)}"
        )


def evaluate_anga_at_instant(
    sun_deg: float,
    moon_deg: float,
    ayanamsha_deg: float,
    anga_type: str,
) -> dict[str, Any]:
    """Evaluate full Anga details from planetary longitudes."""
    if anga_type == "tithi":
        return calculate_tithi(moon_deg, sun_deg)
    elif anga_type == "nakshatra":
        sid_moon = normalize_angle(moon_deg - ayanamsha_deg)
        return calculate_nakshatra(sid_moon)
    elif anga_type == "yoga":
        sid_sun = normalize_angle(sun_deg - ayanamsha_deg)
        sid_moon = normalize_angle(moon_deg - ayanamsha_deg)
        return calculate_yoga(sid_sun, sid_moon)
    elif anga_type == "karana":
        return calculate_karana(moon_deg, sun_deg)
    else:
        raise ValueError(f"Unknown anga_type '{anga_type}'")


def _get_anga_name(anga_type: str, index: int) -> str:
    """Return the display/canonical name for an Anga index."""
    if anga_type == "tithi":
        idx_0 = (index - 1) % 30
        return TITHI_NAMES[idx_0]
    elif anga_type == "nakshatra":
        idx_0 = (index - 1) % 27
        return NAKSHATRA_NAMES[idx_0]
    elif anga_type == "yoga":
        idx_0 = (index - 1) % 27
        return YOGA_NAMES[idx_0]
    elif anga_type == "karana":
        # Use calculate_karana to obtain canonical name
        mid_angle = (index - 0.5) * KARANA_SPAN_DEG
        karana_res = calculate_karana(mid_angle, 0.0)
        return karana_res["display_name"]
    return f"{anga_type}_{index}"


def _find_single_transition_in_bracket(
    jd_a: float,
    jd_b: float,
    theta_a: float,
    unwrapped_boundary: float,
    anga_type: str,
    ts: Any,
    eph: Any,
    earth: Any,
) -> float:
    """
    Bisect within [jd_a, jd_b] to locate the exact Julian Day TT when theta_unwrapped(t) == unwrapped_boundary.

    Guarantees convergence to < BISECTION_TOLERANCE_DAYS (0.5 s).
    """
    low = jd_a
    high = jd_b

    for _ in range(50):
        if (high - low) <= BISECTION_TOLERANCE_DAYS:
            break

        mid = 0.5 * (low + high)
        t_mid = ts.tt_jd(mid)
        s_deg, m_deg, aya_deg = get_sun_moon_state(t_mid, eph, earth)
        th_mid = compute_anga_angle(s_deg, m_deg, aya_deg, anga_type)

        # Unwrapped relative to theta_a
        delta = (th_mid - theta_a) % 360.0
        th_unwrapped = theta_a + delta

        if th_unwrapped < unwrapped_boundary:
            low = mid
        else:
            high = mid

    return 0.5 * (low + high)


def _build_transition_record(
    jd_star: float,
    boundary_deg: float,
    anga_type: str,
    tz: tzinfo,
    ts: Any,
    eph: Any,
    earth: Any,
) -> dict[str, Any]:
    """
    Build a transition result record, confirming that the Anga changes across the boundary.
    """
    t_star = ts.tt_jd(jd_star)
    dt_star_utc_raw = t_star.utc_datetime()
    dt_star_utc = round_datetime_to_second(dt_star_utc_raw)
    dt_star_local = round_datetime_to_second(dt_star_utc.astimezone(tz))

    # Evaluate 2 seconds before and 2 seconds after to confirm change
    jd_before = jd_star - (2.0 / 86400.0)
    jd_after = jd_star + (2.0 / 86400.0)

    # Ensure confirmation window [jd_before, jd_after] lies strictly within supported ephemeris range
    if jd_before < DE421_START_JD or jd_after > DE421_END_JD:
        raise DateOutOfRangeError(
            f"Transition at JD_TT {jd_star:.6f} cannot be safely confirmed within supported "
            f"ephemeris range of {EPHEMERIS_NAME} ({DE421_START_DATE_STR} to {DE421_END_DATE_STR})."
        )

    t_before = ts.tt_jd(jd_before)
    s_b, m_b, aya_b = get_sun_moon_state(t_before, eph, earth)
    anga_before = evaluate_anga_at_instant(s_b, m_b, aya_b, anga_type)

    t_after = ts.tt_jd(jd_after)
    s_a, m_a, aya_a = get_sun_moon_state(t_after, eph, earth)
    anga_after = evaluate_anga_at_instant(s_a, m_a, aya_a, anga_type)

    idx_key = "half_tithi_index" if anga_type == "karana" else "index"
    from_index = int(anga_before[idx_key])
    to_index = int(anga_after[idx_key])
    from_name = str(anga_before.get("display_name", anga_before["name"]))
    to_name = str(anga_after.get("display_name", anga_after["name"]))

    # Confirm transition occurred
    confirmed = from_index != to_index

    return {
        "anga_type": anga_type,
        "boundary_deg": normalize_angle(boundary_deg),
        "transition_time_utc": dt_star_utc.strftime("%Y-%m-%dT%H:%M:%SZ"),
        "transition_time_local": dt_star_local.isoformat(),
        "from_index": from_index,
        "from_name": from_name,
        "to_index": to_index,
        "to_name": to_name,
        "confirmed_change": confirmed,
        "precision_achieved_seconds": 1.0,
    }


def find_next_transition(
    instant: str | datetime,
    anga_type: str,
    timezone_str: str = "UTC",
    *,
    auto_download: bool = True,
) -> dict[str, Any]:
    """
    Find the next boundary crossing that ends the Anga active at the supplied instant.

    Parameters:
    - instant: ISO-8601 string or timezone-aware datetime.
    - anga_type: 'tithi', 'nakshatra', 'yoga', or 'karana'.
    - timezone_str: Observer IANA timezone or offset.
    - auto_download: Whether to allow downloading DE421 if missing.

    Returns:
    - Structured dictionary with current Anga details, next transition event,
      and remaining time in seconds and hours.
    """
    if anga_type not in SUPPORTED_ANGA_TYPES:
        raise ValueError(
            f"Invalid anga_type '{anga_type}'. Must be one of: {list(SUPPORTED_ANGA_TYPES)}"
        )

    if isinstance(instant, str):
        requested_str = instant
        dt = parse_timezone_aware_instant(instant)
    elif isinstance(instant, datetime):
        if instant.tzinfo is None or instant.tzinfo.utcoffset(instant) is None:
            raise ValueError("Supplied datetime is timezone-naive. Must have tzinfo.")
        dt = instant
        requested_str = dt.isoformat()
    else:
        raise ValueError("instant must be an ISO-8601 string or datetime object.")

    tz = parse_timezone(timezone_str)
    ts = get_timescale()
    t_start = ts.from_datetime(dt)

    jd_start = float(t_start.tt)
    if jd_start < DE421_START_JD or jd_start > DE421_END_JD:
        raise DateOutOfRangeError(
            f"Date '{dt.isoformat()}' (JD_TT {jd_start:.2f}) is outside supported "
            f"range of {EPHEMERIS_NAME}."
        )

    eph = load_ephemeris("de421.bsp", auto_download=auto_download)
    earth = eph["earth"]

    span = ANGA_SECTOR_SPANS[anga_type]
    total_sectors = ANGA_TOTAL_SECTORS[anga_type]

    # Evaluate current state
    s0, m0, aya0 = get_sun_moon_state(t_start, eph, earth)
    current_anga = evaluate_anga_at_instant(s0, m0, aya0, anga_type)
    current_angle = compute_anga_angle(s0, m0, aya0, anga_type)

    # Search window: Maximum duration of any Anga is < 30 hours.
    # Step forward in SEARCH_STEP_DAYS increments up to 36 hours (1.5 days).
    max_search_days = 1.5
    current_jd = jd_start
    target_unwrapped_boundary: float | None = None
    bracket_jd_a: float = jd_start
    bracket_jd_b: float = jd_start
    bracket_theta_a: float = current_angle

    # Sector at t_start
    m_current = int(math.floor(current_angle / span))

    # Step forward until boundary is crossed
    while (current_jd - jd_start) < max_search_days:
        if current_jd >= DE421_END_JD:
            break
        next_jd = min(DE421_END_JD, current_jd + SEARCH_STEP_DAYS)
        t_next = ts.tt_jd(next_jd)
        s_next, m_next, aya_next = get_sun_moon_state(t_next, eph, earth)
        angle_next = compute_anga_angle(s_next, m_next, aya_next, anga_type)

        delta_forward = (angle_next - current_angle) % 360.0
        unwrapped_next = current_angle + delta_forward
        m_next_sector = int(math.floor(unwrapped_next / span))

        # Sector safeguard: verify at most one sector boundary was crossed in this step
        if (m_next_sector - m_current) > 1:
            raise RuntimeError(
                f"Step anomaly: multiple boundaries crossed in a single step "
                f"({m_current} to {m_next_sector}) for {anga_type}."
            )

        if m_next_sector > m_current:
            # Boundary crossed!
            target_sector = m_current + 1
            target_unwrapped_boundary = target_sector * span
            bracket_jd_a = current_jd
            bracket_jd_b = next_jd
            bracket_theta_a = current_angle
            break

        current_jd = next_jd
        current_angle = angle_next
        m_current = int(math.floor(current_angle / span)) % total_sectors

    if target_unwrapped_boundary is None:
        if current_jd >= DE421_END_JD:
            raise DateOutOfRangeError(
                f"Next {anga_type} transition falls beyond the supported ephemeris "
                f"range of {EPHEMERIS_NAME} (ends at {DE421_END_DATE_STR})."
            )
        raise RuntimeError(
            f"Failed to locate next {anga_type} transition within 36 hours of {dt.isoformat()}."
        )

    # Refine transition timestamp
    jd_star = _find_single_transition_in_bracket(
        bracket_jd_a,
        bracket_jd_b,
        bracket_theta_a,
        target_unwrapped_boundary,
        anga_type,
        ts,
        eph,
        earth,
    )

    norm_boundary = (target_unwrapped_boundary) % 360.0
    transition_record = _build_transition_record(
        jd_star,
        norm_boundary,
        anga_type,
        tz,
        ts,
        eph,
        earth,
    )

    t_star = ts.tt_jd(jd_star)
    dt_star_utc = round_datetime_to_second(t_star.utc_datetime())
    dt_utc_req = dt.astimezone(timezone.utc)
    seconds_remaining = max(0.0, (dt_star_utc - dt_utc_req).total_seconds())

    dt_local = round_datetime_to_second(dt.astimezone(tz))

    return {
        "instant_requested": requested_str,
        "instant_local": dt_local.isoformat(),
        "instant_utc": dt_utc_req.strftime("%Y-%m-%dT%H:%M:%SZ"),
        "anga_type": anga_type,
        "current_anga": current_anga,
        "next_transition": transition_record,
        "seconds_remaining": seconds_remaining,
        "hours_remaining": round(seconds_remaining / 3600.0, 4),
        "metadata": {
            "ephemeris": EPHEMERIS_NAME,
            "search_step_hours": round(SEARCH_STEP_DAYS * 24.0, 2),
            "precision_seconds": 1.0,
            "assumptions": CALCULATION_ASSUMPTIONS.copy(),
        },
    }


def find_panchang_transitions(
    start_instant: str | datetime,
    end_instant: str | datetime,
    anga_types: list[str] | None = None,
    timezone_str: str = "UTC",
    *,
    limit: int | None = None,
    auto_download: bool = True,
) -> dict[str, Any]:
    """
    Retrieve all boundary transitions for requested Angas over a specified time interval.

    Parameters:
    - start_instant: Beginning of search interval (timezone-aware).
    - end_instant: End of search interval (timezone-aware, must be > start_instant and <= 35 days).
    - anga_types: Subset of ['tithi', 'nakshatra', 'yoga', 'karana'], default is all 4.
    - timezone_str: Observer IANA timezone or offset.
    - limit: Optional maximum number of transitions to return (1 to 500).
    - auto_download: Whether to allow downloading DE421 if missing.

    Returns:
    - Chronologically sorted list of transitions with complete metadata.
    """
    if isinstance(start_instant, str):
        dt_start = parse_timezone_aware_instant(start_instant)
    elif isinstance(start_instant, datetime):
        if start_instant.tzinfo is None or start_instant.tzinfo.utcoffset(start_instant) is None:
            raise ValueError("start_instant is timezone-naive. Must have tzinfo.")
        dt_start = start_instant
    else:
        raise ValueError("start_instant must be an ISO-8601 string or datetime object.")

    if isinstance(end_instant, str):
        dt_end = parse_timezone_aware_instant(end_instant)
    elif isinstance(end_instant, datetime):
        if end_instant.tzinfo is None or end_instant.tzinfo.utcoffset(end_instant) is None:
            raise ValueError("end_instant is timezone-naive. Must have tzinfo.")
        dt_end = end_instant
    else:
        raise ValueError("end_instant must be an ISO-8601 string or datetime object.")

    if dt_end <= dt_start:
        raise ValueError(
            f"end_instant '{dt_end.isoformat()}' must be strictly after start_instant '{dt_start.isoformat()}'."
        )

    interval_duration_days = (dt_end - dt_start).total_seconds() / 86400.0
    if interval_duration_days > MAX_INTERVAL_DAYS:
        raise ValueError(
            f"Requested interval duration ({interval_duration_days:.1f} days) exceeds maximum "
            f"permitted duration of {MAX_INTERVAL_DAYS} days."
        )

    if limit is not None:
        if isinstance(limit, bool) or not isinstance(limit, int):
            raise ValueError("limit must be an integer.")
        if limit < 1:
            raise ValueError("limit must be greater than or equal to 1.")
        if limit > MAX_TRANSITIONS_PER_REQUEST:
            raise ValueError(
                f"Requested limit ({limit}) exceeds maximum permitted limit of {MAX_TRANSITIONS_PER_REQUEST}."
            )

    if anga_types is None:
        active_angas = list(SUPPORTED_ANGA_TYPES)
    else:
        if not isinstance(anga_types, list) or len(anga_types) == 0:
            raise ValueError("anga_types must be a non-empty list of Anga type strings.")
        for a in anga_types:
            if a not in SUPPORTED_ANGA_TYPES:
                raise ValueError(
                    f"Invalid anga_type '{a}'. Must be one of: {list(SUPPORTED_ANGA_TYPES)}"
                )
        active_angas = list(dict.fromkeys(anga_types))  # preserve order without duplicates

    tz = parse_timezone(timezone_str)
    ts = get_timescale()

    t_start = ts.from_datetime(dt_start)
    t_end = ts.from_datetime(dt_end)

    jd_start = float(t_start.tt)
    jd_end = float(t_end.tt)

    if jd_start < DE421_START_JD or jd_end > DE421_END_JD:
        raise DateOutOfRangeError(
            f"Interval [{dt_start.isoformat()} to {dt_end.isoformat()}] is outside supported "
            f"range of {EPHEMERIS_NAME}."
        )

    eph = load_ephemeris("de421.bsp", auto_download=auto_download)
    earth = eph["earth"]

    all_transitions: list[dict[str, Any]] = []

    # Search transitions for each active Anga independently
    for anga in active_angas:
        span = ANGA_SECTOR_SPANS[anga]
        total_sectors = ANGA_TOTAL_SECTORS[anga]

        current_jd = jd_start
        s_cur, m_cur, aya_cur = get_sun_moon_state(t_start, eph, earth)
        current_angle = compute_anga_angle(s_cur, m_cur, aya_cur, anga)
        current_sector = int(math.floor(current_angle / span))

        while current_jd < jd_end:
            next_jd = min(jd_end, current_jd + SEARCH_STEP_DAYS)
            t_next = ts.tt_jd(next_jd)
            s_next, m_next, aya_next = get_sun_moon_state(t_next, eph, earth)
            angle_next = compute_anga_angle(s_next, m_next, aya_next, anga)

            delta_forward = (angle_next - current_angle) % 360.0
            unwrapped_next = current_angle + delta_forward
            next_sector = int(math.floor(unwrapped_next / span))

            # Sector safeguard: verify at most one sector boundary was crossed in this step
            if (next_sector - current_sector) > 1:
                raise RuntimeError(
                    f"Step anomaly: multiple boundaries crossed in a single step "
                    f"({current_sector} to {next_sector}) for {anga}."
                )

            if next_sector > current_sector:
                # One or more boundaries crossed (sampling interval guarantees at most one)
                for crossed_sec in range(current_sector + 1, next_sector + 1):
                    unwrapped_target = crossed_sec * span
                    jd_star = _find_single_transition_in_bracket(
                        current_jd,
                        next_jd,
                        current_angle,
                        unwrapped_target,
                        anga,
                        ts,
                        eph,
                        earth,
                    )

                    # Only record if within interval [jd_start, jd_end]
                    if jd_start <= jd_star <= jd_end:
                        norm_boundary = unwrapped_target % 360.0
                        rec = _build_transition_record(
                            jd_star,
                            norm_boundary,
                            anga,
                            tz,
                            ts,
                            eph,
                            earth,
                        )
                        all_transitions.append(rec)

            current_jd = next_jd
            current_angle = angle_next
            current_sector = int(math.floor(current_angle / span)) % total_sectors

    # Sort all transitions chronologically by UTC timestamp, then by canonical Anga priority
    all_transitions.sort(
        key=lambda x: (
            x["transition_time_utc"],
            ANGA_ORDER_PRIORITY.get(x["anga_type"], 99),
        )
    )

    if limit is not None:
        all_transitions = all_transitions[:limit]
    elif len(all_transitions) > MAX_TRANSITIONS_PER_REQUEST:
        all_transitions = all_transitions[:MAX_TRANSITIONS_PER_REQUEST]

    dt_start_utc = dt_start.astimezone(timezone.utc)
    dt_end_utc = dt_end.astimezone(timezone.utc)
    dt_start_local = round_datetime_to_second(dt_start.astimezone(tz))
    dt_end_local = round_datetime_to_second(dt_end.astimezone(tz))

    return {
        "start_utc": dt_start_utc.strftime("%Y-%m-%dT%H:%M:%SZ"),
        "end_utc": dt_end_utc.strftime("%Y-%m-%dT%H:%M:%SZ"),
        "start_local": dt_start_local.isoformat(),
        "end_local": dt_end_local.isoformat(),
        "anga_types_requested": active_angas,
        "total_transitions": len(all_transitions),
        "transitions": all_transitions,
        "metadata": {
            "ephemeris": EPHEMERIS_NAME,
            "search_step_hours": round(SEARCH_STEP_DAYS * 24.0, 2),
            "precision_seconds": 1.0,
            "assumptions": CALCULATION_ASSUMPTIONS.copy(),
        },
    }


def get_instant_panchang(
    instant: str | datetime,
    timezone_str: str = "UTC",
    *,
    auto_download: bool = True,
) -> dict[str, Any]:
    """
    Calculate instantaneous Panchang Angas (Tithi, Nakshatra, Yoga, Karana) at a specific instant.

    Returns structured data with tropical and sidereal coordinates, Lahiri ayanamsha,
    and longitude convention documentation.
    """
    if isinstance(instant, str):
        requested_str = instant
        dt = parse_timezone_aware_instant(instant)
    elif isinstance(instant, datetime):
        if instant.tzinfo is None or instant.tzinfo.utcoffset(instant) is None:
            raise ValueError("Supplied datetime is timezone-naive. Must have tzinfo.")
        dt = instant
        requested_str = dt.isoformat()
    else:
        raise ValueError("instant must be an ISO-8601 string or datetime object.")

    tz = parse_timezone(timezone_str)
    ts = get_timescale()
    t = ts.from_datetime(dt)

    jd_tt = float(t.tt)
    if jd_tt < DE421_START_JD or jd_tt > DE421_END_JD:
        raise DateOutOfRangeError(
            f"Date '{dt.isoformat()}' (JD_TT {jd_tt:.2f}) is outside supported "
            f"range of {EPHEMERIS_NAME}."
        )

    eph = load_ephemeris("de421.bsp", auto_download=auto_download)
    earth = eph["earth"]

    sun_deg, moon_deg, ayanamsha_deg = get_sun_moon_state(t, eph, earth)

    sun_sidereal = normalize_angle(sun_deg - ayanamsha_deg)
    moon_sidereal = normalize_angle(moon_deg - ayanamsha_deg)

    angas = calculate_panchang_angas(sun_sidereal, moon_sidereal)

    dt_utc = dt.astimezone(timezone.utc)
    dt_local = round_datetime_to_second(dt.astimezone(tz))

    return {
        "instant_requested": requested_str,
        "instant_local": dt_local.isoformat(),
        "instant_utc": dt_utc.strftime("%Y-%m-%dT%H:%M:%SZ"),
        "julian_date_tt": jd_tt,
        "ayanamsha_deg": ayanamsha_deg,
        "sun_sidereal_longitude_deg": sun_sidereal,
        "moon_sidereal_longitude_deg": moon_sidereal,
        "sun_tropical_longitude_deg": sun_deg,
        "moon_tropical_longitude_deg": moon_deg,
        "tithi": angas["tithi"],
        "nakshatra": angas["nakshatra"],
        "yoga": angas["yoga"],
        "karana": angas["karana"],
        "longitude_conventions": LONGITUDE_CONVENTIONS.copy(),
        "metadata": {
            "ephemeris": EPHEMERIS_NAME,
            "ayanamsha": "Lahiri (PAC)",
            "reference_frame": "ICRF / J2000.0 true ecliptic of date",
            "assumptions": CALCULATION_ASSUMPTIONS.copy(),
        },
    }
