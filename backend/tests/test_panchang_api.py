"""API test suite for Panchang endpoints in KalaGanaka backend.

Tests:
- GET and POST /panchang/instant
- GET and POST /panchang/next-transition
- GET and POST /panchang/transitions
- Schema validation, coordinate fields, and metadata
- Karana canonical naming (Kimstughna, Vishti) and alias support
- Error handling: naive datetimes, invalid angas, interval limits (>35 days), date out of range
- API regression checks: /health, /astronomy/planets, /solar/events, /comparison/positions
"""

import pytest
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


# ============================================================================
# INSTANTANEOUS PANCHANG API TESTS
# ============================================================================

class TestPanchangInstantApi:
    """Tests for GET and POST /panchang/instant."""

    def test_get_instant_utc_success(self):
        resp = client.get("/panchang/instant", params={"instant": "2026-10-27T00:00:00Z"})
        assert resp.status_code == 200
        data = resp.json()

        assert data["instant_utc"] == "2026-10-27T00:00:00Z"
        assert "tithi" in data
        assert "nakshatra" in data
        assert "yoga" in data
        assert "karana" in data
        assert "ayanamsha_deg" in data
        assert "sun_sidereal_longitude_deg" in data
        assert "moon_sidereal_longitude_deg" in data
        assert "longitude_conventions" in data

    def test_get_instant_with_timezone(self):
        resp = client.get(
            "/panchang/instant",
            params={"instant": "2026-10-27T00:00:00Z", "timezone": "Asia/Kolkata"},
        )
        assert resp.status_code == 200
        data = resp.json()
        assert data["instant_local"] == "2026-10-27T05:30:00+05:30"
        assert data["instant_utc"] == "2026-10-27T00:00:00Z"

    def test_post_instant_success(self):
        payload = {
            "instant": "2026-10-27T12:00:00+05:30",
            "timezone": "Asia/Kolkata",
        }
        resp = client.post("/panchang/instant", json=payload)
        assert resp.status_code == 200
        data = resp.json()
        assert data["instant_local"].startswith("2026-10-27T12:00:00+05:30")
        assert data["tithi"]["name"] is not None

    def test_karana_canonical_naming(self):
        resp = client.get("/panchang/instant", params={"instant": "2026-10-27T00:00:00Z"})
        assert resp.status_code == 200
        karana = resp.json()["karana"]
        assert karana["canonical_name"] is not None
        assert karana["display_name"] is not None
        assert karana["karana_type"] in ("fixed", "repeating")

    def test_instant_naive_datetime_rejected(self):
        resp = client.get("/panchang/instant", params={"instant": "2026-10-27T00:00:00"})
        assert resp.status_code == 422
        assert "timezone-naive" in resp.json()["detail"]

    def test_instant_invalid_timezone_rejected(self):
        resp = client.get(
            "/panchang/instant",
            params={"instant": "2026-10-27T00:00:00Z", "timezone": "Invalid/Timezone"},
        )
        assert resp.status_code == 422

    def test_instant_date_out_of_range_rejected(self):
        resp = client.get("/panchang/instant", params={"instant": "1800-01-01T00:00:00Z"})
        assert resp.status_code == 422


# ============================================================================
# NEXT TRANSITION API TESTS
# ============================================================================

class TestPanchangNextTransitionApi:
    """Tests for GET and POST /panchang/next-transition."""

    @pytest.mark.parametrize("anga", ["tithi", "nakshatra", "yoga", "karana"])
    def test_get_next_transition_all_angas(self, anga: str):
        resp = client.get(
            "/panchang/next-transition",
            params={
                "instant": "2026-10-27T00:00:00Z",
                "anga_type": anga,
                "timezone": "Asia/Kolkata",
            },
        )
        assert resp.status_code == 200
        data = resp.json()
        assert data["anga_type"] == anga
        assert data["seconds_remaining"] > 0
        assert data["hours_remaining"] > 0

        tr = data["next_transition"]
        assert tr["anga_type"] == anga
        assert tr["from_index"] != tr["to_index"]
        assert tr["confirmed_change"] is True
        assert tr["precision_achieved_seconds"] <= 1.0

    def test_post_next_transition_success(self):
        payload = {
            "instant": "2026-10-27T00:00:00Z",
            "anga_type": "tithi",
            "timezone": "UTC",
        }
        resp = client.post("/panchang/next-transition", json=payload)
        assert resp.status_code == 200
        data = resp.json()
        assert data["next_transition"]["from_name"] == "Pratipada"
        assert data["next_transition"]["to_name"] == "Dwitiya"

    def test_invalid_anga_type_rejected(self):
        resp = client.get(
            "/panchang/next-transition",
            params={"instant": "2026-10-27T00:00:00Z", "anga_type": "invalid_anga"},
        )
        assert resp.status_code == 422
        assert "Invalid anga_type" in resp.json()["detail"]


