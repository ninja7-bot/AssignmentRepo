# Abstract Class vs Interface

## Abstract Class
An abstract class is a class that cannot be instantiated (you cannot create its object directly). It has to be inherited. It can contain:
- Abstract methods (without body)
- Non-abstract methods (with body)

**Example:**

```java
abstract class Animal {
    abstract void sound();
}
class Cat extends Animal {
    void sound() {
        System.out.println("Meow");
    }
}
```
In here, the abstract class Animal has an abstract method `sound()` which has been overridden by **Cat extending Animal**.

---

## Interface
An interface is a completely abstract structure used to define basically what a class should do, but not necessarily how to do it.
- All methods are abstract (by default)
- Variables are public, static, and final
- A class uses implements to use an interface

**Example:**

```java
interface Animal {
    void sound();
}
class Dog implements Animal {
    public void sound() {
        System.out.println("Bark");
    }
}
```
In here, interface Animal creates an abstract structure with a function `sound()` which needs to be present in the inherited class.

---

**Difference:**

| Abstract Class                       | Interface                       |
| ------------------------------------ | ------------------------------- |
| Can have abstract and normal methods | Methods are abstract by default |
| Uses `extends` keyword               | Uses `implements` keyword       |
| Can have constructors                | Cannot have constructors        |
| Supports single inheritance          | Supports multiple inheritance   |
| Can have instance variables          | Variables are static and final  |

---
