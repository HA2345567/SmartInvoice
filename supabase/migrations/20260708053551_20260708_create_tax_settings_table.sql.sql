/*
# Create tax_settings table for GST/VAT configuration

1. New Tables
- `tax_settings`
  - `id` (uuid, primary key)
  - `userid` (uuid, not null, defaults to authenticated user, references auth.users)
  - `taxname` (text, not null - e.g., "GST", "VAT", "Sales Tax")
  - `taxtype` (text, not null - e.g., "gst_inclusive", "gst_exclusive", "vat", "sales_tax")
  - `taxnumber` (text, nullable - GSTIN, VAT number, etc.)
  - `defaultrate` (decimal, not null)
  - `isinclusive` (boolean, default false)
  - `isactive` (boolean, default true)
  - `hsncode` (text, nullable)
  - `saccode` (text, nullable)
  - `statecode` (text, nullable)
  - `createdat` (timestamp)
  - `updatedat` (timestamp)

2. Security
- Enable RLS on `tax_settings`.
- Owner-scoped CRUD.

3. Notes
- Supports multiple tax configurations per user
- HSN/SAC codes for Indian GST
- State code for Indian GST compliance
*/

CREATE TABLE IF NOT EXISTS tax_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  userid uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  taxname text NOT NULL,
  taxtype text NOT NULL DEFAULT 'gst_exclusive',
  taxnumber text,
  defaultrate decimal(5,2) NOT NULL DEFAULT 18,
  isinclusive boolean DEFAULT false,
  isactive boolean DEFAULT true,
  hsncode text,
  saccode text,
  statecode text,
  createdat timestamptz DEFAULT now(),
  updatedat timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE tax_settings ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "select_own_tax_settings" ON tax_settings;
CREATE POLICY "select_own_tax_settings" ON tax_settings FOR SELECT
  TO authenticated USING (auth.uid() = userid);

DROP POLICY IF EXISTS "insert_own_tax_settings" ON tax_settings;
CREATE POLICY "insert_own_tax_settings" ON tax_settings FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = userid);

DROP POLICY IF EXISTS "update_own_tax_settings" ON tax_settings;
CREATE POLICY "update_own_tax_settings" ON tax_settings FOR UPDATE
  TO authenticated USING (auth.uid() = userid) WITH CHECK (auth.uid() = userid);

DROP POLICY IF EXISTS "delete_own_tax_settings" ON tax_settings;
CREATE POLICY "delete_own_tax_settings" ON tax_settings FOR DELETE
  TO authenticated USING (auth.uid() = userid);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_tax_settings_userid ON tax_settings(userid);