# ============================================================================
# TRANSITIONS INTERVAL API TESTS
# ============================================================================

class TestPanchangTransitionsIntervalApi:
    """Tests for GET and POST /panchang/transitions."""

    def test_get_transitions_interval_all_angas(self):
        resp = client.get(
            "/panchang/transitions",
            params={
                "start": "2026-10-27T00:00:00Z",
                "end": "2026-10-28T00:00:00Z",
                "timezone": "Asia/Kolkata",
            },
        )
        assert resp.status_code == 200
        data = resp.json()
        assert data["total_transitions"] >= 5
        assert len(data["transitions"]) == data["total_transitions"]

    def test_get_transitions_filtered_angas(self):
        resp = client.get(
            "/panchang/transitions",
            params={
                "start": "2026-10-27T00:00:00Z",
                "end": "2026-10-28T00:00:00Z",
                "anga_types": "tithi,karana",
                "timezone": "UTC",
            },
        )
        assert resp.status_code == 200
        data = resp.json()
        for tr in data["transitions"]:
            assert tr["anga_type"] in ("tithi", "karana")

    def test_post_transitions_interval_success(self):
        payload = {
            "start": "2026-10-27T00:00:00Z",
            "end": "2026-10-28T00:00:00Z",
            "anga_types": ["tithi"],
            "timezone": "UTC",
        }
        resp = client.post("/panchang/transitions", json=payload)
        assert resp.status_code == 200
        data = resp.json()
        assert data["total_transitions"] >= 1
        assert data["transitions"][0]["anga_type"] == "tithi"

    def test_transitions_end_before_start_rejected(self):
        resp = client.get(
            "/panchang/transitions",
            params={
                "start": "2026-10-28T00:00:00Z",
                "end": "2026-10-27T00:00:00Z",
            },
        )
        assert resp.status_code == 422
        assert "must be strictly after" in resp.json()["detail"]

    def test_transitions_interval_exceeds_max_days_rejected(self):
        resp = client.get(
            "/panchang/transitions",
            params={
                "start": "2026-10-01T00:00:00Z",
                "end": "2026-11-15T00:00:00Z",  # 45 days > 35 days
            },
        )
        assert resp.status_code == 422
        assert "exceeds maximum permitted duration" in resp.json()["detail"]

    def test_transitions_with_limit_caps_results(self):
        resp = client.get(
            "/panchang/transitions",
            params={
                "start": "2026-10-27T00:00:00Z",
                "end": "2026-10-30T00:00:00Z",
                "limit": 3,
            },
        )
        assert resp.status_code == 200
        data = resp.json()
        assert data["total_transitions"] == 3
        assert len(data["transitions"]) == 3

    def test_transitions_invalid_limit_rejected(self):
        resp = client.get(
            "/panchang/transitions",
            params={
                "start": "2026-10-27T00:00:00Z",
                "end": "2026-10-28T00:00:00Z",
                "limit": 0,
            },
        )
        assert resp.status_code == 422

        resp2 = client.get(
            "/panchang/transitions",
            params={
                "start": "2026-10-27T00:00:00Z",
                "end": "2026-10-28T00:00:00Z",
                "limit": 501,
            },
        )
        assert resp2.status_code == 422

    def test_post_transitions_empty_anga_types_rejected(self):
        payload = {
            "start": "2026-10-27T00:00:00Z",
            "end": "2026-10-28T00:00:00Z",
            "anga_types": [],
        }
        resp = client.post("/panchang/transitions", json=payload)
        assert resp.status_code == 422

    def test_post_transitions_invalid_anga_types_rejected(self):
        payload = {
            "start": "2026-10-27T00:00:00Z",
            "end": "2026-10-28T00:00:00Z",
            "anga_types": ["not_an_anga"],
        }
        resp = client.post("/panchang/transitions", json=payload)
        assert resp.status_code == 422

    def test_post_next_transition_invalid_anga_rejected(self):
        payload = {
            "instant": "2026-10-27T00:00:00Z",
            "anga_type": "not_an_anga",
        }
        resp = client.post("/panchang/next-transition", json=payload)
        assert resp.status_code == 422

    def test_post_next_transition_naive_instant_rejected(self):
        payload = {
            "instant": "2026-10-27T00:00:00",
            "anga_type": "tithi",
        }
        resp = client.post("/panchang/next-transition", json=payload)
        assert resp.status_code == 422

    def test_panchang_ephemeris_not_found_returns_503_without_leaking_path(self):
        from unittest.mock import patch
        from app.astronomy.ephemeris import EphemerisNotFoundError

        with patch("app.panchang.transitions.load_ephemeris", side_effect=EphemerisNotFoundError("de421 missing in C:\\secret\\dir")):
            resp = client.get("/panchang/instant", params={"instant": "2026-10-27T00:00:00Z"})
            assert resp.status_code == 503
            detail = resp.json()["detail"]
            assert "C:\\secret\\dir" not in detail
            assert "unavailable" in detail

    def test_panchang_ephemeris_load_error_returns_500_without_leaking_path(self):
        from unittest.mock import patch
        from app.astronomy.ephemeris import EphemerisLoadError

        with patch("app.panchang.transitions.load_ephemeris", side_effect=EphemerisLoadError("corrupt in C:\\secret\\dir")):
            resp = client.get("/panchang/instant", params={"instant": "2026-10-27T00:00:00Z"})
            assert resp.status_code == 500
            detail = resp.json()["detail"]
            assert "C:\\secret\\dir" not in detail
            assert "Failed to load" in detail


