/*
# Add settings columns to users table

1. Modified Tables
- `users`
  - `phone` (text, nullable)
  - `address` (text, nullable)
  - `gstnumber` (text, nullable)
  - `currency` (text, default 'USD')
  - `invoiceprefix` (text, default 'INV')
  - `defaultterms` (text, nullable)
  - `defaultnotes` (text, nullable)
  - `defaultgstrate` (decimal, default 18)
  - `defaulttaxrate` (decimal, default 0)
  - `emailnotifications` (boolean, default true)
  - `reminderemails` (boolean, default true)
  - `reminderdays` (integer, default 7)
  - `autogeneratenumbers` (boolean, default true)
  - `updatedat` (timestamp)

2. Notes
- These columns support the Settings page functionality
- GST and tax rates are for Indian and international users
- Email/notification settings control automated communications
- Invoice prefix and auto-generation settings configure invoice behavior
*/

ALTER TABLE users ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS address text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS gstnumber text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS currency text DEFAULT 'USD';
ALTER TABLE users ADD COLUMN IF NOT EXISTS invoiceprefix text DEFAULT 'INV';
ALTER TABLE users ADD COLUMN IF NOT EXISTS defaultterms text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS defaultnotes text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS defaultgstrate decimal(5,2) DEFAULT 18;
ALTER TABLE users ADD COLUMN IF NOT EXISTS defaulttaxrate decimal(5,2) DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS emailnotifications boolean DEFAULT true;
ALTER TABLE users ADD COLUMN IF NOT EXISTS reminderemails boolean DEFAULT true;
ALTER TABLE users ADD COLUMN IF NOT EXISTS reminderdays integer DEFAULT 7;
ALTER TABLE users ADD COLUMN IF NOT EXISTS autogeneratenumbers boolean DEFAULT true;
ALTER TABLE users ADD COLUMN IF NOT EXISTS updatedat timestamptz DEFAULT now();
