from app.main import app
from fastapi.routing import APIRoute
from fastapi.testclient import TestClient

client = TestClient(app)
response = client.get("/openapi.json")

print("OpenAPI status:", response.status_code)

if response.status_code == 200:
    schema = response.json()
    for path, methods in sorted(schema.get("paths", {}).items()):
        for method, details in methods.items():
            if method.lower() in {
                "get", "post", "put", "patch", "delete"
            }:
                print(
                    method.upper(),
                    path,
                    "->",
                    details.get("summary", "")
                )
else:
    print(response.text[:1000])
