# KalaGanaka Frontend Integration Guide

This document provides the complete API specification, configuration details, and integration examples for Person 1 (Frontend Developer) to integrate with the KalaGanaka Modern Astronomy and Panchang backend.

---

## 1. Quick Start & Local Development

### Prerequisites
* Python 3.11 or 3.12 installed.
* Dependencies installed from `backend/requirements.txt`.

### Startup Commands
From the `backend/` directory:

```bash
# 1. Activate your virtual environment (if using one)
# Windows:
# .\venv\Scripts\activate
# Linux/macOS:
# source venv/bin/activate

# 2. Install backend dependencies (if not already installed)
pip install -r requirements.txt

# 3. Start the FastAPI development server with auto-reload
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

### Base URLs & Interactive Documentation
* **Base API URL**: `http://127.0.0.1:8000` (or `http://localhost:8000`)
* **Interactive Swagger UI**: `http://127.0.0.1:8000/docs`
* **Interactive ReDoc Documentation**: `http://127.0.0.1:8000/redoc`
* **Health Check**: `GET http://127.0.0.1:8000/health` $\to$ `{"status": "ok"}`

---

## 2. CORS & Network Configuration

### Current Behavior (Development)
The backend in `app/main.py` is configured with FastAPI's `CORSMiddleware` restricted to explicit local development origins (unrestricted wildcard `*` with credentials is intentionally not used):
* `http://localhost:3000` (Next.js / CRA)
* `http://localhost:5173` (Vite)
* `http://127.0.0.1:3000`
* `http://127.0.0.1:5173`
* `allow_credentials=True`
* `allow_methods=["*"]`
* `allow_headers=["*"]`

This enables local development frontend servers on ports 3000 or 5173 to perform requests and preflight `OPTIONS` calls while preventing arbitrary external browser origins from accessing the local development API.

### Recommended Production Configuration
When deploying to production, supply explicit production domains (e.g. via an `ALLOWED_ORIGINS` environment variable):

```python
import os

allowed_origins = os.getenv(
    "ALLOWED_ORIGINS",
    "https://kalaganaka.app,https://www.kalaganaka.app"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in allowed_origins if origin.strip()],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)
```

---

## 3. General Conventions & Parameter Rules

### Timezone Handling
* **Input Datetimes MUST Be Timezone-Aware**: All ISO-8601 instant strings must have an explicit UTC offset (`+HH:MM` / `-HH:MM`) or `Z` (e.g. `2026-10-27T12:00:00+05:30` or `2026-10-27T06:30:00Z`).
  * Timezone-naive strings (e.g. `2026-10-27T12:00:00`) are rejected with **HTTP 422**.
* **Timezone Identifiers (`timezone` / `tz`)**: Accept standard IANA timezone names (e.g. `Asia/Kolkata`, `America/New_York`, `Europe/Oslo`, `UTC`) or valid numeric UTC offsets (e.g. `+05:30`, `-04:00`).

### Coordinate Units & Ranges
* **Latitude**: Decimal degrees in range `[-90.0, +90.0]` (positive North, negative South).
* **Longitude**: Decimal degrees in range `[-180.0, +180.0]` (positive East, negative West).
* **Elevation**: Decimal meters above sea level in range `[-500.0, 12000.0]` (default: `0.0`).
* **Angular Positions**: Output longitudes and angles are normalized to `[0.0, 360.0)` degrees (`_deg`).
* **Distances**: Returned simultaneously in Astronomical Units (`distance_au`) and kilometers (`distance_km`).
* **Time Intervals**: Durations remaining are returned in seconds (`seconds_remaining`) and decimal hours (`hours_remaining`).

### Supported Ephemeris Date Range
* The backend engine utilizes JPL DE421 ephemeris data covering **1899-07-29 to 2053-10-08 UTC**.
* Requests outside this range return **HTTP 422** with a descriptive `DateOutOfRangeError` message.

---

## 4. Endpoint Specifications

### 4.1 Modern Planetary Positions

Calculates apparent geocentric ecliptic coordinates (tropical and Lahiri sidereal) for all 7 classical bodies (Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn).

* **GET** `/astronomy/planets?instant={instant}`
* **POST** `/astronomy/planets`

