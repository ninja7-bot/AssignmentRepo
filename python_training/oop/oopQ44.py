"""
44. Demonstrate polymorphism using different classes with the same method name.
"""

class Dog:
    def sound(self):
        return "Woof!"

class Cat:
    def sound(self):
        return "Meow!"
    
class Cow:
    def sound(self):
        return "Moo!"

animals = [Dog(), Cat(), Cow()]
for animal in animals:
    print(animal.sound())