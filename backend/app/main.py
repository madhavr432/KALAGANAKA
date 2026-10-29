
"""FastAPI application entry point."""

from fastapi import FastAPI
from app.api.assistant import router as assistant_router

from fastapi.middleware.cors import CORSMiddleware

from app.api.astronomy import router as astronomy_router
from app.api.comparison import router as comparison_router
from app.api.panchang import router as panchang_router
from app.api.solar import router as solar_router
from app.api.traditional import router as traditional_router
from app.api.festivals import router as festivals_router
from app.api.daily_panchang import router as daily_panchang_router

app = FastAPI(
    title="KalaGanaka API",
    description="Traditional astronomy and planetary-position comparison.",
    version="0.1.0",
)

# Development CORS: allow any port on localhost / 127.0.0.1.
# Vite may start on 5173, 5174, 4173, 8080, etc. depending on availability.
# Using allow_origin_regex avoids maintaining an explicit port list.

# CORS configuration for local development and production
_ALLOWED_ORIGINS = [
    "https://kalaganaka.vercel.app",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=_ALLOWED_ORIGINS,
    allow_origin_regex=r"^https?://(localhost|127\.0\.0\.1)(:\d+)?$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(comparison_router)
app.include_router(traditional_router)
app.include_router(assistant_router)
app.include_router(festivals_router)
app.include_router(astronomy_router)
app.include_router(solar_router)
app.include_router(panchang_router)
app.include_router(daily_panchang_router)


@app.get("/health", tags=["Health"])
def health_check() -> dict[str, str]:
    """Return a simple application health status."""
    return {"status": "ok"}
