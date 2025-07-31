# 🔒 ArcanaPass - Stateless Password Generator

ArcanaPass is a deterministic password generator that creates unique, secure passwords for each website using only your master password, username, and site name. No password storage needed - the same inputs always generate the same password, making it impossible to lose your passwords.

It works like this:

- Combines master password + username + site name into one string
- Runs SHA-256 hash on the combined string
- Converts hash to hexadecimal (64 characters)
- Takes 16 chunks of 4 hex characters each
- Maps each chunk to alphanumeric characters (A-Z, a-z, 0-9)
- Creates 16-character base password
- Picks 2 special characters (!@#$%^&*) using different parts of the hash
- Inserts both special characters at calculated positions in the password
- Returns final 18-character password

## Result:
Same inputs = same password every time

Different inputs = completely different passwords