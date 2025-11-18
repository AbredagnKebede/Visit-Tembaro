# Visit Tembaro

Tourism website for Tembaro Special Wereda, Southern Ethiopia.

## Run with Docker

```bash
docker compose up --build
```

Then open [http://localhost:3000](http://localhost:3000).

**Required environment (optional override):** Create a `.env` file or set:

- `NEXTAUTH_SECRET` – required for production; use a strong random string.

Default seed admin user (after first run with DB):

- Email: `admin@visit-tembaro.local`
- Password: `Admin123!`

Override with `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD` when running the seed.

## Run locally (without Docker)

1. Copy `.env.example` to `.env` and set `DATABASE_URL`, `NEXTAUTH_URL`, `NEXTAUTH_SECRET`.
2. Start PostgreSQL and run:

```bash
npm install
npx prisma migrate deploy
npm run db:seed
npm run build
npm start
```

Development:

```bash
npm run dev
```
