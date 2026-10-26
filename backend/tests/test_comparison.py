import math
import unittest

from app.services.comparison_service import compare_planetary_positions


class TestComparisonService(unittest.TestCase):
    def setUp(self):
        self.traditional = {
            "Sun": 1.0,
            "Moon": 359.0,
        }
        self.modern = {
            "Sun": 359.0,
            "Moon": 1.0,
        }

    def compare(self, **overrides):
        options = {
            "traditional_positions": self.traditional,
            "modern_positions": self.modern,
            "traditional_method": "Traditional method (test fixture)",
            "modern_method": "Mock modern provider",
            "modern_data_source": "mock",
            "coordinate_system": "test convention",
            "instant": "2026-10-26T12:00:00+05:30",
        }
        options.update(overrides)
        return compare_planetary_positions(**options)

    def test_compares_matching_planets(self):
        result = self.compare()
        self.assertEqual(result["compared_planets"], ["Sun", "Moon"])
        self.assertEqual(len(result["results"]), 2)

    def test_wraparound_differences(self):
        result = self.compare()
        by_planet = {item["planet"]: item for item in result["results"]}

        self.assertAlmostEqual(by_planet["Sun"]["signed_difference_deg"], 2)
        self.assertAlmostEqual(by_planet["Moon"]["signed_difference_deg"], -2)

    def test_longitudes_are_normalized(self):
        result = self.compare(
            traditional_positions={"Sun": 361},
            modern_positions={"Sun": -1},
        )
        item = result["results"][0]
        self.assertAlmostEqual(item["traditional_longitude_deg"], 1)
        self.assertAlmostEqual(item["modern_longitude_deg"], 359)
        self.assertAlmostEqual(item["signed_difference_deg"], 2)

    def test_mock_data_is_explicitly_labelled(self):
        result = self.compare()
        self.assertTrue(result["is_mock"])
        self.assertEqual(result["status"], "mock_data")
        self.assertTrue(any("Mock modern positions" in note
                            for note in result["limitations"]))

    def test_provider_data_is_not_labelled_mock(self):
        result = self.compare(modern_data_source="provider")
        self.assertFalse(result["is_mock"])
        self.assertEqual(result["status"], "comparison")

    def test_unmatched_planets_are_reported(self):
        result = self.compare(
            traditional_positions={"Sun": 20, "Mars": 40},
            modern_positions={"Sun": 22, "Jupiter": 50},
        )
        self.assertEqual(result["unmatched_traditional_planets"], ["Mars"])
        self.assertEqual(result["unmatched_modern_planets"], ["Jupiter"])
        self.assertEqual(result["compared_planets"], ["Sun"])

    def test_chart_data_is_available(self):
        result = self.compare()
        self.assertEqual(len(result["chart_data"]), 2)
        self.assertIn("absolute_difference_deg", result["chart_data"][0])

    def test_instant_and_methods_are_returned(self):
        result = self.compare()
        self.assertEqual(result["instant"], "2026-10-26T12:00:00+05:30")
        self.assertIn("Traditional method", result["traditional_method"])

    def test_no_common_planets_raises(self):
        with self.assertRaises(ValueError):
            self.compare(
                traditional_positions={"Sun": 10},
                modern_positions={"Mars": 20},
            )

    def test_non_finite_longitude_raises(self):
        for value in (math.nan, math.inf, -math.inf):
            with self.subTest(value=value):
                with self.assertRaises(ValueError):
                    self.compare(
                        traditional_positions={"Sun": value},
                        modern_positions={"Sun": 20},
                    )

    def test_invalid_source_raises(self):
        with self.assertRaises(ValueError):
            self.compare(modern_data_source="imaginary")

    def test_non_numeric_longitude_raises(self):
        with self.assertRaises(ValueError):
            self.compare(traditional_positions={"Sun": "unknown"})


if __name__ == "__main__":
    unittest.main()
