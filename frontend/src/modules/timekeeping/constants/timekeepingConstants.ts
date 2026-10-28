import { CalculationInfoMetric, EducationalHotspot } from "../types/timekeeping";

export const KONARK_HOTSPOTS: EducationalHotspot[] = [
  {
    id: "hub",
    title: "Central Hub & Axle Gnomon (नाभि एवं अक्ष)",
    hindiTitle: "केन्द्रीय नाभि एवं अक्ष",
    subtitle: "The cosmic pivot and shadow-casting center",
    description:
      "The central hub represents Mount Meru, the cosmic axis around which the celestial sphere rotates. In the temple's horological tradition, the protruding central axle acts as a gnomon whose shadow falls across the spokes to measure solar time.",
    historicalContext:
      "Carved with a multi-petaled lotus (Padma) motif. King Narasimhadeva I's master architect, Bisu Maharana (and according to legend, his son Dharmapada), designed these wheels as integral structural and symbolic elements of Surya's celestial chariot.",
    timekeepingRole:
      "Cast shadows outward along radial angles as the Sun traverses the daytime sky from east to west.",
    position: [0, 0, 0.95],
  },
  {
    id: "major-spoke",
    title: "Major Spokes (8 मुख्य अर / प्रहर)",
    hindiTitle: "८ मुख्य अर (अष्ट प्रहर)",
    subtitle: "Division of day and night into 8 Praharas",
    description:
      "The wheel features 8 major spokes spaced at 45° intervals. In traditional Indian timekeeping, a 24-hour day (Ahoratra) is divided into 8 Praharas (each approximately 3 hours or 7.5 Ghatis). Four Praharas constitute the day and four the night.",
    historicalContext:
      "Each major spoke is adorned with an oval carved medallion illustrating scenes of daily life, deities, musicians, and dancers associated with that time of day.",
    timekeepingRole:
      "A shadow aligning with successive major spokes indicates the progression from one Prahara to the next.",
    position: [1.8, 1.8, 0.4],
  },
  {
    id: "minor-spoke",
    title: "Minor Spokes (8 लघु अर)",
    hindiTitle: "८ लघु अर (अर्ध-प्रहर)",
    subtitle: "Subdivision into 1.5-hour intervals",
    description:
      "Between every two major spokes lies a slender secondary spoke (8 in total, spaced at 22.5° offsets from the major spokes). These divide each 3-hour Prahara in half, marking 1.5-hour (3.75 Ghati / 90-minute) intervals.",
    historicalContext:
      "Slender fluted shafts carved with floral creepers and scrollwork (lata-patra), providing both structural elegance and finer angular division.",
    timekeepingRole: "Provides half-Prahara temporal precision for daytime activities.",
    position: [0.95, 2.3, 0.35],
  },
  {
    id: "rim-beads",
    title: "Outer Rim & 30 Beads (चक्र की परिधि एवं मणियाँ)",
    hindiTitle: "परिधि मणिकाएँ (चषक / सूक्ष्म काल)",
    subtitle: "The continuous circle of cosmic time (Kala Chakra)",
    description:
      "The outer circular rim consists of a stone tire embedded with 30 repeating carved beads (pins) between each major spoke sector. In horological interpretations, each bead interval corresponds to approximately 3 minutes (a Chashaka or sub-division of a Ghati).",
    historicalContext:
      "The rim represents the endless cycle of the year (Samvatsara). The 24 wheels of the Konark Temple together symbolize the 24 Pakshas (fortnights) of the Hindu lunar-solar calendar.",
    timekeepingRole:
      "Allows fine tracking of the shadow's tip as it sweeps across the outer circumference.",
    position: [0, 3.85, 0.45],
  },
  {
    id: "medallion",
    title: "Carved Medallions (उत्कीर्ण चक्र पदक)",
    hindiTitle: "अलंकृत प्रहर पदक",
    subtitle: "Sculptural narrative of diurnal human life",
    description:
      "At the center of each major spoke is an intricately carved stone medallion. Documented sculptures depict activities appropriate for the corresponding hour: morning waking and prayer, king's darbar, domestic chores, study, dance, and evening rest.",
    historicalContext:
      "Classic Kalinga temple art style (c. 1250 CE). The medallions link astronomical time directly to ethical and cultural duty (Dharma and Karma).",
    timekeepingRole:
      "Visual iconographic confirmation of the diurnal period represented by each spoke.",
    position: [-2.1, 0, 0.4],
  },
];

