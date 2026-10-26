"""Unit tests for solar events and solar position calculations."""

import math
import unittest
from datetime import date, datetime, timezone
from zoneinfo import ZoneInfo

from app.astronomy.ephemeris import DateOutOfRangeError
from app.astronomy.solar import (
    calculate_solar_events,
    calculate_solar_position,
    parse_date,
    parse_timezone,
    validate_observer,
)


class TestObserverAndInputValidation(unittest.TestCase):
    def test_valid_observer(self):
        lat, lon, elev = validate_observer(23.1765, 75.7885, 511.0)
        self.assertEqual(lat, 23.1765)
        self.assertEqual(lon, 75.7885)
        self.assertEqual(elev, 511.0)

    def test_invalid_latitude_raises(self):
        for invalid_lat in (90.1, -90.1, 100.0, -180.0, math.nan, True, "23.0"):
            with self.subTest(lat=invalid_lat):
                with self.assertRaises(ValueError):
                    validate_observer(invalid_lat, 75.0, 0.0)

    def test_invalid_longitude_raises(self):
        for invalid_lon in (180.1, -180.1, 360.0, -200.0, math.nan, True, "75.0"):
            with self.subTest(lon=invalid_lon):
                with self.assertRaises(ValueError):
                    validate_observer(23.0, invalid_lon, 0.0)

    def test_invalid_elevation_raises(self):
        for invalid_elev in (-600.0, 15000.0, math.nan, True, "500"):
            with self.subTest(elev=invalid_elev):
                with self.assertRaises(ValueError):
                    validate_observer(23.0, 75.0, invalid_elev)

    def test_parse_date_valid(self):
        d1 = parse_date("2026-10-26")
        self.assertEqual(d1, date(2026, 10, 26))
        d2 = parse_date(date(2026, 10, 26))
        self.assertEqual(d2, date(2026, 10, 26))

    def test_parse_date_invalid(self):
        for invalid in ("", "   ", "not-a-date", "2026-13-01", "2026-02-30"):
            with self.subTest(date_val=invalid):
                with self.assertRaises(ValueError):
                    parse_date(invalid)

    def test_parse_timezone_valid(self):
        for tz_str in ("Asia/Kolkata", "UTC", "+05:30", "-04:00", "Z", "Europe/London"):
            with self.subTest(tz=tz_str):
                tz = parse_timezone(tz_str)
                self.assertIsNotNone(tz)

    def test_parse_timezone_invalid(self):
        for invalid in ("", "   ", "Mars/Crater", "+25:00", "not-a-timezone"):
            with self.subTest(tz=invalid):
                with self.assertRaises(ValueError):
                    parse_timezone(invalid)


class TestSolarEvents(unittest.TestCase):
    def test_solar_events_ujjain_india(self):
        # Ujjain, Madhya Pradesh, India: traditional prime meridian of Indian astronomy
        res = calculate_solar_events(
            date_input="2026-10-26",
            latitude=23.1765,
            longitude=75.7885,
            elevation_m=511.0,
            timezone_str="Asia/Kolkata",
        )

        self.assertEqual(res["date"], "2026-10-26")
        self.assertTrue(res["sunrise"]["available"])
        self.assertTrue(res["sunset"]["available"])
        self.assertTrue(res["solar_noon"]["available"])

        sunrise_dt = datetime.fromisoformat(res["sunrise"]["time_local"])
        sunset_dt = datetime.fromisoformat(res["sunset"]["time_local"])
        noon_dt = datetime.fromisoformat(res["solar_noon"]["time_local"])

        # Chronological ordering on this calendar day
        self.assertLess(sunrise_dt, noon_dt)
        self.assertLess(noon_dt, sunset_dt)

        # Expected times for late October in Ujjain:
        # Sunrise around 06:20 - 06:35 IST
        self.assertEqual(sunrise_dt.hour, 6)
        self.assertGreaterEqual(sunrise_dt.minute, 20)
        self.assertLessEqual(sunrise_dt.minute, 35)

        # Sunset around 17:45 - 18:00 IST
        self.assertEqual(sunset_dt.hour, 17)
        self.assertGreaterEqual(sunset_dt.minute, 45)
        self.assertLessEqual(sunset_dt.minute, 59)

        # Solar noon around 12:05 - 12:15 IST
        self.assertEqual(noon_dt.hour, 12)
        self.assertGreaterEqual(noon_dt.minute, 5)
        self.assertLessEqual(noon_dt.minute, 15)

        # Day length in late October (~11.3 - 11.5 hours)
        self.assertIsNotNone(res["day_length_hours"])
        self.assertGreater(res["day_length_hours"], 11.2)
        self.assertLess(res["day_length_hours"], 11.6)

    def test_solar_events_greenwich_uk(self):
        # Royal Observatory Greenwich, UK near Spring Equinox
        res = calculate_solar_events(
            date_input="2026-03-20",
            latitude=51.4769,
            longitude=0.0005,
            elevation_m=46.0,
            timezone_str="UTC",
        )

        self.assertTrue(res["sunrise"]["available"])
        self.assertTrue(res["sunset"]["available"])
        self.assertTrue(res["solar_noon"]["available"])

        sunrise_dt = datetime.fromisoformat(res["sunrise"]["time_local"])
        sunset_dt = datetime.fromisoformat(res["sunset"]["time_local"])
        noon_dt = datetime.fromisoformat(res["solar_noon"]["time_local"])

        self.assertLess(sunrise_dt, noon_dt)
        self.assertLess(noon_dt, sunset_dt)

        # Near equinox, daylight is around 12.0 - 12.3 hours (accounting for refraction)
        self.assertGreaterEqual(res["day_length_hours"], 12.0)
        self.assertLessEqual(res["day_length_hours"], 12.3)

    def test_polar_day_midnight_sun_svalbard(self):
        # Longyearbyen, Svalbard (lat 78.22 N) on June 21, 2026 (Summer Solstice)
        res = calculate_solar_events(
            date_input="2026-06-21",
            latitude=78.22,
            longitude=15.65,
            elevation_m=20.0,
            timezone_str="UTC",
        )

        # Neither sunrise nor sunset should occur
        self.assertFalse(res["sunrise"]["available"])
        self.assertIsNone(res["sunrise"]["time_local"])
        self.assertIn("Polar day", res["sunrise"]["reason"])

        self.assertFalse(res["sunset"]["available"])
        self.assertIsNone(res["sunset"]["time_local"])
        self.assertIn("Polar day", res["sunset"]["reason"])

        # Continuous 24 hours of daylight
        self.assertEqual(res["day_length_hours"], 24.0)

        # Solar noon (upper meridian transit) still occurs
        self.assertTrue(res["solar_noon"]["available"])
        self.assertIsNotNone(res["solar_noon"]["time_local"])

    def test_polar_night_svalbard(self):
        # Longyearbyen, Svalbard (lat 78.22 N) on December 21, 2026 (Winter Solstice)
        res = calculate_solar_events(
            date_input="2026-12-21",
            latitude=78.22,
            longitude=15.65,
            elevation_m=20.0,
            timezone_str="UTC",
        )

        self.assertFalse(res["sunrise"]["available"])
        self.assertIsNone(res["sunrise"]["time_local"])
        self.assertIn("Polar night", res["sunrise"]["reason"])

        self.assertFalse(res["sunset"]["available"])
        self.assertIsNone(res["sunset"]["time_local"])
        self.assertIn("Polar night", res["sunset"]["reason"])

        # 0 hours daylight
        self.assertEqual(res["day_length_hours"], 0.0)

        # Upper transit occurs below horizon
        self.assertTrue(res["solar_noon"]["available"])

    def test_out_of_range_date_raises(self):
        for out_date in ("1800-01-01", "2100-01-01"):
            with self.subTest(date_val=out_date):
                with self.assertRaises(DateOutOfRangeError):
                    calculate_solar_events(
                        date_input=out_date,
                        latitude=23.0,
                        longitude=75.0,
                    )


