# Fototävlingen

En sida där medlemmar kan skapa konto, ladda upp foton till en tävling och rösta fram vinnaren.
Innehåller en administrativ sektion för att hantera medlemmar, tävlingar och rapporter över
avslutade tävlingar.

## Teknik

- [Next.js 16](https://nextjs.org/) (App Router, TypeScript, Server Actions)
- [Prisma ORM 7](https://www.prisma.io/) mot PostgreSQL
- [NextAuth v5](https://authjs.dev/) (Credentials-inloggning, lösenord hashas med bcrypt)
- Tailwind CSS
- Bilder sparas lokalt på disk i `public/uploads/`

## Kom igång

### 1. Skaffa en databas

Detta projekt är konfigurerat för PostgreSQL. Enklast är ett gratis projekt på
[neon.tech](https://neon.tech):

1. Skapa konto och nytt projekt på neon.tech
2. Kopiera connection-stringen (Dashboard → Connect)
3. Klistra in den som `DATABASE_URL` i `.env`

### 2. Installera beroenden

```bash
npm install
```

### 3. Konfigurera miljövariabler

`.env` finns redan med platshållarvärden. Uppdatera:

- `DATABASE_URL` — din Postgres connection-string
- `AUTH_SECRET` — genererad automatiskt, byt gärna ut i produktion

### 4. Skapa databastabeller

```bash
npm run db:migrate
```

### 5. Skapa första admin-kontot

```bash
ADMIN_EMAIL=din@epost.se ADMIN_NAME="Ditt namn" ADMIN_PASSWORD=ettSäkertLösenord npm run db:seed
```

Utan miljövariabler skapas `admin@example.com` med lösenordet `changeme123` — byt det direkt.

### 6. Starta utvecklingsservern

```bash
npm run dev
```

Öppna [http://localhost:3000](http://localhost:3000).

## Arbetsflöde för en tävling

Admin skapar en tävling under `/admin/contests` (status **Utkast**), och flyttar den sedan genom
stegen:

1. **Öppna för bidrag** — medlemmar kan ladda upp foton
2. **Starta röstning** — uppladdning stängs, medlemmar kan rösta (en röst per medlem, kan ändras)
3. **Avsluta tävling** — röstningen stängs, vinnaren (flest röster) visas publikt och i
   `/admin/reports`

## Övriga kommandon

```bash
npm run db:studio    # Bläddra i databasen visuellt
npm run lint         # Kör ESLint
```
