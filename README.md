## About

This project uses:

- Next.js
- Tailwind CSS with Shadcn UI
- Tremor for the bar lines
- Prisma
- PostgreSQL
- Docker

## Requirements

- Docker
- Node.js
- bun (optional). It's just so much faster to install deps with bun.

## Getting Started

First install the dependencies:

```bash
npm install
# or
bun install
```

Then run the postgres database:

```bash
cd dev && docker-compose up
```

Then open a new tab and copy the `env.example` file to `.env`. You probably need to run the database migrations:

```bash
npm run db:migrate:dev
```

Last, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

To seed the database, run:

```bash
curl -X POST 'http://localhost:3000/seed/insert' --header "Authorization: Basic $(echo -n 'username:password' | base64)"
```

Replace `username` and `password` with the values of `BASIC_AUTH_USER` and `BASIC_AUTH_PASSWORD` in your `.env` file.

To reset the database, run

```bash
npm run db:reset
```

To create all materialized views, run

```bash
curl  -X POST 'http://localhost:3000/cron' --header "Authorization: Basic $(echo -n 'username:password' | base64)"
```

Replace `username` and `password` with the values of `BASIC_AUTH_USER` and `BASIC_AUTH_PASSWORD` in your `.env` file. Please read /app/cron/route.ts for more details.
