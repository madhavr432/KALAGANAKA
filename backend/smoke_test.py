from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

tests = [
    ("POST", "/panchang/daily", {
        "date": "2026-10-29",
        "latitude": 23.2599,
        "longitude": 77.4126,
        "timezone": "Asia/Kolkata"
    }),
    ("POST", "/panchang/instant", {
        "instant": "2026-10-29T12:00:00+05:30",
        "timezone": "Asia/Kolkata"
    }),
    ("POST", "/panchang/next-transition", {
        "instant": "2026-10-29T12:00:00+05:30",
        "anga_type": "tithi",
        "timezone": "Asia/Kolkata"
    }),
    ("POST", "/panchang/transitions", {
        "start": "2026-10-29T00:00:00+05:30",
        "end": "2026-10-30T00:00:00+05:30",
        "timezone": "Asia/Kolkata",
        "limit": 20
    }),
    ("POST", "/solar/events", {
        "date": "2026-10-29",
        "latitude": 23.2599,
        "longitude": 77.4126,
        "timezone": "Asia/Kolkata"
    }),
    ("POST", "/solar/position", {
        "instant": "2026-10-29T12:00:00+05:30",
        "latitude": 23.2599,
        "longitude": 77.4126
    }),
]

for method, path, payload in tests:
    try:
        response = client.request(method, path, json=payload)
        print(f"\n{method} {path} -> HTTP {response.status_code}")
        print(response.text[:600])
    except Exception as exc:
        print(f"\n{method} {path} -> EXCEPTION: {exc}")

try:
    response = client.get(
        "/traditional/solar-position",
        params={"date": "2026-10-29"}
    )
    print(f"\nGET /traditional/solar-position -> HTTP {response.status_code}")
    print(response.text[:600])
except Exception as exc:
    print("\nTraditional endpoint exception:", exc)