# ============================================================================
# API REGRESSION TESTS
# ============================================================================

class TestApiRegression:
    """Ensure existing public endpoints across KalaGanaka remain fully functional."""

    def test_health_check(self):
        resp = client.get("/health")
        assert resp.status_code == 200
        assert resp.json() == {"status": "ok"}

    def test_astronomy_planets_endpoint(self):
        resp = client.get(
            "/astronomy/planets",
            params={"instant": "2026-10-27T00:00:00Z"},
        )
        assert resp.status_code == 200
        data = resp.json()
        assert "positions_sidereal_deg" in data
        assert "Sun" in data["positions_sidereal_deg"]
        assert "Moon" in data["positions_sidereal_deg"]

    def test_solar_events_endpoint(self):
        resp = client.get(
            "/solar/events",
            params={
                "date": "2026-10-27",
                "latitude": 28.6139,
                "longitude": 77.2090,
                "timezone": "Asia/Kolkata",
            },
        )
        assert resp.status_code == 200
        data = resp.json()
        assert data["sunrise"]["available"] is True
        assert data["sunset"]["available"] is True

    def test_comparison_endpoint(self):
        resp = client.post(
            "/comparison/compare",
            json={
                "traditional_positions": {"Sun": 210.0, "Moon": 40.0},
                "modern_positions": {"Sun": 213.5, "Moon": 44.7},
                "traditional_method": "Surya Siddhanta",
                "modern_method": "JPL DE421",
                "modern_data_source": "mock",
                "coordinate_system": "sidereal",
            },
        )
        assert resp.status_code == 200
        data = resp.json()
        assert "results" in data
        assert len(data["results"]) == 2

    def test_traditional_solar_position(self):
        resp = client.get("/traditional/solar-position", params={"date": "2026-10-27"})
        assert resp.status_code == 200
        data = resp.json()
        assert "longitude_deg" in data
        assert data["body"] == "Sun"

    def test_cors_headers_and_preflight(self):
        allowed_origins = [
            "http://localhost:3000",
            "http://localhost:5173",
            "http://127.0.0.1:3000",
            "http://127.0.0.1:5173",
        ]
        for origin in allowed_origins:
            resp = client.options(
                "/astronomy/planets",
                headers={
                    "Origin": origin,
                    "Access-Control-Request-Method": "GET",
                },
            )
            assert resp.status_code == 200
            assert resp.headers.get("access-control-allow-origin") == origin

        disallowed_resp = client.options(
            "/astronomy/planets",
            headers={
                "Origin": "http://untrusted-external-site.com",
                "Access-Control-Request-Method": "GET",
            },
        )
        assert disallowed_resp.headers.get("access-control-allow-origin") is None
