"""Tests for preliminary traditional astronomy calculations."""

import unittest

from datetime import date, datetime, timedelta

from app.traditional.solar_method import (
    REFERENCE_DATE,
    REFERENCE_MEAN_SOLAR_LONGITUDE_DEG,
    calculate_mean_solar_longitude_for_date,
)
from app.services.traditional_service import calculate_solar_position
from app.traditional.solar_method import (
    CIVIL_DAYS_PER_MAHAYUGA,
    calculate_mean_solar_longitude,
)


class TestMeanSolarLongitude(unittest.TestCase):
    def test_zero_elapsed_days_returns_zero(self):
        self.assertEqual(calculate_mean_solar_longitude(0), 0.0)

    def test_full_mahayuga_returns_zero(self):
        result = calculate_mean_solar_longitude(
            CIVIL_DAYS_PER_MAHAYUGA
        )
        self.assertAlmostEqual(result, 0.0, places=7)

    def test_negative_elapsed_days_are_normalized(self):
        result = calculate_mean_solar_longitude(-1)
        self.assertGreaterEqual(result, 0.0)
        self.assertLess(result, 360.0)

    def test_invalid_inputs_are_rejected(self):
        for value in (float("nan"), float("inf"), True, "10", None):
            with self.subTest(value=value):
                with self.assertRaises(ValueError):
                    calculate_mean_solar_longitude(value)

    def test_service_labels_mean_longitude(self):
        result = calculate_solar_position(100)

        self.assertEqual(result["body"], "Sun")
        self.assertEqual(result["calculation_type"], "mean_longitude")
        self.assertFalse(result["is_true_longitude"])
        self.assertTrue(result["limitations"])
    
    def test_reference_date_matches_published_longitude(self):
        result = calculate_mean_solar_longitude_for_date(
            REFERENCE_DATE
        )
        self.assertAlmostEqual(
            result,
            REFERENCE_MEAN_SOLAR_LONGITUDE_DEG,
            places=10,
        )

    def test_next_day_advances_by_mean_daily_motion(self):
        today = calculate_mean_solar_longitude_for_date(
            REFERENCE_DATE
        )
        tomorrow = calculate_mean_solar_longitude_for_date(
            REFERENCE_DATE + timedelta(days=1)
        )

        expected_motion = (
            360.0 * 4_320_000 / 1_577_917_828
        )
        self.assertAlmostEqual(
            (tomorrow - today) % 360.0,
            expected_motion,
            places=8,
        )

    def test_invalid_date_inputs_are_rejected(self):
        for value in ("1860-01-01", None, datetime(1860, 1, 1)):
            with self.subTest(value=value):
                with self.assertRaises(ValueError):
                    calculate_mean_solar_longitude_for_date(value)



if __name__ == "__main__":
    unittest.main()