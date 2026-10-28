
"""Unit tests for KalaGanaka's multi-provider fallback logic."""

import unittest
from unittest.mock import patch
from app.services import ai_service


class TestGenerateAnswer(unittest.TestCase):
    def setUp(self):
        self.providers = (
            ("openrouter", "OPENROUTER_API_KEY", None),
            ("gemini", "GEMINI_API_KEY", None),
        )

        self.providers_patch = patch.object(
            ai_service, "PROVIDERS", self.providers
        )
        self.providers_patch.start()
        self.addCleanup(self.providers_patch.stop)

        self.env_patch = patch.dict(
            "os.environ",
            {
                "OPENROUTER_API_KEY": "test-openrouter-key",
                "GEMINI_API_KEY": "test-gemini-key",
            },
            clear=True,
        )
        self.env_patch.start()
        self.addCleanup(self.env_patch.stop)

    def test_openrouter_success_does_not_call_fallbacks(self):
        providers = (
            ("openrouter", "OPENROUTER_API_KEY",
            lambda q, lang: ("Primary answer", "openrouter-model")),
            ("gemini", "GEMINI_API_KEY",
            lambda q, lang: self.fail("Gemini should not be called")),
        )

        with patch.object(ai_service, "PROVIDERS", providers):
            result = ai_service.generate_answer("Test question")

        self.assertEqual(result["provider"], "openrouter")
        self.assertEqual(result["answer"], "Primary answer")
        self.assertFalse(result["fallback_used"])

    def test_gemini_is_used_when_openrouter_fails(self):
        def fail_openrouter(question, language):
            raise RuntimeError("OpenRouter unavailable")

        providers = (
            ("openrouter", "OPENROUTER_API_KEY", fail_openrouter),
            ("gemini", "GEMINI_API_KEY",
            lambda q, lang: ("Fallback answer", "gemini-model")),
        )

        with patch.object(ai_service, "PROVIDERS", providers):
            result = ai_service.generate_answer("Test question")

        self.assertEqual(result["provider"], "gemini")
        self.assertEqual(result["answer"], "Fallback answer")
        self.assertTrue(result["fallback_used"])

    def test_missing_keys_skip_unconfigured_providers(self):
        with patch.dict("os.environ", {}, clear=True), patch.object(
            ai_service, "_ask_openrouter"
        ) as openrouter, patch.object(
            ai_service, "_ask_gemini"
        ) as gemini:
            with self.assertRaisesRegex(
                RuntimeError, "No AI providers are configured"
            ):
                ai_service.generate_answer("Test question")

        openrouter.assert_not_called()
        gemini.assert_not_called()

    def test_no_keys_raises_configuration_error(self):
        with patch.dict("os.environ", {}, clear=True):
            with self.assertRaisesRegex(
                RuntimeError, "No AI providers are configured"
            ):
                ai_service.generate_answer("Test question")

    def test_all_providers_failing_raises_safe_error(self):
        with patch.object(
            ai_service, "_ask_openrouter",
            side_effect=RuntimeError("OpenRouter unavailable"),
        ), patch.object(
            ai_service, "_ask_gemini",
            side_effect=RuntimeError("Gemini unavailable"),
        ):
            with self.assertRaisesRegex(
                RuntimeError, "All configured AI providers failed"
            ):
                ai_service.generate_answer("Test question")


if __name__ == "__main__":
    unittest.main()

