
"""KalaGanaka AI assistant API with automatic provider fallback."""

import logging
from typing import Literal

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.services.ai_service import generate_answer

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/assistant", tags=["Assistant"])


class ChatRequest(BaseModel):
    question: str = Field(min_length=1, max_length=4000)
    language: Literal["auto", "english", "hindi"] = "auto"


class ChatResponse(BaseModel):
    answer: str
    model: str
    provider: str
    fallback_used: bool


@router.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest) -> ChatResponse:
    """Return an answer from Grok, Gemini, or OpenRouter."""
    question = request.question.strip()

    if not question:
        raise HTTPException(
            status_code=422,
            detail="Question cannot be empty.",
        )

    try:
        result = generate_answer(
            question=question,
            language=request.language,
        )
        return ChatResponse(**result)

    except RuntimeError as exc:
        # Safe, intentional configuration/provider errors.
        raise HTTPException(status_code=503, detail=str(exc)) from exc

    except Exception as exc:
        # Never expose upstream API details to the client.
        logger.error("Assistant request failed: %s", type(exc).__name__)
        raise HTTPException(
            status_code=502,
            detail="The AI assistant could not complete the request.",
        ) from exc
