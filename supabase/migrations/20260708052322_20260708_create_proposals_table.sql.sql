/*
# Create proposals table for proposal/quote management

1. New Tables
- `proposals`
  - `id` (uuid, primary key)
  - `userid` (uuid, not null, defaults to authenticated user, references auth.users)
  - `proposalnum` (text, unique, not null)
  - `clientid` (uuid, nullable, references clients)
  - `clientname` (text, not null)
  - `clientemail` (text, not null)
  - `clientcompany` (text, nullable)
  - `title` (text, not null)
  - `description` (text, nullable)
  - `items` (jsonb, not null - array of proposal line items)
  - `subtotal` (decimal, not null)
  - `discountamount` (decimal, default 0)
  - `taxamount` (decimal, default 0)
  - `amount` (decimal, not null - total)
  - `taxrate` (decimal, default 0)
  - `discountrate` (decimal, default 0)
  - `currency` (text, default 'USD')
  - `status` (text, default 'draft' - draft, sent, viewed, accepted, declined, expired)
  - `date` (date, not null)
  - `validuntil` (date, not null)
  - `terms` (text, nullable)
  - `notes` (text, nullable)
  - `aisummary` (text, nullable - AI-generated executive summary)
  - `aisuggestions` (jsonb, nullable - AI improvement suggestions)
  - `acceptedat` (timestamp, nullable)
  - `viewedat` (timestamp, nullable)
  - `createdat` (timestamp)
  - `updatedat` (timestamp)

2. Security
- Enable RLS on `proposals`.
- Owner-scoped CRUD: each authenticated user can only access their own proposals.

3. Notes
- Proposals can be converted to invoices when accepted
- AI can generate executive summaries and improvement suggestions
- Status flow: draft -> sent -> viewed -> accepted/declined/expired
*/

CREATE TABLE IF NOT EXISTS proposals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  userid uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  proposalnum text UNIQUE NOT NULL,
  clientid uuid REFERENCES clients(id) ON DELETE SET NULL,
  clientname text NOT NULL,
  clientemail text NOT NULL,
  clientcompany text,
  title text NOT NULL,
  description text,
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  subtotal decimal(12,2) NOT NULL DEFAULT 0,
  discountamount decimal(12,2) DEFAULT 0,
  taxamount decimal(12,2) DEFAULT 0,
  amount decimal(12,2) NOT NULL DEFAULT 0,
  taxrate decimal(5,2) DEFAULT 0,
  discountrate decimal(5,2) DEFAULT 0,
  currency text DEFAULT 'USD',
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'viewed', 'accepted', 'declined', 'expired')),
  date date NOT NULL,
  validuntil date NOT NULL,
  terms text,
  notes text,
  aisummary text,
  aisuggestions jsonb,
  acceptedat timestamptz,
  viewedat timestamptz,
  createdat timestamptz DEFAULT now(),
  updatedat timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;

-- Create policies for owner-scoped access
DROP POLICY IF EXISTS "select_own_proposals" ON proposals;
CREATE POLICY "select_own_proposals" ON proposals FOR SELECT
  TO authenticated USING (auth.uid() = userid);

DROP POLICY IF EXISTS "insert_own_proposals" ON proposals;
CREATE POLICY "insert_own_proposals" ON proposals FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = userid);

DROP POLICY IF EXISTS "update_own_proposals" ON proposals;
CREATE POLICY "update_own_proposals" ON proposals FOR UPDATE
  TO authenticated USING (auth.uid() = userid) WITH CHECK (auth.uid() = userid);

DROP POLICY IF EXISTS "delete_own_proposals" ON proposals;
CREATE POLICY "delete_own_proposals" ON proposals FOR DELETE
  TO authenticated USING (auth.uid() = userid);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_proposals_userid ON proposals(userid);
CREATE INDEX IF NOT EXISTS idx_proposals_status ON proposals(status);
CREATE INDEX IF NOT EXISTS idx_proposals_date ON proposals(date);
CREATE INDEX IF NOT EXISTS idx_proposals_validuntil ON proposals(validuntil);
