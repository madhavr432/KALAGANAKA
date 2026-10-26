"""Unit tests for the modern astronomy planetary-position engine."""

import math
import os
import unittest
from datetime import datetime, timezone
from pathlib import Path
from unittest.mock import patch

from app.astronomy.ayanamsha import (
    AYANAMSHA_J2000_DEG,
    calculate_lahiri_ayanamsha,
    calculate_lahiri_ayanamsha_from_tt,
)
from app.astronomy.calculator import (
    calculate_planetary_positions,
    parse_timezone_aware_instant,
)
from app.astronomy.constants import (
    AYANAMSHA_NAME,
    COORDINATE_SYSTEM,
    EPHEMERIS_NAME,
    REFERENCE_FRAME,
    SUPPORTED_PLANETS,
)
from app.astronomy.ephemeris import (
    DateOutOfRangeError,
    EphemerisNotFoundError,
    get_ephemeris_dir,
    get_timescale,
    load_ephemeris,
)
from app.services.comparison_service import compare_planetary_positions


class TestEphemerisLoader(unittest.TestCase):
    def test_default_ephemeris_dir(self):
        directory = get_ephemeris_dir()
        self.assertTrue(directory.is_dir())
        self.assertTrue(directory.name == "ephemeris")

    def test_custom_ephemeris_dir_env_var(self):
        custom_path = Path("./scratch_test_ephem").resolve()
        with patch.dict(os.environ, {"KALAGANAKA_EPHEMERIS_DIR": str(custom_path)}):
            resolved = get_ephemeris_dir()
            self.assertEqual(resolved, custom_path)
            self.assertTrue(custom_path.is_dir())
        # Cleanup
        if custom_path.exists():
            custom_path.rmdir()

    def test_timescale_is_offline(self):
        ts = get_timescale()
        self.assertIsNotNone(ts)
        t = ts.utc(2026, 1, 1)
        self.assertAlmostEqual(t.tt, 2461041.5008, places=2)

    def test_ephemeris_not_found_raises_without_auto_download(self):
        with self.assertRaises(EphemerisNotFoundError):
            load_ephemeris("non_existent_kernel_file.bsp", auto_download=False)


class TestTimestampParsing(unittest.TestCase):
    def test_valid_utc_instant_with_z(self):
        dt = parse_timezone_aware_instant("2026-10-26T12:00:00Z")
        self.assertEqual(dt.year, 2026)
        self.assertEqual(dt.month, 10)
        self.assertEqual(dt.day, 26)
        self.assertIsNotNone(dt.tzinfo)

    def test_valid_instant_with_offset(self):
        dt = parse_timezone_aware_instant("2026-10-26T17:30:00+05:30")
        self.assertEqual(dt.hour, 17)
        self.assertEqual(dt.minute, 30)
        self.assertEqual(dt.utcoffset().total_seconds(), 5.5 * 3600)

    def test_timezone_naive_instant_raises(self):
        with self.assertRaises(ValueError) as ctx:
            parse_timezone_aware_instant("2026-10-26T12:00:00")
        self.assertIn("timezone-naive", str(ctx.exception))

    def test_invalid_string_raises(self):
        for invalid in ("not-a-date", "", "   ", "2026-13-45", "yesterday"):
            with self.subTest(invalid=invalid):
                with self.assertRaises(ValueError):
                    parse_timezone_aware_instant(invalid)


class TestLahiriAyanamsha(unittest.TestCase):
    def test_j2000_value(self):
        # At J2000.0 TT (JD 2451545.0), Ayanamsha must match standard PAC base value
        value = calculate_lahiri_ayanamsha_from_tt(2451545.0)
        expected = 23.0 + 51.0 / 60.0 + 25.532 / 3600.0
        self.assertAlmostEqual(value, expected, places=8)
        self.assertAlmostEqual(value, AYANAMSHA_J2000_DEG, places=8)

    def test_monotonic_precession_forward_in_time(self):
        val_2000 = calculate_lahiri_ayanamsha_from_tt(2451545.0)
        # 1 century later
        val_2100 = calculate_lahiri_ayanamsha_from_tt(2451545.0 + 36525.0)
        self.assertGreater(val_2100, val_2000)
        # Advance by ~50.29 arcseconds per year = ~1.396 degrees per century
        diff_deg = val_2100 - val_2000
        self.assertAlmostEqual(diff_deg, 5029.0966 / 3600.0, delta=0.01)

    def test_invalid_input_raises(self):
        for val in (math.nan, math.inf, -math.inf, "string"):
            with self.subTest(val=val):
                with self.assertRaises(ValueError):
                    calculate_lahiri_ayanamsha_from_tt(val)


