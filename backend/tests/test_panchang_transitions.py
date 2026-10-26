"""Comprehensive test suite for Panchang transition finding engine.

Covers:
- Transitions for all four Angas: Tithi, Nakshatra, Yoga, Karana.
- Boundary crossings at and near 0°/360° (Amavasya -> Pratipada, Naga -> Kimstughna, Revati -> Ashwini, Vaidhriti -> Vishkambha).
- Crossings close to local midnight.
- Consecutive transitions and strictly monotonic ordering.
- Confirmation that the Anga changes across reported transition boundaries.
- Error handling: naive datetimes, invalid dates, invalid timezones, invalid angas, interval bounds.
- Missing ephemeris handling.

Distinction:
- Mathematical Tests: Exact boundary arithmetic, continuous phase unwrapping, bisection convergence, index sequencing.
- Astronomical Reference Tests: Physical solar/lunar ephemeris positions and real sky events computed via JPL DE421.
"""

from datetime import datetime, timedelta, timezone
from unittest.mock import patch
import pytest

from app.astronomy.ephemeris import DateOutOfRangeError, EphemerisNotFoundError
from app.panchang.constants import (
    KARANA_SPAN_DEG,
    NAKSHATRA_NAMES,
    NAKSHATRA_SPAN_DEG,
    TITHI_NAMES,
    TITHI_SPAN_DEG,
    YOGA_NAMES,
    YOGA_SPAN_DEG,
)
from app.panchang.transitions import (
    _find_single_transition_in_bracket,
    compute_anga_angle,
    evaluate_anga_at_instant,
    find_next_transition,
    find_panchang_transitions,
    get_instant_panchang,
    round_datetime_to_second,
)


# ============================================================================
# MATHEMATICAL & NUMERICAL TESTS
# ============================================================================

class TestMathematicalTransitions:
    """Pure mathematical and numerical unit tests for transition calculation logic."""

    def test_round_datetime_to_second(self):
        dt_down = datetime(2026, 10, 27, 12, 0, 0, 499999, tzinfo=timezone.utc)
        assert round_datetime_to_second(dt_down) == datetime(2026, 10, 27, 12, 0, 0, 0, tzinfo=timezone.utc)

        dt_up = datetime(2026, 10, 27, 12, 0, 0, 500000, tzinfo=timezone.utc)
        assert round_datetime_to_second(dt_up) == datetime(2026, 10, 27, 12, 0, 1, 0, tzinfo=timezone.utc)

    def test_compute_anga_angle_definitions(self):
        # Tithi and Karana: Moon - Sun
        sun = 50.0
        moon = 70.0
        aya = 24.0
        assert compute_anga_angle(sun, moon, aya, "tithi") == pytest.approx(20.0)
        assert compute_anga_angle(sun, moon, aya, "karana") == pytest.approx(20.0)

        # Nakshatra: Moon - Ayanamsha
        assert compute_anga_angle(sun, moon, aya, "nakshatra") == pytest.approx(46.0)

        # Yoga: (Sun - aya) + (Moon - aya) = 26 + 46 = 72
        assert compute_anga_angle(sun, moon, aya, "yoga") == pytest.approx(72.0)

    def test_compute_anga_angle_wraparound(self):
        # Separation wrapping across 0 deg: Moon=10, Sun=350 -> diff = 20 deg
        assert compute_anga_angle(350.0, 10.0, 24.0, "tithi") == pytest.approx(20.0)
        # Nakshatra wrapping across 0 deg: Moon=10, Aya=24 -> diff = 346 deg
        assert compute_anga_angle(0.0, 10.0, 24.0, "nakshatra") == pytest.approx(346.0)

    def test_compute_anga_angle_invalid(self):
        with pytest.raises(ValueError, match="Invalid anga_type"):
            compute_anga_angle(0.0, 0.0, 0.0, "invalid_anga")

    def test_evaluate_anga_at_instant_dispatches(self):
        sun = 100.0
        moon = 150.0
        aya = 24.0
        tithi_res = evaluate_anga_at_instant(sun, moon, aya, "tithi")
        assert "paksha" in tithi_res
        nak_res = evaluate_anga_at_instant(sun, moon, aya, "nakshatra")
        assert "sidereal_longitude_deg" in nak_res
        yoga_res = evaluate_anga_at_instant(sun, moon, aya, "yoga")
        assert "combined_longitude_deg" in yoga_res
        karana_res = evaluate_anga_at_instant(sun, moon, aya, "karana")
        assert "half_tithi_index" in karana_res


