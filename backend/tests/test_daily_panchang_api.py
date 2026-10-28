
import unittest
from unittest.mock import patch

from fastapi.testclient import TestClient

from app.main import app


class TestDailyPanchangAPI(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)
        self.payload = {
            "date": "2026-10-28",
            "latitude": 22.7196,
            "longitude": 75.8577,
            "elevation_m": 550,
            "timezone": "Asia/Kolkata",
        }

    def make_panchang(self):
        return {
            "instant_requested": "2026-10-28T06:28:58+05:30",
            "instant_local": "2026-10-28T06:28:58+05:30",
            "instant_utc": "2026-10-28T00:58:58Z",
            "julian_date_tt": 2461337.0,
            "ayanamsha_deg": 24.2,
            "sun_sidereal_longitude_deg": 190.0,
            "moon_sidereal_longitude_deg": 220.0,
            "sun_tropical_longitude_deg": 214.2,
            "moon_tropical_longitude_deg": 244.2,
            "tithi": {
                "index": 18,
                "name": "Krishna Tritiya",
                "paksha": "Krishna",
                "tithi_in_paksha": 3,
                "angular_separation_deg": 30.0,
                "elapsed_deg_in_tithi": 6.0,
                "fraction_elapsed": 0.5,
            },
            "nakshatra": {
                "index": 3,
                "name": "Krittika",
                "sidereal_longitude_deg": 40.0,
                "elapsed_deg_in_nakshatra": 0.0,
                "fraction_elapsed": 0.0,
            },
            "yoga": {
                "index": 17,
                "name": "Vyatipata",
                "combined_longitude_deg": 230.0,
                "elapsed_deg_in_yoga": 3.0,
                "fraction_elapsed": 0.225,
            },
            "karana": {
                "half_tithi_index": 35,
                "name": "Vanija",
                "canonical_name": "Vanija",
                "display_name": "Vanija",
                "alias": None,
                "karana_type": "repeating",
                "angular_separation_deg": 210.0,
                "elapsed_deg_in_karana": 3.0,
                "fraction_elapsed": 0.5,
            },
            "longitude_conventions": {
                "sidereal": "Lahiri",
                "tropical": "Apparent ecliptic longitude of date",
            },
            "metadata": {
                "engine": "test",
                "ephemeris": "mock",
            },
        }

    def make_response(self, status="success"):
        sunrise_available = status == "success"

        return {
            "date": "2026-10-28",
            "observer": {
                "latitude": 22.7196,
                "longitude": 75.8577,
                "elevation_m": 550,
                "timezone": "Asia/Kolkata",
            },
            "sunrise": {
                "available": sunrise_available,
                "time_local": (
                    "2026-10-28T06:28:58+05:30"
                    if sunrise_available
                    else None
                ),
            },
            "vara": {
                "index": 3,
                "name": "Wednesday",
                "timezone": "Asia/Kolkata",
                "basis": "local_sunrise",
                "sunrise_local": "2026-10-28T06:28:58+05:30",
            },
            "panchang": (
                self.make_panchang() if sunrise_available else None
            ),
            "status": status,
            "message": (
                None
                if sunrise_available
                else "Sunrise is unavailable for the requested local date."
            ),
        }

    @patch("app.api.daily_panchang.get_daily_panchang")
    def test_successful_daily_panchang(self, mock_service):
        mock_service.return_value = self.make_response()

        response = self.client.post(
            "/panchang/daily",
            json=self.payload,
        )

        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["status"], "success")
        self.assertEqual(data["date"], "2026-10-28")
        self.assertEqual(data["vara"]["name"], "Wednesday")

        for anga in ("tithi", "nakshatra", "yoga", "karana"):
            self.assertIn(anga, data["panchang"])

        mock_service.assert_called_once()

    def test_invalid_date_returns_422(self):
        payload = {**self.payload, "date": "not-a-date"}
        response = self.client.post("/panchang/daily", json=payload)
        self.assertEqual(response.status_code, 422)

    def test_invalid_timezone_returns_422(self):
        payload = {**self.payload, "timezone": "Invalid/Timezone"}
        response = self.client.post("/panchang/daily", json=payload)
        self.assertEqual(response.status_code, 422)

    def test_missing_date_returns_422(self):
        payload = dict(self.payload)
        payload.pop("date")
        response = self.client.post("/panchang/daily", json=payload)
        self.assertEqual(response.status_code, 422)

    @patch("app.api.daily_panchang.get_daily_panchang")
    def test_unavailable_sunrise_response(self, mock_service):
        mock_service.return_value = self.make_response("unavailable")

        response = self.client.post(
            "/panchang/daily",
            json=self.payload,
        )

        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["status"], "unavailable")
        self.assertIsNone(data["panchang"])
        self.assertIsNotNone(data["vara"])
        self.assertIsNotNone(data["message"])


if __name__ == "__main__":
    unittest.main()