class TestPlanetaryCalculations(unittest.TestCase):
    def setUp(self):
        self.instant = "2026-10-26T12:00:00+05:30"
        self.result = calculate_planetary_positions(self.instant)

    def test_metadata_returned(self):
        self.assertEqual(self.result["ephemeris"], EPHEMERIS_NAME)
        self.assertEqual(self.result["reference_frame"], REFERENCE_FRAME)
        self.assertEqual(self.result["coordinate_system"], COORDINATE_SYSTEM)
        self.assertEqual(self.result["ayanamsha_name"], AYANAMSHA_NAME)
        self.assertTrue(len(self.result["assumptions"]) >= 4)
        self.assertIn("longitude", self.result["units"])

    def test_all_seven_planets_calculated(self):
        calculated_names = [p["name"] for p in self.result["planets"]]
        self.assertEqual(calculated_names, SUPPORTED_PLANETS)
        self.assertEqual(
            sorted(list(self.result["positions_tropical_deg"].keys())),
            sorted(SUPPORTED_PLANETS),
        )
        self.assertEqual(
            sorted(list(self.result["positions_sidereal_deg"].keys())),
            sorted(SUPPORTED_PLANETS),
        )

    def test_coordinate_ranges(self):
        ayanamsha = self.result["ayanamsha_deg"]
        for p in self.result["planets"]:
            with self.subTest(planet=p["name"]):
                trop = p["tropical_longitude_deg"]
                sid = p["sidereal_longitude_deg"]
                lat = p["latitude_deg"]
                dist_au = p["distance_au"]
                dist_km = p["distance_km"]

                # Longitudes in [0, 360)
                self.assertGreaterEqual(trop, 0.0)
                self.assertLess(trop, 360.0)
                self.assertGreaterEqual(sid, 0.0)
                self.assertLess(sid, 360.0)

                # Sidereal = (Tropical - Ayanamsha) % 360
                expected_sid = (trop - ayanamsha) % 360.0
                self.assertAlmostEqual(sid, expected_sid, places=7)

                # Latitudes in [-90, +90]
                self.assertGreaterEqual(lat, -90.0)
                self.assertLessEqual(lat, 90.0)

                # Distances positive
                self.assertGreater(dist_au, 0.0)
                self.assertGreater(dist_km, 0.0)

    def test_physical_sanity_checks(self):
        planets_by_name = {p["name"]: p for p in self.result["planets"]}

        # Sun on October 26: tropical longitude in Libra/Scorpio (~210° - 215°)
        sun = planets_by_name["Sun"]
        self.assertAlmostEqual(sun["latitude_deg"], 0.0, delta=0.01)
        self.assertGreater(sun["tropical_longitude_deg"], 205.0)
        self.assertLess(sun["tropical_longitude_deg"], 220.0)
        # Distance to Sun ~0.98 - 1.02 AU
        self.assertAlmostEqual(sun["distance_au"], 1.0, delta=0.03)

        # Moon distance ~0.0024 - 0.0027 AU (~360,000 - 405,000 km)
        moon = planets_by_name["Moon"]
        self.assertGreater(moon["distance_km"], 350_000)
        self.assertLess(moon["distance_km"], 415_000)

    def test_dates_out_of_range_raise(self):
        for out_date in ("1800-01-01T00:00:00Z", "2100-01-01T00:00:00Z"):
            with self.subTest(date=out_date):
                with self.assertRaises(DateOutOfRangeError):
                    calculate_planetary_positions(out_date)

    def test_accepts_timezone_aware_datetime_object(self):
        dt = datetime(2026, 10, 26, 12, 0, 0, tzinfo=timezone.utc)
        result = calculate_planetary_positions(dt)
        self.assertEqual(len(result["planets"]), 7)

    def test_integration_with_person3_comparison_service(self):
        # Ensure that modern positions from Person 2 can feed Person 3's compare service directly!
        modern_positions = self.result["positions_sidereal_deg"]
        traditional_positions = {
            "Sun": 188.0,
            "Moon": 13.0,
            "Mars": 111.0,
        }
        comparison = compare_planetary_positions(
            traditional_positions=traditional_positions,
            modern_positions=modern_positions,
            traditional_method="Surya Siddhanta Test",
            modern_method="Skyfield JPL DE421",
            modern_data_source="provider",
            coordinate_system="Sidereal (Lahiri)",
            instant=self.instant,
        )
        self.assertEqual(comparison["status"], "comparison")
        self.assertFalse(comparison["is_mock"])
        self.assertEqual(len(comparison["results"]), 3)
        self.assertIn("Sun", comparison["compared_planets"])


if __name__ == "__main__":
    unittest.main()
