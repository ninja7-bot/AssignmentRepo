# Java Data Types: Primitive and Non-Primitive

In Java, data types are of two categories: **primitive** and **non-primitive** data types.

---

### 1. Primitive Data Types

Primitive data types are the most basic types of data in Java. They store simple values directly and do not have methods or additional features.

There are eight primitive data types in Java:

* `int` – stores whole numbers (e.g., 10, -5)
* `float` – stores decimal numbers (e.g., 3.14)
* `double` – stores larger decimal numbers (e.g., 3.14159999)
* `char` – stores a single character (e.g., 'A')
* `boolean` – stores true or false values
* `byte` – stores small integers
* `short` – stores medium-range integers
* `long` – stores large integers

**Example:**

```java
int num = 10;
double cost = 99.99;
char grade = 'A';
boolean bool = true;
```

---

### 2. Non-Primitive Data Types

Non-primitive data types store references (addresses) to the actual data rather than the data itself. They are more complex and can store multiple values or behaviors.

Common examples include:

* `String` – stores sequences of characters
* Arrays – store multiple values of the same type
* Classes and Objects – used to create user-defined data types

**Example:**

```java
String name = "Dark";
int[] numbers = {1, 2, 3, 4};
```

---

### Difference Between Primitive and Non-Primitive Data Types

| Primitive Data Types       | Non-Primitive Data Types                        |
| -------------------------- | ----------------------------------------------- |
| Store actual values        | Store reference to data                         |
| Predefined in Java         | Created by the programmer or predefined classes |
| Fixed size                 | Can vary in size                                |
| Do not have methods        | Can have methods and properties                 |
| Example: int, double, char | Example: String, arrays, objects                |

---

