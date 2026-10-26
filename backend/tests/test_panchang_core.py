"""Unit tests for core Panchang calculations: Tithi, Nakshatra, Yoga, and Karana."""

import math
import unittest

from app.panchang.calculations import (
    calculate_karana,
    calculate_nakshatra,
    calculate_panchang_angas,
    calculate_panchang_angas_at_instant,
    calculate_tithi,
    calculate_yoga,
    validate_finite_angle,
)
from app.panchang.constants import (
    FIXED_KARANAS,
    KARANA_SPAN_DEG,
    NAKSHATRA_NAMES,
    NAKSHATRA_SPAN_DEG,
    REPEATING_KARANAS,
    TITHI_NAMES,
    TITHI_SPAN_DEG,
    YOGA_NAMES,
    YOGA_SPAN_DEG,
)


class TestTithiCalculations(unittest.TestCase):
    def test_all_thirty_tithis(self):
        """Verify each of the 30 Tithis mapped at their midpoints."""
        for i in range(1, 31):
            with self.subTest(tithi_index=i):
                mid_angle = (i - 0.5) * TITHI_SPAN_DEG
                result = calculate_tithi(mid_angle, 0.0)

                self.assertEqual(result["index"], i)
                self.assertEqual(result["name"], TITHI_NAMES[i - 1])

                if i <= 15:
                    self.assertEqual(result["paksha"], "Shukla")
                    self.assertEqual(result["tithi_in_paksha"], i)
                else:
                    self.assertEqual(result["paksha"], "Krishna")
                    self.assertEqual(result["tithi_in_paksha"], i - 15)

                self.assertAlmostEqual(result["elapsed_deg_in_tithi"], 6.0)
                self.assertAlmostEqual(result["fraction_elapsed"], 0.5)

    def test_exact_tithi_boundaries(self):
        """Verify [start, end) lower-inclusive boundary convention for Tithis."""
        for i in range(1, 31):
            with self.subTest(boundary_index=i):
                boundary_angle = (i - 1) * TITHI_SPAN_DEG
                result = calculate_tithi(boundary_angle, 0.0)
                self.assertEqual(result["index"], i)
                self.assertAlmostEqual(result["elapsed_deg_in_tithi"], 0.0)

    def test_immediately_before_and_after_boundaries(self):
        delta = 1e-6
        # Boundary between Tithi 1 and 2 (12 deg)
        res_before = calculate_tithi(12.0 - delta, 0.0)
        self.assertEqual(res_before["index"], 1)
        res_at = calculate_tithi(12.0, 0.0)
        self.assertEqual(res_at["index"], 2)
        res_after = calculate_tithi(12.0 + delta, 0.0)
        self.assertEqual(res_after["index"], 2)

        # Boundary between Shukla and Krishna (180 deg)
        res_purnima = calculate_tithi(180.0 - delta, 0.0)
        self.assertEqual(res_purnima["index"], 15)
        self.assertEqual(res_purnima["paksha"], "Shukla")
        self.assertEqual(res_purnima["name"], "Purnima")

        res_krishna_pratipada = calculate_tithi(180.0, 0.0)
        self.assertEqual(res_krishna_pratipada["index"], 16)
        self.assertEqual(res_krishna_pratipada["paksha"], "Krishna")
        self.assertEqual(res_krishna_pratipada["name"], "Pratipada")

        # Boundary at 360 / 0 deg (Amavasya to Shukla Pratipada)
        res_amavasya = calculate_tithi(360.0 - delta, 0.0)
        self.assertEqual(res_amavasya["index"], 30)
        self.assertEqual(res_amavasya["paksha"], "Krishna")
        self.assertEqual(res_amavasya["name"], "Amavasya")

        res_zero = calculate_tithi(0.0, 0.0)
        self.assertEqual(res_zero["index"], 1)
        self.assertEqual(res_zero["paksha"], "Shukla")

        res_full_circle = calculate_tithi(360.0, 0.0)
        self.assertEqual(res_full_circle["index"], 1)

    def test_angular_wraparound(self):
        # Negative separation
        res_neg = calculate_tithi(-10.0, 0.0)  # -10 deg == 350 deg -> Amavasya (index 30)
        self.assertEqual(res_neg["index"], 30)

        # Sun ahead of Moon
        res_sun_ahead = calculate_tithi(10.0, 20.0)  # 10 - 20 = -10 == 350 deg
        self.assertEqual(res_sun_ahead["index"], 30)

        # Multi-rotation wraparound
        res_multi = calculate_tithi(730.0, 0.0)  # 730 == 10 deg -> Tithi 1
        self.assertEqual(res_multi["index"], 1)

    def test_tropical_sidereal_invariance(self):
        """Verify that subtracting Sun from Moon yields identical Tithi regardless of ayanamsha."""
        ayanamsha = 24.2317
        moon_tropical = 100.0
        sun_tropical = 40.0
        moon_sidereal = (moon_tropical - ayanamsha) % 360.0
        sun_sidereal = (sun_tropical - ayanamsha) % 360.0

        res_trop = calculate_tithi(moon_tropical, sun_tropical)
        res_sid = calculate_tithi(moon_sidereal, sun_sidereal)

        self.assertEqual(res_trop["index"], res_sid["index"])
        self.assertAlmostEqual(
            res_trop["angular_separation_deg"],
            res_sid["angular_separation_deg"],
            places=7,
        )

    def test_invalid_and_non_finite_inputs(self):
        for val in (math.nan, math.inf, -math.inf, True, "10.0"):
            with self.subTest(val=val):
                with self.assertRaises(ValueError):
                    calculate_tithi(val, 0.0)
                with self.assertRaises(ValueError):
                    calculate_tithi(0.0, val)


