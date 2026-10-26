
"""Read-only lookup service for curated festival rules."""

import json
from pathlib import Path
from typing import Any


DATA_FILE = (
    Path(__file__).resolve().parents[1]
    / "knowledge"
    / "festival_rules.json"
)


def _load_dataset() -> dict[str, Any]:
    """Load and validate the basic dataset structure."""
    try:
        with DATA_FILE.open("r", encoding="utf-8") as file:
            dataset = json.load(file)
    except (OSError, json.JSONDecodeError) as exc:
        raise RuntimeError("Festival rules dataset could not be loaded.") from exc

    if not isinstance(dataset, dict) or not isinstance(
        dataset.get("festivals"), list
    ):
        raise RuntimeError("Festival rules dataset has an invalid structure.")

    return dataset


def list_festivals(region: str | None = None) -> dict[str, Any]:
    """Return festival rules, optionally filtered by region."""
    dataset = _load_dataset()
    festivals = dataset["festivals"]

    if region:
        requested_region = region.strip().casefold()
        festivals = [
            festival
            for festival in festivals
            if festival.get("region", "").casefold() in (
                requested_region,
                "all",
            )
        ]

    return {
        "dataset_version": dataset.get("dataset_version", "unknown"),
        "verification_status": dataset.get("verification_status", "unknown"),
        "count": len(festivals),
        "festivals": festivals,
        "notice": (
            "Rules are informational. Verify sources and regional conventions; "
            "this endpoint does not calculate festival dates."
        ),
    }


def get_festival(festival_id: str) -> dict[str, Any] | None:
    """Find a festival by its stable ID."""
    dataset = _load_dataset()
    for festival in dataset["festivals"]:
        if festival.get("id", "").casefold() == festival_id.casefold():
            return {
                "dataset_version": dataset.get("dataset_version", "unknown"),
                "festival": festival,
            }

    return None
