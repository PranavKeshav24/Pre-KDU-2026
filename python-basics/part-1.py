# Part of live coding session on 2025-12-01
def validate_password(password):
    if len(password) < 8:
        return False
    if not any(char.isdigit() for char in password):
        return False
    if not any(char.isupper() for char in password):
        return False
    if not any(char.islower() for char in password):
        return False
    return True

def main():
    first_string = input("Enter the first string: ")
    second_string = input("Enter the second string: ")
    
    if not validate_password(first_string) or not validate_password(second_string):
        print("Passwords must be at least 8 characters long, contain at least one digit, one uppercase letter, and one lowercase letter.")
        return
    
    length1 = len(first_string)
    length2 = len(second_string)

    print(f"Length 1: {length1}")  
    print(f"Length 2: {length2}")  

    print(f"Lengths match: {length1 == length2}")  
    print(f"strings match: {first_string == second_string}")  

if __name__=="__main__":
    main()

# Feedback received:
# Maintain a trace of all errors and then throw an exception at the end
# Add validation to ensure that the user inputs non-empty strings and that passwords have a validation check.
# Modularize it further with functions, splitting the responsibilities.