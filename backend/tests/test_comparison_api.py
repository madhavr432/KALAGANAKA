import unittest

from fastapi.testclient import TestClient

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


if __name__ == "__main__":
    unittest.main()
