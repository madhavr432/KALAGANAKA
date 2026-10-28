/**
 * Utility functions for formatting angles, coordinates, altitude, and azimuth.
 */

export function formatDegrees(deg: number, precision = 2): string {
  if (isNaN(deg)) return "--°";
  return `${deg.toFixed(precision)}°`;
}

export function formatDMS(deg: number): string {
  if (isNaN(deg)) return "--° --' --\"";
  const absolute = Math.abs(deg);
  const d = Math.floor(absolute);
  const minFloat = (absolute - d) * 60;
  const m = Math.floor(minFloat);
  const s = Math.round((minFloat - m) * 60);

  const sign = deg < 0 ? "-" : "";
  return `${sign}${d}° ${m}' ${s}"`;
}

export function formatLatitude(lat: number): string {
  const dir = lat >= 0 ? "N" : "S";
  return `${Math.abs(lat).toFixed(4)}° ${dir}`;
}

export function formatLongitude(lon: number): string {
  const dir = lon >= 0 ? "E" : "W";
  return `${Math.abs(lon).toFixed(4)}° ${dir}`;
}

export function getAzimuthDirection(azimuthDeg: number): string {
  const normalized = ((azimuthDeg % 360) + 360) % 360;
  const directions = [
    { label: "N", min: 348.75, max: 11.25 },
    { label: "NNE", min: 11.25, max: 33.75 },
    { label: "NE", min: 33.75, max: 56.25 },
    { label: "ENE", min: 56.25, max: 78.75 },
    { label: "E", min: 78.75, max: 101.25 },
    { label: "ESE", min: 101.25, max: 123.75 },
    { label: "SE", min: 123.75, max: 146.25 },
    { label: "SSE", min: 146.25, max: 168.75 },
    { label: "S", min: 168.75, max: 191.25 },
    { label: "SSW", min: 191.25, max: 213.75 },
    { label: "SW", min: 213.75, max: 236.25 },
    { label: "WSW", min: 236.25, max: 258.75 },
    { label: "W", min: 258.75, max: 281.25 },
    { label: "WNW", min: 281.25, max: 303.75 },
    { label: "NW", min: 303.75, max: 326.25 },
    { label: "NNW", min: 326.25, max: 348.75 },
  ];

  if (normalized >= 348.75 || normalized < 11.25) return "N";
  for (const dir of directions) {
    if (normalized >= dir.min && normalized < dir.max) {
      return dir.label;
    }
  }
  return "N";
}
