
"""Unit tests for KalaGanaka's multi-provider fallback logic."""

import os
import unittest
from unittest.mock import Mock, patch

from app.services import grok_service


class TestGenerateAnswer(unittest.TestCase):

    def setUp(self):
        self.grok = Mock(return_value=("Grok answer", "grok-test"))
        self.gemini = Mock(return_value=("Gemini answer", "gemini-test"))
        self.openrouter = Mock(
            return_value=("OpenRouter answer", "openrouter-test")
        )

        self.providers = (
            ("grok", "XAI_API_KEY", self.grok),
            ("gemini", "GEMINI_API_KEY", self.gemini),
            ("openrouter", "OPENROUTER_API_KEY", self.openrouter),
        )

        self.provider_patch = patch.object(
            grok_service, "PROVIDERS", self.providers
        )
        self.provider_patch.start()
        self.addCleanup(self.provider_patch.stop)

        self.env_patch = patch.dict(
            os.environ,
            {
                "XAI_API_KEY": "test-grok-key",
                "GEMINI_API_KEY": "test-gemini-key",
                "OPENROUTER_API_KEY": "test-openrouter-key",
            },
            clear=True,
        )
        self.env_patch.start()
        self.addCleanup(self.env_patch.stop)

    def test_grok_success_does_not_call_fallbacks(self):
        result = grok_service.generate_answer("Hello")

        self.assertEqual(result["provider"], "grok")
        self.assertEqual(result["answer"], "Grok answer")
        self.assertFalse(result["fallback_used"])

        self.grok.assert_called_once_with("Hello", "auto")
        self.gemini.assert_not_called()
        self.openrouter.assert_not_called()

    def test_gemini_is_used_when_grok_fails(self):
        self.grok.side_effect = RuntimeError("Simulated Grok failure")

        result = grok_service.generate_answer("Hello", "english")

        self.assertEqual(result["provider"], "gemini")
        self.assertEqual(result["answer"], "Gemini answer")
        self.assertTrue(result["fallback_used"])

        self.grok.assert_called_once_with("Hello", "english")
        self.gemini.assert_called_once_with("Hello", "english")
        self.openrouter.assert_not_called()

    def test_openrouter_is_used_when_first_two_fail(self):
        self.grok.side_effect = RuntimeError("Simulated Grok failure")
        self.gemini.side_effect = RuntimeError("Simulated Gemini failure")

        result = grok_service.generate_answer("Hello", "hindi")

        self.assertEqual(result["provider"], "openrouter")
        self.assertEqual(result["answer"], "OpenRouter answer")
        self.assertTrue(result["fallback_used"])

        self.grok.assert_called_once()
        self.gemini.assert_called_once()
        self.openrouter.assert_called_once_with("Hello", "hindi")

    def test_missing_keys_skip_unconfigured_providers(self):
        with patch.dict(
            os.environ,
            {"GEMINI_API_KEY": "test-gemini-key"},
            clear=True,
        ):
            result = grok_service.generate_answer("Hello")

        self.assertEqual(result["provider"], "gemini")
        self.assertTrue(result["fallback_used"])
        self.grok.assert_not_called()
        self.gemini.assert_called_once()
        self.openrouter.assert_not_called()

    def test_no_keys_raises_configuration_error(self):
        with patch.dict(os.environ, {}, clear=True):
            with self.assertRaisesRegex(
                RuntimeError, "No AI providers are configured"
            ):
                grok_service.generate_answer("Hello")

        self.grok.assert_not_called()
        self.gemini.assert_not_called()
        self.openrouter.assert_not_called()

    def test_all_providers_failing_raises_safe_error(self):
        self.grok.side_effect = RuntimeError("Private upstream detail")
        self.gemini.side_effect = RuntimeError("Private upstream detail")
        self.openrouter.side_effect = RuntimeError("Private upstream detail")

        with self.assertRaisesRegex(
            RuntimeError, "All configured AI providers failed"
        ):
            grok_service.generate_answer("Hello")

        self.grok.assert_called_once()
        self.gemini.assert_called_once()
        self.openrouter.assert_called_once()


if __name__ == "__main__":
    unittest.main()
