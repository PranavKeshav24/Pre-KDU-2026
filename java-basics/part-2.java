import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Scanner;

// Task as a part of live coding session on 2025-12-01
class Ticket{
    String type;
    double price;
    char section;

    Ticket(String type, double price, char section){
        this.type=type;
        this.price=price;
        this.section=section;
    }

    public String getType(){
        return type;
    }

    public double getPrice(){
        return price;
    }

    public char getSection(){
        return section;
    }  

    @Override
    public int hashCode() {
        return type.hashCode();
    }

    @Override
    public boolean equals(Object o) {
        if (this==o) return true;
        if (!(o instanceof Ticket)) return false;
        Ticket t=(Ticket) o;
        return Double.compare(t.price, price)==0 &&
            section==t.section &&
            type.equals(t.type);
    }
}

class Solution {
    public static void main(String args[]) {
        try (Scanner sc = new Scanner(System.in)) {
            ArrayList<Ticket> strs=new ArrayList<>();
            HashSet<Ticket> hash_strs=new HashSet<>();        
            HashMap<Integer, Ticket> ticket_map=new HashMap<>();


            System.out.println("Enter ticket details (ID Type Price Section): ");
            for(int i=0; i<1; i++) {
                int id=sc.nextInt();
                String type=sc.next();
                double price=sc.nextDouble();
                char section=sc.next().charAt(0);
                Ticket ticket=new Ticket(type, price, section);
                ticket_map.put(id, ticket);    
                
                strs.add(ticket);
                if(!hash_strs.contains(ticket)) {
                    hash_strs.add(ticket);
                }
            }

            System.out.println("Tickets in ArrayList: ");
            for (Ticket t: strs) {
                System.out.println("Type: "+t.getType()+", Price: "+t.getPrice()+", Section: "+t.getSection());
            }

            System.out.println("Tickets in HashSet (unique types): ");
            for (Ticket t: hash_strs) {
                System.out.println("Type: "+t.getType()+", Price: "+t.getPrice()+", Section: "+t.getSection());
            }

            System.out.println("Tickets in HashMap: ");
            for (Map.Entry<Integer, Ticket> entry: ticket_map.entrySet()) {
                Ticket t=entry.getValue();
                System.out.println("ID: "+entry.getKey()+", Type: "+t.getType()+", Price: "+t.getPrice()+", Section: "+t.getSection());
            }

            System.out.println();
        } 
        catch (Exception e) {
            System.out.println("An error occurred: " + e.getMessage());
        }
    }
}