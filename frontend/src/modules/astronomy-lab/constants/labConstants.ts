/**
 * constants/labConstants.ts
 * Verified historical sources, classical formulas, authentic instrument archives,
 * and scientific comparison standards for Module 5: Ancient vs Modern Analysis Lab.
 */

import type {
  TraditionalFormulaDefinition,
  AstronomicalInstrument,
  InstrumentSideBySideComparison,
  ScientificFaqItem,
} from "../types/astronomyLab";

/**
 * Verified formulas implemented or analyzed within KalaGanaka.
 */
export const VERIFIED_FORMULAS: TraditionalFormulaDefinition[] = [
  {
    id: "surya-siddhanta-mean-motion",
    name: "Surya Siddhanta Mean Solar Motion",
    nameSanskrit: "सूर्यसिद्धान्तोक्त सूर्य मध्यम गति",
    category: "solar-motion",
    formulaLatex:
      "\\lambda_{\\text{mean}}(t) = \\left( \\lambda_{\\text{epoch}} + \\Delta t \\times \\frac{360^\\circ \\times \\text{Rev}_{\\text{Maha}}}{\\text{Days}_{\\text{Maha}}} \\right) \\bmod 360^\\circ",
    formulaCodeSnippet: `// Daily solar motion in degrees:
const REVOLUTIONS_PER_MAHAYUGA = 4_320_000;
const CIVIL_DAYS_PER_MAHAYUGA = 1_577_917_828;
const dailyMotion = 360.0 * REVOLUTIONS_PER_MAHAYUGA / CIVIL_DAYS_PER_MAHAYUGA;
// dailyMotion = 0.9856026645398... deg/day (59' 08'' 10''')

// Date-based calculation from Ujjain 1860 reference:
const elapsedDays = (targetDate - REFERENCE_DATE_1860).days;
const meanSolarLongitude = normalizeAngle(
  REFERENCE_MEAN_SOLAR_LONGITUDE_DEG + elapsedDays * dailyMotion
);`,
    provenance: {
      sourceType: "explicit-historical-text",
      historicalSourceText:
        "Surya Siddhanta (सूर्यसिद्धान्त), Chapter 1 (Madhyamadhikara), Verses 29–34",
      historicalVerseOrChapter: "Chapter 1, Verses 29–34 (Number of revolutions in a Mahayuga)",
      historicalAuthor: "Traditional attribution to Maya / Solar Revelation",
      historicalTranslator: "Rev. Ebenezer Burgess, annotated by William Dwight Whitney (1860)",
      historicalYear: "c. 5th–8th Century CE (Recension translated 1860)",
      historicalUrl: "https://archive.org/details/translationofsur00burgiala",
      modernScholarlyRef:
        "Burgess, E. (1860). 'Translation of the Surya-Siddhanta, a Text-Book of Hindu Astronomy'. Journal of the American Oriental Society, Vol. 6, pp. 141–498.",
      modernScholarlyUrl: "https://www.jstor.org/stable/592174",
    },
    variableDefinitions: [
      {
        symbol: "λ_mean",
        name: "Mean Solar Longitude",
        unit: "degrees (°)",
        range: "[0°, 360°)",
        description:
          "Mean angular position of the Sun along the sidereal ecliptic without eccentricity corrections.",
      },
      {
        symbol: "λ_epoch",
        name: "Reference Epoch Longitude",
        unit: "degrees (°)",
        description:
          "Published mean position at the reference epoch (257° 48' 07\" on Jan 1, 1860 midnight Ujjain).",
      },
      {
        symbol: "Δt",
        name: "Elapsed Civil Days",
        unit: "days",
        description:
          "Number of elapsed civil days between the calculation date and the reference epoch.",
      },
      {
        symbol: "Rev_Maha",
        name: "Revolutions per Mahayuga",
        unit: "integer revolutions",
        description: "Constant 4,320,000 solar revolutions in one cosmic Mahayuga (Great Age).",
      },
      {
        symbol: "Days_Maha",
        name: "Civil Days per Mahayuga",
        unit: "integer days",
        description:
          "Constant 1,577,917,828 terrestrial solar days in one Mahayuga according to the Surya Siddhanta.",
      },
    ],
    inputUnits: "Gregorian Date (YYYY-MM-DD), interpreted at civil midnight at the Ujjain meridian",
    outputUnits: "Degrees [0°, 360°), expressible in Rashis, Degrees, Minutes, and Seconds",
    timeConventions: "Local Solar Civil Midnight at Ujjain Meridian (75° 46' E longitude)",
    coordinateSystem: "Traditional Sidereal (Nirayana) ecliptic coordinates",
    referenceEpoch: "January 1, 1860 CE, midnight at Ujjain (Burgess benchmark: 257° 48' 07\")",
    assumptionsAndLimitations: [
      "Assumes uniform circular motion without elliptical perturbation or planetary gravitational pull.",
      "Does not calculate true apparent solar longitude; Mandaphala (equation of the center) must be applied separately.",
      "Reference epoch is anchored to Burgess's published 1860 tables rather than a full continuous Julian Day calendar epoch.",
      "This is a preliminary educational implementation, not a validated nautical ephemeris.",
    ],
    beginnerExplanation:
      "Traditional Indian astronomy calculates the Sun's average daily movement by dividing the total revolutions of the Sun in a 4.32-million-year Great Age (Mahayuga) by the number of earthly days in that same age. This yields an average daily movement of approximately 0.9856 degrees per day (59 arcminutes and 8 arcseconds).",
    stepByStepExplanation: [
      "1. Determine the number of elapsed civil days between the requested date and the verified reference date (January 1, 1860).",
      "2. Multiply the elapsed days by the constant daily solar speed: 360° × 4,320,000 / 1,577,917,828 ≈ 0.98560266°/day.",
      "3. Add the result to the verified reference position at Ujjain (257.80194°).",
      "4. Modulo the sum by 360° to bring the angle into the range [0°, 360°).",
    ],
  },
  {
    id: "equation-of-the-center-mandaphala",
    name: "Surya Siddhanta Equation of the Center (Mandaphala)",
    nameSanskrit: "सूर्यसिद्धान्तोक्त मन्दफल संस्कार",
    category: "solar-motion",
    formulaLatex:
      "M = (\\lambda_{\\text{mean}} - \\lambda_{\\text{apsis}}) \\bmod 360^\\circ, \\quad \\sin(\\Delta\\lambda_{\\text{manda}}) = \\frac{r_0}{360^\\circ} \\sin(M)",
    formulaCodeSnippet: `// Mean anomaly M relative to the solar apogee (Mandocca):
const M = normalizeAngle(meanLongitude - solarApsisLongitude);
const M_rad = (M * Math.PI) / 180;

// Traditional epicycle radius r0 = 13° 40' = 13.6667°:
const epicycleRadiusDeg = 13 + 40 / 60; // 13.6667°
const mandaphalaRad = Math.asin((epicycleRadiusDeg / 360) * Math.sin(M_rad));
const mandaphalaDeg = (mandaphalaRad * 180) / Math.PI;

// True longitude (Spashta Graha):
const trueLongitude = normalizeAngle(meanLongitude - mandaphalaDeg);`,
    provenance: {
      sourceType: "explicit-historical-text",
      historicalSourceText: "Surya Siddhanta, Chapter 2 (Spashtadhikara), Verses 12–45",
      historicalVerseOrChapter:
        "Chapter 2, Verses 34–39 (The correction for apsis / Manda epicycle)",
      historicalAuthor: "Classical Indian Astronomical Tradition",
      historicalTranslator: "Rev. E. Burgess (1860), pp. 210–232",
      historicalYear: "c. 5th–10th Century CE",
      historicalUrl: "https://archive.org/details/translationofsur00burgiala",
      modernScholarlyRef:
        "Plofker, K. (2009). 'Mathematics in India', Princeton University Press, Ch. 4 (Astronomical Models), pp. 91–118.",
      modernScholarlyUrl:
        "https://press.princeton.edu/books/hardcover/9780691120676/mathematics-in-india",
    },
    variableDefinitions: [
      {
        symbol: "M",
        name: "Mean Anomaly (Manda Kendra)",
        unit: "degrees (°)",
        description:
          "Angular distance of the Sun from its slowest orbital point (apogee / Mandocca).",
      },
      {
        symbol: "λ_apsis",
        name: "Solar Apogee Longitude (Mandocca)",
        unit: "degrees (°)",
        description:
          "Position of solar apogee (approx 77° to 80° in sidereal frame, drifting ~1 arcminute every 516.8 years).",
      },
      {
        symbol: "r_0",
        name: "Manda Epicycle Circumference",
        unit: "degrees (°)",
        description:
          "Canonical circumference of the solar epicycle (13° 40' in the Surya Siddhanta, 14° in Aryabhatiya).",
      },
      {
        symbol: "Δλ_manda",
        name: "Equation of the Center (Mandaphala)",
        unit: "degrees (°)",
        description:
          "Correction angle added or subtracted from mean longitude to produce true longitude.",
      },
    ],
    inputUnits: "Mean solar longitude (degrees) and target year",
    outputUnits: "Degrees [0°, 360°)",
    timeConventions: "Continuous sidereal coordinate",
    coordinateSystem: "Traditional Nirayana (Sidereal) Ecliptic",
    referenceEpoch: "Apsis linear drift anchored to 1850 CE benchmark (95° 04')",
    assumptionsAndLimitations: [
      "The ancient epicyclic model uses a circular eccentric/epicycle geometry that mirrors Kepler's first and second laws to first order in eccentricity.",
      "The maximum correction is approximately 2° 10' 30\", closely matching the modern value of 2 × e ≈ 1.914° (with slight differences due to epochal values).",
    ],
    beginnerExplanation:
      "Because Earth travels around the Sun in an ellipse rather than a circle, its speed changes throughout the year. The Sun appears to move fastest in early January and slowest in early July. Traditional astronomers modeled this with an 'epicycle' (a small secondary wheel), producing a smooth periodic correction of up to ±2.18 degrees called Mandaphala.",
    stepByStepExplanation: [
      "1. Find the Sun's distance from its slowest orbital point (apogee or Mandocca).",
      "2. Calculate the sine of this angle: sin(M).",
      "3. Scale by the ratio of the small epicycle circumference to the large orbit circle (13.6667° / 360°).",
      "4. Take the arcsine to find the correction angle Δλ.",
      "5. Subtract Δλ from the mean position to obtain the true apparent position.",
    ],
  },
  {
    id: "panchang-tithi-formula",
    name: "Tithi Angular Separation Formula",
    nameSanskrit: "तिथि साधन गणित सूत्र",
    category: "lunar-panchang",
    formulaLatex:
      "\\text{Tithi Index} = \\left\\lfloor \\frac{(\\lambda_{\\text{Moon}} - \\lambda_{\\text{Sun}}) \\bmod 360^\\circ}{12^\\circ} \\right\\rfloor + 1",
    formulaCodeSnippet: `// Pure angular elongation in degrees:
const elongationDeg = (moonLongitudeDeg - sunLongitudeDeg + 360) % 360;

// 1-based Tithi index [1, 30]:
const tithiIndex = Math.floor(elongationDeg / 12.0) + 1;
const elapsedDeg = elongationDeg % 12.0;
const fractionElapsed = elapsedDeg / 12.0;

// Paksha determination:
const paksha = tithiIndex <= 15 ? "Shukla" : "Krishna";`,
    provenance: {
      sourceType: "explicit-historical-text",
      historicalSourceText: "Vedanga Jyotisha, verse 14; Surya Siddhanta, Madhyamadhikara",
      historicalVerseOrChapter:
        "Surya Siddhanta Ch. 1, Verse 13 ('Twelve degrees of separation between Sun and Moon make a Tithi')",
      historicalAuthor: "Sage Lagadha / Ancient Vedic Tradition",
      historicalTranslator: "Burgess (1860); K.S. Shukla (1976)",
      historicalYear: "c. 1200 BCE – 500 CE",
      historicalUrl: "https://archive.org/details/vedangajyotisham00shukuoft",
      modernScholarlyRef:
        "Meeus, J. (1998). 'Astronomical Algorithms', 2nd Edition, Willmann-Bell, Chapters 48 & 49 (Phases of the Moon).",
      modernScholarlyUrl: "https://www.willbell.com/math/mc1.htm",
    },
    variableDefinitions: [
      {
        symbol: "λ_Moon",
        name: "Moon Ecliptic Longitude",
        unit: "degrees (°)",
        range: "[0°, 360°)",
        description: "Apparent geocentric ecliptic longitude of the Moon.",
      },
      {
        symbol: "λ_Sun",
        name: "Sun Ecliptic Longitude",
        unit: "degrees (°)",
        range: "[0°, 360°)",
        description: "Apparent geocentric ecliptic longitude of the Sun.",
      },
      {
        symbol: "θ",
        name: "Elongation Angle",
        unit: "degrees (°)",
        range: "[0°, 360°)",
        description:
          "Relative angular separation between the Moon and Sun along the ecliptic plane.",
      },
    ],
    inputUnits: "Ecliptic longitudes in degrees [0°, 360°)",
    outputUnits: "Integer index from 1 to 30",
    timeConventions: "Continuous instantaneous transition instant",
    coordinateSystem: "Ecliptic coordinates (invariant under equal precession subtraction)",
    referenceEpoch: "Universal mathematical definition across all epochs",
    assumptionsAndLimitations: [
      "Mathematical invariance: Because Ayanamsha is subtracted equally from both Moon and Sun, (λ_M - Δψ) - (λ_S - Δψ) = λ_M - λ_S. Tithi is identically identical in both Tropical and Sidereal systems!",
      "Actual duration varies from 19 to 26 hours due to combined orbital eccentricities of the Moon and Earth.",
    ],
    beginnerExplanation:
      "A Tithi is the time it takes for the Moon to pull 12 degrees ahead of the Sun in the sky. When the Moon and Sun are together, it is New Moon (Amavasya, 0°). When the Moon is directly opposite at 180°, it is Full Moon (Purnima). Each 12-degree step is one Tithi.",
    stepByStepExplanation: [
      "1. Obtain the current apparent longitudes of the Moon and Sun.",
      "2. Subtract the Sun's longitude from the Moon's longitude and normalize to [0°, 360°).",
      "3. Divide this elongation angle by 12 degrees.",
      "4. The integer part plus one gives the active Tithi index (1 to 30).",
    ],
  },
  {
    id: "lahiri-ayanamsha-formulation",
    name: "Lahiri (Chitrapaksha) Ayanamsha Polynomial",
    nameSanskrit: "लाहिड़ी (चित्रापक्ष) अयनांश सूत्र",
    category: "precession",
    formulaLatex:
      "\\Delta\\psi(T) = 23^\\circ 51' 11'' + 50.29'' \\times T + 0.000111'' \\times T^2",
    formulaCodeSnippet: `// Julian Centuries from J2000.0 (JD 2451545.0):
const T = (julianDate - 2451545.0) / 36525.0;

// Lahiri Chitrapaksha Ayanamsha in degrees:
// Epoch J2000 value: 23° 51' 11.2" = 23.853111°
const ayanamshaDeg = 23.853111 + (5029.0966 / 3600.0) * T + (1.112 / 3600.0) * T * T;

// Conversion between Tropical (Sayana) and Sidereal (Nirayana):
const siderealLongitude = (tropicalLongitude - ayanamshaDeg + 360) % 360;`,
    provenance: {
      sourceType: "explicit-historical-text",
      historicalSourceText:
        "Report of the Calendar Reform Committee (Government of India, 1955), Part II",
      historicalVerseOrChapter: "Chapter V (Ayanamsha and the National Calendar)",
      historicalAuthor: "Prof. Meghnad Saha (Chairman) and N.C. Lahiri (Secretary)",
      historicalYear: "1955 CE",
      historicalUrl: "https://archive.org/details/CalendarReformCommitteeReport1955",
      modernScholarlyRef:
        "Positional Astronomy Centre (India Meteorological Department, Kolkata). 'Indian Astronomical Ephemeris', published annually.",
      modernScholarlyUrl: "https://paconline.gov.in/",
    },
    variableDefinitions: [
      {
        symbol: "T",
        name: "Julian Centuries from J2000.0",
        unit: "centuries",
        description:
          "Time interval measured in Julian centuries of 36,525 ephemeris days from epoch January 1.5, 2000.",
      },
      {
        symbol: "Δψ",
        name: "Ayanamsha Precession Angle",
        unit: "degrees (°)",
        description:
          "Angular distance between the Vernal Equinox (First Point of Aries) and the anchor star Spica (Chitra) at 180°.",
      },
      {
        symbol: "50.29''",
        name: "General Precession in Longitude",
        unit: "arcseconds per year",
        description:
          "Rate of continuous westward drift of the equinox caused by Earth's axial precession.",
      },
    ],
    inputUnits: "Julian Ephemeris Date (JD) or Gregorian calendar instant",
    outputUnits: "Degrees [0°, 360°)",
    timeConventions: "Terrestrial Time (TT) / Ephemeris Time (ET)",
    coordinateSystem:
      "Coordinate rotation between Sayana (Tropical) and Nirayana (Sidereal) ecliptic",
    referenceEpoch: "Fixed Spica (Alpha Virginis / Chitra) at exactly 180° sidereal longitude",
    assumptionsAndLimitations: [
      "Anchored to the Chitrapaksha convention officially adopted by the Government of India in 1957.",
      "Other traditional schools use alternative Ayanamshas: Krishnamurti (KP, ~23° 45'), Raman (~22° 30'), or Pushya-paksha (~19° 10'). Differences range up to 4 degrees.",
    ],
    beginnerExplanation:
      "Due to the slow wobbling of the Earth's rotational axis (like a spinning top), the Spring Equinox point slowly drifts backward across the constellations by about 1 degree every 71.6 years. Ayanamsha is the exact correction angle needed to convert between modern western zodiac signs (anchored to the moving equinox) and traditional Indian constellations (anchored to fixed stars).",
    stepByStepExplanation: [
      "1. Calculate the time elapsed in Julian centuries from the J2000.0 standard epoch.",
      "2. Evaluate the PAC Kolkata polynomial: 23.8531° + 1.39697° × T.",
      "3. For the current year 2026, the Lahiri Ayanamsha is approximately 24.23° (24 degrees and 14 arcminutes).",
      "4. Subtract this angle from the tropical longitude to obtain the sidereal coordinate.",
    ],
  },
  {
    id: "konark-wheel-timekeeping-formula",
    name: "Konark Wheel Shadow-Angle-to-Time Equation",
    nameSanskrit: "कोणार्क चक्र छाया-काल गणित",
    category: "timekeeping",
    formulaLatex:
      "T_{\\text{solar}} = \\text{Prahar}_{\\text{base}} + \\left( \\frac{\\theta_{\\text{shadow}} - \\theta_{\\text{spoke}}}{45^\\circ} \\times 3\\text{ hours} \\right) = \\text{Spoke Time} + (N_{\\text{beads}} \\times 3\\text{ min})",
    formulaCodeSnippet: `// 8 major spokes divide 24 hours into 8 Prahars (3 hours = 180 min each):
// 8 minor spokes divide segments into 1.5 hours (90 min each):
// 30 beads between major and minor spoke -> 90 min / 30 beads = 3 min per bead:
const minutesPerBead = 90.0 / 30.0; // exactly 3 minutes

const totalMinutesFromSpoke = beadCount * minutesPerBead + (beadThirdFraction * 1.0);
const solarLocalTimeMinutes = baseSpokeMinutes + totalMinutesFromSpoke;`,
    provenance: {
      sourceType: "explicit-historical-text",
      historicalSourceText:
        "Archaeological Survey of India (ASI) Architectural Analysis of Konark Sun Temple",
      historicalVerseOrChapter: "Temple Chariot Wheels Sundial Documentation",
      historicalAuthor: "King Narasimhadeva I / Chief Architect Bishu Maharana",
      historicalYear: "c. 1250 CE",
      historicalUrl: "https://asi.nic.in/world-heritage-sites-konark-sun-temple/",
      modernScholarlyRef:
        "Donaldson, T.E. (2003). 'Konark', Oxford University Press; ASI Monograph on Sun Temple Wheels.",
      modernScholarlyUrl: "https://global.oup.com/academic/product/konark-9780195675917",
    },
    variableDefinitions: [
      {
        symbol: "T_solar",
        name: "Local Apparent Solar Time",
        unit: "hours:minutes",
        description:
          "Time of day determined directly from the Sun's position relative to the local meridian.",
      },
      {
        symbol: "N_beads",
        name: "Number of Beads Shadowed",
        unit: "count [0, 30]",
        description:
          "The count of small carved stone beads traversed by the central hub's gnomon shadow.",
      },
      {
        symbol: "3 min",
        name: "Bead Time Equivalent",
        unit: "minutes per bead",
        description: "Each bead represents 3 minutes of solar movement (90 minutes / 30 beads).",
      },
    ],
    inputUnits: "Shadow position on the wheel rim or count of beads from the nearest spoke",
    outputUnits: "Local Apparent Solar Time (hours and minutes)",
    timeConventions: "Local Apparent Solar Time (LAT) at Konark (86° 05' E longitude)",
    coordinateSystem: "Equatorial / Vertical Sundial Plane",
    referenceEpoch: "Local Solar Noon (Midday Spoke)",
    assumptionsAndLimitations: [
      "Measures Local Apparent Time (sundial time), which differs from Indian Standard Time (IST, 82.5° E) by both longitude offset (+14.3 minutes at Konark) and the Equation of Time (up to ±16 minutes due to Earth's orbital eccentricity and tilt).",
      "Only functional during clear daylight hours when the gnomon casts a sharp shadow.",
    ],
    beginnerExplanation:
      "The 24 colossal wheels of the Konark Sun Temple are functioning sundials. Each wheel has 8 major spokes that divide the day into 8 Prahars (3-hour periods). Between a major spoke and minor spoke are 30 small carved beads. When the shadow falls on a bead, each bead represents exactly 3 minutes of time.",
    stepByStepExplanation: [
      "1. Identify the nearest major spoke where the central hub shadow falls.",
      "2. Note the base time of that spoke (each major spoke = 3 hours).",
      "3. Count the number of beads traversed by the shadow toward the next spoke.",
      "4. Multiply the bead count by 3 minutes.",
      "5. Add the resulting minutes to the spoke base time to read true solar time.",
    ],
  },
  {
    id: "modern-jpl-de421-numerical-integration",
    name: "NASA JPL DE421 Ephemeris Numerical Integration",
    nameSanskrit: "नासा जेपीएल डीई४२१ संख्यात्मक गति समीकरण",
    category: "planetary-orbit",
    formulaLatex:
      "\\frac{d^2 \\mathbf{r}_i}{dt^2} = -\\sum_{j \\neq i} \\frac{G m_j (\\mathbf{r}_i - \\mathbf{r}_j)}{|\\mathbf{r}_i - \\mathbf{r}_j|^3} + \\mathbf{a}_{\\text{relativistic}} + \\mathbf{a}_{\\text{oblateness}}",
    formulaCodeSnippet: `// In Skyfield Python backend:
from skyfield.api import load
ts = load.timescale()
t = ts.from_datetime(utc_instant)

# JPL DE421 barycentric vectors:
planets = load('de421.bsp')
earth = planets['earth']
sun = planets['sun']

# Apparent geocentric position with light-time and aberration:
astrometric = earth.at(t).observe(sun)
apparent = astrometric.apparent()
lat, lon, dist = apparent.ecliptic_latlon(epoch='date')`,
    provenance: {
      sourceType: "modern-mathematical-interpretation",
      historicalSourceText:
        "Newtonian Universal Gravitation & Einsteinian General Relativity (Post-Newtonian Formulation)",
      historicalVerseOrChapter:
        "Standard N-body relativistic equations of motion (EIH formulation)",
      historicalAuthor: "Einstein, Infeld, Hoffmann (1938); Standish, E.M. (1990)",
      historicalYear: "2008 CE (DE421 release)",
      historicalUrl: "https://ssd.jpl.nasa.gov/planets/eph_export.html",
      modernScholarlyRef:
        "Folkner, W. M., et al. (2009). 'The Planetary and Lunar Ephemeris DE421', JPL Interplanetary Network Progress Report, 42-178, pp. 1–34.",
      modernScholarlyUrl: "https://ipnpr.jpl.nasa.gov/progress_report/42-178/178C.pdf",
    },
    variableDefinitions: [
      {
        symbol: "r_i",
        name: "Barycentric Position Vector",
        unit: "Kilometers (km) / AU",
        description: "Position of body i relative to the Solar System Barycenter (SSB).",
      },
      {
        symbol: "G m_j",
        name: "Standard Gravitational Parameter",
        unit: "km³ / s²",
        description: "Gravitational constant multiplied by mass for each gravitating body.",
      },
      {
        symbol: "a_relativistic",
        name: "General Relativistic Acceleration",
        unit: "km / s²",
        description: "Corrections for space-time curvature and gravitational time dilation.",
      },
      {
        symbol: "T_eph",
        name: "Barycentric Dynamical Time",
        unit: "seconds / Julian Days",
        description: "Uniform coordinate time standard of relativistic gravitational equations.",
      },
    ],
    inputUnits: "Coordinated Universal Time (UTC) instant converted to Terrestrial Time (TT)",
    outputUnits: "Barycentric vectors, converted to geocentric apparent spherical coordinates",
    timeConventions: "Barycentric Dynamical Time (TDB) / Terrestrial Time (TT)",
    coordinateSystem: "International Celestial Reference System (ICRS) / True Ecliptic of Date",
    referenceEpoch:
      "Continuous integration valid between 1900-01-01 and 2050-01-01 (JD 2414992.5 to 2469808.5)",
    assumptionsAndLimitations: [
      "Accounts for mutual gravitational perturbations of Sun, 8 major planets, Moon, Pluto, and the 300 most massive asteroids.",
      "Includes general relativistic effects, Earth-Moon figure oblateness, and lunar physical libration.",
      "Precision for inner planets is typically within 0.001 arcseconds (a few meters in orbit) over the validity epoch.",
    ],
    beginnerExplanation:
      "Modern space agencies do not use simple repeating formulas. Instead, supercomputers solve the exact physics equations of gravity for the Sun, Moon, planets, and hundreds of asteroids simultaneously, including Einstein's theory of relativity. NASA's JPL DE421 ephemeris is the gold standard used to navigate interplanetary spacecraft.",
    stepByStepExplanation: [
      "1. Input the UTC calendar timestamp and convert to uniform Terrestrial Time (TT = UTC + ΔAT + 32.184s).",
      "2. Query the Chebyshev polynomial interpolation coefficients in the DE421 kernel.",
      "3. Compute the raw Barycentric coordinates of Earth and the target celestial body.",
      "4. Calculate the light travel time from the body to Earth and back-propagate the body's position.",
      "5. Apply gravitational light deflection caused by the Sun's mass.",
      "6. Apply stellar aberration due to Earth's orbital velocity (~30 km/s).",
      "7. Transform the resulting apparent direction into the ecliptic frame of date.",
    ],
  },
];

