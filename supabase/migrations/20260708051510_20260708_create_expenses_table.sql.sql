/*
# Create expenses table for expense tracking

1. New Tables
- `expenses`
  - `id` (uuid, primary key)
  - `userid` (uuid, not null, defaults to authenticated user, references auth.users)
  - `description` (text, not null)
  - `amount` (decimal, not null)
  - `currency` (text, default 'USD')
  - `category` (text, not null)
  - `subcategory` (text, nullable)
  - `date` (date, not null)
  - `vendor` (text, nullable)
  - `receipt_url` (text, nullable)
  - `notes` (text, nullable)
  - `is_recurring` (boolean, default false)
  - `recurring_frequency` (text, nullable - 'daily', 'weekly', 'monthly', 'yearly')
  - `tags` (text array, nullable)
  - `aicategorized` (boolean, default false)
  - `createdat` (timestamp)
  - `updatedat` (timestamp)

2. Security
- Enable RLS on `expenses`.
- Owner-scoped CRUD: each authenticated user can only access their own expenses.

3. Notes
- This table supports AI-powered expense categorization via the `aicategorized` flag
- Categories suggested by AI are stored in `category` and `subcategory`
- Recurring expenses are tracked with frequency settings
- Tags allow flexible categorization
*/

CREATE TABLE IF NOT EXISTS expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  userid uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  description text NOT NULL,
  amount decimal(12,2) NOT NULL,
  currency text NOT NULL DEFAULT 'USD',
  category text NOT NULL,
  subcategory text,
  date date NOT NULL,
  vendor text,
  receipt_url text,
  notes text,
  is_recurring boolean NOT NULL DEFAULT false,
  recurring_frequency text CHECK (recurring_frequency IN ('daily', 'weekly', 'monthly', 'yearly')),
  tags text[],
  aicategorized boolean NOT NULL DEFAULT false,
  createdat timestamptz DEFAULT now(),
  updatedat timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Create policies for owner-scoped access
DROP POLICY IF EXISTS "select_own_expenses" ON expenses;
CREATE POLICY "select_own_expenses" ON expenses FOR SELECT
  TO authenticated USING (auth.uid() = userid);

DROP POLICY IF EXISTS "insert_own_expenses" ON expenses;
CREATE POLICY "insert_own_expenses" ON expenses FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = userid);

DROP POLICY IF EXISTS "update_own_expenses" ON expenses;
CREATE POLICY "update_own_expenses" ON expenses FOR UPDATE
  TO authenticated USING (auth.uid() = userid) WITH CHECK (auth.uid() = userid);

DROP POLICY IF EXISTS "delete_own_expenses" ON expenses;
CREATE POLICY "delete_own_expenses" ON expenses FOR DELETE
  TO authenticated USING (auth.uid() = userid);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_expenses_userid ON expenses(userid);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category);
CREATE INDEX IF NOT EXISTS idx_expenses_createdat ON expenses(createdat DESC);