# ============================================================================
# ASTRONOMICAL REFERENCE TESTS: INSTANTANEOUS PANCHANG
# ============================================================================

class TestInstantPanchang:
    """Tests for instantaneous Panchang Angas calculation using JPL DE421."""

    def test_instant_panchang_structure(self):
        instant_str = "2026-10-27T00:00:00Z"
        res = get_instant_panchang(instant_str, "Asia/Kolkata", auto_download=False)

        assert res["instant_requested"] == instant_str
        assert res["instant_utc"] == "2026-10-27T00:00:00Z"
        assert res["instant_local"] == "2026-10-27T05:30:00+05:30"
        assert "tithi" in res
        assert "nakshatra" in res
        assert "yoga" in res
        assert "karana" in res
        assert "ayanamsha_deg" in res
        assert "longitude_conventions" in res

    def test_instant_karana_naming(self):
        # Verify canonical name and alias handling
        res = get_instant_panchang("2026-10-27T00:00:00Z", "UTC", auto_download=False)
        karana = res["karana"]
        assert karana["canonical_name"] is not None
        assert karana["display_name"] is not None
        assert karana["karana_type"] in ("fixed", "repeating")


# ============================================================================
# ASTRONOMICAL REFERENCE TESTS: NEXT TRANSITION
# ============================================================================

class TestNextTransition:
    """Tests finding the next boundary crossing for each of the four Angas."""

    def test_next_transition_tithi(self):
        instant_str = "2026-10-27T00:00:00Z"
        res = find_next_transition(instant_str, "tithi", "Asia/Kolkata", auto_download=False)

        assert res["anga_type"] == "tithi"
        assert res["seconds_remaining"] > 0
        assert res["hours_remaining"] > 0
        tr = res["next_transition"]
        assert tr["from_name"] == "Pratipada"
        assert tr["to_name"] == "Dwitiya"
        assert tr["from_index"] == 16
        assert tr["to_index"] == 17
        assert tr["boundary_deg"] == pytest.approx(192.0)
        assert tr["confirmed_change"] is True
        assert tr["precision_achieved_seconds"] <= 1.0

    def test_next_transition_karana(self):
        instant_str = "2026-10-27T00:00:00Z"
        res = find_next_transition(instant_str, "karana", "UTC", auto_download=False)

        assert res["anga_type"] == "karana"
        tr = res["next_transition"]
        assert tr["from_index"] == 32
        assert tr["to_index"] == 33
        assert tr["from_name"] == "Kaulava"
        assert tr["to_name"] == "Taitila"
        assert tr["boundary_deg"] == pytest.approx(192.0)
        assert tr["confirmed_change"] is True

    def test_next_transition_nakshatra(self):
        instant_str = "2026-10-27T00:00:00Z"
        res = find_next_transition(instant_str, "nakshatra", "UTC", auto_download=False)

        assert res["anga_type"] == "nakshatra"
        tr = res["next_transition"]
        assert tr["from_index"] == 2
        assert tr["to_index"] == 3
        assert tr["from_name"] == "Bharani"
        assert tr["to_name"] == "Krittika"
        assert tr["boundary_deg"] == pytest.approx(26.666666666666668)
        assert tr["confirmed_change"] is True

    def test_next_transition_yoga(self):
        instant_str = "2026-10-27T00:00:00Z"
        res = find_next_transition(instant_str, "yoga", "UTC", auto_download=False)

        assert res["anga_type"] == "yoga"
        tr = res["next_transition"]
        assert tr["from_index"] == 16
        assert tr["to_index"] == 17
        assert tr["from_name"] == "Siddhi"
        assert tr["to_name"] == "Vyatipata"
        assert tr["boundary_deg"] == pytest.approx(213.33333333333334)
        assert tr["confirmed_change"] is True


# ============================================================================
# ASTRONOMICAL REFERENCE TESTS: 0°/360° WRAP BOUNDARIES
# ============================================================================

