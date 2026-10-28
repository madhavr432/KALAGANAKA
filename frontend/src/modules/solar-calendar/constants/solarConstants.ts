/**
 * Constants and reference datasets for Module 2: Solar Calendar & Solar Festivals.
 */

import {
  ObservatoryPreset,
  RashiDetail,
  AstronomicalStationEvent,
  SolarFestivalItem,
  SolarInfoMetric,
} from "../types/solarCalendar";

export const SOLAR_OBSERVATORY_PRESETS: ObservatoryPreset[] = [
  {
    id: "ujjain",
    name: "Ujjain (उज्जयिनी - Mahakaleshwar)",
    city: "Ujjain, Madhya Pradesh",
    region: "Central India",
    latitude: 23.1765,
    longitude: 75.7885,
    elevation_m: 494.0,
    timezone: "Asia/Kolkata",
  },
  {
    id: "konark",
    name: "Konark Sun Temple (कोणार्क सूर्य मन्दिर)",
    city: "Konark, Odisha",
    region: "East India",
    latitude: 19.8876,
    longitude: 86.0945,
    elevation_m: 6.0,
    timezone: "Asia/Kolkata",
  },
  {
    id: "jaipur",
    name: "Jaipur Jantar Mantar (जयपुर जन्तर मन्तर)",
    city: "Jaipur, Rajasthan",
    region: "North India",
    latitude: 26.9248,
    longitude: 75.8246,
    elevation_m: 431.0,
    timezone: "Asia/Kolkata",
  },
  {
    id: "delhi",
    name: "Delhi Jantar Mantar (दिल्ली जन्तर मन्तर)",
    city: "New Delhi",
    region: "North India",
    latitude: 28.6271,
    longitude: 77.2166,
    elevation_m: 216.0,
    timezone: "Asia/Kolkata",
  },
  {
    id: "varanasi",
    name: "Varanasi (वाराणसी - Kashi)",
    city: "Varanasi, Uttar Pradesh",
    region: "North India",
    latitude: 25.3176,
    longitude: 82.9739,
    elevation_m: 81.0,
    timezone: "Asia/Kolkata",
  },
  {
    id: "chennai",
    name: "Chennai (चेन्नई - Tamil Tradition)",
    city: "Chennai, Tamil Nadu",
    region: "South India",
    latitude: 13.0827,
    longitude: 80.2707,
    elevation_m: 6.0,
    timezone: "Asia/Kolkata",
  },
  {
    id: "kolkata",
    name: "Kolkata (कोलकाता - Bengal Panjika)",
    city: "Kolkata, West Bengal",
    region: "East India",
    latitude: 22.5726,
    longitude: 88.3639,
    elevation_m: 9.0,
    timezone: "Asia/Kolkata",
  },
];

