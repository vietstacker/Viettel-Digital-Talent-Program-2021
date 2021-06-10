from main import Rectangle
import pytest


def test_get_area():
    assert Rectangle(6, 9).get_area() == 54


def test_get_perimeter():
    assert Rectangle(6, 9).get_perimeter() == 30