export const CALCULATION_METRICS: Record<string, CalculationInfoMetric> = {
  konarkWheel: {
    key: "konarkWheel",
    title: "Konark Wheel Minute Calculation (कोणार्क चक्र मणिका काल-गणना)",
    hindiTitle: "कोणार्क चक्र सूक्ष्म काल-गणना",
    plainSummary:
      "The Konark Sun Temple features 24 massive stone wheels (12 on each side of the temple chariot) representing the 24 hours of the day or the 24 fortnights (Pakshas) of the year. The wheel is divided into 8 major spokes representing the 8 Praharas (3 hours / 180 minutes each). Eight minor spokes divide each segment into 1.5 hours (90 minutes). Between each major spoke and adjacent minor spoke are exactly 30 carved beads. Because 90 minutes ÷ 30 beads = 3 minutes per bead, each bead represents 3 minutes. Observers can visually estimate into thirds of a bead to read time down to a single minute!",
    formula: "Time = Prahara_Base + (Bead_Index − 1) × 3 min + Sub_Bead_Third (0, 1, or 2 min)",
    steps: [
      "1. Identify the active Prahara: The 8 major spokes divide the 24-hour day into 8 equal Praharas (each 3 hours / 180 min), starting from dawn (06:00).",
      "2. Determine the sector half: The thinner minor spoke bisects the Prahara at 90 minutes (1.5 hours). Determine whether the shadow lies in the 1st half (Major → Minor, 0–90 min) or 2nd half (Minor → Major, 90–180 min).",
      "3. Count the beads: There are 30 beads along the rim between the major and minor spoke. Multiply the bead count by 3 minutes: Minutes = (Bead_Number − 1) × 3.",
      "4. Read the sub-bead third: Look at where the shadow falls on the bead: outer edge (+0 min), center (+1 min), or inner edge (+2 min).",
      "5. Sum the values: Prahara Start + Sector Offset + Bead Minutes + Sub-minute Third = Exact Time!",
    ],
    units: "Hours, Minutes, Praharas (1-8), Beads (1-30), Thirds (1-3)",
    assumptions: [
      "24 wheels symbolize the 24 hours and 24 fortnights (Pakshas) of the Hindu lunisolar calendar.",
      "Equal 3-hour Prahara intervals referenced to the local apparent solar day (LAST).",
      "Shadow direction corresponds to apparent solar hour angle cast by the central axle pin (gnomon).",
    ],
    limitations: [
      "The shadow reflects Local Apparent Solar Time (LAST). Converting to modern Indian Standard Time (IST) requires adding the longitude difference (~14.4 minutes at Konark) and seasonal Equation of Time (EoT).",
      "On non-equinoctial days, vertical sundial shadow rates vary slightly across the year, requiring seasonal declination calibration.",
    ],
    source:
      "Archaeological Survey of India (ASI), Odisha Temple Architecture Records, and Konark Horological Tradition.",
  },
  altitude: {
    key: "altitude",
    title: "Solar Altitude (सौर उन्नतांश)",
    hindiTitle: "सौर उन्नतांश",
    plainSummary:
      "Solar altitude tells us how high the Sun appears above the horizon. A value of 0° means the Sun is right on the horizon (sunrise or sunset); a positive value means the Sun is up in the sky, reaching its peak altitude at solar noon.",
    formula: "sin(alt) = sin(φ) · sin(δ) + cos(φ) · cos(δ) · cos(H)",
    steps: [
      "1. Determine observer geographic latitude (φ).",
      "2. Calculate Sun's apparent declination (δ) for the current instant.",
      "3. Compute the local solar hour angle (H = Local Apparent Solar Time - 12h) in degrees (15°/hour).",
      "4. Apply spherical trigonometry to find geometric altitude: sin(alt) = sin(φ)sin(δ) + cos(φ)cos(δ)cos(H).",
      "5. Apply Sæmundsson atmospheric refraction correction: alt_refracted = alt + R.",
    ],
    units: "Decimal degrees [−90.0° to +90.0°]",
    assumptions: [
      "Standard atmospheric refraction model (1013.25 mbar pressure, 15°C temperature).",
      "Observer is at specified elevation above mean sea level.",
    ],
    limitations: [
      "Local topography, mountains, or tree canopy may block the horizon.",
      "Extreme atmospheric temperature inversions can cause minor mirage or refraction anomalies.",
    ],
    source: "JPL DE421 Ephemeris / Skyfield topocentric solver & NOAA Solar Calculations.",
  },
  azimuth: {
    key: "azimuth",
    title: "Solar Azimuth (सौर दिगंश)",
    hindiTitle: "सौर दिगंश",
    plainSummary:
      "Solar azimuth tells us the compass direction of the Sun. It is measured in degrees clockwise starting from True North (0° = North, 90° = East, 180° = South, 270° = West).",
    formula: "cos(Az) = (sin(δ) − sin(φ) · sin(alt)) / (cos(φ) · cos(alt))",
    steps: [
      "1. Calculate Sun's declination (δ) and true altitude (alt).",
      "2. Solve spherical triangle for azimuth angle from meridian.",
      "3. If Hour Angle H > 0 (afternoon), adjust azimuth: Az = 360° − Az_raw.",
      "4. Normalize angle to [0°, 360°) clockwise from True North.",
    ],
    units: "Decimal degrees [0.0° to 360.0°), clockwise from True North",
    assumptions: [
      "Referenced to True Geodetic North (not Magnetic North).",
      "Earth modeled as WGS84 ellipsoid.",
    ],
    limitations: ["Near the zenith (altitude ~ 90°), azimuth becomes indeterminate."],
    source: "Jean Meeus Astronomical Algorithms / JPL DE421 Ephemeris.",
  },
  lmst: {
    key: "lmst",
    title: "Local Mean Solar Time (LMST / स्थानीय माध्य सौर काल)",
    hindiTitle: "स्थानीय माध्य सौर काल",
    plainSummary:
      "Local Mean Solar Time is a uniform time based on the observer's exact longitude, assuming a hypothetical 'Mean Sun' that moves along the celestial equator at a constant speed throughout the whole year.",
    formula: "LMST = UTC + (Longitude° / 15°) hours",
    steps: [
      "1. Convert selected civil time to Universal Coordinated Time (UTC).",
      "2. Multiply observer longitude by 4 minutes per degree (or divide by 15°/hour).",
      "3. Add longitude offset to UTC (East is positive, West is negative).",
      "4. Wrap within [00:00:00, 24:00:00).",
    ],
    units: "Hours, Minutes, Seconds (HH:mm:ss)",
    assumptions: [
      "Fictitious Mean Sun moving at uniform angular speed along the celestial equator.",
      "Earth's rotation period is taken as the uniform mean solar day (86,400 SI seconds).",
    ],
    limitations: [
      "Does not match a physical sundial shadow directly because Earth's real orbit is elliptical and tilted.",
    ],
    source: "Standard Horological Convention / Explanatory Supplement to Astronomical Almanac.",
  },
  last: {
    key: "last",
    title: "Local Apparent Solar Time (LAST / स्थानीय स्पष्ट सौर काल)",
    hindiTitle: "स्थानीय स्पष्ट सौर काल (धूपघड़ी काल)",
    plainSummary:
      "Local Apparent Solar Time is the true time shown by a real sundial shadow! It is based on the actual visible Sun in the sky. At exact solar noon, LAST is precisely 12:00:00.",
    formula: "LAST = LMST + Equation of Time (EoT)",
    steps: [
      "1. Calculate Local Mean Solar Time (LMST) from UTC and longitude.",
      "2. Compute the Equation of Time (EoT) from Earth's orbital eccentricity (e) and axial obliquity (ε).",
      "3. Add EoT (in minutes) to LMST: LAST = LMST + EoT.",
      "4. The resulting time directly matches the shadow angle cast by a vertical or polar gnomon.",
    ],
    units: "Hours, Minutes, Seconds (HH:mm:ss)",
    assumptions: [
      "Light-travel time from Sun to Earth (~8.3 minutes) accounted for in apparent Sun coordinates.",
    ],
    limitations: [
      "Sundial days vary slightly in length across seasons (up to ±30 seconds per day) due to Keplerian orbital mechanics.",
    ],
    source: "NOAA Solar Calculation Engine & Surya Siddhanta Spashta Saur Mana.",
  },
  eot: {
    key: "eot",
    title: "Equation of Time (EoT / कालान्तर संस्कार)",
    hindiTitle: "कालान्तर (समीकरण काल)",
    plainSummary:
      "The Equation of Time is the difference between true apparent solar time (sundial) and mean clock time. Because Earth's orbit is an ellipse and its axis is tilted 23.44°, sundials run up to 16 minutes fast or 14 minutes slow throughout the year!",
    formula:
      "EoT = 4 · (y · sin(2L₀) − 2e · sin(M) + 4e·y · sin(M)·cos(2L₀) − 0.5y² · sin(4L₀) − 1.25e² · sin(2M))",
    steps: [
      "1. Calculate Earth's orbital eccentricity (e ≈ 0.0167) and obliquity factor y = tan²(ε/2).",
      "2. Calculate Mean Longitude (L₀) and Mean Anomaly (M).",
      "3. Sum the trigonometric contributions of orbital ellipticity and axial tilt.",
      "4. Convert radians to minutes of time (1 radian = 229.18 minutes).",
    ],
    units: "Minutes of time [−14.2 min to +16.4 min]",
    assumptions: ["Standard J2000.0 secular terms for Earth orbital elements."],
    limitations: ["Valid for dates within the ephemeris window (1900–2053 CE)."],
    source: "Smart's Spherical Astronomy / Jean Meeus Formulae.",
  },
  prahar: {
    key: "prahar",
    title: "Prahara & Ghati System (अष्ट प्रहर एवं षष्टि घटी)",
    hindiTitle: "अष्ट प्रहर एवं षष्टि घटी",
    plainSummary:
      "In traditional Indian timekeeping, a complete 24-hour day (Ahoratra) is divided into 60 Ghatis (1 Ghati = 24 minutes) and 8 Praharas (each ~3 hours). The 8 major spokes of the Konark Chakra represent these 8 Praharas.",
    formula: "1 Ahoratra = 8 Praharas = 60 Ghatis = 3,600 Palas",
    steps: [
      "1. 1 Solar Day (Ahoratra) = 24 Civil Hours.",
      "2. 1 Prahara = 3 Hours = 7.5 Ghatis.",
      "3. 1 Ghati = 24 Minutes = 60 Palas.",
      "4. 1 Pala = 24 Seconds = 60 Vipala.",
      "5. Konark major spoke spacing = 360° / 8 = 45° per Prahara.",
      "6. Konark minor spoke spacing = 22.5° = 1.5 Hours (3.75 Ghatis).",
    ],
    units: "Praharas (1-8), Ghatis (0-60), Palas (0-60)",
    assumptions: [
      "Equal Prahara division (Sama Prahara) spanning 24 hours.",
      "Tradition also recognizes Dinardha (daytime Praharas scaled between sunrise and sunset).",
    ],
    limitations: [
      "Historical temple inscriptions at Konark celebrate cosmic time cycles (Surya Chariot); individual spoke exactitude is an educational reconstruction based on Odisha horological tradition.",
    ],
    source: "Surya Siddhanta (Madhyamadhikara), Vedanga Jyotisha, and Odisha Temple Horology.",
  },
  konarkWheel: {
    key: "konarkWheel",
    title: "Konark Sun Temple Wheel Calculation (कोणार्क चक्र समय गणना)",
    hindiTitle: "कोणार्क चक्र समय गणना (३० मणिका प्रणाली)",
    plainSummary:
      "The Sun Temple at Konark features 24 carved stone chariot wheels representing the 24 hours of the day (or 24 fortnights/Pakshas of the solar year). Each wheel possesses 8 major spokes (dividing the day into 8 Praharas of 3 hours / 180 min each) and 8 minor spokes (dividing each segment into 90 minutes). Between each major and adjacent minor spoke are exactly 30 carved beads: each bead represents 3 minutes (90 min / 30 beads). By observing which bead the gnomon shadow bisects and estimating thirds, observers could measure time down to single minutes!",
    formula:
      "1 Bead = 90 min / 30 beads = 3 minutes; Time = Sector_Start + (Bead − 1) × 3 min + Sub-Bead Third (0, 1, or 2 min)",
    steps: [
      "1. Identify the active Prahara from the Sun's position among the 8 major spokes (each 3 hours / 180 min).",
      "2. Check if the central gnomon shadow falls in the first half (Major → Minor spoke: 0–90 min) or second half (Minor → Major spoke: 90–180 min).",
      "3. Count the carved stone beads (1 to 30) along the rim in that sector. Each bead equals exactly 3 minutes (90 min / 30 beads = 3 min/bead).",
      "4. Observe where the shadow falls on the active bead: leading edge (+0 min), center (+1 min), or trailing edge (+2 min) to determine single-minute time.",
    ],
    units: "Praharas (1-8), Sectors (1-16), Beads (1-30), Minutes (0-89)",
    assumptions: [
      "24 wheels represent the 24 hours of the day or 24 fortnights (Pakshas) of the Hindu calendar.",
      "Sundial gnomon shadow indicates Apparent Solar Time (LAST) at Konark (86.09° E).",
    ],
    limitations: [
      "A sundial functions only during daylight hours when direct sunlight casts a crisp shadow from the axle pin.",
      "Requires Longitude Offset and Equation of Time (EoT) adjustment to match modern civil clock time.",
    ],
    source: "Archaeological Survey of India (ASI) Konark Monographs & Odisha Sun Temple Horology.",
  },
};