export const SOLAR_RASHIS: RashiDetail[] = [
  {
    index: 1,
    sanskritName: "मेष (Mesha)",
    englishName: "Aries",
    symbol: "♈",
    element: "Agni (Fire)",
    rulingGraha: "Mangala (Mars)",
    startDeg: 0,
    endDeg: 30,
    solarMonthNorth: "Chaitra / Vaisakha",
    solarMonthTamil: "Chithirai (சித்திரை)",
    solarMonthBengali: "Boishakh (বৈশাখ)",
    solarMonthMalayalam: "Medam (മേടം)",
    solarMonthOdia: "Mesha (ମେଷ)",
    approximateDateRange: "Apr 14 – May 14",
    associatedFestivals: [
      "Mesha Sankranti",
      "Puthandu",
      "Vishu",
      "Poila Boishakh",
      "Pana Sankranti",
      "Baisakhi",
    ],
    culturalSignificance:
      "Beginning of the astronomical Nirayana solar year; the Sun enters its exaltation sign (Uchcha).",
    dayBoundaryRule:
      "Tamil: Sunset rule; Bengal: Danda rule (if transit occurs before midnight); Kerala: Aparahna rule.",
  },
  {
    index: 2,
    sanskritName: "वृषभ (Vrishabha)",
    englishName: "Taurus",
    symbol: "♉",
    element: "Prithvi (Earth)",
    rulingGraha: "Shukra (Venus)",
    startDeg: 30,
    endDeg: 60,
    solarMonthNorth: "Jyeshtha",
    solarMonthTamil: "Vaikasi (வைகாசி)",
    solarMonthBengali: "Joishtho (জ্যৈষ্ঠ)",
    solarMonthMalayalam: "Edavam (ഇടവം)",
    solarMonthOdia: "Brusha (ବୃଷ)",
    approximateDateRange: "May 15 – Jun 14",
    associatedFestivals: ["Vrishabha Sankranti", "Vaikasi Visakam"],
    culturalSignificance:
      "Fixed Earth sign; Sun represents steadfast agricultural nourishment and intense early summer heat.",
    dayBoundaryRule: "16 Ghatis (~6h 24m) after transit constitute the sacred Punya Kala window.",
  },
  {
    index: 3,
    sanskritName: "मिथुन (Mithuna)",
    englishName: "Gemini",
    symbol: "♊",
    element: "Vayu (Air)",
    rulingGraha: "Budha (Mercury)",
    startDeg: 60,
    endDeg: 90,
    solarMonthNorth: "Ashadha",
    solarMonthTamil: "Aani (ஆனி)",
    solarMonthBengali: "Asharh (আষাঢ়)",
    solarMonthMalayalam: "Mithunam (മിഥുനം)",
    solarMonthOdia: "Mithuna (ମିଥୁନ)",
    approximateDateRange: "Jun 15 – Jul 15",
    associatedFestivals: ["Mithuna Sankranti", "Raja Parba (Odisha)"],
    culturalSignificance:
      "Dual air sign marking the culmination of Uttarayana and transition toward monsoon showers.",
    dayBoundaryRule: "In Odisha, Raja Parba celebrates earth fertility across Mithuna Sankranti.",
  },
  {
    index: 4,
    sanskritName: "कर्क (Karka)",
    englishName: "Cancer",
    symbol: "♋",
    element: "Jala (Water)",
    rulingGraha: "Chandra (Moon)",
    startDeg: 90,
    endDeg: 120,
    solarMonthNorth: "Shravana",
    solarMonthTamil: "Aadi (ஆடி)",
    solarMonthBengali: "Srabon (শ্রাবণ)",
    solarMonthMalayalam: "Karkidakam (കർക്കിടകം)",
    solarMonthOdia: "Karkata (କର୍କଟ)",
    approximateDateRange: "Jul 16 – Aug 16",
    associatedFestivals: ["Karka Sankranti (Dakshinayana)", "Aadi Perukku", "Ramayana Masam"],
    culturalSignificance:
      "Cardinal water sign marking traditional Dakshinayana ingress (Sun's southward journey in Nirayana reckoning).",
    dayBoundaryRule: "30 Ghatis (~12 hours) prior to ingress are considered sacred Punya Kala.",
  },
  {
    index: 5,
    sanskritName: "सिंह (Simha)",
    englishName: "Leo",
    symbol: "♌",
    element: "Agni (Fire)",
    rulingGraha: "Surya (Sun itself)",
    startDeg: 120,
    endDeg: 150,
    solarMonthNorth: "Bhadrapada",
    solarMonthTamil: "Aavani (ஆவணி)",
    solarMonthBengali: "Bhadro (ভাদ্র)",
    solarMonthMalayalam: "Chingam (ചിങ്ങം)",
    solarMonthOdia: "Simha (ସିଂହ)",
    approximateDateRange: "Aug 17 – Sep 16",
    associatedFestivals: ["Simha Sankranti", "Onam (Chingam harvest)"],
    culturalSignificance:
      "The Sun resides in its Moolatrikona and own domicile. In Kerala, Chingam 1 marks New Year day of the Kollam Era.",
    dayBoundaryRule: "Kerala uses the Madhyanha (solar noon) rule for Chingam month commencement.",
  },
  {
    index: 6,
    sanskritName: "कन्या (Kanya)",
    englishName: "Virgo",
    symbol: "♍",
    element: "Prithvi (Earth)",
    rulingGraha: "Budha (Mercury)",
    startDeg: 150,
    endDeg: 180,
    solarMonthNorth: "Ashwina",
    solarMonthTamil: "Purattasi (புரட்டாசி)",
    solarMonthBengali: "Ashwin (আশ্বিন)",
    solarMonthMalayalam: "Kanni (കന്നി)",
    solarMonthOdia: "Kanya (କନ୍ୟା)",
    approximateDateRange: "Sep 17 – Oct 16",
    associatedFestivals: ["Kanya Sankranti", "Vishwakarma Puja"],
    culturalSignificance:
      "Sign of craftsmanship, harvest organization, and sacred ancestral remembrance during autumnal transition.",
    dayBoundaryRule: "16 Ghatis after transit constitute the sacred Punya Kala window.",
  },
  {
    index: 7,
    sanskritName: "तुला (Tula)",
    englishName: "Libra",
    symbol: "♎",
    element: "Vayu (Air)",
    rulingGraha: "Shukra (Venus)",
    startDeg: 180,
    endDeg: 210,
    solarMonthNorth: "Kartika",
    solarMonthTamil: "Aipasi (ஐப்பசி)",
    solarMonthBengali: "Kartik (কার্তিক)",
    solarMonthMalayalam: "Thulam (തുലാം)",
    solarMonthOdia: "Tula (ତୁଳା)",
    approximateDateRange: "Oct 17 – Nov 15",
    associatedFestivals: ["Tula Sankranti", "Cauvery Theerthodbhava"],
    culturalSignificance:
      "Cardinal air sign symbolizing cosmic balance (scales); sacred holy dips in holy rivers (Tula Snanam).",
    dayBoundaryRule: "Punya Kala spans 15 Ghatis before and 15 Ghatis after ingress.",
  },
  {
    index: 8,
    sanskritName: "वृश्चिक (Vrischika)",
    englishName: "Scorpio",
    symbol: "♏",
    element: "Jala (Water)",
    rulingGraha: "Mangala (Mars)",
    startDeg: 210,
    endDeg: 240,
    solarMonthNorth: "Margashirsha",
    solarMonthTamil: "Karthigai (கார்த்திகை)",
    solarMonthBengali: "Agrahayan (অগ্রহায়ণ)",
    solarMonthMalayalam: "Vrischikam (വൃശ്ചികം)",
    solarMonthOdia: "Bichha (ବିଛା)",
    approximateDateRange: "Nov 16 – Dec 15",
    associatedFestivals: ["Vrischika Sankranti", "Karthigai Deepam", "Sabarimala Mandala Season"],
    culturalSignificance:
      "Fixed water sign; festival of lights (Deepam) on hilltops and commencement of sacred ascetic pilgrimages.",
    dayBoundaryRule: "16 Ghatis prior to transit are auspicious for sacred charitable offerings.",
  },
  {
    index: 9,
    sanskritName: "धनु (Dhanu)",
    englishName: "Sagittarius",
    symbol: "♐",
    element: "Agni (Fire)",
    rulingGraha: "Guru (Jupiter)",
    startDeg: 240,
    endDeg: 270,
    solarMonthNorth: "Pausha",
    solarMonthTamil: "Margazhi (மார்கழி)",
    solarMonthBengali: "Poush (পৌষ)",
    solarMonthMalayalam: "Dhanu (ധനു)",
    solarMonthOdia: "Dhanu (ଧନୁ)",
    approximateDateRange: "Dec 16 – Jan 13",
    associatedFestivals: ["Dhanu Sankranti", "Margazhi Thiruppavai", "Vaikuntha Ekadashi"],
    culturalSignificance:
      "Dual fire sign devoted entirely to spiritual devotion and singing hymns in early dawn (Brahmamuhurta).",
    dayBoundaryRule: "16 Ghatis after transit are auspicious for Dhanu Sankranti rites.",
  },
  {
    index: 10,
    sanskritName: "मकर (Makara)",
    englishName: "Capricorn",
    symbol: "♑",
    element: "Prithvi (Earth)",
    rulingGraha: "Shani (Saturn)",
    startDeg: 270,
    endDeg: 300,
    solarMonthNorth: "Magha",
    solarMonthTamil: "Thai (தை)",
    solarMonthBengali: "Magh (মাঘ)",
    solarMonthMalayalam: "Makaram (മകരം)",
    solarMonthOdia: "Makara (ମକର)",
    approximateDateRange: "Jan 14 – Feb 12",
    associatedFestivals: [
      "Makar Sankranti",
      "Thai Pongal",
      "Magh Bihu",
      "Lohri",
      "Uttarayan Festival",
    ],
    culturalSignificance:
      "Cardinal earth sign heralding traditional Uttarayana; harvest celebration celebrated nationwide under diverse regional names.",
    dayBoundaryRule:
      "Punya Kala: 40 Ghatis (~16h). If ingress occurs after sunset, observance shifts to next morning at sunrise.",
  },
  {
    index: 11,
    sanskritName: "कुम्भ (Kumbha)",
    englishName: "Aquarius",
    symbol: "♒",
    element: "Vayu (Air)",
    rulingGraha: "Shani (Saturn)",
    startDeg: 300,
    endDeg: 330,
    solarMonthNorth: "Phalguna",
    solarMonthTamil: "Maasi (மாசி)",
    solarMonthBengali: "Falgun (ফাল্গুন)",
    solarMonthMalayalam: "Kumbham (കുംഭം)",
    solarMonthOdia: "Kumbha (କୁମ୍ଭ)",
    approximateDateRange: "Feb 13 – Mar 13",
    associatedFestivals: ["Kumbha Sankranti", "Maha Shivaratri (Lunisolar)", "Maasi Magam"],
    culturalSignificance:
      "Fixed air sign representing cosmic nectar pot; sacred Snanam across holy river confluences (Sangam).",
    dayBoundaryRule: "16 Ghatis after ingress constitute the principal Punya Kala.",
  },
  {
    index: 12,
    sanskritName: "मीन (Meena)",
    englishName: "Pisces",
    symbol: "♓",
    element: "Jala (Water)",
    rulingGraha: "Guru (Jupiter)",
    startDeg: 330,
    endDeg: 360,
    solarMonthNorth: "Chaitra (Purva)",
    solarMonthTamil: "Panguni (பங்குனி)",
    solarMonthBengali: "Choitro (চৈত্র)",
    solarMonthMalayalam: "Meenam (മീനം)",
    solarMonthOdia: "Meena (ମୀନ)",
    approximateDateRange: "Mar 14 – Apr 13",
    associatedFestivals: ["Meena Sankranti", "Panguni Uthiram", "Holi (Lunisolar culmination)"],
    culturalSignificance:
      "Final sign of the Nirayana zodiac. The solar cycle completes before renewing in Mesha.",
    dayBoundaryRule:
      "16 Ghatis prior to transit are auspicious for sacred charity and year-end contemplation.",
  },
];

