
"""API tests for traditional solar calculations."""

import unittest

from fastapi.testclient import TestClient

from app.main import app
from app.traditional.solar_method import (
    calculate_solar_apsis_longitude_for_year,
)
client = TestClient(app)


class TestTraditionalSolarAPI(unittest.TestCase):
    def test_reference_date_returns_success(self):
        response = client.get(
            "/traditional/solar-position",
            params={"date": "1860-01-01"},
        )

        self.assertEqual(response.status_code, 200)
        data = response.json()

        self.assertEqual(data["body"], "Sun")
        self.assertEqual(data["date"], "1860-01-01")
        self.assertAlmostEqual(
            data["longitude_deg"],
            257.8019444444445,
            places=8,
        )
        self.assertEqual(data["calculation_type"], "mean_longitude")
        self.assertFalse(data["is_true_longitude"])
        self.assertTrue(data["limitations"])
        self.assertIn("solar_apsis_longitude_deg", data)
        self.assertAlmostEqual(
            data["solar_apsis_longitude_deg"],
            calculate_solar_apsis_longitude_for_year(1860),
            places=8,
        )
        self.assertFalse(data["is_true_longitude"])
        self.assertIn(
            "The solar equation of the apsis has not been applied.",
            data["limitations"],
        )

    def test_invalid_date_returns_422(self):
        response = client.get(
            "/traditional/solar-position",
            params={"date": "not-a-date"},
        )
        self.assertEqual(response.status_code, 422)

    def test_missing_date_returns_422(self):
        response = client.get("/traditional/solar-position")
        self.assertEqual(response.status_code, 422)


if __name__ == "__main__":
    unittest.main()
