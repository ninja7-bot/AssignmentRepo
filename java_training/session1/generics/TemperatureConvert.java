import java.util.Scanner;

public class TemperatureConvert {
    public static void celsToFarh (double temp){
        double res = (temp * 9/5) + 32;
        System.out.print(temp + "°C = " + res + "°F");
    }

    public static void farhToCels (double temp){
        double res = (temp - 32) * 5/9;
        System.out.print(temp + "°F = " + res + "°C");
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.println("----- Temperature Convert -----");
        
        System.out.println("1. Celsius to Fahrenheit");
        System.out.println("2. Fahrenheit to Celsius");
        System.out.print("Enter choice: ");
        int choice = sc.nextInt();
        
        if (choice == 1) {
            System.out.print("Enter Celsius: ");
            double c = sc.nextDouble();
            celsToFarh(c);  
        } else if (choice == 2) {
            System.out.print("Enter Fahrenheit: ");
            double f = sc.nextDouble();
            farhToCels(f);
        } else {
            System.out.print("Wrong Choice");   
        }
    }
}