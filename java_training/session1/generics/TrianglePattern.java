import java.util.Scanner;

public class TrianglePattern {
    public static void printTriangle(int rows) {
        System.out.println("\nTriangle:");
        for (int i = 1; i <= rows; i++) {
            for (int j = 1; j <= i; j++) {
                System.out.print("* ");
            }
            System.out.println();
        }
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("-----PATTERN TRIANGLE-----\n");

        System.out.print("Enter number of rows: ");
        int rows = sc.nextInt();

        printTriangle(rows);

        sc.close();
    }
}
