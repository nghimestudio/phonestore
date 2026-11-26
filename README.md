# PhoneStore — Full Stack Phone E-Commerce

Next.js storefront for selling smartphones, with authentication, cart/checkout, order history, and an admin panel for products and orders.

## Stack

- Next.js (App Router) + React + TypeScript + Tailwind CSS
- Prisma + SQLite
- Auth.js (NextAuth v5) credentials provider
- Zod validation

## Setup

```bash
npm install
npx prisma db push
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Demo accounts

| Role     | Email                   | Password     |
|----------|-------------------------|--------------|
| Admin    | admin@phonestore.com    | admin123     |
| Customer | customer@phonestore.com | customer123  |

## Features

### Storefront
- Home page with featured phones and brand links
- Product catalog with search and filters (brand, price, storage)
- Product detail with specs and add-to-cart
- Server-side cart (login required)
- Checkout with COD or bank transfer (mock payment)
- Order history and order detail pages

### Admin (`/admin`)
- Dashboard with product/order stats and low-stock alerts
- Product create / edit / delete
- Order list with status updates (`PENDING`, `PAID`, `SHIPPED`, `CANCELLED`)

## Useful scripts

```bash
npm run dev        # start development server
npm run db:push    # sync Prisma schema to SQLite
npm run db:seed    # reset and seed demo data
npm run db:studio  # open Prisma Studio
```

## Environment

Configured in `.env`:

- `DATABASE_URL` — SQLite file path (`file:./dev.db`)
- `AUTH_SECRET` — Auth.js secret
- `AUTH_TRUST_HOST=true` — local/dev host trust