/**
 * Authentic Ancient Astronomical Instruments.
 */
export const ANCIENT_INSTRUMENTS: AstronomicalInstrument[] = [
  {
    id: "konark-sun-wheel",
    name: "Konark Sun Temple Chakra",
    nameHindi: "कोणार्क सूर्य मन्दिर चक्र",
    nameSanskrit: "कोणार्क सूर्य रथ चक्र",
    type: "ancient",
    location: "Konark, Puri District, Odisha, India (19° 53' N, 86° 05' E)",
    eraOrYear: "c. 1250 CE (13th Century)",
    builderOrInstitution: "King Narasimhadeva I (Eastern Ganga Dynasty)",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Konark_Sun_Temple_wheel.jpg/1200px-Konark_Sun_Temple_wheel.jpg",
    imageAlt: "Carved stone chariot wheel of the Konark Sun Temple in Odisha",
    imageCaption:
      "One of the 24 massive stone wheels of the 13th-century Konark Sun Temple chariot, engineered as an accurate solar dial.",
    imageAttribution: "Wikimedia Commons / User:G4graham (CC BY-SA 3.0)",
    imageLicense: "Creative Commons Attribution-ShareAlike 3.0 Unported",
    imageLicenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
    imageSourceUrl: "https://commons.wikimedia.org/wiki/File:Konark_Sun_Temple_wheel.jpg",
    primaryPurpose:
      "Measurement of diurnal apparent solar time (Prahars and minutes) through gnomonic shadow casting.",
    measurementPrinciple:
      "A central ornate hub acts as a horizontal gnomon. The 8 major spokes divide the 24-hour cycle into 8 Prahars (3 hours each). The 8 minor spokes divide segments into 90 minutes. 30 intermediate carved beads divide each segment into 3-minute divisions.",
    inputsMeasured: "Position of the cast shadow relative to spokes and beads.",
    outputsProduced: "Local Apparent Solar Time (LAT) at Konark meridian.",
    units:
      "Prahars (3 hours), Ghati (24 minutes), Vighati/Pala (24 seconds), and 3-minute bead counts.",
    precisionOrUncertainty: "Approx. 1 to 3 minutes during clear daylight hours.",
    relationToSoftware:
      "Directly modeled in Module 1: Ancient vs Modern Timekeeping as an interactive 3D procedural wheel.",
    isDirectFormulaSource: true,
    references: [
      {
        title: "Sun Temple, Konârak",
        source: "UNESCO World Heritage Centre",
        url: "https://whc.unesco.org/en/list/246/",
      },
      {
        title: "Archaeological Survey of India: Konark Monograph",
        source: "Archaeological Survey of India (ASI)",
        url: "https://asi.nic.in/world-heritage-sites-konark-sun-temple/",
      },
      {
        title: "The Wheels of Time of Konark",
        source: "Donaldson, T.E. (2003), Oxford University Press",
      },
    ],
    strengths: [
      "Permanent monumental stone construction immune to corrosion and clock drift.",
      "Direct geometric reading of solar shadow without requiring delicate mechanics.",
      "Subdivision down to 3 minutes exceeded contemporary European medieval sundials.",
    ],
    limitations: [
      "Operates only during clear daylight hours when the Sun casts a discernible shadow.",
      "Measures Local Apparent Time, which varies from uniform clock time by the Equation of Time (up to ±16 minutes/year).",
      "Fixed to its local geographic latitude and longitude.",
    ],
  },
  {
    id: "vrihat-samrat-yantra",
    name: "Vrihat Samrat Yantra",
    nameHindi: "बृहत् सम्राट् यन्त्र (जयपुर)",
    nameSanskrit: "सम्राट् यन्त्र (यन्त्रराज)",
    type: "ancient",
    location: "Jantar Mantar, Jaipur, Rajasthan, India (26° 55' N, 75° 49' E)",
    eraOrYear: "1734 CE (18th Century)",
    builderOrInstitution: "Maharaja Sawai Jai Singh II of Amber/Jaipur",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Vrihat_Samrat_Yantra%2C_Jantar_Mantar%2C_Jaipur%2C_Rajasthan.jpg/1200px-Vrihat_Samrat_Yantra%2C_Jantar_Mantar%2C_Jaipur%2C_Rajasthan.jpg",
    imageAlt: "Vrihat Samrat Yantra, the world's largest stone sundial at Jantar Mantar, Jaipur",
    imageCaption:
      "The 27-meter-tall Vrihat Samrat Yantra at Jantar Mantar Jaipur, capable of measuring local solar time to an accuracy of 2 seconds.",
    imageAttribution: "Wikimedia Commons / User:Vikashegde (CC BY-SA 4.0)",
    imageLicense: "Creative Commons Attribution-ShareAlike 4.0 International",
    imageLicenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    imageSourceUrl:
      "https://commons.wikimedia.org/wiki/File:Vrihat_Samrat_Yantra,_Jantar_Mantar,_Jaipur,_Rajasthan.jpg",
    primaryPurpose:
      "Precision measurement of local solar time, solar declination, and meridian transit.",
    measurementPrinciple:
      "An enormous right-angled triangular gnomon (hypotenuse parallel to Earth's polar axis, inclined at 26° 55'). The gnomon shadow falls on curved quadrant scales parallel to the equator, moving at 1 mm per second.",
    inputsMeasured: "Linear displacement of the shadow along the marble graduation scales.",
    outputsProduced: "Local Apparent Solar Time to 2-second resolution; Sun's declination.",
    units: "Hours, minutes, seconds, Ghati, and Vighati.",
    precisionOrUncertainty: "±2 seconds reading precision under sharp sunlight.",
    relationToSoftware:
      "Exemplifies the empirical observational heritage (Drik-Siddha) that calibrated traditional table parameters.",
    isDirectFormulaSource: false,
    references: [
      {
        title: "The Jantar Mantar, Jaipur",
        source: "UNESCO World Heritage Centre",
        url: "https://whc.unesco.org/en/list/1338/",
      },
      {
        title: "Astronomical Instruments of Jai Singh",
        source: "Sharma, V.N. (1995), Motilal Banarsidass Publishers",
      },
    ],
    strengths: [
      "Gigantic scale reduces shadow penumbra reading uncertainty to just 2 seconds.",
      "Graduations in marble allow direct angle and time reading without optical distortion.",
      "Remains fully functional nearly 300 years after construction.",
    ],
    limitations: [
      "Subject to diffraction penumbra blurring at shadow edges.",
      "Cannot measure nocturnal or overcast time.",
      "Does not automatically convert solar time to uniform mean civil time.",
    ],
  },
  {
    id: "jai-prakash-yantra",
    name: "Jai Prakash Yantra",
    nameHindi: "जय प्रकाश यन्त्र",
    nameSanskrit: "जयप्रकाश यन्त्र",
    type: "ancient",
    location: "Jantar Mantar, Jaipur, Rajasthan, India",
    eraOrYear: "1734 CE",
    builderOrInstitution: "Maharaja Sawai Jai Singh II",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Jai_Prakash_Yantra_at_Jantar_Mantar_in_Jaipur.jpg/1200px-Jai_Prakash_Yantra_at_Jantar_Mantar_in_Jaipur.jpg",
    imageAlt: "Hemispherical marble bowl of the Jai Prakash Yantra at Jantar Mantar Jaipur",
    imageCaption:
      "Complementary hemispherical bowl instrument mapping the celestial vault onto an inverted subterranean marble bowl.",
    imageAttribution: "Wikimedia Commons / User:Rangan Datta (CC BY-SA 4.0)",
    imageLicense: "Creative Commons Attribution-ShareAlike 4.0 International",
    imageLicenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    imageSourceUrl:
      "https://commons.wikimedia.org/wiki/File:Jai_Prakash_Yantra_at_Jantar_Mantar_in_Jaipur.jpg",
    primaryPurpose:
      "Comprehensive coordinate transformation: directly reading Altitude, Azimuth, Hour Angle, Declination, and Zodiacal Sign.",
    measurementPrinciple:
      "A pair of complementary concave marble hemispherical bowls representing the celestial sphere upside down. Crosswires stretched across the rim carry a small ring whose shadow marks the Sun's exact celestial coordinates directly upon engraved marble coordinate curves.",
    inputsMeasured: "Position of crosswire shadow on the concave bowl surface.",
    outputsProduced:
      "Horizon (Alt/Az) and Equator (Dec/HA) coordinates simultaneously; active Zodiacal Rashi.",
    units: "Degrees, arcminutes, Rashis (30° segments), Ghatis.",
    precisionOrUncertainty: "Approx. 1 arcminute for solar position.",
    relationToSoftware:
      "Direct historical precedent for our Dual Coordinate System Lab (Sayana vs Nirayana and Horizon vs Ecliptic).",
    isDirectFormulaSource: false,
    references: [
      {
        title: "A Study of the Jai Prakash Yantra",
        source: "Journal of Astronomical History and Heritage",
        url: "https://www.narit.or.th/en/index.php/jahh",
      },
    ],
    strengths: [
      "Ingenious complementary twin design: observers walk down passages inside one bowl while the matching bowl catches the shadow.",
      "Performs real-time analog coordinate transformation without manual spherical trigonometry.",
    ],
    limitations: [
      "Thermal expansion of marble and masonry over centuries causes minor seasonal zero-point drift.",
      "Requires careful ladder access to read coordinates deep within the subterranean bowls.",
    ],
  },
  {
    id: "shanku-yantra",
    name: "Shanku Yantra (Vertical Gnomon)",
    nameHindi: "शङ्कु यन्त्र (ऋजु शङ्कु)",
    nameSanskrit: "शङ्कु यन्त्र (द्वादशाङ्गुल शङ्कु)",
    type: "ancient",
    location: "Described across historical Indian observatories (Ujjain, Varanasi, Delhi, Jaipur)",
    eraOrYear: "c. 5th Century BCE – 5th Century CE (Documented in Sulba Sutras and Aryabhatiya)",
    builderOrInstitution: "Foundational Classical Indian Astronomical Instrument",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Gnomon_at_Jantar_Mantar%2C_New_Delhi.jpg/1200px-Gnomon_at_Jantar_Mantar%2C_New_Delhi.jpg",
    imageAlt: "Historical gnomon shadow instrument at Jantar Mantar observatory",
    imageCaption:
      "Classical vertical 12-angula (digit) Shanku gnomon used to determine true cardinal north, local noon, observer latitude, and equinoxes.",
    imageAttribution: "Wikimedia Commons / Public Domain",
    imageLicense: "Public Domain / Creative Commons Attribution",
    imageLicenseUrl: "https://creativecommons.org/licenses/by/3.0/",
    imageSourceUrl:
      "https://commons.wikimedia.org/wiki/File:Gnomon_at_Jantar_Mantar,_New_Delhi.jpg",
    primaryPurpose:
      "Determining true cardinal directions (Dig-jnana), local solar noon, latitude (Akshamsa), and equinoctial midday shadow (Palabha).",
    measurementPrinciple:
      "A standard vertical rod of 12 angulas (units) is placed at the center of concentric circles drawn on a level floor. The points where the morning and afternoon shadow tips touch the circle circumference form a fish-like figure (Matsya), defining the true East-West line.",
    inputsMeasured: "Length and orientation of the gnomon shadow.",
    outputsProduced:
      "True North-South-East-West orientation; Equinoctial shadow (Palabha); Observer latitude.",
    units: "Angulas (digits), degrees, and minutes of arc.",
    precisionOrUncertainty:
      "Approx. 5 to 10 arcminutes for cardinal direction; 1 arcminute for solar noon.",
    relationToSoftware:
      "Underlies the solar position and equinoctial calculation services in Module 1 and Module 2.",
    isDirectFormulaSource: true,
    references: [
      {
        title: "Surya Siddhanta Chapter 3 (Chhayadhikara / Shadow Computation)",
        source: "Burgess (1860)",
      },
      {
        title: "Aryabhatiya, Gola-Pada (Sphere of Earth and Heavens)",
        source: "K.S. Shukla (1976)",
      },
    ],
    strengths: [
      "Extremely simple, transportable, and mathematically rigorous.",
      "Eliminates magnetic compass declination error by finding true geographic north purely from the Sun.",
    ],
    limitations: [
      "Requires an impeccably level water-checked horizontal stone floor.",
      "Cloud cover prevents shadow tip demarcation.",
    ],
  },
];

