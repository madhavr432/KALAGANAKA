
"""Multi-provider AI service: OpenRouter -> Google Gemini fallback."""

import logging
import os

from dotenv import load_dotenv
from google import genai
from google.genai import types
from openai import OpenAI

load_dotenv()

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """
You are KalaGanaka's bilingual assistant for traditional Indian astronomy,
Sanskrit mathematical traditions and Panchang concepts.

Answer in the requested language. Explain technical concepts clearly.
Distinguish established facts from interpretations and unverified claims.
Never invent citations, astronomical calculations, or festival dates.
Numerical astronomy questions should use verified deterministic backend
results when provided. If reliable information is unavailable, say so.
"""


def _ask_openrouter(question: str, language: str) -> tuple[str, str]:
    """Primary provider: OpenRouter."""
    client = OpenAI(
        api_key=os.environ["OPENROUTER_API_KEY"],
        base_url="https://openrouter.ai/api/v1",
        timeout=30.0,
        max_retries=0,
    )

    model = os.getenv(
        "OPENROUTER_MODEL",
        "google/gemini-3.8-flash",
    )

    response = client.chat.completions.create(
        model=model,
        messages=[
            {
                "role": "system",
                "content": f"{SYSTEM_PROMPT}\nRequested language: {language}.",
            },
            {"role": "user", "content": question},
        ],
        max_tokens=2048,
    )

    answer = (response.choices[0].message.content or "").strip()
    if not answer:
        raise RuntimeError("Empty response")

    return answer, response.model or model


def _ask_gemini(question: str, language: str) -> tuple[str, str]:
    """Fallback provider: Google Gemini."""
    client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])

    model = os.getenv("GEMINI_MODEL", "gemini-3.8-flash")
    response = client.models.generate_content(
        model=model,
        contents=question,
        config=types.GenerateContentConfig(
            system_instruction=f"{SYSTEM_PROMPT}\nRequested language: {language}.",
            max_output_tokens=2048,
        ),
    )

    answer = (response.text or "").strip()
    if not answer:
        raise RuntimeError("Empty response")

    return answer, model


PROVIDERS = (
    ("openrouter", "OPENROUTER_API_KEY", _ask_openrouter),
    ("gemini", "GEMINI_API_KEY", _ask_gemini),
)


def generate_answer(question: str, language: str = "auto") -> dict:
    """
    Try OpenRouter first, then Gemini.

    Missing keys skip that provider. API errors and empty responses trigger
    fallback. Credentials and raw upstream errors are never returned.
    """
    configured_count = 0

    for provider_name, key_name, provider_function in PROVIDERS:
        if not os.getenv(key_name):
            logger.info("Skipping %s: API key is not configured", provider_name)
            continue

        configured_count += 1

        try:
            answer, model = provider_function(question, language)

            return {
                "answer": answer,
                "provider": provider_name,
                "model": model,
                "fallback_used": provider_name == "gemini",
            }

        except Exception as exc:
            logger.warning(
                "Provider %s failed (%s); trying next provider",
                provider_name,
                type(exc).__name__,
            )

    if configured_count == 0:
        raise RuntimeError(
            "No AI providers are configured. Add at least one provider API key."
        )

    raise RuntimeError(
        "All configured AI providers failed. Please try again later."
    )
