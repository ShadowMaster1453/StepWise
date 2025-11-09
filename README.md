# StepWise — Shoe Store (Next.js + Prisma + Stripe)

## Quick start
```bash
# 1) Install deps
npm i

# 2) Set env
cp .env.local.example .env.local
# fill DATABASE_URL, NEXTAUTH_SECRET, STRIPE_*

# 3) Push schema & seed
npm run prisma:push
npm run seed

# 4) Dev
npm run dev
```

## Notes
- App Router (no `pages/`). Entry route is `/app/page.jsx`.
- Prisma client is a singleton in `lib/prisma.js`.
- Stripe is in test mode. Use the dashboard CLI to listen: `stripe listen --forward-to localhost:3000/api/stripe/webhook`