/**
 * Authentic Modern Astronomical Instruments.
 */
export const MODERN_INSTRUMENTS: AstronomicalInstrument[] = [
  {
    id: "nist-cesium-atomic-clock",
    name: "NIST-F2 Cesium Fountain Atomic Clock",
    nameHindi: "सीज़ियम परमाणु घड़ी (एनआईएसटी-एफ२)",
    type: "modern",
    location: "National Institute of Standards and Technology (NIST), Boulder, Colorado, USA",
    eraOrYear: "2014 CE – Present",
    builderOrInstitution: "NIST Time and Frequency Division",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/NIST-F2_atomic_clock.jpg/1200px-NIST-F2_atomic_clock.jpg",
    imageAlt: "NIST-F2 Cesium Fountain Atomic Clock apparatus with laser optics and vacuum chamber",
    imageCaption:
      "NIST-F2 primary frequency standard, which realizes the SI second with a fractional uncertainty under 1 part in 10^16.",
    imageAttribution: "Wikimedia Commons / NIST (Public Domain)",
    imageLicense: "Public Domain (US Federal Government Work)",
    imageLicenseUrl: "https://www.nist.gov/oism/policies/copyright-policy",
    imageSourceUrl: "https://commons.wikimedia.org/wiki/File:NIST-F2_atomic_clock.jpg",
    primaryPurpose:
      "Realization of the SI second and generation of International Atomic Time (TAI) and Coordinated Universal Time (UTC).",
    measurementPrinciple:
      "Lasers cool cesium-133 atoms to near absolute zero (-273.15°C) inside a vacuum chamber, creating a fountain tossed upward. Microwaves interrogate the unperturbed ground-state hyperfine transition frequency defined at exactly 9,192,631,770 Hz.",
    inputsMeasured: "Microwave photon absorption frequency of laser-cooled cesium-133 atoms.",
    outputsProduced: "SI second; frequency offset relative to atomic transition.",
    units: "Hertz (Hz), seconds, nanoseconds, fractional frequency uncertainty (Δf/f).",
    precisionOrUncertainty:
      "Fractional uncertainty < 1 × 10^-16 (neither loses nor gains 1 second in 300 million years).",
    relationToSoftware:
      "Defines the physical time standard underpinning all modern ephemeris time scales (TT, TDB, UTC) in our backend.",
    isDirectFormulaSource: false,
    references: [
      {
        title: "NIST-F2: A More Accurate Atomic Clock",
        source: "NIST Physical Measurement Laboratory",
        url: "https://www.nist.gov/pml/time-and-frequency-division/primary-standards/nist-f2",
      },
      {
        title: "Metrologia: Evaluation of NIST-F2",
        source: "Heavner, T.P., et al. (2014), Metrologia, Vol. 51, No. 3",
        url: "https://iopscience.iop.org/article/10.1088/0026-1394/51/3/174",
      },
    ],
    strengths: [
      "Completely decoupled from Earth's irregular axial rotation and seasonal variations.",
      "Unmatched long-term frequency stability realizing the fundamental SI time unit.",
    ],
    limitations: [
      "Operates under ultra-high vacuum and cryogenic laboratory environments requiring constant maintenance.",
      "Because Earth's rotation slows down relative to atomic time, leap seconds must be periodically introduced into civil UTC.",
    ],
  },
  {
    id: "nasa-jpl-deep-space-network",
    name: "NASA Deep Space Network (DSN 70m Antenna)",
    nameHindi: "नासा डीप स्पेस नेटवर्क (७० मीटर एंटीना)",
    type: "modern",
    location: "Goldstone, California, USA; Madrid, Spain; Canberra, Australia",
    eraOrYear: "1963 CE – Present",
    builderOrInstitution: "NASA Jet Propulsion Laboratory (JPL) / Caltech",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Deep_Space_Station_14_%2870-meter_antenna%29_at_Goldstone%2C_California.jpg/1200px-Deep_Space_Station_14_%2870-meter_antenna%29_at_Goldstone%2C_California.jpg",
    imageAlt:
      "70-meter giant parabolic dish antenna at the Goldstone Deep Space Communications Complex",
    imageCaption:
      "DSS-14 70-meter parabolic antenna at Goldstone, California, conducting interplanetary spacecraft tracking and planetary radar ranging.",
    imageAttribution: "Wikimedia Commons / NASA/JPL (Public Domain)",
    imageLicense: "Public Domain (NASA)",
    imageLicenseUrl: "https://www.nasa.gov/multimedia/guidelines/index.html",
    imageSourceUrl:
      "https://commons.wikimedia.org/wiki/File:Deep_Space_Station_14_(70-meter_antenna)_at_Goldstone,_California.jpg",
    primaryPurpose:
      "Interplanetary spacecraft navigation, planetary radar ranging, and astronomical ephemeris calibration.",
    measurementPrinciple:
      "Two-way coherent microwave Doppler shift measures spacecraft radial velocity to < 0.1 mm/s. Two-way microwave range delay timing measures distances across hundreds of millions of kilometers with meter-level precision.",
    inputsMeasured: "Microwave round-trip travel time (ranging) and frequency shift (Doppler).",
    outputsProduced:
      "Topocentric range (km), range-rate (km/s), celestial right ascension and declination.",
    units: "Seconds, Megahertz (MHz), Kilometers (km), Astronomical Units (AU).",
    precisionOrUncertainty:
      "Range uncertainty: ±1 to 3 meters across the inner solar system; velocity uncertainty: < 0.1 mm/s.",
    relationToSoftware:
      "Provides the empirical observational constraints that directly calibrate NASA JPL DE421 used in our backend.",
    isDirectFormulaSource: true,
    references: [
      {
        title: "NASA Deep Space Network Official Overview",
        source: "NASA JPL",
        url: "https://www.jpl.nasa.gov/missions/deep-space-network-dsn",
      },
      {
        title: "The Planetary and Lunar Ephemeris DE421",
        source: "JPL IPN Progress Report 42-178 (2009)",
        url: "https://ipnpr.jpl.nasa.gov/progress_report/42-178/178C.pdf",
      },
    ],
    strengths: [
      "Transfers tracking data across the entire solar system up to interstellar distances (Voyager 1 and 2).",
      "Global triad (Goldstone, Madrid, Canberra) provides uninterrupted 24-hour planetary coverage despite Earth's rotation.",
    ],
    limitations: [
      "Microwave signals suffer delay and refraction through Earth's ionosphere and the solar corona (plasma dispersion).",
      "Immense operational, cryogenic receiver, and power infrastructure required.",
    ],
  },
  {
    id: "very-large-telescope-eso",
    name: "ESO Very Large Telescope (VLT Unit Telescopes)",
    nameHindi: "वेरी लार्ज टेलीस्कोप (वीएलटी)",
    type: "modern",
    location: "Cerro Paranal, Atacama Desert, Chile (24° 37' S, 70° 24' W, Elev: 2,635m)",
    eraOrYear: "1998 CE – Present",
    builderOrInstitution: "European Southern Observatory (ESO)",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Laser_beams_from_the_VLT_point_to_the_Galactic_Centre.jpg/1200px-Laser_beams_from_the_VLT_point_to_the_Galactic_Centre.jpg",
    imageAlt:
      "Laser guide star beams shooting from ESO Very Large Telescope into the Milky Way night sky",
    imageCaption:
      "Laser guide star adaptive optics on the 8.2-meter Unit Telescopes of ESO's VLT, neutralizing atmospheric turbulence to achieve milliarcsecond resolution.",
    imageAttribution: "Wikimedia Commons / ESO/G. Hüdepohl (CC BY 4.0)",
    imageLicense: "Creative Commons Attribution 4.0 International",
    imageLicenseUrl: "https://creativecommons.org/licenses/by/4.0/",
    imageSourceUrl:
      "https://commons.wikimedia.org/wiki/File:Laser_beams_from_the_VLT_point_to_the_Galactic_Centre.jpg",
    primaryPurpose:
      "High-resolution optical/infrared astrometry, spectroscopy, and exoplanet imaging.",
    measurementPrinciple:
      "Four 8.2-meter primary mirrors equipped with active optics (150 computer-controlled actuators) and laser guide stars to measure and counteract atmospheric wavefront distortions up to 1,000 times per second.",
    inputsMeasured:
      "Starlight photons across visible and near-infrared wavelengths (300 nm to 25 µm).",
    outputsProduced:
      "Calibrated CCD astrometric positions, radial velocities, and stellar spectra.",
    units: "Milliarcseconds (mas), micrometers (µm), kilometers per second (km/s).",
    precisionOrUncertainty:
      "Astrometric resolution: ~1 milliarcsecond with interferometric recombination (VLTI).",
    relationToSoftware:
      "Anchors the fixed stellar reference frame that calibrates modern sidereal catalogs (Gaia and Hipparcos).",
    isDirectFormulaSource: false,
    references: [
      {
        title: "Very Large Telescope",
        source: "European Southern Observatory",
        url: "https://www.eso.org/public/teles-instr/paranal-observatory/vlt/",
      },
    ],
    strengths: [
      "Ultra-clear, dry Atacama Desert atmosphere with over 300 cloudless nights per year.",
      "Adaptive optics removes atmospheric blurring, rivaling space-based optical clarity.",
    ],
    limitations: [
      "Extreme cost and complexity; ground-based observing is still subject to sky brightness and weather windows.",
      "Limited to observing targets above the local horizon.",
    ],
  },
  {
    id: "navic-gps-satellite-constellations",
    name: "GNSS Spaceborne Atomic Clocks (GPS / NavIC)",
    nameHindi: "उपग्रह परमाणु घड़ियाँ (नाविक एवं जीपीएस)",
    type: "modern",
    location: "Medium Earth Orbit (GPS ~20,200 km) and Geostationary/GSO Orbit (NavIC ~36,000 km)",
    eraOrYear: "1978 CE – Present (NavIC operational 2018)",
    builderOrInstitution: "ISRO (NavIC) / US Space Force (GPS)",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/GPS_Satellite_NASA_art-iif.jpg/1200px-GPS_Satellite_NASA_art-iif.jpg",
    imageAlt: "Artist rendering of a modern Block IIF navigation satellite in Earth orbit",
    imageCaption:
      "Navigation satellites carry redundant Rubidium and Passive Hydrogen Maser atomic clocks, synchronizing global positioning and civil time.",
    imageAttribution: "Wikimedia Commons / NASA (Public Domain)",
    imageLicense: "Public Domain (NASA / US Government)",
    imageLicenseUrl: "https://www.nasa.gov/multimedia/guidelines/index.html",
    imageSourceUrl: "https://commons.wikimedia.org/wiki/File:GPS_Satellite_NASA_art-iif.jpg",
    primaryPurpose:
      "Global sub-meter positioning, velocity determination, and sub-nanosecond international time transfer.",
    measurementPrinciple:
      "Satellites broadcast precise L-band pseudorandom noise microwave signals encoded with their onboard atomic clock readings. Receivers calculate distance by multiplying signal time-of-flight by the speed of light.",
    inputsMeasured: "Microwave signal time-of-arrival from at least 4 visible satellites.",
    outputsProduced:
      "Geocentric Earth-Fixed (ECEF) Latitude, Longitude, Altitude, and Receiver Clock Bias.",
    units: "Nanoseconds (ns), meters (m), meters per second (m/s).",
    precisionOrUncertainty:
      "Time synchronization: < 5 nanoseconds; Position: < 1 meter with dual-frequency corrections.",
    relationToSoftware:
      "Powers the geographic coordinate detection and local timezone calibration in KalaGanaka.",
    isDirectFormulaSource: false,
    references: [
      {
        title: "Navigation with Indian Constellation (NavIC)",
        source: "Indian Space Research Organisation (ISRO)",
        url: "https://www.isro.gov.in/NavIC.html",
      },
      {
        title: "GPS.gov Official Information",
        source: "US National Coordination Office for Space-Based PNT",
        url: "https://www.gps.gov/",
      },
    ],
    strengths: [
      "Provides instant, global, all-weather 3D positioning and atomic time transfer anywhere on Earth's surface.",
      "Explicitly models relativistic time dilation (general relativistic gravitational blueshift + special relativistic time dilation).",
    ],
    limitations: [
      "Signal can be attenuated or blocked by dense buildings, canyons, and deep foliage (multipath error).",
      "Dependent on vulnerable space orbital infrastructure.",
    ],
  },
];

