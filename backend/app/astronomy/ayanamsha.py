"""Calculation of Lahiri (Chitrapaksha) Ayanamsha.

The Lahiri (Chitrapaksha) Ayanamsha is the official standard adopted by the
Calendar Reform Committee of the Government of India (1955) and the Positional
Astronomy Centre (PAC, Kolkata).

Reference Definition:
- Epoch: J2000.0 (JD 2451545.0 TT, 2000 January 1 12:00:00 TT).
- Value at J2000.0: 23° 51' 25.532" (approx. 23.85709222°).
- Precession rate: Standard IAU precession polynomial adjusted for the
  Chitrapaksha fiducial star (Spica / Chitra at sidereal longitude 180°).
"""

import math
from skyfield.timelib import Time

# Base Ayanamsha at J2000.0 in degrees: 23 deg, 51 min, 25.532 sec
AYANAMSHA_J2000_DEG = 23.0 + 51.0 / 60.0 + 25.532 / 3600.0

# Rate coefficients in arcseconds per Julian century from J2000.0 (TT)
P1_ARCSEC = 5029.0966
P2_ARCSEC = 1.11161


def calculate_lahiri_ayanamsha_from_tt(jd_tt: float) -> float:
    """Calculate Lahiri Ayanamsha in degrees from Julian Date in Terrestrial Time (TT)."""
    if not isinstance(jd_tt, (int, float)) or not math.isfinite(jd_tt):
        raise ValueError("jd_tt must be a finite number.")

    # Julian centuries of 36,525 days from J2000.0
    t_centuries = (jd_tt - 2451545.0) / 36525.0

    arcsec_offset = (P1_ARCSEC * t_centuries) + (P2_ARCSEC * (t_centuries**2))
    return AYANAMSHA_J2000_DEG + (arcsec_offset / 3600.0)


def calculate_lahiri_ayanamsha(time: Time) -> float:
    """Calculate Lahiri Ayanamsha in degrees for a given Skyfield Time object."""
    return calculate_lahiri_ayanamsha_from_tt(float(time.tt))