#### POST Request Body:
```json
{
  "instant": "2026-10-27T00:00:00Z"
}
```

#### Response (`200 OK`):
```json
{
  "instant": "2026-10-27T00:00:00+00:00",
  "julian_date_tt": 2461340.500801,
  "ayanamsha_name": "Lahiri (Chitrapaksha)",
  "ayanamsha_deg": 24.234512,
  "planets": [
    {
      "name": "Sun",
      "tropical_longitude_deg": 213.584348,
      "sidereal_longitude_deg": 189.349836,
      "latitude_deg": 0.000187,
      "distance_au": 0.993512,
      "distance_km": 148627891.2
    },
    {
      "name": "Moon",
      "tropical_longitude_deg": 44.714903,
      "sidereal_longitude_deg": 20.480391,
      "latitude_deg": 4.915037,
      "distance_au": 0.002611,
      "distance_km": 390612.4
    }
  ],
  "positions_tropical_deg": {
    "Sun": 213.584348,
    "Moon": 44.714903,
    "Mercury": 230.469692,
    "Venus": 209.020321,
    "Mars": 136.064258,
    "Jupiter": 143.687077,
    "Saturn": 9.613920
  },
  "positions_sidereal_deg": {
    "Sun": 189.349836,
    "Moon": 20.480391,
    "Mercury": 206.235180,
    "Venus": 184.785809,
    "Mars": 111.829746,
    "Jupiter": 119.452565,
    "Saturn": 345.379408
  },
  "ephemeris": "JPL DE421",
  "reference_frame": "Geocentric true equator and equinox of date (apparent coordinates)",
  "coordinate_system": "Ecliptic coordinates of date",
  "time_standard": "UTC (input) converted to TT (Terrestrial Time)",
  "units": {
    "longitude": "degrees in range [0, 360)",
    "latitude": "degrees in range [-90, +90]",
    "distance": "Astronomical Units (au) and Kilometers (km)",
    "ayanamsha": "degrees"
  },
  "assumptions": [
    "Apparent positions include light-travel time correction, gravitational deflection of light, and stellar aberration.",
    "Ecliptic coordinates are referenced to the true ecliptic and equinox of date (accounting for precession and nutation)."
  ]
}
```

---

### 4.2 Solar Events (Sunrise, Sunset, Solar Noon)

Calculates civil/astronomical sunrise, sunset, and solar noon for a given observer location and local Gregorian date.

* **GET** `/solar/events?date={YYYY-MM-DD}&latitude={lat}&longitude={lon}&elevation_m={elev}&timezone={tz}`
* **POST** `/solar/events`

#### POST Request Body:
```json
{
  "date": "2026-10-27",
  "latitude": 28.6139,
  "longitude": 77.2090,
  "elevation_m": 0.0,
  "timezone": "Asia/Kolkata"
}
```

#### Response (`200 OK`):
```json
{
  "date": "2026-10-27",
  "observer": {
    "latitude": 28.6139,
    "longitude": 77.2090,
    "elevation_m": 0.0,
    "timezone": "Asia/Kolkata"
  },
  "sunrise": {
    "time_local": "2026-10-27T06:29:28+05:30",
    "time_utc": "2026-10-27T00:59:28Z",
    "available": true,
    "reason": null
  },
  "sunset": {
    "time_local": "2026-10-27T17:40:12+05:30",
    "time_utc": "2026-10-27T12:10:12Z",
    "available": true,
    "reason": null
  },
  "solar_noon": {
    "time_local": "2026-10-27T12:04:50+05:30",
    "time_utc": "2026-10-27T06:34:50Z",
    "available": true,
    "reason": null
  },
  "day_length_hours": 11.1788,
  "conventions": {
    "standard_altitude_deg": "-0.8333 degrees below horizon",
    "solar_limb_convention": "Upper limb of Sun touching apparent horizon (16 arcminutes semidiameter)",
    "refraction_convention": "Standard atmospheric refraction of 34 arcminutes at sea level",
    "observer_model": "WGS84 ellipsoidal surface with specified elevation above sea level"
  },
  "assumptions": [
    "Sunrise and sunset occur when the Sun's upper limb touches the apparent horizon.",
    "Accounts for standard atmospheric refraction of 34 arcminutes at the horizon and 16 arcminutes solar semidiameter (-50' center depression)."
  ]
}
```

