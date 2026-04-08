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

class GraduateStudent extends Student {
    String researchArea;
    
    GraduateStudent(String n, int r, double m, String ra) {
        super(n, r, m);
        researchArea = ra;
    }
    
    void display() {
        super.display();
        System.out.println("Research Area: " + researchArea);
    }
}

class TestInheritance {
    public static void main(String[] args) {
        GraduateStudent gs = new GraduateStudent("Dark", 201, 86.5, "AI");
        gs.display();
    }
}