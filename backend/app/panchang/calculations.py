"""Pure mathematical calculation functions for core Panchang Angas: Tithi, Nakshatra, Yoga, and Karana."""

import math
from datetime import datetime
from typing import Any

from app.astronomy.calculator import calculate_planetary_positions
from app.panchang.constants import (
    FIXED_KARANAS,
    KARANA_SPAN_DEG,
    LONGITUDE_CONVENTIONS,
    NAKSHATRA_NAMES,
    NAKSHATRA_SPAN_DEG,
    REPEATING_KARANAS,
    TITHI_NAMES,
    TITHI_SPAN_DEG,
    YOGA_NAMES,
    YOGA_SPAN_DEG,
)
from app.traditional.angle_utils import normalize_angle


def validate_finite_angle(angle: float, param_name: str) -> float:
    """Validate that the given angle is a finite numeric value."""
    if (
        isinstance(angle, bool)
        or not isinstance(angle, (int, float))
        or not math.isfinite(angle)
    ):
        raise ValueError(f"{param_name} must be a finite numeric value.")
    return float(angle)


def calculate_tithi(
    moon_longitude_deg: float,
    sun_longitude_deg: float,
) -> dict[str, Any]:
    """
    Calculate Tithi (1-30) from Moon-Sun angular separation.

    Separation is normalized to [0, 360) and divided into 30 intervals of 12 degrees.
    Boundary convention: [start, end) where lower boundary is inclusive.

    Note on Longitudes:
    Can accept either tropical or sidereal longitudes because ayanamsha cancels:
    (Moon_sidereal - Sun_sidereal) == (Moon_tropical - Sun_tropical) % 360.
    """
    m_lon = validate_finite_angle(moon_longitude_deg, "moon_longitude_deg")
    s_lon = validate_finite_angle(sun_longitude_deg, "sun_longitude_deg")

    angular_sep = normalize_angle(m_lon - s_lon)

    # 1-based Tithi index: 1 to 30
    tithi_index = (int(math.floor(angular_sep / TITHI_SPAN_DEG)) % 30) + 1

    # Paksha classification
    if tithi_index <= 15:
        paksha = "Shukla"
        tithi_in_paksha = tithi_index
    else:
        paksha = "Krishna"
        tithi_in_paksha = tithi_index - 15

    elapsed_deg = max(
        0.0,
        min(
            TITHI_SPAN_DEG,
            angular_sep - (tithi_index - 1) * TITHI_SPAN_DEG,
        ),
    )
    fraction_elapsed = elapsed_deg / TITHI_SPAN_DEG

    return {
        "index": tithi_index,
        "name": TITHI_NAMES[tithi_index - 1],
        "paksha": paksha,
        "tithi_in_paksha": tithi_in_paksha,
        "angular_separation_deg": angular_sep,
        "elapsed_deg_in_tithi": elapsed_deg,
        "fraction_elapsed": fraction_elapsed,
        "boundary_convention": "[start, end) degrees, lower inclusive, upper exclusive",
    }


def calculate_nakshatra(
    moon_sidereal_longitude_deg: float,
) -> dict[str, Any]:
    """
    Calculate Nakshatra (1-27) from Moon's Lahiri sidereal longitude.

    Divides the 360-degree zodiac into 27 equal sectors of 13°20' (40/3 degrees).
    Boundary convention: [start, end) where lower boundary is inclusive.
    """
    m_sid = validate_finite_angle(
        moon_sidereal_longitude_deg, "moon_sidereal_longitude_deg"
    )

    norm_lon = normalize_angle(m_sid)

    # 1-based Nakshatra index: 1 to 27
    nakshatra_index = (int(math.floor(norm_lon / NAKSHATRA_SPAN_DEG)) % 27) + 1

    elapsed_deg = max(
        0.0,
        min(
            NAKSHATRA_SPAN_DEG,
            norm_lon - (nakshatra_index - 1) * NAKSHATRA_SPAN_DEG,
        ),
    )
    fraction_elapsed = elapsed_deg / NAKSHATRA_SPAN_DEG

    return {
        "index": nakshatra_index,
        "name": NAKSHATRA_NAMES[nakshatra_index - 1],
        "sidereal_longitude_deg": norm_lon,
        "elapsed_deg_in_nakshatra": elapsed_deg,
        "fraction_elapsed": fraction_elapsed,
        "sector_span_deg": NAKSHATRA_SPAN_DEG,
        "boundary_convention": "[start, end) degrees, lower inclusive, upper exclusive",
    }


