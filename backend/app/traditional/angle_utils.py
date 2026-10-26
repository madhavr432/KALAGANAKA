"""Utilities for normalizing and comparing angular measurements."""

import math


def normalize_angle(angle_degrees: float) -> float:
    """Normalize a finite angle to the interval [0, 360)."""
    if not math.isfinite(angle_degrees):
        raise ValueError("Angle must be a finite number.")

    return angle_degrees % 360.0


def signed_angular_difference(
    traditional_longitude: float,
    modern_longitude: float,
) -> float:
    """
    Return traditional minus modern longitude in [-180, 180).

    Both inputs must be finite angles in degrees.
    An exact 180-degree difference is represented as -180.
    """
    if not math.isfinite(traditional_longitude):
        raise ValueError("Traditional longitude must be finite.")

    if not math.isfinite(modern_longitude):
        raise ValueError("Modern longitude must be finite.")

    return (
        (traditional_longitude - modern_longitude + 180.0) % 360.0
    ) - 180.0
