# Encapsulation in Java

Encapsulation is the concept of **wrapping data (variables) and methods (functions) together in a single unit (class)** and **restricting direct access to the data**. The data is accessed through controlled methods.

* Data is kept **private**
* Access is provided through **public methods (getters and setters)**

---

### Uses

* Protects data from unauthorized access
* Improves security
* Makes code more organized and maintainable

---

### Example

```java
class Student {
    private int marks;   // private data

    // Setter method
    public void setMarks(int m) {
        marks = m;
    }

    // Getter method
    public int getMarks() {
        return marks;
    }
}

public class Main {
    public static void main(String[] args) {
        Student s = new Student();

        s.setMarks(85);   // setting value using method
        System.out.println("Marks: " + s.getMarks());  // accessing value
    }
}
```

---

### **Explanation**

* The variable `marks` is **private**, so it cannot be accessed directly.
* The methods `setMarks()` and `getMarks()` are used to **modify and access** the data.
* This ensures that the data is **controlled and safe**.

---