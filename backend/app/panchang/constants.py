"""Constants, names, and sector spans for traditional Indian Panchang calculations."""

from typing import Final

# Sector angular spans in degrees
TITHI_SPAN_DEG: Final[float] = 12.0
KARANA_SPAN_DEG: Final[float] = 6.0
NAKSHATRA_SPAN_DEG: Final[float] = 360.0 / 27.0  # 13 degrees 20 minutes = 13.333333333333334 deg
YOGA_SPAN_DEG: Final[float] = 360.0 / 27.0       # 13 degrees 20 minutes = 13.333333333333334 deg

# Canonical list of 30 Tithis in a lunar month
TITHI_NAMES: Final[list[str]] = [
    # Shukla Paksha (Bright Fortnight, 1-15)
    "Pratipada",
    "Dwitiya",
    "Tritiya",
    "Chaturthi",
    "Panchami",
    "Shhashthi",
    "Saptami",
    "Ashtami",
    "Navami",
    "Dashami",
    "Ekadashi",
    "Dvadashi",
    "Trayodashi",
    "Chaturdashi",
    "Purnima",
    # Krishna Paksha (Dark Fortnight, 16-30)
    "Pratipada",
    "Dwitiya",
    "Tritiya",
    "Chaturthi",
    "Panchami",
    "Shhashthi",
    "Saptami",
    "Ashtami",
    "Navami",
    "Dashami",
    "Ekadashi",
    "Dvadashi",
    "Trayodashi",
    "Chaturdashi",
    "Amavasya",
]

# Canonical list of 27 Nakshatras
NAKSHATRA_NAMES: Final[list[str]] = [
    "Ashwini",
    "Bharani",
    "Krittika",
    "Rohini",
    "Mrigashirsha",
    "Ardra",
    "Punarvasu",
    "Pushya",
    "Ashlesha",
    "Magha",
    "Purva Phalguni",
    "Uttara Phalguni",
    "Hasta",
    "Chitra",
    "Swati",
    "Vishakha",
    "Anuradha",
    "Jyeshtha",
    "Mula",
    "Purva Ashadha",
    "Uttara Ashadha",
    "Shravana",
    "Dhanishta",
    "Shatabhisha",
    "Purva Bhadrapada",
    "Uttara Bhadrapada",
    "Revati",
]

# Canonical list of 27 Yogas
YOGA_NAMES: Final[list[str]] = [
    "Vishkambha",
    "Priti",
    "Ayushman",
    "Saubhagya",
    "Shobhana",
    "Atiganda",
    "Sukarma",
    "Dhriti",
    "Shula",
    "Ganda",
    "Vriddhi",
    "Dhruva",
    "Vyaghata",
    "Harshana",
    "Vajra",
    "Siddhi",
    "Vyatipata",
    "Variyan",
    "Parigha",
    "Shiva",
    "Siddha",
    "Sadhya",
    "Shubha",
    "Shukla",
    "Brahma",
    "Indra",
    "Vaidhriti",
]

# 4 Fixed (Sthira) Karanas with their explicit 1-based half-Tithi indices
# - Kimstughna: 1st half of Shukla Pratipada (Half-Tithi 1)
# - Shakuni:    2nd half of Krishna Chaturdashi (Half-Tithi 58)
# - Chatushpada: 1st half of Amavasya (Half-Tithi 59)
# - Naga:       2nd half of Amavasya (Half-Tithi 60)
FIXED_KARANAS: Final[dict[int, str]] = {
    1: "Kimstughna",
    58: "Shakuni",
    59: "Chatushpada",
    60: "Naga",
}

# 7 Repeating (Chara / Movable) Karanas cycling through Half-Tithis 2 to 57 (8 cycles x 7 = 56)
REPEATING_KARANAS: Final[list[str]] = [
    "Bava",
    "Balava",
    "Kaulava",
    "Taitila",
    "Gara",
    "Vanija",
    "Vishti",
]

# Total half-tithi count in a lunar month
TOTAL_HALF_TITHIS: Final[int] = 60

# Documentation of longitude conventions
LONGITUDE_CONVENTIONS = {
    "tithi_and_karana": (
        "Calculated from relative angular separation: (Moon - Sun) % 360. "
        "Mathematically invariant between tropical and sidereal coordinates because "
        "the ayanamsha cancels out identically: (Moon_sid - Sun_sid) = (Moon_trop - Sun_trop)."
    ),
    "nakshatra": (
        "Strictly requires the Moon's Lahiri (Chitrapaksha) sidereal longitude. "
        "Divides the sidereal zodiac into 27 equal 13°20' sectors starting from 0° Aries (Mesha)."
    ),
    "yoga": (
        "Strictly requires the normalized sum of sidereal Sun and Moon longitudes: "
        "(Sun_sidereal + Moon_sidereal) % 360. "
        "Tropical coordinates must NOT be used because (Sun_trop + Moon_trop) includes 2 * Ayanamsha."
    ),
}
