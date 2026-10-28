import unittest

from fastapi.testclient import TestClient
from unittest.mock import patch

from app.astronomy.ephemeris import DateOutOfRangeError
from app.main import app


class TestComparisonAPI(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)
        self.payload = {
            "traditional_positions": {"Sun": 1, "Moon": 359},
            "modern_positions": {"Sun": 359, "Moon": 1},
            "traditional_method": "Traditional test data",
            "modern_method": "Modern mock test data",
            "modern_data_source": "mock",
            "coordinate_system": "test convention",
            "instant": "2026-10-26T12:00:00+05:30",
        }

    def test_health_endpoint(self):
        response = self.client.get("/health")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"status": "ok"})

    def test_successful_comparison(self):
        response = self.client.post(
            "/comparison/compare", json=self.payload
        )
        self.assertEqual(response.status_code, 200)

        data = response.json()
        self.assertTrue(data["is_mock"])
        self.assertEqual(data["status"], "mock_data")
        self.assertAlmostEqual(
            data["results"][0]["signed_difference_deg"], 2
        )
        self.assertAlmostEqual(
            data["results"][1]["signed_difference_deg"], -2
        )

    def test_no_matching_planets_returns_422(self):
        payload = {
            **self.payload,
            "traditional_positions": {"Sun": 10},
            "modern_positions": {"Mars": 20},
        }
        response = self.client.post(
            "/comparison/compare", json=payload
        )
        self.assertEqual(response.status_code, 422)

    def test_invalid_data_source_returns_422(self):
        payload = {
            **self.payload,
            "modern_data_source": "imaginary",
        }
        response = self.client.post(
            "/comparison/compare", json=payload
        )
        self.assertEqual(response.status_code, 422)

    def test_non_numeric_longitude_returns_422(self):
        payload = {
            **self.payload,
            "traditional_positions": {"Sun": "unknown"},
        }
        response = self.client.post(
            "/comparison/compare", json=payload
        )
        self.assertEqual(response.status_code, 422)

    def test_unknown_request_field_returns_422(self):
        payload = {**self.payload, "unexpected": True}
        response = self.client.post(
            "/comparison/compare", json=payload
        )
        self.assertEqual(response.status_code, 422)
    
    @patch("app.api.comparison.calculate_planetary_positions")
    @patch("app.api.comparison.calculate_solar_position_for_date")
    def test_integrated_solar_comparison_uses_real_calculation_path(
        self, mock_traditional, mock_modern
    ):
        mock_traditional.return_value = {
            "body": "Sun",
            "date": "2026-10-28",
            "longitude_deg": 10.0,
            "calculation_type": "mean_longitude",
            "is_true_longitude": False,
            "reference_date": "1860-01-01",
        }
        mock_modern.return_value = {
            "positions_sidereal_deg": {"Sun": 12.0},
        }

        response = self.client.get(
            "/comparison/solar",
            params={"date": "2026-10-28"},
        )

        self.assertEqual(response.status_code, 200)
        data = response.json()

        self.assertFalse(data["is_mock"])
        self.assertEqual(data["status"], "comparison")
        self.assertEqual(data["compared_planets"], ["Sun"])
        self.assertAlmostEqual(
            data["results"][0]["traditional_longitude_deg"], 10.0
        )
        self.assertAlmostEqual(
            data["results"][0]["modern_longitude_deg"], 12.0
        )
        self.assertAlmostEqual(
            data["results"][0]["signed_difference_deg"], -2.0
        )
        self.assertAlmostEqual(
            data["results"][0]["absolute_difference_deg"], 2.0
        )

        basis = data["comparison_basis"]
        self.assertEqual(
            basis["traditional_calculation_type"], "mean_longitude"
        )
        self.assertFalse(basis["traditional_is_true_longitude"])
        self.assertEqual(basis["scientific_validation"], "preliminary")

        mock_traditional.assert_called_once()
        mock_modern.assert_called_once()

    def test_integrated_solar_comparison_rejects_invalid_date(self):
        response = self.client.get(
            "/comparison/solar",
            params={"date": "not-a-date"},
        )
        self.assertEqual(response.status_code, 422)

    @patch("app.api.comparison.calculate_planetary_positions")
    @patch("app.api.comparison.calculate_solar_position_for_date")
    def test_integrated_solar_comparison_handles_ephemeris_range_error(
        self, mock_traditional, mock_modern
    ):
        mock_traditional.return_value = {
            "body": "Sun",
            "date": "1800-01-01",
            "longitude_deg": 10.0,
            "calculation_type": "mean_longitude",
            "is_true_longitude": False,
            "reference_date": "1860-01-01",
        }
        mock_modern.side_effect = DateOutOfRangeError(
            "Date is outside the supported ephemeris range."
        )

        response = self.client.get(
            "/comparison/solar",
            params={"date": "1800-01-01"},
        )

        self.assertEqual(response.status_code, 422)
        self.assertIn(
            "outside the supported ephemeris range",
            response.json()["detail"],
        )



if __name__ == "__main__":
    unittest.main()
