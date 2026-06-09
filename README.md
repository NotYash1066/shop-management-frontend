# Ledger House Frontend

Admin-first frontend for the `shop-management-system` backend.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- TanStack Query
- React Hook Form + Zod
- Framer Motion

## Run

1. Set `NEXT_PUBLIC_API_BASE_URL` in `.env.local` if your backend is not at `http://localhost:8080/api`.
2. Install dependencies with `npm install`.
3. Start the app with `npm run dev`.

## Backend Alignment

- Auth: `/api/auth/register`, `/api/auth/login`
- Dashboard: `/api/dashboard/stats`, `/api/dashboard/low-stock`
- Inventory: `/api/products`
- Reference data: `/api/categories`, `/api/suppliers`, `/api/employees`
- Orders: `/api/orders`, `/api/orders/user/{userId}`

## Known Backend Gap

The frontend is already prepared for:

- `GET /api/orders`
- `GET /api/orders/{id}`

Those two endpoints do not exist in the current backend, so the admin order queue falls back to current-user order history until they are added.