*Note on Polar Regions*: During Polar Day (midnight sun) or Polar Night, `sunrise.available` is `false`, and `reason` provides a descriptive explanation (e.g. `"Polar day (midnight sun): Sun remains above horizon continuously"`).

---

### 4.3 Solar Position (Altitude and Azimuth)

Calculates the topocentric apparent solar altitude and azimuth for an observer location at an instant.

* **GET** `/solar/position?instant={instant}&latitude={lat}&longitude={lon}&elevation_m={elev}`
* **POST** `/solar/position`

#### POST Request Body:
```json
{
  "instant": "2026-10-27T12:00:00+05:30",
  "latitude": 28.6139,
  "longitude": 77.2090,
  "elevation_m": 0.0
}
```

#### Response (`200 OK`):
```json
{
  "instant": "2026-10-27T12:00:00+05:30",
  "observer": {
    "latitude": 28.6139,
    "longitude": 77.2090,
    "elevation_m": 0.0,
    "timezone": "UTC"
  },
  "altitude_deg": 48.2145,
  "altitude_refracted_deg": 48.2289,
  "azimuth_deg": 178.4312,
  "distance_au": 0.993512,
  "distance_km": 148627891.2,
  "is_sun_up": true,
  "conventions": {
    "altitude_convention": "Degrees above horizon [-90, +90]",
    "azimuth_convention": "Degrees clockwise from True North [0, 360)",
    "refraction_model": "Standard atmospheric refraction (15°C, 1013.25 mbar)"
  }
}
```

---

### 4.4 Instantaneous Panchang Angas

Calculates the core five/four Panchang limbs (Tithi, Nakshatra, Yoga, Karana) active at a specific instant.

* **GET** `/panchang/instant?instant={instant}&timezone={tz}`
* **POST** `/panchang/instant`

#### POST Request Body:
```json
{
  "instant": "2026-10-27T00:00:00Z",
  "timezone": "Asia/Kolkata"
}
```

#### Response (`200 OK`):
```json
{
  "instant_requested": "2026-10-27T00:00:00Z",
  "instant_local": "2026-10-27T05:30:00+05:30",
  "instant_utc": "2026-10-27T00:00:00Z",
  "julian_date_tt": 2461340.500801,
  "ayanamsha_deg": 24.234512,
  "sun_sidereal_longitude_deg": 189.349836,
  "moon_sidereal_longitude_deg": 20.480391,
  "sun_tropical_longitude_deg": 213.584348,
  "moon_tropical_longitude_deg": 44.714903,
  "tithi": {
    "index": 16,
    "name": "Pratipada",
    "paksha": "Krishna",
    "tithi_in_paksha": 1,
    "angular_separation_deg": 191.130554,
    "elapsed_deg_in_tithi": 11.130554,
    "fraction_elapsed": 0.927546,
    "boundary_convention": "[start, end) degrees, lower inclusive, upper exclusive"
  },
  "nakshatra": {
    "index": 2,
    "name": "Bharani",
    "sidereal_longitude_deg": 20.480391,
    "elapsed_deg_in_nakshatra": 7.147058,
    "fraction_elapsed": 0.536029,
    "sector_span_deg": 13.333333,
    "boundary_convention": "[start, end) degrees, lower inclusive, upper exclusive"
  },
  "yoga": {
    "index": 16,
    "name": "Vajra",
    "combined_longitude_deg": 209.830227,
    "elapsed_deg_in_yoga": 9.830227,
    "fraction_elapsed": 0.737267,
    "sector_span_deg": 13.333333,
    "boundary_convention": "[start, end) degrees, lower inclusive, upper exclusive"
  },
  "karana": {
    "half_tithi_index": 32,
    "name": "Balava",
    "canonical_name": "Balava",
    "display_name": "Balava",
    "alias": null,
    "karana_type": "repeating",
    "angular_separation_deg": 191.130554,
    "elapsed_deg_in_karana": 5.130554,
    "fraction_elapsed": 0.855092,
    "boundary_convention": "[start, end) degrees, lower inclusive, upper exclusive"
  },
  "longitude_conventions": {
    "ayanamsha": "Lahiri (Chitrapaksha) computed from Positional Astronomy Centre (PAC) Kolkata polynomial",
    "tithi_principle": "Relative separation (Moon - Sun), ayanamsha cancels identically"
  },
  "metadata": {
    "ephemeris": "JPL DE421",
    "precision_seconds": 1.0
  }
}
```