def calculate_yoga(
    sun_sidereal_longitude_deg: float,
    moon_sidereal_longitude_deg: float,
) -> dict[str, Any]:
    """
    Calculate Yoga (1-27) from the sum of Sun and Moon Lahiri sidereal longitudes.

    Normalized sum is divided into 27 equal sectors of 13°20' (40/3 degrees).
    Boundary convention: [start, end) where lower boundary is inclusive.

    Note: Must strictly use sidereal longitudes because the sum of tropical longitudes
    includes 2 * Ayanamsha (~48.5° offset in 2026).
    """
    s_sid = validate_finite_angle(
        sun_sidereal_longitude_deg, "sun_sidereal_longitude_deg"
    )
    m_sid = validate_finite_angle(
        moon_sidereal_longitude_deg, "moon_sidereal_longitude_deg"
    )

    combined_lon = normalize_angle(s_sid + m_sid)

    # 1-based Yoga index: 1 to 27
    yoga_index = (int(math.floor(combined_lon / YOGA_SPAN_DEG)) % 27) + 1

    elapsed_deg = max(
        0.0,
        min(
            YOGA_SPAN_DEG,
            combined_lon - (yoga_index - 1) * YOGA_SPAN_DEG,
        ),
    )
    fraction_elapsed = elapsed_deg / YOGA_SPAN_DEG

    return {
        "index": yoga_index,
        "name": YOGA_NAMES[yoga_index - 1],
        "combined_longitude_deg": combined_lon,
        "elapsed_deg_in_yoga": elapsed_deg,
        "fraction_elapsed": fraction_elapsed,
        "sector_span_deg": YOGA_SPAN_DEG,
        "boundary_convention": "[start, end) degrees, lower inclusive, upper exclusive",
    }


def calculate_karana(
    moon_longitude_deg: float,
    sun_longitude_deg: float,
) -> dict[str, Any]:
    """
    Calculate Karana (half of a Tithi, 6 degrees) from Moon-Sun angular separation.

    Sequence across the 60 half-tithis of a lunar month:
    - Half-Tithi 1:  Kintughna (Fixed Karana #4)
    - Half-Tithi 2-57: 8 recurring cycles of 7 repeating Karanas (Bava to Vishti)
    - Half-Tithi 58: Shakuni (Fixed Karana #1)
    - Half-Tithi 59: Chatushpada (Fixed Karana #2)
    - Half-Tithi 60: Naga (Fixed Karana #3)
    """
    m_lon = validate_finite_angle(moon_longitude_deg, "moon_longitude_deg")
    s_lon = validate_finite_angle(sun_longitude_deg, "sun_longitude_deg")

    angular_sep = normalize_angle(m_lon - s_lon)

    # 1-based half-tithi index: 1 to 60
    half_tithi_index = (int(math.floor(angular_sep / KARANA_SPAN_DEG)) % 60) + 1

    if half_tithi_index in FIXED_KARANAS:
        name = FIXED_KARANAS[half_tithi_index]
        karana_type = "fixed"
        canonical_name = name
        display_name = name
        alias = "Kintughna" if half_tithi_index == 1 else None
    else:
        # Repeating karanas cycle for indices 2 through 57
        rep_idx = (half_tithi_index - 2) % 7
        name = REPEATING_KARANAS[rep_idx]
        karana_type = "repeating"
        canonical_name = name
        display_name = "Vishti (Bhadra)" if name == "Vishti" else name
        alias = "Bhadra" if name == "Vishti" else None

    elapsed_deg = max(
        0.0,
        min(
            KARANA_SPAN_DEG,
            angular_sep - (half_tithi_index - 1) * KARANA_SPAN_DEG,
        ),
    )
    fraction_elapsed = elapsed_deg / KARANA_SPAN_DEG

    return {
        "half_tithi_index": half_tithi_index,
        "name": name,
        "canonical_name": canonical_name,
        "display_name": display_name,
        "alias": alias,
        "karana_type": karana_type,
        "angular_separation_deg": angular_sep,
        "elapsed_deg_in_karana": elapsed_deg,
        "fraction_elapsed": fraction_elapsed,
        "boundary_convention": "[start, end) degrees, lower inclusive, upper exclusive",
    }


def calculate_panchang_angas(
    sun_sidereal_deg: float,
    moon_sidereal_deg: float,
) -> dict[str, Any]:
    """Calculate all four core Angas from Sun and Moon Lahiri sidereal longitudes."""
    tithi = calculate_tithi(moon_sidereal_deg, sun_sidereal_deg)
    nakshatra = calculate_nakshatra(moon_sidereal_deg)
    yoga = calculate_yoga(sun_sidereal_deg, moon_sidereal_deg)
    karana = calculate_karana(moon_sidereal_deg, sun_sidereal_deg)

    return {
        "tithi": tithi,
        "nakshatra": nakshatra,
        "yoga": yoga,
        "karana": karana,
        "longitude_conventions": LONGITUDE_CONVENTIONS.copy(),
    }


def calculate_panchang_angas_at_instant(
    instant: str | datetime,
    *,
    auto_download: bool = True,
) -> dict[str, Any]:
    """
    Calculate the four core Panchang Angas at a specific timezone-aware instant.

    Reuses Person 2's modern astronomy engine to compute apparent Lahiri sidereal positions.
    """
    positions = calculate_planetary_positions(instant, auto_download=auto_download)

    sun_sidereal = positions["positions_sidereal_deg"]["Sun"]
    moon_sidereal = positions["positions_sidereal_deg"]["Moon"]

    angas = calculate_panchang_angas(sun_sidereal, moon_sidereal)

    return {
        "instant": positions["instant"],
        "julian_date_tt": positions["julian_date_tt"],
        "ayanamsha_name": positions["ayanamsha_name"],
        "ayanamsha_deg": positions["ayanamsha_deg"],
        "sun_sidereal_deg": sun_sidereal,
        "moon_sidereal_deg": moon_sidereal,
        **angas,
    }
