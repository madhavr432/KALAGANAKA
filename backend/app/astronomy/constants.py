"""Constants and reference metadata for modern astronomical calculations."""

# Supported classical planets / luminaries
SUPPORTED_PLANETS = [
    "Sun",
    "Moon",
    "Mercury",
    "Venus",
    "Mars",
    "Jupiter",
    "Saturn",
]

# Mapping from canonical planet name to JPL DE421 ephemeris target identifiers.
# In JPL DE421 kernels:
# - Jupiter and Saturn are tracked by their system barycenters (targets 5 and 6).
# - Mercury, Venus, and Mars are tracked by their planet centers (targets 199, 299, 499).
# - Sun and Moon are targets 10 and 301.
PLANET_EPHEMERIS_TARGETS: dict[str, str] = {
    "Sun": "sun",
    "Moon": "moon",
    "Mercury": "mercury",
    "Venus": "venus",
    "Mars": "mars",
    "Jupiter": "jupiter barycenter",
    "Saturn": "saturn barycenter",
}

# JPL DE421 approximate validity bounds
# Start: JD 2414864.5 TT = 1899-07-29 00:00:00 TT (1899-07-28 23:59:18 UTC)
DE421_START_JD = 2414864.5
# End: JD 2471184.5 TT = 2053-10-09 00:00:00 TT (2053-10-08 23:58:51 UTC)
DE421_END_JD = 2471184.5

DE421_START_DATE_STR = "1899-07-29"  # Calendar date in TT
DE421_END_DATE_STR = "2053-10-08"    # Calendar date in UTC

# Reference metadata
EPHEMERIS_NAME = "JPL DE421"
REFERENCE_FRAME = "Geocentric true equator and equinox of date (apparent coordinates)"
COORDINATE_SYSTEM = "Ecliptic coordinates of date"
TIME_STANDARD = "UTC (input) converted to TT (Terrestrial Time)"
AYANAMSHA_NAME = "Lahiri (Chitrapaksha)"

CALCULATION_ASSUMPTIONS = [
    "Apparent positions include light-travel time correction, gravitational deflection of light, and stellar aberration.",
    "Ecliptic coordinates are referenced to the true ecliptic and equinox of date (accounting for precession and nutation).",
    "Distances are calculated geocentrically in Astronomical Units (AU) and Kilometers (km).",
    "Lahiri (Chitrapaksha) sidereal longitude is computed by subtracting the Positional Astronomy Centre (PAC, Kolkata) standard Ayanamsha polynomial from apparent tropical longitude.",
    "Jupiter and Saturn coordinates refer to their planetary system barycenters as defined in the JPL DE421 kernel.",
]
