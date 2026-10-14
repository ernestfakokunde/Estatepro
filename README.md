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

Install packages, generate the Prisma client, apply the database schema, seed the sample homes, and start both apps:

```powershell
npm install
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

The Next.js app runs at `http://localhost:3000`. The Express API runs at `http://localhost:4000`; `GET /api/health` checks the database connection. To run one process, use `npm run dev:client` or `npm run dev:server`.

The seed creates an agent account and six approved sample listings across Lagos, Abuja, Suleja, and Minna. If `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD` are configured, it also creates an admin account. The credentials are the values you set in `server/.env`.

## Scripts

| Command               | Purpose                                                |
| --------------------- | ------------------------------------------------------ |
| `npm run dev`         | Run the client and API together                        |
| `npm run dev:client`  | Run only Next.js                                       |
| `npm run dev:server`  | Run only Express                                       |
| `npm run build`       | Build the API and client                               |
| `npm run start`       | Start both production builds                           |
| `npm run db:generate` | Generate the Prisma client                             |
| `npm run db:migrate`  | Create or apply a development migration                |
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
