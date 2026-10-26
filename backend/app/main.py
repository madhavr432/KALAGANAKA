
"""FastAPI application entry point."""

from fastapi import FastAPI

from app.api.comparison import router as comparison_router
from app.api.traditional import router as traditional_router

app = FastAPI(
    title="KalaGanaka API",
    description="Traditional astronomy and planetary-position comparison.",
    version="0.1.0",
)

app.include_router(comparison_router)
app.include_router(traditional_router)


@app.get("/health", tags=["Health"])
def health_check() -> dict[str, str]:
    """Return a simple application health status."""
    return {"status": "ok"}