class TestNakshatraCalculations(unittest.TestCase):
    def test_all_twenty_seven_nakshatras(self):
        """Verify each of the 27 Nakshatras mapped at their midpoints."""
        span = NAKSHATRA_SPAN_DEG
        for i in range(1, 28):
            with self.subTest(nakshatra_index=i):
                mid_angle = (i - 0.5) * span
                result = calculate_nakshatra(mid_angle)

                self.assertEqual(result["index"], i)
                self.assertEqual(result["name"], NAKSHATRA_NAMES[i - 1])
                self.assertAlmostEqual(result["elapsed_deg_in_nakshatra"], span / 2.0)
                self.assertAlmostEqual(result["fraction_elapsed"], 0.5)

    def test_exact_nakshatra_boundaries(self):
        span = NAKSHATRA_SPAN_DEG
        for i in range(1, 28):
            with self.subTest(boundary_index=i):
                boundary_angle = (i - 1) * span
                result = calculate_nakshatra(boundary_angle)
                self.assertEqual(result["index"], i)
                self.assertAlmostEqual(result["elapsed_deg_in_nakshatra"], 0.0)

    def test_immediately_before_and_after_boundaries(self):
        span = NAKSHATRA_SPAN_DEG
        delta = 1e-6

        # Ashwini to Bharani boundary (13°20')
        res_before = calculate_nakshatra(span - delta)
        self.assertEqual(res_before["index"], 1)
        self.assertEqual(res_before["name"], "Ashwini")

        res_at = calculate_nakshatra(span)
        self.assertEqual(res_at["index"], 2)
        self.assertEqual(res_at["name"], "Bharani")

        # 360 boundary (Revati to Ashwini)
        res_revati = calculate_nakshatra(360.0 - delta)
        self.assertEqual(res_revati["index"], 27)
        self.assertEqual(res_revati["name"], "Revati")

        res_zero = calculate_nakshatra(0.0)
        self.assertEqual(res_zero["index"], 1)
        self.assertEqual(res_zero["name"], "Ashwini")

        res_full = calculate_nakshatra(360.0)
        self.assertEqual(res_full["index"], 1)

    def test_angular_wraparound(self):
        # Negative angle
        res_neg = calculate_nakshatra(-1.0)  # -1 == 359 deg -> Revati (27)
        self.assertEqual(res_neg["index"], 27)

        # Multi-rotation
        res_multi = calculate_nakshatra(365.0)  # 365 == 5 deg -> Ashwini (1)
        self.assertEqual(res_multi["index"], 1)

    def test_invalid_inputs(self):
        for val in (math.nan, math.inf, -math.inf, True, "5.0"):
            with self.subTest(val=val):
                with self.assertRaises(ValueError):
                    calculate_nakshatra(val)


