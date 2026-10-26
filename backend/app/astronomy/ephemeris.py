"""Ephemeris loader and timescale management with predictable local caching."""

import os
from pathlib import Path
from typing import Any

from skyfield.api import Loader
from skyfield.jpllib import SpiceKernel
from skyfield.timelib import Timescale

_LOADED_KERNELS: dict[str, SpiceKernel] = {}
_TIMESCALE: Timescale | None = None


class EphemerisError(Exception):
    """Base exception for ephemeris-related issues."""


class EphemerisNotFoundError(EphemerisError):
    """Raised when the requested ephemeris data file cannot be found."""


class EphemerisLoadError(EphemerisError):
    """Raised when loading the ephemeris data fails."""


class DateOutOfRangeError(EphemerisError):
    """Raised when a requested date falls outside ephemeris coverage."""


def get_ephemeris_dir() -> Path:
    """Return the configured or default directory path for caching ephemeris files."""
    env_dir = os.environ.get("KALAGANAKA_EPHEMERIS_DIR")
    if env_dir:
        path = Path(env_dir).resolve()
    else:
        # Default: backend/data/ephemeris relative to this repository
        base_dir = Path(__file__).resolve().parent.parent.parent
        path = (base_dir / "data" / "ephemeris").resolve()

    path.mkdir(parents=True, exist_ok=True)
    return path


def get_timescale() -> Timescale:
    """Return a Skyfield Timescale instance using built-in offline delta_t tables."""
    global _TIMESCALE
    if _TIMESCALE is None:
        ephem_dir = get_ephemeris_dir()
        loader = Loader(str(ephem_dir), expire=False)
        _TIMESCALE = loader.timescale(builtin=True)
    return _TIMESCALE


def load_ephemeris(
    filename: str = "de421.bsp",
    *,
    auto_download: bool = True,
) -> SpiceKernel:
    """
    Load a JPL SPICE ephemeris kernel from the local cache directory.

    If auto_download is False and the file does not exist locally,
    EphemerisNotFoundError is raised without triggering network requests.
    """
    ephem_dir = get_ephemeris_dir()
    file_path = ephem_dir / filename
    cache_key = str(file_path.resolve())

    if cache_key in _LOADED_KERNELS:
        return _LOADED_KERNELS[cache_key]

    if not file_path.is_file():
        if not auto_download:
            raise EphemerisNotFoundError(
                f"Ephemeris data file '{filename}' was not found in cache directory "
                f"'{ephem_dir}'. Please download '{filename}' or enable auto_download."
            )

    try:
        loader = Loader(str(ephem_dir), expire=False)
        kernel = loader(filename)
        _LOADED_KERNELS[cache_key] = kernel
        return kernel
    except Exception as exc:
        raise EphemerisLoadError(
            f"Failed to load ephemeris '{filename}' from '{ephem_dir}': {exc}"
        ) from exc


def clear_ephemeris_cache() -> None:
    """Clear in-memory cached kernels and timescale (primarily for testing)."""
    global _LOADED_KERNELS, _TIMESCALE
    _LOADED_KERNELS.clear()
    _TIMESCALE = None
