import java.util.Scanner;

public class AreaCalculator {

    public static double areaCircle(double radius) {
        return 3.14 * radius * radius;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        System.out.println("-----AREA PROGRAM-----");

        System.out.print("Enter radius: ");
        double radius = sc.nextDouble();

        double area = areaCircle(radius);

        System.out.println("Area of Circle: " + area);
    }
}