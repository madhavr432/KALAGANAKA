
import unittest

from fastapi.testclient import TestClient

from app.main import app
from app.services.festival_service import get_festival, list_festivals


class TestFestivalService(unittest.TestCase):

    def test_list_returns_festival_records(self):
        result = list_festivals()

        self.assertGreater(result["count"], 0)
        self.assertEqual(result["count"], len(result["festivals"]))
        self.assertIn("dataset_version", result)

    def test_rules_are_marked_for_verification(self):
        result = list_festivals()

        self.assertEqual(
            result["verification_status"],
            "draft_needs_source_verification",
        )
        for festival in result["festivals"]:
            self.assertEqual(
                festival["verification_status"],
                "needs_verification",
            )

    def test_known_festival_can_be_found(self):
        result = get_festival("diwali")

        self.assertIsNotNone(result)
        self.assertEqual(result["festival"]["id"], "diwali")

    def test_festival_lookup_is_case_insensitive(self):
        result = get_festival("DIWALI")

        self.assertIsNotNone(result)

    def test_unknown_festival_returns_none(self):
        self.assertIsNone(get_festival("not-a-real-festival"))

    def test_region_filter_returns_matching_region(self):
        result = list_festivals(region="India")

        self.assertGreater(result["count"], 0)
        for festival in result["festivals"]:
            self.assertEqual(festival["region"], "India")


class TestFestivalAPI(unittest.TestCase):

    def setUp(self):
        self.client = TestClient(app)

    def test_list_endpoint(self):
        response = self.client.get("/festivals")

        self.assertEqual(response.status_code, 200)
        self.assertIn("festivals", response.json())

    def test_detail_endpoint(self):
        response = self.client.get("/festivals/diwali")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["festival"]["id"], "diwali")

    def test_unknown_festival_returns_404(self):
        response = self.client.get("/festivals/not-a-real-festival")

        self.assertEqual(response.status_code, 404)


if __name__ == "__main__":
    unittest.main()

