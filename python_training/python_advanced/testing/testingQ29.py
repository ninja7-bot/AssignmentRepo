"""
- Write pytest test cases for a function that adds two numbers.
"""

import pytest

def add(a, b):
    return a + b

def test_add1():
    assert add(3, 5) == 8

def test_add2():
    assert add(3, -5) != 8

def test_add3():
    assert add(-3, 5) != 8

def test_add4():
    assert add(-1, 1) != -2

def test_add5():
    assert add(-1, 1) != 2
    
def test_add6():
    assert add(-1, 1) == 0
