"""API tests for modern astronomy endpoints."""

import unittest

from fastapi.testclient import TestClient

from app.main import app


class TestAstronomyAPI(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)
        self.valid_instant = "2026-10-26T12:00:00+05:30"

    def test_get_planets_success(self):
        response = self.client.get(
            "/astronomy/planets",
            params={"instant": self.valid_instant},
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()

        self.assertEqual(data["instant"], self.valid_instant)
        self.assertEqual(len(data["planets"]), 7)
        self.assertIn("Sun", data["positions_tropical_deg"])
        self.assertIn("Moon", data["positions_sidereal_deg"])
        self.assertEqual(data["ephemeris"], "JPL DE421")
        self.assertEqual(data["ayanamsha_name"], "Lahiri (Chitrapaksha)")

    def test_post_planets_success(self):
        response = self.client.post(
            "/astronomy/planets",
            json={"instant": "2026-10-26T06:30:00Z"},
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()

        self.assertEqual(len(data["planets"]), 7)
        self.assertEqual(len(data["positions_tropical_deg"]), 7)

    def test_missing_instant_param_returns_422(self):
        response = self.client.get("/astronomy/planets")
        self.assertEqual(response.status_code, 422)

    def test_timezone_naive_instant_returns_422(self):
        response = self.client.get(
            "/astronomy/planets",
            params={"instant": "2026-10-26T12:00:00"},
        )
        self.assertEqual(response.status_code, 422)
        self.assertIn("timezone-naive", response.json()["detail"])

    def test_invalid_instant_string_returns_422(self):
        response = self.client.get(
            "/astronomy/planets",
            params={"instant": "not-a-timestamp"},
        )
        self.assertEqual(response.status_code, 422)

    def test_date_out_of_ephemeris_range_returns_422(self):
        response = self.client.get(
            "/astronomy/planets",
            params={"instant": "1800-01-01T00:00:00Z"},
        )
        self.assertEqual(response.status_code, 422)
        self.assertIn("outside supported range", response.json()["detail"])

    def test_post_extra_fields_forbidden_returns_422(self):
        response = self.client.post(
            "/astronomy/planets",
            json={"instant": self.valid_instant, "unexpected": "value"},
        )
        self.assertEqual(response.status_code, 422)

    def test_empty_instant_string_returns_422(self):
        response = self.client.get(
            "/astronomy/planets",
            params={"instant": ""},
        )
        self.assertEqual(response.status_code, 422)

    def test_whitespace_instant_string_returns_422(self):
        response = self.client.get(
            "/astronomy/planets",
            params={"instant": "   "},
        )
        self.assertEqual(response.status_code, 422)

    def test_ephemeris_not_found_returns_503_without_leaking_path(self):
        from unittest.mock import patch
        from app.astronomy.ephemeris import EphemerisNotFoundError

        with patch("app.astronomy.calculator.load_ephemeris", side_effect=EphemerisNotFoundError("de421.bsp missing in C:\\private\\path")):
            response = self.client.get(
                "/astronomy/planets",
                params={"instant": self.valid_instant},
            )
            self.assertEqual(response.status_code, 503)
            detail = response.json()["detail"]
            self.assertNotIn("C:\\private\\path", detail)
            self.assertIn("unavailable", detail)

    def test_ephemeris_load_error_returns_500_without_leaking_path(self):
        from unittest.mock import patch
        from app.astronomy.ephemeris import EphemerisLoadError

        with patch("app.astronomy.calculator.load_ephemeris", side_effect=EphemerisLoadError("corrupt in C:\\private\\path")):
            response = self.client.get(
                "/astronomy/planets",
                params={"instant": self.valid_instant},
            )
            self.assertEqual(response.status_code, 500)
            detail = response.json()["detail"]
            self.assertNotIn("C:\\private\\path", detail)
            self.assertIn("Failed to load", detail)


if __name__ == "__main__":
    unittest.main()
