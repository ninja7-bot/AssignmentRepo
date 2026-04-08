import java.io.*;

public class FileHandling {
    public static void main(String[] args) {
        try {
            FileWriter writer = new FileWriter("test.txt");
            writer.write("Test Text file created using Java Input/Output Package.\n");
            writer.close();
            System.out.println("Written Operation Complete.");
        } catch (IOException e) {
            System.out.println("Error writing file.");
        }
        
        try {
            BufferedReader reader = new BufferedReader(new FileReader("test.txt"));
            String line;
            System.out.println("\nReading file:");
            while ((line = reader.readLine()) != null) {
                System.out.println(line);
            }
            reader.close();
        } catch (IOException e) {
            System.out.println("Error reading file");
        }
    }
}