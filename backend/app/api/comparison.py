"""API endpoint for comparing traditional and modern planetary longitudes."""

from typing import Literal

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, ConfigDict, Field

from app.services.comparison_service import compare_planetary_positions

router = APIRouter(prefix="/comparison", tags=["Comparison"])


class ComparisonRequest(BaseModel):
    """Input data for comparing planetary longitudes."""

    model_config = ConfigDict(extra="forbid")

    traditional_positions: dict[str, float] = Field(
        description="Planet names mapped to traditional longitudes in degrees."
    )
    modern_positions: dict[str, float] = Field(
        description="Planet names mapped to modern longitudes in degrees."
    )
    traditional_method: str = Field(min_length=1)
    modern_method: str = Field(min_length=1)
    modern_data_source: Literal["mock", "provider"] = "mock"
    coordinate_system: str = Field(default="unspecified", min_length=1)
    instant: str | None = None


@router.post("/compare")
def compare_positions(request: ComparisonRequest) -> dict:
    """Compare matching planetary positions from two supplied datasets."""

    try:
        return compare_planetary_positions(
            traditional_positions=request.traditional_positions,
            modern_positions=request.modern_positions,
            traditional_method=request.traditional_method,
            modern_method=request.modern_method,
            modern_data_source=request.modern_data_source,
            coordinate_system=request.coordinate_system,
            instant=request.instant,
        )
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
