import unittest
from datetime import date

from app.panchang.vara import calculate_civil_vara, calculate_vara_at_sunrise


class TestVara(unittest.TestCase):
    def test_monday(self):
        result = calculate_civil_vara(date(2026, 10, 26))
        self.assertEqual(result["index"], 1)
        self.assertEqual(result["name"], "Monday")

    def test_sunday(self):
        result = calculate_civil_vara(date(2026, 10, 25))
        self.assertEqual(result["index"], 7)
        self.assertEqual(result["name"], "Sunday")

    def test_sunrise_timezone_conversion(self):
        result = calculate_vara_at_sunrise(
            "2026-10-26T00:30:00+00:00",
            "Asia/Kolkata",
        )
        self.assertEqual(result["name"], "Monday")
        self.assertEqual(result["timezone"], "Asia/Kolkata")
        self.assertTrue(result["sunrise_local"].endswith("+05:30"))

    def test_rejects_naive_timestamp(self):
        with self.assertRaises(ValueError):
            calculate_vara_at_sunrise(
                "2026-10-26T06:30:00",
                "Asia/Kolkata",
            )

    def test_rejects_invalid_timezone(self):
        with self.assertRaises(ValueError):
            calculate_vara_at_sunrise(
                "2026-10-26T06:30:00+05:30",
                "Invalid/Timezone",
            )


if __name__ == "__main__":
    unittest.main()
