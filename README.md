<div align="center">

<br />

<img src="public/logo.svg" alt="SmartInvoice Logo" width="280" />

**AI-powered invoice management built for modern freelancers & businesses.**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169E1?style=for-the-badge&logo=postgresql)](https://neon.tech/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000?style=for-the-badge&logo=vercel)](https://vercel.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

<br/>

> Create, send, and track professional invoices — with AI that learns your workflow.

<br/>

[🚀 Get Started](#-quick-start) · [✨ Features](#-features) · [📖 API Docs](#-api-reference) · [🚢 Deploy](#-deployment)

<br/>

![SmartInvoice Landing Hero](public/landing-hero.png)

<br/>

</div>

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Quick Start](#-quick-start)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [Deployment](#-deployment)
- [Security](#-security)
- [Scripts](#-available-scripts)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🧭 Overview

SmartInvoice is a **production-ready SaaS application** for creating, managing, and sending professional invoices. It blends a sleek Spotify-inspired dark UI with AI-powered features — from smart auto-fill to payment prediction — making it faster and smarter than traditional invoicing tools.

**Built for:** Freelancers, agencies, consultants, and small businesses that need a professional invoicing solution without the enterprise overhead.

---

## ✨ Features

### 🧾 Core Invoicing

| Feature | Description |
|---|---|
| **Invoice Management** | Create, edit, send, duplicate, and archive invoices |
| **Smart Numbering** | Auto-incremented invoice numbers with custom prefixes |
| **PDF Generation** | Branded, pixel-perfect PDF export via Puppeteer & jsPDF |
| **Multi-Currency** | Support for global currencies with per-client preferences |
| **Tax & Discounts** | GST/VAT calculations with line-item and invoice-level discounts |
| **Payment Tracking** | Mark invoices as paid, track payment method & date |

### 🤖 AI-Powered Features

| Feature | Description |
|---|---|
| **AI Chatbot Assistant** | Floating conversational interface — create invoices via chat |
| **Smart Suggestions** | Auto-complete line items based on client history (Gemini AI) |
| **Description Enhancer** | Rewrite item descriptions in Formal or Friendly tone |
| **Payment Predictor** | Cash-flow forecast with confidence intervals |
| **Expense Categorizer** | AI categorizes uploaded receipts automatically |

### 📊 Analytics & Reporting

- Revenue insights with interactive charts (Recharts)
- Invoice status breakdown — Draft, Sent, Paid, Overdue
- Cash-flow forecast dashboard widget
- CSV export for accounting tools

### 👥 Client Management

- Full client database with company, address, GST number, currency
- Per-client invoice history and tracking
- Smart client search with fuzzy matching

### 📧 Automation

- Automated email delivery via Nodemailer (Gmail SMTP) or Resend
- Configurable payment reminder sequences
- Reminder history tracking per invoice

### 🔐 Security

- JWT-based authentication with `bcryptjs` password hashing
- ALTCHA CAPTCHA integration on auth flows
- Secure HTTP-only cookie sessions
- Input validation with Zod schemas

---

## 🛠 Tech Stack

### Frontend

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5.2 |
| UI Components | Radix UI + shadcn/ui |
| Styling | Tailwind CSS + custom dark theme |
| Animations | Framer Motion |
| Charts | Recharts |
| Forms | React Hook Form + Zod |
| Icons | Lucide React |

### Backend

| Layer | Technology |
|---|---|
| Runtime | Node.js ≥ 18 |
| Database | PostgreSQL via Neon serverless |
| Database Client | `@neondatabase/serverless` |
| Auth | JWT (`jsonwebtoken`) + `bcryptjs` |
| Email | Nodemailer (SMTP) + Resend API |
| PDF | Puppeteer + jsPDF + html2canvas |
| AI | Google Gemini (`@google/generative-ai`) |
| Payments | Razorpay SDK |

### Infrastructure

| Layer | Technology |
|---|---|
| Hosting | Vercel (recommended) |
| Database | Neon (serverless Postgres) |
| Package Manager | Bun |

---

## 📁 Project Structure

```
SmartInvoice/
├── app/
│   ├── api/                        # API route handlers
│   │   ├── auth/                   #   Login, signup, logout
│   │   ├── invoices/               #   CRUD + PDF + email
│   │   ├── clients/                #   Client management
│   │   ├── reminders/              #   Reminder scheduling & sending
│   │   ├── analytics/              #   Revenue & stats
│   │   ├── ai/                     #   AI chatbot & suggestions
│   │   ├── expenses/               #   Expense tracking & AI categorization
│   │   ├── export/                 #   CSV export
│   │   ├── proposals/              #   Proposal management
│   │   ├── tax/                    #   Tax calculation
│   │   └── upload/                 #   File upload
│   ├── auth/                       # Auth pages (login, signup)
│   ├── dashboard/                  # Protected dashboard routes
│   │   ├── agent/                  #   AI agent interface
│   │   ├── analytics/              #   Revenue analytics
│   │   ├── clients/                #   Client list & detail
│   │   ├── create/                 #   Invoice creation wizard
│   │   ├── expenses/               #   Expense management
│   │   ├── invoices/               #   Invoice list & detail
│   │   ├── proposals/              #   Proposals
│   │   ├── reminders/              #   Reminder settings
│   │   ├── reports/                #   Financial reports
│   │   ├── settings/               #   User & business settings
│   │   ├── tax/                    #   Tax dashboard
│   │   └── components/             #   Shared dashboard components
│   ├── globals.css                 # Global styles & design tokens
│   ├── layout.tsx                  # Root layout
│   └── page.tsx                    # Landing page
├── components/
│   ├── ai/                         # AI chatbot & suggestion UI
│   ├── invoice/                    # Invoice form & preview
│   ├── invoices/                   # Invoice list components
│   ├── security/                   # CAPTCHA & security
│   └── ui/                         # Base UI primitives (shadcn)
├── lib/
│   ├── database.ts                 # DB queries & type interfaces
│   ├── auth.ts                     # JWT helpers
│   ├── ai-agent.ts                 # AI agent orchestration
│   ├── gemini.ts                   # Gemini AI client
│   ├── smart-suggestions.ts        # AI suggestion engine
│   ├── email-service.ts            # Email sending logic
│   ├── pdf-generator.ts            # PDF generation
│   ├── invoice-generator.ts        # Invoice number logic
│   ├── payment-service.ts          # Razorpay integration
│   ├── reminder-service.ts         # Reminder scheduling
│   └── error-handler.ts            # Centralized error handling
├── types/                          # Shared TypeScript types
├── hooks/                          # Custom React hooks
├── contexts/                       # React context providers
├── public/                         # Static assets
└── supabase/                       # Database migration files
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** ≥ 18.0.0
- **Bun** (recommended) or npm ≥ 8.0.0
- **PostgreSQL** database — local or [Neon](https://neon.tech) for cloud

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/SmartInvoice.git
cd SmartInvoice
```

### 2. Install Dependencies

```bash
bun install
# or
npm install
```

### 3. Configure Environment Variables

```bash
cp .env.local.example .env.local
# Fill in your values — see Environment Variables section below
```

### 4. Set Up the Database

Run the SQL migration files against your PostgreSQL instance:

```bash
psql -d your_database_url -f supabase/migrations/001_initial.sql
```

Or paste the SQL directly in the Supabase / Neon dashboard query editor.

### 5. Start the Development Server

```bash
bun dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — the app is live! 🎉

---

## 🔑 Environment Variables

Create a `.env.local` file at the project root:

```env
# ─── Application ──────────────────────────────────────────────
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# ─── Database (Required) ──────────────────────────────────────
DATABASE_URL=postgresql://username:password@host:5432/smartinvoice

# ─── Authentication (Required) ────────────────────────────────
# Generate: openssl rand -base64 32
JWT_SECRET=your-super-secret-jwt-key-min-32-chars

# ─── Email via SMTP (Optional) ────────────────────────────────
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password
EMAIL_FROM=noreply@yourdomain.com

# ─── Email via Resend (Alternative) ──────────────────────────
RESEND_API_KEY=re_your_api_key

# ─── Google Gemini AI (Required for AI features) ──────────────
GEMINI_API_KEY=your-gemini-api-key

# ─── Razorpay (Optional — payment links) ─────────────────────
RAZORPAY_KEY_ID=rzp_live_your_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

> **Gmail Tip:** Create an [App Password](https://myaccount.google.com/apppasswords) — do not use your main account password.

---

## 📖 API Reference

All routes are under `/api/`. Protected routes require a valid JWT passed as a Bearer token in the `Authorization` header, or as a session cookie.

### 🔐 Authentication

#### `POST /api/auth/signup`
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "securepassword123",
  "company": "Doe Studios"
}
```

#### `POST /api/auth/login`
```json
{
  "email": "jane@example.com",
  "password": "securepassword123"
}
```

#### `POST /api/auth/logout`
Clears the session cookie. No body required.

---

### 🧾 Invoices

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/invoices` | List all invoices |
| `POST` | `/api/invoices` | Create a new invoice |
| `GET` | `/api/invoices/[id]` | Get invoice by ID |
| `PUT` | `/api/invoices/[id]` | Update an invoice |
| `DELETE` | `/api/invoices/[id]` | Delete an invoice |
| `POST` | `/api/invoices/[id]/send` | Send invoice via email |
| `GET` | `/api/invoices/[id]/pdf` | Download as PDF |

**Create Invoice — Example Payload:**
```json
{
  "clientName": "Acme Corp",
  "clientEmail": "billing@acme.com",
  "clientAddress": "123 Main St, New York, NY 10001",
  "items": [
    { "description": "Web Design", "quantity": 1, "rate": 2500 },
    { "description": "SEO Setup", "quantity": 3, "rate": 150 }
  ],
  "taxRate": 18,
  "discountRate": 5,
  "dueDate": "2026-09-01",
  "notes": "Thank you for your business!",
  "currency": "USD"
}
```

---

### 👥 Clients

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/clients` | List all clients |
| `POST` | `/api/clients` | Create a client |
| `PUT` | `/api/clients/[id]` | Update client |
| `DELETE` | `/api/clients/[id]` | Delete client |

---

### 📊 Analytics

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/analytics` | Revenue summary & KPIs |
| `GET` | `/api/analytics/cashflow` | Cash-flow forecast data |

---

### 🤖 AI

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/ai/chat` | Send message to AI assistant |
| `GET` | `/api/suggestions` | Smart line-item suggestions |

---

### 📧 Reminders

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/reminders` | List reminder config |
| `POST` | `/api/reminders/send` | Manually trigger reminders |

---

### 📤 Export

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/export/invoices` | Export invoices as CSV |
| `GET` | `/api/export/expenses` | Export expenses as CSV |

---

## 🚢 Deployment

### ▲ Vercel (Recommended — ~5 min)

1. Push your repository to GitHub.
2. Go to [vercel.com](https://vercel.com) → **New Project** → import your repo.
3. Add all environment variables in the Vercel dashboard under **Settings → Environment Variables**.
4. Click **Deploy**.

```bash
# Or via CLI
npm i -g vercel
vercel --prod
```

### 🚂 Railway (~5 min)

```bash
npm i -g @railway/cli
railway login
railway init
railway up
```

### 🐳 Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
docker build -t smartinvoice .
docker run -p 3000:3000 --env-file .env.local smartinvoice
```

### 🖥 Manual (nginx + PM2)

```bash
npm run build
pm2 start npm --name "smartinvoice" -- start
# Set up nginx as reverse proxy on port 3000
```

---

## 🔒 Security

SmartInvoice follows security best practices out of the box:

| Area | Implementation |
|---|---|
| Authentication | JWT tokens, configurable expiry, HTTP-only cookies |
| Passwords | `bcryptjs` hashing with ≥ 10 salt rounds |
| Bot Protection | ALTCHA CAPTCHA on registration |
| Input Validation | Zod schemas on all API endpoints |
| Secrets | No sensitive values in client bundle |
| Transport | HTTPS enforced in production |

### Pre-Launch Checklist

- [ ] Rotate `JWT_SECRET` — `openssl rand -base64 32`
- [ ] Set `NODE_ENV=production`
- [ ] Enable SSL on the database connection
- [ ] Use a strong, unique database password
- [ ] Configure CORS for your production domain
- [ ] Enable rate limiting on auth endpoints
- [ ] Set up automated database backups

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `bun dev` | Start the development server |
| `bun run build` | Build for production |
| `bun start` | Start the production server |
| `bun run lint` | Run ESLint |
| `bun run type-check` | TypeScript type check (`tsc --noEmit`) |
| `bun run clean` | Clear `.next` build cache |
| `bun run dev:clean` | Clean + start dev server |
| `npm run security-audit` | Run `npm audit` for vulnerabilities |

---

## 🔧 Troubleshooting

### Database Connection Fails
- Verify `DATABASE_URL` format: `postgresql://user:pass@host:5432/dbname`
- If using Neon, use the **pooled** connection string
- Check that your IP is allowlisted in the database firewall settings

### Emails Not Sending
- For Gmail: use an [App Password](https://myaccount.google.com/apppasswords), not your account password
- Ensure `EMAIL_PORT=587` and `EMAIL_SECURE=false` for STARTTLS
- Test the mail config: `GET /api/test-email`

### AI Features Not Working
- Verify `GEMINI_API_KEY` is valid in [Google AI Studio](https://aistudio.google.com)
- Check API quota limits on your Google Cloud project
- AI features gracefully degrade — the app is fully functional without an AI key

### PDF Generation Fails
- On Vercel/serverless: `jsPDF` mode is used automatically (no Puppeteer)
- On a VPS: install Chromium dependencies
  ```bash
  apt-get install -y chromium libgbm-dev
  ```

### Build Errors
```bash
# Clear all caches and reinstall
bun run clean
rm -rf node_modules
bun install
bun run build
```

---

## 🤝 Contributing

Contributions are welcome and appreciated! Please follow these steps:

1. **Fork** this repository
2. **Create** a feature branch: `git checkout -b feat/your-feature`
3. **Commit** your changes using conventional commits:
   ```
   feat:     New feature
   fix:      Bug fix
   docs:     Documentation only
   refactor: Code refactoring
   chore:    Build/tooling updates
   ```
4. **Push** your branch: `git push origin feat/your-feature`
5. **Open** a Pull Request with a clear description of what changed and why

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

Built with ❤️ using Next.js, TypeScript, and a lot of ☕

**[⬆ Back to Top](#-smartinvoice)**

</div>