class TestSolarPosition(unittest.TestCase):
    def test_solar_noon_position_ujjain(self):
        # Solar noon in Ujjain on 2026-10-26 is at 06:40:50 UTC
        instant = "2026-10-26T06:40:50Z"
        pos = calculate_solar_position(
            instant=instant,
            latitude=23.1765,
            longitude=75.7885,
            elevation_m=511.0,
        )

        # At solar noon, altitude is positive and high (~54 degrees)
        self.assertGreater(pos["altitude_deg"], 50.0)
        self.assertLess(pos["altitude_deg"], 60.0)
        self.assertTrue(pos["is_sun_up"])

        # Refraction increases altitude slightly
        self.assertGreaterEqual(pos["altitude_refracted_deg"], pos["altitude_deg"])

        # Azimuth at meridian transit in Northern Hemisphere (outside tropics/subtropics in late autumn)
        # Sun is due South (Azimuth ~180 degrees)
        self.assertAlmostEqual(pos["azimuth_deg"], 180.0, delta=0.5)

        # Topocentric distance ~ 1.0 AU
        self.assertAlmostEqual(pos["distance_au"], 1.0, delta=0.03)
        self.assertGreater(pos["distance_km"], 1.45e8)
        self.assertLess(pos["distance_km"], 1.55e8)

    def test_midnight_position_ujjain(self):
        # Midnight in Ujjain: 18:40:47 UTC (00:10:47 AM local)
        instant = "2026-10-26T18:40:47Z"
        pos = calculate_solar_position(
            instant=instant,
            latitude=23.1765,
            longitude=75.7885,
            elevation_m=511.0,
        )

        # Well below horizon
        self.assertLess(pos["altitude_deg"], -30.0)
        self.assertFalse(pos["is_sun_up"])

        # Azimuth at solar midnight is due North (~0° / 360°)
        diff_from_north = min(pos["azimuth_deg"], 360.0 - pos["azimuth_deg"])
        self.assertLess(diff_from_north, 1.0)

    def test_coordinate_ranges(self):
        pos = calculate_solar_position(
            instant="2026-10-26T12:00:00+05:30",
            latitude=23.1765,
            longitude=75.7885,
        )
        self.assertGreaterEqual(pos["altitude_deg"], -90.0)
        self.assertLessEqual(pos["altitude_deg"], 90.0)
        self.assertGreaterEqual(pos["azimuth_deg"], 0.0)
        self.assertLess(pos["azimuth_deg"], 360.0)

    def test_timezone_naive_instant_raises(self):
        with self.assertRaises(ValueError) as ctx:
            calculate_solar_position(
                instant="2026-10-26T12:00:00",
                latitude=23.0,
                longitude=75.0,
            )
        self.assertIn("timezone-naive", str(ctx.exception))


if __name__ == "__main__":
    unittest.main()
