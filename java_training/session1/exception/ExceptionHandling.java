public class ExceptionHandling {
    public static void main(String[] args) {
        try {
            int result = 10 / 0;
        } catch (ArithmeticException e) {
            System.out.println("Error: Division by zero");
        }
        
        try {
            int x = 10 / 2;
            System.out.println("Result: " + x);
        } catch (Exception e) {
            System.out.println("Error");
        } finally {
            System.out.println("Finally block always runs");
        }
    }
}