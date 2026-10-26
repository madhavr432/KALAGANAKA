"""Service layer for Panchang instantaneous calculations and transitions."""

from datetime import datetime
from typing import Any

from app.panchang.transitions import (
    find_next_transition,
    find_panchang_transitions,
    get_instant_panchang,
)


def get_panchang_instant(
    instant: str | datetime,
    timezone_str: str = "UTC",
    *,
    auto_download: bool = True,
) -> dict[str, Any]:
    """Calculate instantaneous Panchang Angas at a specific instant."""
    return get_instant_panchang(
        instant=instant,
        timezone_str=timezone_str,
        auto_download=auto_download,
    )


def get_panchang_next_transition(
    instant: str | datetime,
    anga_type: str,
    timezone_str: str = "UTC",
    *,
    auto_download: bool = True,
) -> dict[str, Any]:
    """Calculate the next boundary transition for a specific Anga type."""
    return find_next_transition(
        instant=instant,
        anga_type=anga_type,
        timezone_str=timezone_str,
        auto_download=auto_download,
    )


def get_panchang_interval_transitions(
    start_instant: str | datetime,
    end_instant: str | datetime,
    anga_types: list[str] | None = None,
    timezone_str: str = "UTC",
    *,
    limit: int | None = None,
    auto_download: bool = True,
) -> dict[str, Any]:
    """Calculate all boundary transitions over a specified time interval."""
    return find_panchang_transitions(
        start_instant=start_instant,
        end_instant=end_instant,
        anga_types=anga_types,
        timezone_str=timezone_str,
        limit=limit,
        auto_download=auto_download,
    )
