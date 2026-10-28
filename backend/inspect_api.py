from app.main import app
import json

schema = app.openapi()

for path in [
    "/panchang/daily",
    "/panchang/instant",
    "/panchang/next-transition",
    "/panchang/transitions",
    "/solar/events",
    "/solar/position",
    "/traditional/solar-position",
]:
    print("\n" + "=" * 60)
    print(path)

    for method, operation in schema["paths"][path].items():
        print("\nMETHOD:", method.upper())

        params = operation.get("parameters", [])
        if params:
            print("QUERY PARAMETERS:")
            for p in params:
                print(
                    p["name"],
                    "required =", p.get("required", False),
                    "schema =", p.get("schema", {})
                )

        body = operation.get("requestBody", {})
        if body:
            content = body.get("content", {}).get("application/json", {})
            ref = content.get("schema", {})
            print("REQUEST BODY SCHEMA:", json.dumps(ref, indent=2))

            if "$ref" in ref:
                name = ref["$ref"].split("/")[-1]
                print(
                    "MODEL:",
                    json.dumps(
                        schema.get("components", {}).get("schemas", {}).get(name, {}),
                        indent=2
                    )
                )
