import java.util.*;

class Solution {
    public static void main(String args[]) {
        Scanner sc=new Scanner(System.in);
        
        ArrayList<String> strs=new ArrayList<>();
        HashSet<String> hash_strs=new HashSet<>();
        HashMap<String, Integer> str_freq=new HashMap<>();

        String temp;
        System.out.println("Enter 10 strings: ");
        for(int i=0; i<10; i++) {
            temp=sc.nextLine();
            strs.add(temp);
            hash_strs.add(temp);
            str_freq.put(temp, str_freq.getOrDefault(temp, 0)+1);
        }

        System.out.print("ArrayList: [");
        for(int i=0; i<10; i++) {
            if(i==9)
                System.out.print(strs.get(i)+"]");
            else
                System.out.print(strs.get(i)+", ");
        }
        System.out.println();
        
        System.out.print("HashSet: [");
        int hsCount = 0;
        int hsSize = hash_strs.size();
        for (String s : hash_strs) {
            hsCount++;
            if (hsCount == hsSize)
                System.out.print(s + "]");
            else
                System.out.print(s + ", ");
        }
        System.out.println();

        System.out.print("HashMap: {");
        int hmCount = 0;
        int hmSize = str_freq.size();
        for (Map.Entry<String, Integer> entry : str_freq.entrySet()) {
            hmCount++;
            if (hmCount == hmSize)
                System.out.print(entry.getKey() + "=" + entry.getValue() + "}");
            else
                System.out.print(entry.getKey() + "=" + entry.getValue() + ", ");
        }
        System.out.println();
    }
}