class TestWrapBoundaryTransitions:
    """Tests boundary crossings across 0°/360° without losing transitions."""

    def test_tithi_amavasya_to_shukla_pratipada_wrap(self):
        """
        Verify transition from Amavasya (Tithi 30) to Shukla Pratipada (Tithi 1).
        Occurs on 2026-11-09 around 07:02 UTC.
        Boundary angle crossed is exactly 0.0° / 360.0°.
        """
        res = find_panchang_transitions(
            "2026-11-09T00:00:00Z",
            "2026-11-09T14:00:00Z",
            ["tithi"],
            "UTC",
            auto_download=False,
        )
        assert res["total_transitions"] == 1
        tr = res["transitions"][0]
        assert tr["anga_type"] == "tithi"
        assert tr["boundary_deg"] == pytest.approx(0.0)
        assert tr["from_index"] == 30
        assert tr["to_index"] == 1
        assert tr["from_name"] == "Amavasya"
        assert tr["to_name"] == "Pratipada"
        assert tr["confirmed_change"] is True
        assert tr["transition_time_utc"] == "2026-11-09T07:02:07Z"

    def test_karana_naga_to_kimstughna_wrap(self):
        """
        Verify transition from Naga (Karana 60) to Kimstughna (Karana 1).
        Occurs on 2026-11-09 at exact same instant as Tithi 30 -> 1.
        Boundary angle crossed is 0.0° / 360.0°.
        """
        res = find_panchang_transitions(
            "2026-11-09T00:00:00Z",
            "2026-11-09T14:00:00Z",
            ["karana"],
            "UTC",
            auto_download=False,
        )
        assert res["total_transitions"] >= 1
        tr = res["transitions"][0]
        assert tr["anga_type"] == "karana"
        assert tr["boundary_deg"] == pytest.approx(0.0)
        assert tr["from_index"] == 60
        assert tr["to_index"] == 1
        assert tr["from_name"] == "Naga"
        assert tr["to_name"] == "Kimstughna"
        assert tr["confirmed_change"] is True
        assert tr["transition_time_utc"] == "2026-11-09T07:02:07Z"

    def test_nakshatra_revati_to_ashwini_wrap(self):
        """
        Verify transition from Revati (27) to Ashwini (1) across 0° Aries.
        In late Oct 2026, Moon enters Ashwini on 2026-10-25 at 13:52:06 UTC.
        """
        res = find_panchang_transitions(
            "2026-10-25T00:00:00Z",
            "2026-10-26T00:00:00Z",
            ["nakshatra"],
            "UTC",
            auto_download=False,
        )
        wrap_tr = [t for t in res["transitions"] if t["from_index"] == 27 and t["to_index"] == 1]
        assert len(wrap_tr) == 1
        tr = wrap_tr[0]
        assert tr["from_name"] == "Revati"
        assert tr["to_name"] == "Ashwini"
        assert tr["boundary_deg"] == pytest.approx(0.0)
        assert tr["confirmed_change"] is True
        assert tr["transition_time_utc"] == "2026-10-25T13:52:06Z"

    def test_yoga_vaidhriti_to_vishkambha_wrap(self):
        """
        Verify transition from Vaidhriti (27) to Vishkambha (1) across 0° / 360°.
        Occurs on 2026-11-05 at 23:39:18 UTC.
        """
        res = find_panchang_transitions(
            "2026-11-05T00:00:00Z",
            "2026-11-06T12:00:00Z",
            ["yoga"],
            "UTC",
            auto_download=False,
        )
        wrap_tr = [t for t in res["transitions"] if t["from_index"] == 27 and t["to_index"] == 1]
        assert len(wrap_tr) == 1
        tr = wrap_tr[0]
        assert tr["from_name"] == "Vaidhriti"
        assert tr["to_name"] == "Vishkambha"
        assert tr["boundary_deg"] == pytest.approx(0.0)
        assert tr["confirmed_change"] is True
        assert tr["transition_time_utc"] == "2026-11-05T23:39:18Z"


# ============================================================================
# ASTRONOMICAL REFERENCE TESTS: LOCAL MIDNIGHT CROSSINGS
# ============================================================================

