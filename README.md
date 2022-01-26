# Lektion 26 januari

Uppdelning av kod - visuell överblick: https://www.figma.com/file/qKMDYtPl5DE3zm3zjFdCgm/Untitled?node-id=0%3A1

## Övningar

**Bcryptjs**

Fortsätt på er loginsida och gör om lösenorden hashas med bcryptjs och kontrolleras mot bcryptjs när man loggar in.

Lösenordet ska hashas när man skapar konto och hashen ska sparas med användaren i databasen. Använd `bcrypt.hash(password, saltRounds)`. 
Gör sedan om login-funktionen så du kontrollerar lösenordet med `bcrypt.compare(password, hash)` istället.

**Dela upp kod**
Träna på att dela upp din kod som det är gjort i mappen `login-page-roles-exercise`.

## Artiklar

Bcryptjs: https://www.npmjs.com/package/bcryptjs

## Videor

## Inspelningar

https://drive.google.com/drive/folders/1gYffunh3ffQeS39Xt7732F6JhgKvzP24?usp=sharing