export const ASTRONOMICAL_STATIONS: AstronomicalStationEvent[] = [
  {
    id: "vernal-equinox",
    name: "Vernal Equinox (Spring Equinox)",
    sanskritName: "वसन्त विषुव (Mahāvishuva)",
    approximateDate: "~March 20–21",
    tropicalLongitudeDeg: 0,
    declinationDeg: 0,
    orbitAngleRad: 0,
    description:
      "The moment the Sun crosses the celestial equator moving northwards. Day and night are of approximately equal duration everywhere on Earth.",
    hemisphereSignificance:
      "Marks astronomical spring in the Northern Hemisphere and astronomical autumn in the Southern Hemisphere.",
    indianAstronomicalContext:
      "Historically known as Mahāvishuva. The zero point of the tropical Sayana coordinate system (First Point of Aries). In the 3rd century CE, this aligned with sidereal Mesha.",
    defaultDate: { month: 3, day: 20 },
  },
  {
    id: "summer-solstice",
    name: "Summer Solstice (Uttara Ayana Start)",
    sanskritName: "कर्क संक्रान्ति (Sayana Summer Solstice)",
    approximateDate: "~June 20–21",
    tropicalLongitudeDeg: 90,
    declinationDeg: 23.44,
    orbitAngleRad: Math.PI / 2,
    description:
      "The Sun reaches its northernmost declination (+23.44°), standing directly overhead at the Tropic of Cancer. Longest day of the year in the Northern Hemisphere.",
    hemisphereSignificance:
      "Peak solar insolation in the Northern Hemisphere; onset of astronomical summer.",
    indianAstronomicalContext:
      "Astronomically, the Sun reaches its northern turnaround and begins moving southward (astronomical Dakshinayana begins). In Nirayana tradition, Dakshinayana is celebrated when Sun enters sidereal Cancer in mid-July.",
    defaultDate: { month: 6, day: 21 },
  },
  {
    id: "autumnal-equinox",
    name: "Autumnal Equinox (Fall Equinox)",
    sanskritName: "शरद विषुव (Jala-vishuva)",
    approximateDate: "~September 22–23",
    tropicalLongitudeDeg: 180,
    declinationDeg: 0,
    orbitAngleRad: Math.PI,
    description:
      "The Sun crosses the celestial equator moving southwards. Day and night are once again equal worldwide.",
    hemisphereSignificance:
      "Marks astronomical autumn in the Northern Hemisphere and spring in the Southern Hemisphere.",
    indianAstronomicalContext:
      "Historically known as Jala-vishuva. Precession has shifted this point ~24° westward from the sidereal Chitra/Spica anchor at 180°.",
    defaultDate: { month: 9, day: 22 },
  },
  {
    id: "winter-solstice",
    name: "Winter Solstice (Dakshina Ayana Start)",
    sanskritName: "मकर संक्रान्ति (Sayana Winter Solstice)",
    approximateDate: "~December 21–22",
    tropicalLongitudeDeg: 270,
    declinationDeg: -23.44,
    orbitAngleRad: (3 * Math.PI) / 2,
    description:
      "The Sun reaches its southernmost declination (-23.44°), directly overhead at the Tropic of Capricorn. Shortest day of the year in the Northern Hemisphere.",
    hemisphereSignificance:
      "Minimum solar elevation in Northern Hemisphere; onset of astronomical winter.",
    indianAstronomicalContext:
      "Astronomically, the Sun turns northward (true astronomical Uttarayana begins). Because of precession of the equinoxes (~24.2°), the cultural festival of Makar Sankranti occurs ~23 days later in mid-January when Sun reaches sidereal Makara.",
    defaultDate: { month: 12, day: 21 },
  },
  {
    id: "perihelion",
    name: "Perihelion (Closest to Sun)",
    sanskritName: "उपसौर (Upasaurya)",
    approximateDate: "~January 2–5",
    tropicalLongitudeDeg: 283,
    declinationDeg: -22.8,
    orbitAngleRad: 4.93,
    description:
      "Earth is at its nearest point to the Sun in its slightly elliptical orbit (~147.1 million km / 0.9833 AU).",
    hemisphereSignificance:
      "Occurs during Northern winter, proving that distance from the Sun does NOT cause the seasons—axial tilt does!",
    indianAstronomicalContext:
      "Sun moves at its fastest apparent daily speed (~1.02°/day) in accordance with Kepler's Second Law and Surya Siddhanta's Mandaphala.",
    defaultDate: { month: 1, day: 3 },
  },
  {
    id: "aphelion",
    name: "Aphelion (Farthest from Sun)",
    sanskritName: "अपसौर (Apasaurya)",
    approximateDate: "~July 3–6",
    tropicalLongitudeDeg: 103,
    declinationDeg: 22.8,
    orbitAngleRad: 1.79,
    description:
      "Earth is at its furthest point from the Sun in its orbit (~152.1 million km / 1.0167 AU).",
    hemisphereSignificance:
      "Occurs during Northern summer, demonstrating once again that seasonal warmth is governed by solar angle, not proximity.",
    indianAstronomicalContext:
      "Sun moves at its slowest apparent daily speed (~0.95°/day). The Manda-kendra reaches apogee (Mandoccha).",
    defaultDate: { month: 7, day: 4 },
  },
];

