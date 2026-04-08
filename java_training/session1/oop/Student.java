package oop;

class Student {
    String name;
    int rollNumber;
    double marks;
    
    Student(String n, int r, double m) {
        name = n;
        rollNumber = r;
        marks = m;
    }
    
    void display() {
        System.out.println("Name: " + name);
        System.out.println("Roll Number: " + rollNumber);
        System.out.println("Marks: " + marks);
    }
}

class StudentTest {
    public static void main(String[] args) {
        Student s1 = new Student("Dark", 101, 85.5);
        s1.display();
    }
}