import math
import unittest

from app.traditional.angle_utils import (
    normalize_angle,
    signed_angular_difference,
)


class TestNormalizeAngle(unittest.TestCase):
    def test_zero(self):
        self.assertEqual(normalize_angle(0), 0)

    def test_full_rotation(self):
        self.assertEqual(normalize_angle(360), 0)

    def test_multiple_rotations(self):
        self.assertEqual(normalize_angle(720), 0)

    def test_negative_angle(self):
        self.assertEqual(normalize_angle(-10), 350)

    def test_fractional_angle(self):
        self.assertAlmostEqual(normalize_angle(361.5), 1.5)

    def test_non_finite_angle_raises(self):
        for value in (math.nan, math.inf, -math.inf):
            with self.subTest(value=value):
                with self.assertRaises(ValueError):
                    normalize_angle(value)


class TestSignedAngularDifference(unittest.TestCase):
    def test_crossing_zero_forward(self):
        self.assertAlmostEqual(
            signed_angular_difference(1, 359), 2
        )

    def test_crossing_zero_backward(self):
        self.assertAlmostEqual(
            signed_angular_difference(359, 1), -2
        )

    def test_equal_angles(self):
        self.assertAlmostEqual(
            signed_angular_difference(120, 120), 0
        )

    def test_opposite_angles(self):
        self.assertAlmostEqual(
            signed_angular_difference(180, 0), -180
        )

    def test_non_finite_input_raises(self):
        for values in (
            (math.nan, 0),
            (0, math.inf),
            (-math.inf, 0),
        ):
            with self.subTest(values=values):
                with self.assertRaises(ValueError):
                    signed_angular_difference(*values)


if __name__ == "__main__":
    unittest.main()
