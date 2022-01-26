# Lektion 26 januari

## Övningar

**Bcryptjs**

Fortsätt på er loginsida och gör om lösenorden hashas med bcryptjs och kontrolleras mot bcryptjs när man loggar in.

Lösenordet ska hashas när man skapar konto och hashen ska sparas med användaren i databasen. Använd `bcrypt.hash(password, saltRounds)`. 
Gör sedan om login-funktionen så du kontrollerar lösenordet med `bcrypt.compare(password, hash)` istället.

## Artiklar

Bcryptjs: https://www.npmjs.com/package/bcryptjs

## Videor

## Inspelningar
