"""Pure service for comparing traditional and modern longitudes."""

import math
from collections.abc import Mapping
from typing import Any

from app.traditional.angle_utils import (
    normalize_angle,
    signed_angular_difference,
)


LIMITATIONS = [
    "A longitude difference is not, by itself, proof of either method's accuracy.",
    "The comparison is meaningful only when coordinate systems, reference frames, "
    "epochs, and other conventions are compatible.",
    "Traditional and modern values must refer to the same instant.",
    "Mock modern positions are illustrative test data, not real ephemeris results.",
]


def _validate_positions(
    positions: Mapping[str, float],
    label: str,
) -> dict[str, tuple[str, float]]:
    """Validate positions and index them by case-insensitive planet name."""
    if not isinstance(positions, Mapping):
        raise ValueError(f"{label} positions must be a mapping.")

    validated: dict[str, tuple[str, float]] = {}

    for planet, longitude in positions.items():
        if not isinstance(planet, str) or not planet.strip():
            raise ValueError(f"{label} planet names must be non-empty strings.")

        key = planet.strip().casefold()
        if key in validated:
            raise ValueError(
                f"{label} contains duplicate planet name: {planet!r}."
            )

        if isinstance(longitude, bool) or not isinstance(longitude, (int, float)):
            raise ValueError(
                f"{label} longitude for {planet!r} must be numeric."
            )

        if not math.isfinite(longitude):
            raise ValueError(
                f"{label} longitude for {planet!r} must be finite."
            )

        validated[key] = (planet.strip(), normalize_angle(float(longitude)))

    return validated


def compare_planetary_positions(
    traditional_positions: Mapping[str, float],
    modern_positions: Mapping[str, float],
    *,
    traditional_method: str,
    modern_method: str,
    modern_data_source: str = "mock",
    coordinate_system: str = "unspecified",
    instant: str | None = None,
) -> dict[str, Any]:
    """
    Compare matching planetary longitudes in degrees.

    Position mappings use planet names as keys and ecliptic longitudes
    as values. Only planets present in both mappings are compared.

    modern_data_source must be "mock" or "provider". "provider" means
    supplied by an external provider; it does not independently guarantee
    that the data is scientifically accurate.
    """
    if not isinstance(traditional_method, str) or not traditional_method.strip():
        raise ValueError("traditional_method must be provided.")

    if not isinstance(modern_method, str) or not modern_method.strip():
        raise ValueError("modern_method must be provided.")

    if modern_data_source not in {"mock", "provider"}:
        raise ValueError("modern_data_source must be 'mock' or 'provider'.")

    if not isinstance(coordinate_system, str) or not coordinate_system.strip():
        raise ValueError("coordinate_system must be provided.")

    if instant is not None and (
        not isinstance(instant, str) or not instant.strip()
    ):
        raise ValueError("instant must be a non-empty string or None.")

    traditional = _validate_positions(
        traditional_positions, "Traditional"
    )
    modern = _validate_positions(modern_positions, "Modern")

    common_planets = traditional.keys() & modern.keys()
    if not common_planets:
        raise ValueError(
            "No matching planets were supplied for comparison."
        )

    results = []

    # Keep the output order predictable by using the traditional input order.
    for key, (planet, traditional_longitude) in traditional.items():
        if key not in common_planets:
            continue

        modern_longitude = modern[key][1]
        difference = signed_angular_difference(
            traditional_longitude,
            modern_longitude,
        )

        results.append({
            "planet": planet,
            "traditional_longitude_deg": traditional_longitude,
            "modern_longitude_deg": modern_longitude,
            "signed_difference_deg": difference,
            "absolute_difference_deg": abs(difference),
        })

    return {
        "status": "mock_data" if modern_data_source == "mock" else "comparison",
        "is_mock": modern_data_source == "mock",
        "traditional_method": traditional_method.strip(),
        "modern_method": modern_method.strip(),
        "modern_data_source": modern_data_source,
        "coordinate_system": coordinate_system.strip(),
        "instant": instant,
        "compared_planets": [item["planet"] for item in results],
        "unmatched_traditional_planets": [
            name for key, (name, _) in traditional.items()
            if key not in modern
        ],
        "unmatched_modern_planets": [
            name for key, (name, _) in modern.items()
            if key not in traditional
        ],
        "results": results,
        "chart_data": [
            {
                "planet": item["planet"],
                "traditional_longitude_deg": item["traditional_longitude_deg"],
                "modern_longitude_deg": item["modern_longitude_deg"],
                "absolute_difference_deg": item["absolute_difference_deg"],
            }
            for item in results
        ],
        "limitations": LIMITATIONS.copy(),
    }