class TestYogaCalculations(unittest.TestCase):
    def test_all_twenty_seven_yogas(self):
        """Verify each of the 27 Yogas mapped at their midpoints."""
        span = YOGA_SPAN_DEG
        for i in range(1, 28):
            with self.subTest(yoga_index=i):
                mid_angle = (i - 0.5) * span
                # Split sum between Sun and Moon
                sun = mid_angle / 2.0
                moon = mid_angle / 2.0
                result = calculate_yoga(sun, moon)

                self.assertEqual(result["index"], i)
                self.assertEqual(result["name"], YOGA_NAMES[i - 1])
                self.assertAlmostEqual(result["elapsed_deg_in_yoga"], span / 2.0)
                self.assertAlmostEqual(result["fraction_elapsed"], 0.5)

    def test_exact_yoga_boundaries(self):
        span = YOGA_SPAN_DEG
        for i in range(1, 28):
            with self.subTest(boundary_index=i):
                boundary_angle = (i - 1) * span
                result = calculate_yoga(boundary_angle, 0.0)
                self.assertEqual(result["index"], i)
                self.assertAlmostEqual(result["elapsed_deg_in_yoga"], 0.0)

    def test_wraparound_sum(self):
        # Sum > 360 deg: e.g. 200 + 200 = 400 == 40 deg
        # 40 deg / (40/3) = 3.0 -> Index 4 (Saubhagya)
        res = calculate_yoga(200.0, 200.0)
        self.assertEqual(res["index"], 4)
        self.assertEqual(res["name"], "Saubhagya")

    def test_invalid_inputs(self):
        for val in (math.nan, math.inf, -math.inf, True, "5.0"):
            with self.subTest(val=val):
                with self.assertRaises(ValueError):
                    calculate_yoga(val, 0.0)
                with self.assertRaises(ValueError):
                    calculate_yoga(0.0, val)


