/*
# Create contracts table for contract management

1. New Tables
- `contracts`
  - `id` (uuid, primary key)
  - `userid` (uuid, not null, defaults to authenticated user, references auth.users)
  - `contractnum` (text, unique, not null)
  - `clientid` (uuid, nullable, references clients)
  - `clientname` (text, not null)
  - `clientemail` (text, not null)
  - `clientcompany` (text, nullable)
  - `title` (text, not null)
  - `description` (text, nullable)
  - `contracttype` (text, default 'service' - service, nda, employment, consulting, license, other)
  - `startdate` (date, not null)
  - `enddate` (date, nullable)
  - `value` (decimal, nullable)
  - `currency` (text, default 'USD')
  - `terms` (text, nullable)
  - `templateid` (uuid, nullable)
  - `status` (text, default 'draft' - draft, sent, signed, active, expired, terminated)
  - `signedat` (timestamp, nullable)
  - `expireat` (timestamptz, nullable)
  - `signatureurl` (text, nullable)
  - `clientsigned` (boolean, default false)
  - `usersigned` (boolean, default false)
  - `pdfurl` (text, nullable)
  - `notes` (text, nullable)
  - `createdat` (timestamp)
  - `updatedat` (timestamp)

2. Security
- Enable RLS on `contracts`.
- Owner-scoped CRUD: each authenticated user can only access their own contracts.

3. Notes
- Contracts can be generated from proposals or created standalone
- E-signature integration placeholder (signatureUrl)
- Supports various contract types for different use cases
*/

CREATE TABLE IF NOT EXISTS contracts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  userid uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  contractnum text UNIQUE NOT NULL,
  clientid uuid REFERENCES clients(id) ON DELETE SET NULL,
  clientname text NOT NULL,
  clientemail text NOT NULL,
  clientcompany text,
  title text NOT NULL,
  description text,
  contracttype text NOT NULL DEFAULT 'service' CHECK (contracttype IN ('service', 'nda', 'employment', 'consulting', 'license', 'other')),
  startdate date NOT NULL,
  enddate date,
  value decimal(12,2),
  currency text DEFAULT 'USD',
  terms text,
  templateid uuid,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'signed', 'active', 'expired', 'terminated')),
  signedat timestamptz,
  expireat timestamptz,
  signatureurl text,
  clientsigned boolean DEFAULT false,
  usersigned boolean DEFAULT false,
  pdfurl text,
  notes text,
  createdat timestamptz DEFAULT now(),
  updatedat timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;

-- Create policies for owner-scoped access
DROP POLICY IF EXISTS "select_own_contracts" ON contracts;
CREATE POLICY "select_own_contracts" ON contracts FOR SELECT
  TO authenticated USING (auth.uid() = userid);

DROP POLICY IF EXISTS "insert_own_contracts" ON contracts;
CREATE POLICY "insert_own_contracts" ON contracts FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = userid);

DROP POLICY IF EXISTS "update_own_contracts" ON contracts;
CREATE POLICY "update_own_contracts" ON contracts FOR UPDATE
  TO authenticated USING (auth.uid() = userid) WITH CHECK (auth.uid() = userid);

DROP POLICY IF EXISTS "delete_own_contracts" ON contracts;
CREATE POLICY "delete_own_contracts" ON contracts FOR DELETE
  TO authenticated USING (auth.uid() = userid);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_contracts_userid ON contracts(userid);
CREATE INDEX IF NOT EXISTS idx_contracts_status ON contracts(status);
CREATE INDEX IF NOT EXISTS idx_contracts_startdate ON contracts(startdate);
CREATE INDEX IF NOT EXISTS idx_contracts_enddate ON contracts(enddate);
CREATE INDEX IF NOT EXISTS idx_contracts_contracttype ON contracts(contracttype);
