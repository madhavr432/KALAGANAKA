"""API tests for solar events and solar position endpoints."""

import unittest

from fastapi.testclient import TestClient

from app.main import app


class TestSolarAPI(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)
        self.ujjain_events_query = {
            "date": "2026-10-26",
            "latitude": 23.1765,
            "longitude": 75.7885,
            "elevation_m": 511.0,
            "timezone": "Asia/Kolkata",
        }
        self.ujjain_position_query = {
            "instant": "2026-10-26T12:10:50+05:30",
            "latitude": 23.1765,
            "longitude": 75.7885,
            "elevation_m": 511.0,
        }

    def test_get_solar_events_success(self):
        response = self.client.get(
            "/solar/events",
            params=self.ujjain_events_query,
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()

        self.assertEqual(data["date"], "2026-10-26")
        self.assertEqual(data["observer"]["latitude"], 23.1765)
        self.assertEqual(data["observer"]["timezone"], "Asia/Kolkata")
        self.assertTrue(data["sunrise"]["available"])
        self.assertTrue(data["sunset"]["available"])
        self.assertTrue(data["solar_noon"]["available"])
        self.assertIn("+05:30", data["sunrise"]["time_local"])
        self.assertIsNotNone(data["day_length_hours"])
        self.assertIn("standard_altitude_deg", data["conventions"])

    def test_post_solar_events_success(self):
        response = self.client.post(
            "/solar/events",
            json=self.ujjain_events_query,
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue(data["sunrise"]["available"])
        self.assertTrue(data["sunset"]["available"])

    def test_polar_day_events_via_api(self):
        query = {
            "date": "2026-06-21",
            "latitude": 78.22,
            "longitude": 15.65,
            "elevation_m": 20.0,
            "timezone": "UTC",
        }
        response = self.client.get("/solar/events", params=query)
        self.assertEqual(response.status_code, 200)
        data = response.json()

        self.assertFalse(data["sunrise"]["available"])
        self.assertIsNone(data["sunrise"]["time_local"])
        self.assertIn("Polar day", data["sunrise"]["reason"])
        self.assertEqual(data["day_length_hours"], 24.0)

    def test_get_solar_position_success(self):
        response = self.client.get(
            "/solar/position",
            params=self.ujjain_position_query,
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()

        self.assertIn("altitude_deg", data)
        self.assertIn("azimuth_deg", data)
        self.assertIn("distance_au", data)
        self.assertTrue(data["is_sun_up"])
        self.assertAlmostEqual(data["azimuth_deg"], 180.0, delta=0.5)

    def test_post_solar_position_success(self):
        response = self.client.post(
            "/solar/position",
            json=self.ujjain_position_query,
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("altitude_deg", data)

    def test_missing_params_returns_422(self):
        response = self.client.get("/solar/events")
        self.assertEqual(response.status_code, 422)

    def test_invalid_latitude_returns_422(self):
        payload = {**self.ujjain_events_query, "latitude": 95.0}
        response = self.client.get("/solar/events", params=payload)
        self.assertEqual(response.status_code, 422)

    def test_invalid_longitude_returns_422(self):
        payload = {**self.ujjain_events_query, "longitude": 195.0}
        response = self.client.get("/solar/events", params=payload)
        self.assertEqual(response.status_code, 422)

    def test_invalid_date_format_returns_422(self):
        payload = {**self.ujjain_events_query, "date": "not-a-date"}
        response = self.client.get("/solar/events", params=payload)
        self.assertEqual(response.status_code, 422)

    def test_invalid_timezone_returns_422(self):
        payload = {**self.ujjain_events_query, "timezone": "Invalid/Zone"}
        response = self.client.get("/solar/events", params=payload)
        self.assertEqual(response.status_code, 422)

    def test_timezone_naive_instant_returns_422(self):
        payload = {
            **self.ujjain_position_query,
            "instant": "2026-10-26T12:00:00",
        }
        response = self.client.get("/solar/position", params=payload)
        self.assertEqual(response.status_code, 422)
        self.assertIn("timezone-naive", response.json()["detail"])

    def test_out_of_range_date_returns_422(self):
        payload = {**self.ujjain_events_query, "date": "1800-01-01"}
        response = self.client.get("/solar/events", params=payload)
        self.assertEqual(response.status_code, 422)

    def test_post_extra_fields_forbidden_returns_422(self):
        payload = {**self.ujjain_events_query, "unexpected": "extra"}
        response = self.client.post("/solar/events", json=payload)
        self.assertEqual(response.status_code, 422)

    def test_invalid_elevation_returns_422(self):
        payload = {**self.ujjain_events_query, "elevation_m": 15000.0}
        response = self.client.get("/solar/events", params=payload)
        self.assertEqual(response.status_code, 422)

    def test_invalid_calendar_day_returns_422(self):
        payload = {**self.ujjain_events_query, "date": "2026-02-30"}
        response = self.client.get("/solar/events", params=payload)
        self.assertEqual(response.status_code, 422)

    def test_empty_date_string_returns_422(self):
        payload = {**self.ujjain_events_query, "date": ""}
        response = self.client.get("/solar/events", params=payload)
        self.assertEqual(response.status_code, 422)

    def test_ephemeris_not_found_returns_503_without_leaking_path(self):
        from unittest.mock import patch
        from app.astronomy.ephemeris import EphemerisNotFoundError

        with patch("app.astronomy.solar.load_ephemeris", side_effect=EphemerisNotFoundError("de421.bsp missing in C:\\private\\path")):
            response = self.client.get("/solar/events", params=self.ujjain_events_query)
            self.assertEqual(response.status_code, 503)
            detail = response.json()["detail"]
            self.assertNotIn("C:\\private\\path", detail)
            self.assertIn("unavailable", detail)

    def test_ephemeris_load_error_returns_500_without_leaking_path(self):
        from unittest.mock import patch
        from app.astronomy.ephemeris import EphemerisLoadError

        with patch("app.astronomy.solar.load_ephemeris", side_effect=EphemerisLoadError("corrupt in C:\\private\\path")):
            response = self.client.get("/solar/events", params=self.ujjain_events_query)
            self.assertEqual(response.status_code, 500)
            detail = response.json()["detail"]
            self.assertNotIn("C:\\private\\path", detail)
            self.assertIn("Failed to load", detail)


if __name__ == "__main__":
    unittest.main()