class TestKaranaCalculations(unittest.TestCase):
    def test_complete_sixty_half_tithis(self):
        """
        Verify the complete classical sequence of all 60 half-Tithis:
        - 1: Kintughna (Fixed)
        - 2-57: 8 cycles of Bava, Balava, Kaulava, Taitila, Gara, Vanija, Vishti (Repeating)
        - 58: Shakuni (Fixed)
        - 59: Chatushpada (Fixed)
        - 60: Naga (Fixed)
        """
        for k in range(1, 61):
            with self.subTest(half_tithi=k):
                mid_angle = (k - 0.5) * KARANA_SPAN_DEG
                result = calculate_karana(mid_angle, 0.0)

                self.assertEqual(result["half_tithi_index"], k)

                if k == 1:
                    self.assertIn(result["name"], ("Kimstughna", "Kintughna"))
                    self.assertEqual(result["canonical_name"], "Kimstughna")
                    self.assertEqual(result["display_name"], "Kimstughna")
                    self.assertEqual(result["alias"], "Kintughna")
                    self.assertEqual(result["karana_type"], "fixed")
                elif 2 <= k <= 57:
                    expected_rep = REPEATING_KARANAS[(k - 2) % 7]
                    self.assertEqual(result["name"], expected_rep)
                    self.assertEqual(result["karana_type"], "repeating")
                    if expected_rep == "Vishti":
                        self.assertEqual(result["canonical_name"], "Vishti")
                        self.assertEqual(result["alias"], "Bhadra")
                elif k == 58:
                    self.assertEqual(result["name"], "Shakuni")
                    self.assertEqual(result["karana_type"], "fixed")
                elif k == 59:
                    self.assertEqual(result["name"], "Chatushpada")
                    self.assertEqual(result["karana_type"], "fixed")
                elif k == 60:
                    self.assertEqual(result["name"], "Naga")
                    self.assertEqual(result["karana_type"], "fixed")

    def test_exact_karana_boundaries(self):
        for k in range(1, 61):
            with self.subTest(boundary_index=k):
                boundary_angle = (k - 1) * KARANA_SPAN_DEG
                result = calculate_karana(boundary_angle, 0.0)
                self.assertEqual(result["half_tithi_index"], k)
                self.assertAlmostEqual(result["elapsed_deg_in_karana"], 0.0)

    def test_immediately_before_and_after_boundaries(self):
        delta = 1e-6
        # Boundary between Kimstughna (1) and Bava (2) at 6 deg
        res_before = calculate_karana(6.0 - delta, 0.0)
        self.assertEqual(res_before["half_tithi_index"], 1)
        self.assertIn(res_before["name"], ("Kimstughna", "Kintughna"))
        self.assertEqual(res_before["canonical_name"], "Kimstughna")

        res_at = calculate_karana(6.0, 0.0)
        self.assertEqual(res_at["half_tithi_index"], 2)
        self.assertEqual(res_at["name"], "Bava")

        # Boundary between Vishti (57) and Shakuni (58) at 342 deg
        res_vishti = calculate_karana(342.0 - delta, 0.0)
        self.assertEqual(res_vishti["half_tithi_index"], 57)
        self.assertEqual(res_vishti["name"], "Vishti")
        self.assertEqual(res_vishti["alias"], "Bhadra")

        res_shakuni = calculate_karana(342.0, 0.0)
        self.assertEqual(res_shakuni["half_tithi_index"], 58)
        self.assertEqual(res_shakuni["name"], "Shakuni")

        # Boundary between Naga (60) and Kimstughna (1) at 360 / 0 deg
        res_naga = calculate_karana(360.0 - delta, 0.0)
        self.assertEqual(res_naga["half_tithi_index"], 60)
        self.assertEqual(res_naga["name"], "Naga")

        res_kintughna_zero = calculate_karana(0.0, 0.0)
        self.assertEqual(res_kintughna_zero["half_tithi_index"], 1)
        self.assertIn(res_kintughna_zero["name"], ("Kimstughna", "Kintughna"))
        self.assertEqual(res_kintughna_zero["canonical_name"], "Kimstughna")

        res_kintughna_full = calculate_karana(360.0, 0.0)
        self.assertEqual(res_kintughna_full["half_tithi_index"], 1)

    def test_invalid_inputs(self):
        for val in (math.nan, math.inf, -math.inf, True, "10"):
            with self.subTest(val=val):
                with self.assertRaises(ValueError):
                    calculate_karana(val, 0.0)
                with self.assertRaises(ValueError):
                    calculate_karana(0.0, val)


class TestInstantAngasIntegration(unittest.TestCase):
    def test_calculate_panchang_angas_at_instant(self):
        # 2026-10-26 12:00:00 IST
        instant = "2026-10-26T12:00:00+05:30"
        result = calculate_panchang_angas_at_instant(instant)

        self.assertEqual(result["instant"], instant)
        self.assertIn("tithi", result)
        self.assertIn("nakshatra", result)
        self.assertIn("yoga", result)
        self.assertIn("karana", result)
        self.assertIn("sun_sidereal_deg", result)
        self.assertIn("moon_sidereal_deg", result)

        tithi_idx = result["tithi"]["index"]
        karana_idx = result["karana"]["half_tithi_index"]

        # Mathematical harmony: Karana must be the 1st or 2nd half of the Tithi!
        self.assertTrue(
            karana_idx == (2 * tithi_idx - 1) or karana_idx == (2 * tithi_idx),
            f"Karana {karana_idx} does not correspond to Tithi {tithi_idx}",
        )

    def test_timezone_naive_instant_raises(self):
        with self.assertRaises(ValueError):
            calculate_panchang_angas_at_instant("2026-10-26T12:00:00")


if __name__ == "__main__":
    unittest.main()