/**
 * Structured Side-by-Side Instrument Comparisons.
 */
export const INSTRUMENT_COMPARISONS: InstrumentSideBySideComparison[] = [
  {
    id: "sundial-vs-atomic-clock",
    title: "Konark Wheel & Samrat Yantra vs Cesium Fountain Atomic Clock",
    ancientInstrumentId: "konark-sun-wheel",
    modernInstrumentId: "nist-cesium-atomic-clock",
    conceptualBridge:
      "Both systems answer the fundamental question: 'What is the present instant of time?' However, ancient instruments measure Apparent Solar Time tied to Earth's rotation, while modern atomic clocks measure Uniform Coordinate Time tied to quantum transitions of the atom.",
    fields: [
      {
        fieldLabel: "Primary Purpose",
        ancientText:
          "Track the Sun's diurnal passage and indicate local solar time for daily civil and ritual life.",
        modernText:
          "Define and realize the physical SI second and generate international civil coordinate time (UTC).",
        scientificCommentary:
          "Ancient instruments serve civil and cultural life; modern standards serve precision navigation, computing networks, and deep space exploration.",
      },
      {
        fieldLabel: "Measurement Principle",
        ancientText:
          "Geometric shadow projection cast by a gnomon onto calibrated stone quadrants or wheel beads.",
        modernText:
          "Quantum hyperfine transition frequency of unperturbed cesium-133 atoms interrogated by microwaves in vacuum.",
        scientificCommentary:
          "Shadow is astronomical and macroscopic; atomic resonance is quantum and microscopic.",
      },
      {
        fieldLabel: "Inputs Required",
        ancientText: "Direct unimpeded sunlight and stable geographical stone alignment.",
        modernText: "Cryogenic vacuum chamber, lasers, microwave synthesizer, and electric power.",
        scientificCommentary:
          "Ancient systems require zero electricity; atomic standards require controlled laboratory physics facilities.",
      },
      {
        fieldLabel: "Output Produced",
        ancientText: "Local Apparent Solar Time (LAT) in Prahars, Ghatis, and minutes.",
        modernText: "Continuous, uniform atomic frequency and elapsed SI seconds.",
        scientificCommentary:
          "Solar time fluctuates naturally throughout the year; atomic time is strictly invariant.",
      },
      {
        fieldLabel: "Measurement Units",
        ancientText: "Prahars (3 hrs), Ghatis (24 min), Vighatis (24 sec), Beads (3 min).",
        modernText: "SI Seconds, Nanoseconds, Picoseconds, Hertz (Hz).",
        scientificCommentary:
          "Traditional units are sexagesimal base-60; modern units are decimal base-10.",
      },
      {
        fieldLabel: "Demonstrated Precision",
        ancientText: "±1 to 3 minutes (Konark Wheel); ±2 seconds (Samrat Yantra Jaipur).",
        modernText: "Uncertainty < 1 × 10^-16 (< 1 second drift in 300 million years).",
        scientificCommentary: "A precision difference of roughly 14 orders of magnitude.",
      },
      {
        fieldLabel: "Strengths",
        ancientText:
          "Durable for centuries without power, calibration drift, or electronic breakdown.",
        modernText:
          "Completely immune to weather, day/night cycles, and Earth's rotational wobbles.",
        scientificCommentary: "Stone endures indefinitely; atomic clocks achieve peak accuracy.",
      },
      {
        fieldLabel: "Inherent Limitations",
        ancientText:
          "Cannot tell time at night or under clouds; subject to the ±16 min Equation of Time.",
        modernText:
          "Requires leap seconds to stay synchronized with the astronomical day and night.",
        scientificCommentary:
          "Atomic time is so steady that it outpaces the slowing rotation of the Earth!",
      },
      {
        fieldLabel: "Relevant Mathematical Model",
        ancientText:
          "Spherical trigonometry of solar declination and hour angle: cos(t) = (sin(h) - sin(φ)sin(δ)) / (cos(φ)cos(δ)).",
        modernText: "Quantum electrodynamics: ν_0 = ΔE / h = 9,192,631,770 Hz exactly.",
        scientificCommentary: "Spherical astronomy vs quantum mechanics.",
      },
    ],
  },
  {
    id: "optical-gnomon-vs-deep-space-network",
    title: "Jai Prakash & Shanku Yantra vs NASA Deep Space Network",
    ancientInstrumentId: "jai-prakash-yantra",
    modernInstrumentId: "nasa-jpl-deep-space-network",
    conceptualBridge:
      "Both instruments measure celestial positions. Ancient gnomons track the celestial sphere from Earth's surface using optical shadows. Modern deep space tracking reaches outward across billions of kilometers using coherent radio ranging.",
    fields: [
      {
        fieldLabel: "Primary Purpose",
        ancientText:
          "Measure celestial coordinates (Altitude, Azimuth, Declination, Rashi) of Sun and stars.",
        modernText:
          "Determine interplanetary orbits of spacecraft and planets to calibrate solar system ephemerides.",
        scientificCommentary:
          "Jai Prakash Yantra performs analog coordinate conversion; DSN provides empirical telemetry for numerical ephemerides.",
      },
      {
        fieldLabel: "Measurement Principle",
        ancientText: "Optical shadow projection onto an inverted concave hemispherical marble sky.",
        modernText:
          "Two-way coherent microwave Doppler velocity and round-trip radar travel-time ranging.",
        scientificCommentary:
          "One uses visible solar rays; the other uses relativistic microwave transponders.",
      },
      {
        fieldLabel: "Inputs Required",
        ancientText: "Sunlight or stellar sight-lines passing across crosswires.",
        modernText: "70-meter steerable microwave dish, cryogenic maser amplifiers, atomic clocks.",
        scientificCommentary:
          "One requires clear sky and human eyes; the other requires global tracking stations.",
      },
      {
        fieldLabel: "Output Produced",
        ancientText: "Direct visual reading of Altitude, Azimuth, Declination, and Hour Angle.",
        modernText:
          "Range vectors accurate to meters, radial velocity to 0.1 mm/s, and orbital state vectors.",
        scientificCommentary: "Analog visual angular reading vs digital relativistic 3D vectors.",
      },
      {
        fieldLabel: "Demonstrated Precision",
        ancientText: "±1 to 2 arcminutes on marble scale.",
        modernText: "±1 to 3 meters across inner solar system; sub-milliarcsecond astrometry.",
        scientificCommentary:
          "Modern ranging is millions of times more sensitive than naked-eye masonry.",
      },
      {
        fieldLabel: "Strengths",
        ancientText:
          "Instantly visualizes the entire celestial hemisphere without computing trigonometry.",
        modernText: "Enables interplanetary navigation to Mars, Jupiter, and outer space probes.",
        scientificCommentary:
          "Educational and observational elegance vs deep-space exploration capability.",
      },
      {
        fieldLabel: "Inherent Limitations",
        ancientText:
          "Limited by masonry thermal expansion, visual acuity, and atmospheric turbulence.",
        modernText:
          "Complex radio propagation delays through space plasma, ionosphere, and troposphere.",
        scientificCommentary: "Both methods must contend with Earth's atmosphere.",
      },
    ],
  },
  {
    id: "jai-prakash-vs-vlt",
    title: "Jai Prakash Yantra vs ESO Very Large Telescope",
    ancientInstrumentId: "jai-prakash-yantra",
    modernInstrumentId: "very-large-telescope-eso",
    conceptualBridge:
      "Both instruments map the night sky and stellar coordinates optically from the ground. Jai Prakash Yantra uses concave inverted marble domes for naked-eye horizon coordinates, while the VLT uses 8.2-meter active mirrors and laser adaptive optics to penetrate atmospheric turbulence at milliarcsecond precision.",
    fields: [
      {
        fieldLabel: "Primary Purpose",
        ancientText:
          "Naked-eye coordinate mapping of visible stars, planets, and constellations directly into Altitude and Azimuth.",
        modernText:
          "Diffraction-limited optical/infrared astrometry, spectroscopy, and imaging of distant exoplanets and deep-sky objects.",
        scientificCommentary: "Macro spherical astronomy vs deep-space spectroscopic astrophysics.",
      },
      {
        fieldLabel: "Measurement Principle",
        ancientText:
          "Observer looks through copper ring crosswires from inside a hollow marble hemisphere.",
        modernText:
          "Photons focused by 8.2m mirrors; laser guide star adaptive optics deforms mirrors 1,000 times/sec to counteract atmospheric distortion.",
        scientificCommentary: "Geometric sight-line vs high-speed wave-front optical compensation.",
      },
      {
        fieldLabel: "Outputs & Units",
        ancientText: "Degrees, arcminutes, and Nakshatra divisions carved into marble.",
        modernText:
          "Milliarcseconds (mas), CCD spectral fluxes, and line-of-sight radial velocities (km/s).",
        scientificCommentary: "Visual coordinates vs digital scientific datasets.",
      },
      {
        fieldLabel: "Demonstrated Precision",
        ancientText: "±1 to 2 arcminutes.",
        modernText: "Sub-milliarcsecond (~0.001 arcsec) with optical interferometry.",
        scientificCommentary: "More than 100,000 times sharper resolution.",
      },
      {
        fieldLabel: "Physical Limitations",
        ancientText: "Limited to naked-eye visual magnitude (~6 mag) and clear night visibility.",
        modernText:
          "High operational costs, narrow field of view, and atmospheric weather windows.",
        scientificCommentary: "Both require pristine dark skies.",
      },
    ],
  },
  {
    id: "shanku-vs-gnss",
    title: "Shanku Gnomon vs GNSS & Satellite Geodesy",
    ancientInstrumentId: "shanku-yantra",
    modernInstrumentId: "navic-gps-satellite-constellations",
    conceptualBridge:
      "Both systems establish geographic coordinates, cardinal orientation (Dig-jnana), and local solar noon. The classical 12-angula Shanku gnomon uses sunlight geometry on a level stone floor; GNSS constellations use atomic clock time-of-flight trilateration from satellite constellations.",
    fields: [
      {
        fieldLabel: "Primary Purpose",
        ancientText:
          "Determine true cardinal North-South, observer latitude (Akshamsa), and equinoctial midday shadow (Palabha).",
        modernText:
          "Instant 3D geodetic positioning (latitude, longitude, altitude) and sub-nanosecond atomic time synchronization.",
        scientificCommentary: "Solar shadow alignment vs spaceborne atomic trilateration.",
      },
      {
        fieldLabel: "Measurement Principle",
        ancientText:
          "Intersection of morning and afternoon shadow tips with concentric circles forming a fish figure (Matsya).",
        modernText:
          "Trilateration using pseudorange time-of-arrival of microwave signals from at least 4 satellites.",
        scientificCommentary: "Simple geometry of Sun's path vs relativistic spacetime metric.",
      },
      {
        fieldLabel: "Demonstrated Precision",
        ancientText: "±5 to 10 arcminutes for cardinal north; 1 arcminute for solar noon.",
        modernText:
          "Sub-meter to centimeter accuracy with Real-Time Kinematic (RTK) differential correction.",
        scientificCommentary:
          "Ancient gnomon determines true astronomical north without magnetic declination errors.",
      },
      {
        fieldLabel: "Strengths",
        ancientText:
          "Requires zero power or electronics; immune to cyber interference or orbital failures.",
        modernText: "Instant, global, all-weather 24/7 positioning anywhere on Earth.",
        scientificCommentary: "Immortal physical principle vs advanced electronic utility.",
      },
      {
        fieldLabel: "Physical Limitations",
        ancientText: "Requires clear unimpeded sunlight and a leveled stone floor.",
        modernText: "Signal blockage by tall buildings and dependence on space satellites.",
        scientificCommentary: "Both have distinct operational failure modes.",
      },
    ],
  },
];

