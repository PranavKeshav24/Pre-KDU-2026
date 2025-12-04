import java.util.Scanner;

class Solution {
    static boolean validateUsername(String username) {
        return username.length() >= 5;
    }

    public static void main(String args[]) {
        try (Scanner sc=new Scanner(System.in)) {
            String username, confirmation;

            System.out.println("Enter the username: ");
            username=sc.nextLine();
            if(!validateUsername(username)) {
                System.out.println("Invalid username. It must be at least 5 characters long.");
                sc.close();
                return;
            }

            System.out.println("Re-enter the username for confirmation: ");
            confirmation=sc.nextLine();

            int lenUsername=username.length();
            int lenConfirmation=confirmation.length();

            System.out.println("Length 1: "+lenUsername);
            System.out.println("Length 2: "+lenConfirmation);

            System.out.println("Lengths match: "+(lenUsername==lenConfirmation));
            System.out.println("Strings match: "+username.equals(confirmation));
        } catch (Exception e) {
            System.out.println("An error occurred: " + e.getMessage());        
        }
    }
}

// Feedback received:
// Add Validation to the usernames
// Include a try catch to handle automatic closure of objects