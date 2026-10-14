# EstatePro

EstatePro is a Nigerian real estate marketplace built as a TypeScript monorepo. The Next.js client is in `/client`; the Express REST API and Prisma database package are in `/server`.

## Stack

- Next.js App Router, React, TypeScript, Tailwind CSS, and Framer Motion
- Express 5 and TypeScript
- PostgreSQL (Neon) through Prisma ORM
- JWT sessions in HTTP-only cookies; bcrypt password hashing
- Cloudinary image uploads
- Zod request and form validation

## Requirements

- Node.js 20.9 or newer and npm
- A Neon PostgreSQL database
- Cloudinary credentials to upload listing photos

## Local setup

```powershell
Copy-Item client/.env.example client/.env.local
Copy-Item server/.env.example server/.env
```

Fill in the values in both files. In `server/.env`, use the Neon pooled connection URL for `DATABASE_URL` and the direct, unpooled URL for `DIRECT_URL`. Replace the JWT secret and the seed agent password. Set both seed admin values if you want the development admin account.

Install packages from the repository root (the folder containing this README and the root `package.json`). This is an npm workspaces monorepo with one root lockfile; installing inside `client` creates a separate nested install. If npm 11 says dependency install scripts need approval, approve the Prisma and native tooling scripts before generating Prisma Client. Then apply the database schema, seed the sample homes, and start both apps:

```powershell
npm install
npm install-scripts approve @prisma/client @prisma/engines prisma esbuild unrs-resolver
npm run db:setup
npm run dev
```

`db:setup` generates Prisma Client, applies the current schema to the database with `prisma db push`, and runs the seed. It is intended for initial local setup when the database has no tables yet. For later schema changes where you want checked-in migration history, use `npm run db:migrate -- --name describe_your_change` instead of `db:push`, then run `npm run db:generate` if the generated client needs updating.

The Next.js app runs at `http://localhost:3000`. The Express API runs at `http://localhost:4000`; `GET /api/health` checks the database connection. To run one process, use `npm run dev:client` or `npm run dev:server`.

The seed creates an agent account and six approved sample listings across Lagos, Abuja, Suleja, and Minna. If `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD` are configured, it also creates an admin account. The credentials are the values you set in `server/.env`.

To create or refresh the development admin account, set both `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD` in `server/.env` (the password must have at least 12 characters), then run `npm run db:seed` from the repository root. The seed upserts that email as an active `ADMIN`, so it can be run again if the account already exists. Sign in through the app with that email and password; the login response includes the user's role. If the account was seeded before with a different password, re-running the seed updates its password hash.

When `npm run dev` starts the API, it checks the database before listening and logs a successful database connection. It also reports whether Cloudinary credentials are configured; Cloudinary is contacted when an image upload is used.

### Accounts, agent review, and email

Public signup creates a regular buyer/renter account. New accounts must verify their email before signing in. Agent applicants use the separate **Apply as an agent** link; an admin reviews the application after email verification, and only approved agents can create listings. Admin accounts are still created through the seed process.

Add `RESEND_API_KEY` to `server/.env` to deliver email verification, password reset, inquiry notifications, and agent application decisions. Set `EMAIL_FROM` to a sender address verified in Resend before production use. In development, if the key is missing, verification and reset links are printed in the server console. Property pages offer WhatsApp contact using the assigned agent's registered phone number. Buyer inquiries remain available to guests; signed-in users can see their own submitted inquiries at `/my-inquiries`.

After changing `server/prisma/schema.prisma`, stop the running API, then run `npm run db:generate` and `npm run db:push` from the repository root. `db:push` updates the development database schema; it does not run the seed.

## Scripts

| Command               | Purpose                                                |
| --------------------- | ------------------------------------------------------ |
| `npm run dev`         | Run the client and API together                        |
| `npm run dev:client`  | Run only Next.js                                       |
| `npm run dev:server`  | Run only Express                                       |
| `npm run build`       | Build the API and client                               |
| `npm run start`       | Start both production builds                           |
| `npm run db:generate` | Generate the Prisma client                             |
| `npm run db:migrate -- --name init` | Create or apply a development migration |
| `npm run db:push`     | Apply the Prisma schema directly (development setup)   |
| `npm run db:setup`    | Generate client, apply schema, and seed the database  |
| `npm run db:seed`     | Add the Nigerian sample data and configured seed users |
| `npm run lint`        | Lint the client and server                             |
| `npm run format`      | Format the repository with Prettier                    |

## Project layout

```text
client/     Next.js pages, domain components, contexts, hooks, API client, and validation
server/     Express routes, controllers, services, middleware, validators, Prisma schema, and seed
```

Public listings can be searched by location, price, sale/rent type, property category, bedroom count, sort order, and page. Agents can manage their listings and incoming inquiries. Admins can review listings and manage user roles and account access.

## Environment variables

Every application setting and credential is documented in `client/.env.example` and `server/.env.example`. Copy those files before starting the apps; do not commit the populated `.env` files.