export const SOLAR_FESTIVALS: SolarFestivalItem[] = [
  {
    id: "makar-sankranti",
    name: "Makar Sankranti",
    sanskritName: "मकर संक्रान्ति (Makar Sankranti)",
    regionalName: "उत्तरायण / खिचड़ी / মাঘ মেলা",
    region: "All India",
    category: "Sankranti Ingress",
    tradition: "Sidereal Nirayana",
    approximateGregorian: "January 14–15",
    solarTarget: "Sun enters Sidereal Makara (270.0°)",
    astronomicalBasis:
      "The moment the geocentric apparent solar longitude (Lahiri sidereal) reaches exactly 270° 00' 00\". Marks the Sun's transit out of Sagittarius into Capricorn.",
    culturalSignificance:
      "Pan-Indian harvest celebration marking the transition toward longer, warmer days. Commemorated with holy dips in the Ganga, kite flying in Gujarat, sesame-jaggery sweets (Tilgul) in Maharashtra, and Khichdi in North India.",
    observanceRule:
      "Standard Shastric Rule: If the ingress (Sankranti instant) occurs during the daytime, Punya Kala is observed on that day. If ingress occurs after local sunset, the sacred ritual bath and festival are observed on the following morning at sunrise.",
    defaultDate: { month: 1, day: 14 },
  },
  {
    id: "pongal",
    name: "Thai Pongal",
    sanskritName: "पोंगल (Thai Pongal)",
    regionalName: "தைப்பொங்கல்",
    region: "South",
    category: "Harvest / Seasonal",
    tradition: "Sidereal Nirayana",
    approximateGregorian: "January 14–15",
    solarTarget: "Thai Month Day 1 (Makara Ingress)",
    astronomicalBasis:
      "Directly synchronized with the Sun's entry into Makara Rashi. Thai 1 marks the first civil day of the 10th month of the Tamil solar calendar.",
    culturalSignificance:
      "Four-day Tamil festival of gratitude to Surya, cattle (Mattu Pongal), and nature. Freshly harvested rice, jaggery, and milk are boiled in an earthen pot until it overflows, shouting 'Pongalo Pongal!'.",
    observanceRule:
      "Tamil Sunset Rule: If Makara Sankranti occurs before local sunset, that civil calendar day is Thai 1; otherwise, the following day is designated as Thai 1.",
    defaultDate: { month: 1, day: 15 },
  },
  {
    id: "mesha-sankranti",
    name: "Mesha Sankranti (Maha Vishuva)",
    sanskritName: "मेष संक्रान्ति (Mesha Sankranti)",
    regionalName: "महा विषुव संक्रान्ति",
    region: "All India",
    category: "Sankranti Ingress",
    tradition: "Sidereal Nirayana",
    approximateGregorian: "April 13–15",
    solarTarget: "Sun enters Sidereal Mesha (0.0°)",
    astronomicalBasis:
      "The moment the Sun crosses the sidereal origin point (0° Mesha), returning to the beginning of the Nirayana zodiac after traversing all 12 Rashis.",
    culturalSignificance:
      "Forms the bedrock of regional solar calendars across India. Celebrated as the astronomical solar New Year in Tamil Nadu, Kerala, Bengal, Assam, Odisha, and Punjab.",
    observanceRule:
      "Punya Kala spans 16 Ghatis (~6h 24m) after the exact transit moment. Sacred charity (Dāna), water pot offerings, and ancestral tarpana are performed.",
    defaultDate: { month: 4, day: 14 },
  },
  {
    id: "puthandu",
    name: "Puthandu (Tamil New Year)",
    sanskritName: "पुथांडु (Puthandu)",
    regionalName: "தமிழ்ப் புத்தாண்டு",
    region: "South",
    category: "Solar New Year",
    tradition: "Sidereal Nirayana",
    approximateGregorian: "April 14",
    solarTarget: "Chithirai Month Day 1",
    astronomicalBasis:
      "First day of the first solar month (Chithirai) in the Tamil calendar, governed by the Sun's ingress into Mesha Rashi.",
    culturalSignificance:
      "Welcoming the New Year with the auspicious viewing of Kani (tray with gold, fruits, flowers, mirror), neem-mango Pachadi symbolizing life's diverse flavors, and reading the new Panchangam.",
    observanceRule:
      "Calculated based on whether Mesha Sankranti falls between sunrise and sunset (Aparahna rule).",
    defaultDate: { month: 4, day: 14 },
  },
  {
    id: "vishu",
    name: "Vishu",
    sanskritName: "विषु (Vishu)",
    regionalName: "വിഷു (Malayalam Solar New Year)",
    region: "South",
    category: "Solar New Year",
    tradition: "Sidereal Nirayana",
    approximateGregorian: "April 14–15",
    solarTarget: "Medam Month Day 1",
    astronomicalBasis:
      "Marks the Sun's transit into Medam (sidereal Mesha). The Sanskrit word 'Vishu' historically means equal day and night (equinox).",
    culturalSignificance:
      "Celebrated in Kerala with Vishukkani (auspicious first sight featuring golden Kani Konna cassia flowers, Krishna idol, rice, and betel leaves), Vishu Kaineettam (elder blessings with coins), and firecrackers.",
    observanceRule:
      "Kollam Era Rule: If Mesha Sankranti occurs before Madhyanha (astronomical solar noon), that day is Medam 1. Otherwise, the next day is Medam 1.",
    defaultDate: { month: 4, day: 15 },
  },
  {
    id: "poila-boishakh",
    name: "Poila Boishakh (Noboborsho)",
    sanskritName: "पोइला बैसाख (Noboborsho)",
    regionalName: "পয়লা বৈশাখ / শুভ নববর্ষ",
    region: "East",
    category: "Solar New Year",
    tradition: "Sidereal Nirayana",
    approximateGregorian: "April 14–15",
    solarTarget: "Boishakh Month Day 1",
    astronomicalBasis:
      "Calculated from the entry of the Sun into Mesha using the Surya Siddhanta Drik Bengali Panjika convention.",
    culturalSignificance:
      "Bengali Solar New Year, celebrated with cultural processions (Mangal Shobhajatra), opening of fresh accounting ledgers (Haalkhata), and exchange of traditional sweets (Rasgulla, Sandesh).",
    observanceRule:
      "Traditional Danda Rule: If the Sun enters Mesha between sunrise and midnight, the next civil day is observed as Boishakh 1.",
    defaultDate: { month: 4, day: 15 },
  },
  {
    id: "pana-sankranti",
    name: "Pana Sankranti (Maha Vishuba)",
    sanskritName: "पणा संक्रान्ति (Pana Sankranti)",
    regionalName: "ପଣା ସଂକ୍ରାନ୍ତି / ଓଡ଼ିଆ ନୂଆ ବର୍ଷ",
    region: "East",
    category: "Solar New Year",
    tradition: "Sidereal Nirayana",
    approximateGregorian: "April 14",
    solarTarget: "Mesha Month Day 1",
    astronomicalBasis: "Odia solar calendar beginning upon Sun's ingress into Mesha Rashi.",
    culturalSignificance:
      "A perforated earthen pot (Basundhara Theki) filled with water is suspended over a Tulasi plant, dripping life-giving water during scorching spring heat. Devotees drink refreshing sweet Bela Pana (wood-apple drink).",
    observanceRule:
      "Determined according to the Odia Kohinoor and Biraja Panjika calculation of Mesha Sankranti.",
    defaultDate: { month: 4, day: 14 },
  },
  {
    id: "baisakhi",
    name: "Baisakhi (Vaisakhi)",
    sanskritName: "बैसाखी (Baisakhi)",
    regionalName: "ਵੈਸାଖੀ (Punjabi Solar Harvest)",
    region: "North",
    category: "Harvest / Seasonal",
    tradition: "Sidereal Nirayana",
    approximateGregorian: "April 13–14",
    solarTarget: "Vaisakh Month Day 1 (Mesha Ingress)",
    astronomicalBasis:
      "Celebrates the Sun's ingress into Mesha in the North Indian Bikrami solar calendar.",
    culturalSignificance:
      "Celebrates golden Rabi wheat harvest in Punjab with Bhangra and Giddha folk dances. Also commemorates the historic creation of the Khalsa Panth by Guru Gobind Singh Ji in 1699 CE.",
    observanceRule: "Observed on the civil day corresponding to the Mesha Sankranti transit.",
    defaultDate: { month: 4, day: 13 },
  },
  {
    id: "karka-sankranti",
    name: "Karka Sankranti",
    sanskritName: "कर्क संक्रान्ति (Karka Sankranti)",
    regionalName: "दक्षिणायन प्रारम्भ",
    region: "All India",
    category: "Sankranti Ingress",
    tradition: "Sidereal Nirayana",
    approximateGregorian: "July 16–17",
    solarTarget: "Sun enters Sidereal Karka (90.0°)",
    astronomicalBasis:
      "The moment the geocentric apparent solar longitude reaches 90° (Cancer ingress).",
    culturalSignificance:
      "Traditional Indian solar marker of Dakshinayana (southward movement of Surya). Associated with cooling monsoon rains, fasting, and contemplation.",
    observanceRule: "Punya Kala spans 30 Ghatis (~12 hours) prior to the exact transit instant.",
    defaultDate: { month: 7, day: 16 },
  },
  {
    id: "simha-sankranti",
    name: "Simha Sankranti (Chingam 1)",
    sanskritName: "सिंह संक्रान्ति (Simha Sankranti)",
    regionalName: "ചിങ്ങം 1 (Chingam Month Start)",
    region: "South",
    category: "Sankranti Ingress",
    tradition: "Sidereal Nirayana",
    approximateGregorian: "August 16–17",
    solarTarget: "Sun enters Sidereal Simha (120.0°)",
    astronomicalBasis: "The Sun transits into its own zodiacal sign Leo (Simha Rashi).",
    culturalSignificance:
      "Marks the beginning of the Malayalam New Year calendar (Kollam Era). In Himachal and Kumaon, celebrated as Ghee Sankranti with feasts of pure clarified butter.",
    observanceRule:
      "Kerala applies the Madhyanha rule: if ingress occurs before astronomical noon, that day is Chingam 1; else the following day.",
    defaultDate: { month: 8, day: 17 },
  },
  {
    id: "chhath-puja",
    name: "Chhath Puja (Surya Shashthi)",
    sanskritName: "छठ पूजा (Chhath Puja)",
    regionalName: "सूर्य षष्ठी / डाला छठ",
    region: "East",
    category: "Solar Reverence",
    tradition: "Lunisolar Solar-Tithi",
    approximateGregorian: "October–November (Kartika Shukla Shashthi)",
    solarTarget: "Kartika Solar Month • Setting & Rising Surya",
    astronomicalBasis:
      "Observed on the 6th lunar tithi (Shashthi) of Kartika month, honoring Surya and his cosmic consort Usha (dawn) and Pratyusha (dusk).",
    culturalSignificance:
      "The most rigorous ancient Vedic solar ritual. Without any priest intervention, devotees (Vrati) stand waist-deep in river waters, offering pure Arghya to the setting and rising Sun, praying for health, vitality, and gratitude.",
    observanceRule:
      "Sandhya Arghya offered at precise local sunset on Shashthi; Usha Arghya offered at precise local sunrise on Saptami.",
    defaultDate: { month: 11, day: 6 },
  },
  {
    id: "ratha-saptami",
    name: "Ratha Saptami (Surya Jayanti)",
    sanskritName: "रथ सप्तमी (Ratha Saptami)",
    regionalName: "सूर्य जयन्ती / आरोग्य सप्तमी",
    region: "All India",
    category: "Solar Reverence",
    tradition: "Lunisolar Solar-Tithi",
    approximateGregorian: "January–February (Magha Shukla Saptami)",
    solarTarget: "Magha Solar Period • Turning of Surya's Chariot",
    astronomicalBasis:
      "Observed on Magha Shukla Saptami, symbolizing Surya turning his 7-horse chariot towards the northeast, inaugurating warmer spring days.",
    culturalSignificance:
      "Celebrated across India as the symbolic birthday of Surya Deva. Devotees take bath with Ekka (Calotropis) leaves on their heads, offering water and worshipping the seven spectral rays of solar illumination.",
    observanceRule:
      "Snanam and Arghya must be performed at Arunodaya (early dawn twilight, approximately 1 hour 36 minutes before sunrise).",
    defaultDate: { month: 2, day: 4 },
  },
];

