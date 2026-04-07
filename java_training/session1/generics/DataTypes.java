public class DataTypes {
    public static void main(String[] args) {
        // Primitive Data Types
        System.out.println("----- Primitive Data Types -----");
        
        int age = 25;
        double salary = 50000.50;
        char grade = 'A';
        boolean isStudent = true;
        
        System.out.println("int age = " + age);
        System.out.println("double salary: " + salary);
        System.out.println("char grade: " + grade);
        System.out.println("boolean isStudent: " + isStudent);
        
        // Non-Primitive Data Types
        System.out.println("\n----- Reference Data Types -----");
        
        String name = "Dark";
        int[] marks = {85, 90, 78};
        
        System.out.println("String name: " + name);
        System.out.print("int[] marks: ");
        for (int i = 0; i < marks.length; i++) {
            System.out.print(marks[i] + " ");
        }
        
        System.out.println("\n\n----- Difference -----");
        int x = 10;
        int y = x;
        y = 20;
        System.out.println("Primitive: x = " + x + ", y = " + y);
    }
}