---

### 4.5 Next Panchang Transition

Calculates the next boundary event ending the active Anga and beginning the subsequent one.

* **GET** `/panchang/next-transition?instant={instant}&anga_type={anga_type}&timezone={tz}`
* **POST** `/panchang/next-transition`
* `anga_type`: One of `"tithi"`, `"nakshatra"`, `"yoga"`, `"karana"`.

#### POST Request Body:
```json
{
  "instant": "2026-10-27T00:00:00Z",
  "anga_type": "tithi",
  "timezone": "Asia/Kolkata"
}
```

#### Response (`200 OK`):
```json
{
  "instant_requested": "2026-10-27T00:00:00Z",
  "instant_local": "2026-10-27T05:30:00+05:30",
  "instant_utc": "2026-10-27T00:00:00Z",
  "anga_type": "tithi",
  "current_anga": {
    "index": 16,
    "name": "Pratipada",
    "paksha": "Krishna"
  },
  "next_transition": {
    "anga_type": "tithi",
    "boundary_deg": 192.0,
    "transition_time_utc": "2026-10-27T01:32:09Z",
    "transition_time_local": "2026-10-27T07:02:09+05:30",
    "from_index": 16,
    "from_name": "Pratipada",
    "to_index": 17,
    "to_name": "Dwitiya",
    "confirmed_change": true,
    "precision_achieved_seconds": 1.0
  },
  "seconds_remaining": 5529.0,
  "hours_remaining": 1.54,
  "metadata": {
    "ephemeris": "JPL DE421"
  }
}
```

---

### 4.6 Panchang Transitions Over an Interval

Calculates all boundary crossings for one or more Angas over a specified duration (up to 35 days).

* **GET** `/panchang/transitions?start={start}&end={end}&anga_types={types}&timezone={tz}&limit={limit}`
* **POST** `/panchang/transitions`

#### Parameters & Constraints:
* `start`: Timezone-aware ISO-8601 string.
* `end`: Timezone-aware ISO-8601 string (must be strictly after `start`, duration $\le$ 35 days).
* `anga_types`: Optional subset of `["tithi", "nakshatra", "yoga", "karana"]`. Default is all 4.
* `timezone`: Observer timezone (default `"UTC"`).
* `limit`: Optional maximum number of transitions returned (`1` to `500`).

#### POST Request Body:
```json
{
  "start": "2026-10-27T00:00:00Z",
  "end": "2026-10-29T00:00:00Z",
  "anga_types": ["tithi", "karana"],
  "timezone": "Asia/Kolkata",
  "limit": 10
}
```

#### Response (`200 OK`):
```json
{
  "start_utc": "2026-10-27T00:00:00Z",
  "end_utc": "2026-10-29T00:00:00Z",
  "start_local": "2026-10-27T05:30:00+05:30",
  "end_local": "2026-10-29T05:30:00+05:30",
  "anga_types_requested": ["tithi", "karana"],
  "total_transitions": 6,
  "transitions": [
    {
      "anga_type": "tithi",
      "boundary_deg": 192.0,
      "transition_time_utc": "2026-10-27T01:32:09Z",
      "transition_time_local": "2026-10-27T07:02:09+05:30",
      "from_index": 16,
      "from_name": "Pratipada",
      "to_index": 17,
      "to_name": "Dwitiya",
      "confirmed_change": true,
      "precision_achieved_seconds": 1.0
    },
    {
      "anga_type": "karana",
      "boundary_deg": 192.0,
      "transition_time_utc": "2026-10-27T01:32:09Z",
      "transition_time_local": "2026-10-27T07:02:09+05:30",
      "from_index": 32,
      "from_name": "Balava",
      "to_index": 33,
      "to_name": "Kaulava",
      "confirmed_change": true,
      "precision_achieved_seconds": 1.0
    }
  ],
  "metadata": {
    "ephemeris": "JPL DE421",
    "search_step_hours": 2.0,
    "precision_seconds": 1.0
  }
}
```

---

## 5. JavaScript `fetch()` Integration Examples

