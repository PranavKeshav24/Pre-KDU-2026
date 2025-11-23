def main():
    first_string=input("Enter the first string: ")
    second_string=input("Enter the second string: ")

    length1=len(first_string)
    length2=len(second_string)

    print("Length 1: ", length1)
    print("Length 2: ", length2)

    print("Lengths match: ", length1==length2)
    print("strings match: ", first_string==second_string)

if __name__=="__main__":
    main()