class TestLocalMidnightCrossings:
    """Tests transition detection and timezone formatting across local midnight (23:59 -> 00:00)."""

    def test_crossing_near_local_midnight(self):
        """
        On 2026-10-27, Tithi 16 -> 17 transition occurs at 01:32:09 UTC.
        In a timezone like UTC-01:30 (e.g. Atlantic/Cape_Verde or custom offset),
        01:32:09 UTC is 00:02:09 local time (just 2 minutes after local midnight).
        In UTC-02:00, 01:32:09 UTC is 23:32:09 of the previous calendar date.
        """
        # Test in UTC-02:00
        res_prev = find_next_transition(
            "2026-10-26T23:00:00-02:00",
            "tithi",
            "-02:00",
            auto_download=False,
        )
        tr = res_prev["next_transition"]
        assert tr["transition_time_local"].startswith("2026-10-26T23:32:09-02:00")

        # Test in UTC-01:00
        res_next = find_next_transition(
            "2026-10-27T00:00:00-01:00",
            "tithi",
            "-01:00",
            auto_download=False,
        )
        tr2 = res_next["next_transition"]
        assert tr2["transition_time_local"].startswith("2026-10-27T00:32:09-01:00")


# ============================================================================
# CONSECUTIVE TRANSITIONS & ORDERING
# ============================================================================

class TestConsecutiveTransitions:
    """Verify chronological sequence and duration consistency of consecutive transitions."""

    def test_consecutive_tithis_over_three_days(self):
        res = find_panchang_transitions(
            "2026-10-27T00:00:00Z",
            "2026-10-30T00:00:00Z",
            ["tithi"],
            "UTC",
            auto_download=False,
        )
        transitions = res["transitions"]
        assert len(transitions) >= 3

        # Verify strictly monotonically increasing timestamps
        for i in range(len(transitions) - 1):
            t1 = datetime.fromisoformat(transitions[i]["transition_time_utc"])
            t2 = datetime.fromisoformat(transitions[i + 1]["transition_time_utc"])
            assert t2 > t1
            # Tithi duration must be between 18 and 28 hours
            duration_hours = (t2 - t1).total_seconds() / 3600.0
            assert 18.0 <= duration_hours <= 28.0

            # Sequential indices
            assert transitions[i + 1]["from_index"] == transitions[i]["to_index"]

    def test_interval_with_all_four_angas(self):
        res = find_panchang_transitions(
            "2026-10-27T00:00:00Z",
            "2026-10-28T00:00:00Z",
            None,  # All 4 angas
            "Asia/Kolkata",
            auto_download=False,
        )
        assert res["total_transitions"] >= 5
        # Verify chronological ordering of all mixed Anga transitions
        for i in range(len(res["transitions"]) - 1):
            t1 = datetime.fromisoformat(res["transitions"][i]["transition_time_utc"])
            t2 = datetime.fromisoformat(res["transitions"][i + 1]["transition_time_utc"])
            assert t2 >= t1


# ============================================================================
# ERROR HANDLING AND EDGE CASES
# ============================================================================

class TestTransitionErrorHandling:
    """Tests validation of dates, timezones, interval limits, and ephemeris errors."""

    def test_invalid_anga_type(self):
        with pytest.raises(ValueError, match="Invalid anga_type"):
            find_next_transition("2026-10-27T00:00:00Z", "rashi")

    def test_timezone_naive_instant(self):
        with pytest.raises(ValueError, match="timezone-naive"):
            find_next_transition("2026-10-27T00:00:00", "tithi")

    def test_malformed_instant(self):
        with pytest.raises(ValueError, match="Invalid ISO-8601"):
            find_next_transition("not-a-date", "tithi")

    def test_invalid_timezone(self):
        with pytest.raises(ValueError, match="Invalid timezone"):
            find_next_transition("2026-10-27T00:00:00Z", "tithi", "Invalid/Timezone_Name")

    def test_end_before_start(self):
        with pytest.raises(ValueError, match="must be strictly after"):
            find_panchang_transitions(
                "2026-10-28T00:00:00Z",
                "2026-10-27T00:00:00Z",
                ["tithi"],
            )

    def test_interval_exceeds_max_duration(self):
        with pytest.raises(ValueError, match="exceeds maximum permitted duration"):
            find_panchang_transitions(
                "2026-10-01T00:00:00Z",
                "2026-11-15T00:00:00Z",  # 45 days > 35 days
                ["tithi"],
            )

    def test_date_out_of_range(self):
        with pytest.raises(DateOutOfRangeError):
            find_next_transition("1850-01-01T00:00:00Z", "tithi")

    def test_missing_ephemeris(self):
        with patch("app.panchang.transitions.load_ephemeris", side_effect=EphemerisNotFoundError("DE421 missing")):
            with pytest.raises(EphemerisNotFoundError):
                find_next_transition("2026-10-27T00:00:00Z", "tithi", auto_download=False)
