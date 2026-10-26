# SmartInvoice

SmartInvoice is a web app for creating and managing invoices. Guests can create and download invoice PDFs; signed-in users can manage clients, invoices, expenses, proposals, and payment records.

![SmartInvoice invoice and analytics hero](public/landing-hero.webp)

## Features

- Create, edit, track, and export invoices with configurable numbering, currencies, taxes, discounts, and invoice templates.
- Create and manage clients, expenses, and proposals.
- Generate branded invoice PDFs and export invoice/client data as CSV.
- Send invoices and reminders through a configured email provider.
- Use AI-assisted invoice description enhancement, receipt scanning, and chat. Review AI output before saving it.
- View invoice and revenue summaries, tax reports, and cash-flow projections based on historical data.
- Sign in with email/password; optional Google sign-in requires OAuth credentials.

SmartInvoice records invoice payment status and details. A payment-provider integration for collecting card or bank payments is not currently enabled.

## Tech stack

- Next.js 14 App Router and React 18
- TypeScript, Tailwind CSS, Radix UI, and Recharts
- PostgreSQL, Neon serverless driver, and Prisma schema/client
- JWT sessions and bcrypt password hashing
- Gemini or compatible AI provider integrations
- jsPDF invoice generation; Nodemailer/Resend email delivery

## Run locally

### Requirements

- Node.js 18 or newer
- PostgreSQL database (Neon works)
- npm

### Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create `.env.local` in the project root. At minimum, configure the database URLs and a private JWT secret:

   ```env
   DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require
   DIRECT_URL=postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require
   JWT_SECRET=replace-with-a-random-secret-at-least-32-characters
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

   `DATABASE_URL` is used by the app's Neon/PostgreSQL data access. `DIRECT_URL` is used by Prisma. Use a strong, unique secret for `JWT_SECRET`; the app does not provide a fallback signing key.

3. Generate the Prisma client and sync the schema to a development database:

   ```bash
   npx prisma generate
   npx prisma db push
   ```

   Use a disposable development database for `db push`. Review and apply an appropriate migration workflow before changing a production database.

4. Start the development server:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

### Optional integrations

- AI: set `GEMINI_API_KEY` (or configure a provider and key in the app's AI settings).
- Email: configure `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS`, and optionally `EMAIL_FROM`; or set `RESEND_API_KEY`.
- Google sign-in: set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`, and configure the matching OAuth callback URL for your deployment.
- Local ALTCHA challenge signing: set a private `ALTCHA_API_SECRET` of at least 32 characters.

Some parts of the UI are available without optional provider credentials; the corresponding server feature will report that it needs configuration.

## Project layout

```text
app/                 Next.js pages and API route handlers
components/          Shared UI, invoice templates, and AI interfaces
contexts/            Client-side authentication state
lib/                 Database, auth, AI, PDF, email, and reporting services
prisma/schema.prisma Database models
public/              Static assets, screenshots, and feature images
```

## API overview

The app exposes route handlers under `/api`, including:

| Area | Routes |
|---|---|
| Authentication | `/api/auth/signup`, `/api/auth/login`, `/api/auth/me`, `/api/auth/google` |
| Invoices | `/api/invoices`, `/api/invoices/[id]`, `/api/invoices/[id]/pdf`, `/api/invoices/[id]/send` |
| Clients | `/api/clients`, `/api/clients/[id]` |
| Expenses and proposals | `/api/expenses`, `/api/proposals` |
| Analytics and tax | `/api/analytics`, `/api/tax/report`, `/api/accounting/report` |
| AI and suggestions | `/api/ai/chat`, `/api/ai/enhance`, `/api/expenses/scan`, `/api/suggestions/items` |
| Email and exports | `/api/reminders/send`, `/api/export/invoices`, `/api/export/clients` |

Requests that access a user's saved records require a valid session. See the route handlers for request and response details.

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start the local development server |
| `npm run build` | Build the production app |
| `npm start` | Run the production build |
| `npm run lint` | Run Next.js ESLint checks |
| `npm run type-check` | Run the TypeScript compiler without emitting files |
| `npm run security-audit` | Run the npm dependency audit |

## Deployment notes

Deploy to a Next.js-compatible host and configure the environment variables there. Set `NODE_ENV=production`, use HTTPS, restrict database credentials, configure a private `JWT_SECRET` and `ALTCHA_API_SECRET`, and set `NEXT_PUBLIC_APP_URL` to the public origin. Configure email, AI, and Google OAuth only if those features are enabled.

Before describing the app as production-ready, run the build and security checks, validate the deployment configuration, and review the application's authentication and data-access behavior for the intended use case.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE).