export const SOLAR_INFO_METRICS: Record<string, SolarInfoMetric> = {
  tropicalLongitude: {
    id: "tropicalLongitude",
    title: "Apparent Tropical Solar Longitude (Sayana Longitude - λ_trop)",
    plainSummary:
      "The angular position of the Sun along the ecliptic, measured counterclockwise from the Vernal Equinox (the point where the Sun crosses the celestial equator going North). This is the coordinate system used by modern Western astronomy and meteorology to define the seasons.",
    formula:
      "\\lambda_{trop} = \\lambda_{mean} + C(\\text{Equation of Center}) + \\Delta\\psi_{nutation} - \\text{Aberration}",
    steps: [
      "Compute Julian Ephemeris Century (T) from the target instant in Terrestrial Time (TT).",
      "Calculate Earth's mean anomaly: M = 357.5291° + 35999.0503° · T.",
      "Calculate the Equation of Center: C = (1.9146° - 0.0048° T) sin(M) + (0.0200° - 0.0001° T) sin(2M) + 0.0003° sin(3M).",
      "Add true geometric longitude and apply periodic planetary perturbations from JPL DE421 ephemeris.",
      'Apply light-time correction (-20.49" stellar aberration) and IAU 2000B nutation in longitude.',
    ],
    units: "Degrees (°) [0° to 360°)",
    source:
      "NASA JPL DE421 Ephemeris / IAU 2000 Reference Frame / Astronomical Algorithms (Jean Meeus)",
    assumptions: [
      "Geocentric apparent position (as seen from Earth's center, corrected for light deflection and aberration).",
      "Epoch: True Equinox and Ecliptic of Date.",
    ],
    limitations: [
      "Tropical longitude drifts relative to the fixed stars at ~50.29 arcseconds per year due to axial precession.",
    ],
  },
  siderealLongitude: {
    id: "siderealLongitude",
    title: "Lahiri Sidereal Solar Longitude (Nirayana Longitude - λ_sid)",
    plainSummary:
      "The angular position of the Sun along the ecliptic measured from a fixed star framework rather than the shifting equinox. In the official Indian Government Calendar Reform Committee standard (Lahiri / Chitrapaksha), the sidereal zero point is placed exactly 180° opposite the bright star Spica (Chitra).",
    formula: "\\lambda_{sid} = (\\lambda_{trop} - \\Delta\\psi_{Lahiri}) \\pmod{360^\\circ}",
    steps: [
      "Obtain high-precision apparent geocentric tropical longitude λ_trop from ephemeris.",
      'Compute the Lahiri Ayanamsha: Δψ = 23° 51\' 25.53" (at J2000.0) + 50.290966"/year · (T - 2000).',
      "Subtract Ayanamsha from tropical longitude: λ_sid = λ_trop - Δψ.",
      "Normalize angle within [0°, 360°).",
      "Determine Rashi index: Rashi = floor(λ_sid / 30°), where 0 = Mesha, 1 = Vrishabha... 9 = Makara.",
    ],
    units: "Degrees (°) [0° to 360°)",
    source:
      "Calendar Reform Committee Report (1955) / Lahiri Chitrapaksha Standard / Indian Astronomical Ephemeris",
    assumptions: [
      "Chitra (Spica / α Virginis) is fixed at precisely 180° 00' 00\" in the sidereal Nirayana zodiac.",
      "Linear precession rate with second-order nutation corrections.",
    ],
    limitations: [
      "Other traditional ayanamshas exist (Raman, Krishnamurti, Fagan-Bradley, Pushya-Paksha); differences range up to ~1° to 3°.",
    ],
  },
  ayanamsha: {
    id: "ayanamsha",
    title: "Ayanamsha & Precession of the Equinoxes (अयनांश)",
    plainSummary:
      "Because Earth wobbles like a spinning top with a 25,772-year period, the Vernal Equinox slowly slips backwards through the constellations at about 1 degree every 72 years (~50.29 arcseconds/year). The difference between the tropical equinox and the fixed sidereal stars is called Ayanamsha (literally 'ayana portion').",
    formula:
      "\\Delta\\psi(t) = \\lambda_{trop}(t) - \\lambda_{sid}(t) \\approx 24.23^\\circ \\text{ (in 2026)}",
    steps: [
      "In approximately 285 CE, the tropical Vernal Equinox was directly aligned with the start of sidereal Mesha (Aries), meaning Ayanamsha was approximately 0°.",
      'Over the subsequent 1,741 years, the equinox has precessed westward: 1741 years · (50.29" / 3600") ≈ 24.31°.',
      "Consequently, any solar event defined sidereally occurs ~24 days later in the Gregorian year today than it did in 285 CE.",
    ],
    units: "Degrees (°), Arcminutes ('), Arcseconds (\")",
    source: "IAU Precession Model (P03) / Lahiri Indian Astronomical Ephemeris",
    assumptions: ["Zero-Ayanamsha year calibrated to ~285 CE (Chitrapaksha convention)."],
    limitations: [
      "Historical texts (Aryabhatiya, Surya Siddhanta) utilize slightly varying base epochs and trepidation models.",
    ],
  },
  sankranti: {
    id: "sankranti",
    title: "Sankranti Ingress & Sacred Punya Kala (संक्रान्ति)",
    plainSummary:
      "A Sankranti is the exact astronomical instant when the center of the Sun crosses from one sidereal Rashi (30° zodiac sector) into the next. There are 12 Sankrantis each year. The time immediately before and after this transit is deemed the sacred Punya Kala window.",
    formula:
      "\\text{Sankranti condition: } \\lambda_{sid}(t) = k \\cdot 30^\\circ \\quad (k \\in \\{0, 1, \\dots, 11\\})",
    steps: [
      "Track instantaneous sidereal longitude: λ_sid(t).",
      "Locate the exact second when λ_sid reaches an exact multiple of 30° (0° Mesha, 90° Karka, 270° Makara, etc.).",
      "Calculate the Punya Kala window: For Makara Sankranti, the window spans 40 Ghatis (16 hours).",
      "Determine civil observance day: If the transit occurs after local sunset, festival observances (Snanam, Dāna) shift to the following civil sunrise.",
    ],
    units: "Exact UTC/Local Instant; Punya Kala in Ghatis (1 Ghati = 24 minutes)",
    source: "Surya Siddhanta Chapter 14 / Dharma Sindhu & Nirnaya Sindhu",
    assumptions: [
      "Apparent geocentric solar disk center.",
      "Calculated in Indian Standard Time (UTC+05:30) with local sunrise/sunset offsets.",
    ],
    limitations: [
      "Different regional traditions (Tamil, Malayalam, Odia, Bengali) use different day-boundary rules for Day 1 of the solar month.",
    ],
  },
  makarPrecession: {
    id: "makarPrecession",
    title: "Why Makar Sankranti Is NOT on the Winter Solstice",
    plainSummary:
      "One of the most common astronomical misconceptions is that Makar Sankranti falls on the shortest day of the year (Winter Solstice). While they were synchronized around 1,700 years ago (~285 CE), axial precession has caused the tropical Winter Solstice (~Dec 21) and sidereal Makar Sankranti (~Jan 14-15) to diverge by ~23.5 days!",
    formula:
      "\\Delta t = \\frac{\\text{Ayanamsha}}{\\text{Mean Solar Speed}} = \\frac{24.23^\\circ}{0.9856^\\circ/\\text{day}} \\approx 24.58 \\text{ days}",
    steps: [
      "On December 21, the Sun reaches its southernmost declination (-23.44°) at tropical longitude 270.0° (Sayana Winter Solstice).",
      "At that moment, the sidereal solar longitude is: 270.0° - 24.23° = 245.77°, which is in Dhanu (Sagittarius), not Makara!",
      "The Sun must travel another 24.23° along the ecliptic to reach sidereal Makara (270.0°).",
      "At the Sun's daily pace of ~0.9856° per day, this takes 24.23 / 0.9856 ≈ 24.5 days.",
      "Adding 24.5 days to December 21 brings us precisely to January 14–15 (Makar Sankranti)!",
    ],
    units: "Days of difference; Precession rate ~1° per 72 years",
    source: "KalaGanaka Comparative Astronomy Analysis / B.S. Shylaja & S. Balachandra Rao",
    assumptions: [
      "Earth's orbital speed near perihelion is ~1.02°/day (accelerated motion accounted for).",
    ],
    limitations: ["In about 5,000 years, Makar Sankranti will occur in February!"],
  },
  seasonsAxialTilt: {
    id: "seasonsAxialTilt",
    title: "Earth's 23.44° Axial Tilt & Seasons (Why Distance Does Not Cause Seasons)",
    plainSummary:
      "Seasons are caused entirely by the tilt of Earth's rotational axis (23.44°) relative to its orbital plane, NOT by its distance from the Sun. Earth is actually CLOSEST to the Sun in January (Perihelion: 147.1M km) during the Northern Hemisphere winter!",
    formula:
      "\\sin(\\delta) = \\sin(\\epsilon) \\cdot \\sin(\\lambda_{trop}), \\quad \\epsilon \\approx 23.43929^\\circ",
    steps: [
      "Earth's rotational axis points in a fixed direction in space (towards Polaris).",
      "In June, the Northern Hemisphere tilts toward the Sun, receiving direct solar rays at steep angles (concentrated energy, higher noon altitude, longer daylight).",
      "In December, the Northern Hemisphere tilts away from the Sun, receiving shallow, spreading rays (lower energy per square meter, shorter days).",
      "Earth-Sun orbital distance varies by only ~3.3% between Perihelion (147.1M km) and Aphelion (152.1M km), causing less than 7% insolation difference, completely overshadowed by axial tilt geometry.",
    ],
    units: "Obliquity ε = 23.44°; Declination δ between -23.44° and +23.44°",
    source: "Milankovitch Climate Theory / Modern Celestial Mechanics",
    assumptions: [
      "Earth's obliquity varies between 22.1° and 24.5° over a 41,000-year cycle; currently decreasing at 47\" per century.",
    ],
    limitations: [
      "Exaggerated orbital visual models should not be misinterpreted as extreme orbital eccentricity.",
    ],
  },
};