/**
 * Educational Scientific Q&A explaining the science.
 */
export const SCIENTIFIC_FAQS: ScientificFaqItem[] = [
  {
    id: "why-do-methods-differ",
    question:
      "Why does the traditional Surya Siddhanta solar longitude differ from modern ephemeris by ~1.4°?",
    questionHindi: "सूर्यसिद्धान्त और आधुनिक गणना में १.४ डिग्री का अन्तर क्यों है?",
    answer:
      "The primary difference arises from two distinct scientific factors: First, our preliminary traditional code computes mean solar longitude (uniform circular motion), while the modern NASA JPL DE421 ephemeris computes apparent true longitude (including Earth's orbital eccentricity, which introduces a seasonal oscillation of up to ±1.91° called the Equation of the Center). Second, the traditional constant daily speed was determined over a 4.32-million-year cosmic cycle in antiquity, creating a minute drift (~0.000014°/year) against modern atomic time.",
    technicalDetails:
      "When the traditional Mandaphala (Equation of the Center) is applied, the residual difference between the Surya Siddhanta and modern sidereal positions shrinks significantly. Furthermore, traditional Indian astronomy uses the Nirayana (sidereal) frame anchored to Spica, while modern astronomy references the ICRF frame.",
    scientificCitations: [
      "Burgess, E. (1860). Commentary on Surya Siddhanta, JAOS Vol. 6, p. 154.",
      "Folkner et al. (2009). The Planetary and Lunar Ephemeris DE421, JPL.",
    ],
  },
  {
    id: "sayana-vs-nirayana",
    question:
      "What is the difference between Sayana (Tropical) and Nirayana (Sidereal) coordinates?",
    questionHindi: "सायन (Tropical) और निरयण (Sidereal) निर्देशांक में क्या अन्तर है?",
    answer:
      "Sayana (Tropical) coordinates measure planetary positions starting from the Vernal Equinox (the point where the Sun crosses the celestial equator in spring). Due to Earth's axial precession, this equinox point drifts westward by about 50.29 arcseconds every year. Nirayana (Sidereal) coordinates, used in Indian astronomy, measure positions relative to fixed background star groups, anchored by Spica (Chitra) at exactly 180°. The difference between them is the Ayanamsha (~24.23° in 2026).",
    technicalDetails:
      "Directly subtracting a Sayana coordinate from a Nirayana coordinate without applying Ayanamsha is a severe mathematical error (introducing a ~24° offset). In KalaGanaka, coordinate compatibility checks prevent invalid direct comparisons.",
    scientificCitations: [
      "Calendar Reform Committee Report (1955), Government of India.",
      "Explanatory Supplement to the Astronomical Almanac, Section 8 (Precession).",
    ],
  },
  {
    id: "circular-wraparound",
    question: "How does the Analysis Lab handle circular angular wraparound at 360°/0°?",
    questionHindi: "वृत्ताकार कोणों में ३६०° और ०° के अन्तर का गणितीय समाधान कैसे होता है?",
    answer:
      "In angular astronomy, 359° and 1° are separated by only 2°, not 358°. A naive arithmetic subtraction (359 - 1 = 358) produces completely false errors near the 0° boundary. Our engine uses circular modulo reduction: Δθ = ((θ_trad - θ_mod + 180°) mod 360°) - 180°, which guarantees signed differences strictly within [-180°, +180°).",
    technicalDetails:
      "This is verified by dedicated unit tests across zero-degree boundary transitions (e.g. Pisces/Aries cusp at Revati/Ashwini).",
    scientificCitations: [
      "Meeus, J. (1998). Astronomical Algorithms, Ch. 1 (Angles and Trigonometry).",
    ],
  },
  {
    id: "time-standards",
    question: "Why do UTC, UT1, TT, and TDB time standards differ?",
    questionHindi: "यूटीसी, टीटी और टीडीबी समय पैमानों में क्या अन्तर है?",
    answer:
      "UTC (civil time) is based on atomic clocks but paused occasionally with leap seconds. UT1 is based on Earth's actual physical rotation, which is gradually slowing down due to tidal friction. TT (Terrestrial Time) is an ideal uniform clock on Earth's surface running ahead of UTC by ΔT = 32.184s + leap seconds (~69.2s in 2026). TDB (Barycentric Dynamical Time) accounts for Einsteinian gravitational time dilation across the solar system.",
    technicalDetails:
      "NASA JPL DE421 ephemeris calculations strictly require TT and TDB. Feeding uncorrected civil UTC directly into planetary equations would cause several kilometers of position error.",
    scientificCitations: [
      "IERS Conventions (2010), International Earth Rotation and Reference Systems Service.",
    ],
  },
];