### Example 1: GET Request (Solar Events)

```javascript
async function getSolarEvents(dateStr, lat, lon, timezone = "Asia/Kolkata") {
  const baseUrl = "http://127.0.0.1:8000";
  const params = new URLSearchParams({
    date: dateStr,            // "YYYY-MM-DD"
    latitude: lat.toString(), // e.g. "28.6139"
    longitude: lon.toString(),// e.g. "77.2090"
    elevation_m: "0.0",
    timezone: timezone,
  });

  try {
    const response = await fetch(`${baseUrl}/solar/events?${params.toString()}`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `Server error: ${response.status}`);
    }

    const data = await response.json();
    console.log("Sunrise:", data.sunrise.time_local);
    console.log("Sunset:", data.sunset.time_local);
    console.log("Day length (hours):", data.day_length_hours);
    return data;
  } catch (error) {
    console.error("Failed to fetch solar events:", error.message);
    throw error;
  }
}

// Usage:
// getSolarEvents("2026-10-27", 28.6139, 77.2090, "Asia/Kolkata");
```

---

### Example 2: POST Request (Panchang Instant)

```javascript
async function getPanchangInstant(isoInstant, timezone = "Asia/Kolkata") {
  const baseUrl = "http://127.0.0.1:8000";
  const payload = {
    instant: isoInstant, // Must be timezone-aware (e.g. "2026-10-27T00:00:00Z")
    timezone: timezone,  // e.g. "Asia/Kolkata"
  };

  try {
    const response = await fetch(`${baseUrl}/panchang/instant`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      // Handle FastAPI structured validation errors or string details
     const message = typeof errorData.detail === "string"
  ? errorData.detail
        : JSON.stringify(errorData.detail);
      throw new Error(message || `Server error: ${response.status}`);
    }

    const data = await response.json();
    console.log("Tithi:", data.tithi.name, `(${data.tithi.paksha} Paksha)`);
    console.log("Nakshatra:", data.nakshatra.name);
    console.log("Yoga:", data.yoga.name);
    console.log("Karana:", data.karana.name);
    return data;
  } catch (error) {
    console.error("Failed to fetch instant panchang:", error.message);
    throw error;
  }
}

// Usage:
// getPanchangInstant("2026-10-27T00:00:00Z", "Asia/Kolkata");
```

---

## 6. Error Handling & Status Codes

All API errors return predictable JSON responses conforming to standard FastAPI error schemas:

| HTTP Status | Meaning | Typical Scenarios & Resolution |
| :--- | :--- | :--- |
| **422 Unprocessable Entity** | Client validation failure | * **Timezone-naive datetime**: Client sent `"2026-10-27T12:00:00"` without timezone offset or `Z`.<br>* **Invalid Date**: Sent `"2026-02-30"` (impossible date).<br>* **Out of Range Date**: Date is outside 1899–2053 ephemeris range.<br>* **Out of Bounds Coordinates**: Latitude $> 90^\circ$ or Longitude $> 180^\circ$.<br>* **Invalid Anga Type**: Sent anga type other than `tithi`, `nakshatra`, `yoga`, or `karana`.<br>* **Interval Limit Exceeded**: Search duration $> 35$ days.<br>* **End Before Start**: `end` instant is before `start` instant. |
| **503 Service Unavailable** | Missing Ephemeris Data | Server does not have `de421.bsp` kernel file in local cache.<br>Detail: `"Required planetary ephemeris kernel (de421.bsp) is unavailable on the server."` |
| **500 Internal Server Error** | Kernel Load / Engine Fault | Failed to load ephemeris kernel or unexpected calculation error occurred.<br>Detail: `"Failed to load planetary ephemeris kernel on the server."` or `"An internal calculation error occurred while processing the request."` |

### Error Response Shape
```json
{
  "detail": "Instant '2026-10-27T12:00:00' is timezone-naive. Please provide an explicit timezone offset or 'Z' (e.g. '2026-10-26T12:00:00Z')."
}
```
Or for Pydantic schema validation failures:
```json
{
  "detail": [
    {
      "type": "greater_than_equal",
      "loc": ["query", "latitude"],
      "msg": "Input should be greater than or equal to -90",
      "input": -95.0
    }
  ]
}
```
