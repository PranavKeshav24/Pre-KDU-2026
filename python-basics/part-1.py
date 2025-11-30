def main():
    first_string = input("Enter the first string: ")
    second_string = input("Enter the second string: ")

    length1 = len(first_string)
    length2 = len(second_string)

    print(f"Length 1: {length1}")  
    print(f"Length 2: {length2}")  

    print(f"Lengths match: {length1 == length2}")  
    print(f"strings match: {first_string == second_string}")  

if __name__=="__main__":
    main()
