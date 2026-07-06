/*
# Fix Auth RLS Policies and Add Default Values for Multi-user App

1. Purpose
   - Enable end-to-end authentication using Supabase Auth (email/password)
   - Fix RLS policies to allow proper signup flow
   - Add DEFAULT auth.uid() to owner columns so inserts work correctly

2. Changes to 'users' Table
   - Add INSERT policy for anon role (allows signup)
   - The users table will serve as a profile extension of auth.users
   - ID will reference auth.users(id)

3. Changes to Owner Columns
   - clients.userid: Add DEFAULT auth.uid()
   - invoices.userid: Add DEFAULT auth.uid()
   - projects.userid: Add DEFAULT auth.uid()
   - estimates.userid: Add DEFAULT auth.uid()
   - time_entries.userid: Add DEFAULT auth.uid()
   - recurring_invoices.userid: Add DEFAULT auth.uid()

4. Updated RLS Policies
   - users: Allow anon INSERT for signup
   - All other tables: Keep authenticated-only but work with DEFAULT auth.uid()

5. Important Notes
   - The app renders sign-in screens, so policies use 'authenticated'
   - DEFAULT auth.uid() ensures inserts work without passing userid from frontend
   - Users can only see/modify their own data
*/

-- ============================================================================
-- PART 1: Fix users table RLS for signup
-- ============================================================================

-- Drop existing restrictive insert policy
DROP POLICY IF EXISTS "insert_own_users" ON users;

-- Allow anyone (anon) to insert a new user profile during signup
-- This is necessary because signup happens before authentication
CREATE POLICY "insert_user_profile" ON users
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow users to select their own profile (authenticated users only)
DROP POLICY IF EXISTS "select_own_users" ON users;
CREATE POLICY "select_own_users" ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Allow users to update their own profile
DROP POLICY IF EXISTS "update_own_users" ON users;
CREATE POLICY "update_own_users" ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ============================================================================
-- PART 2: Add DEFAULT auth.uid() to owner columns
-- This makes INSERT work without explicitly passing the userid
-- ============================================================================

-- Clients table
ALTER TABLE clients 
  ALTER COLUMN userid SET DEFAULT auth.uid();

-- Invoices table  
ALTER TABLE invoices
  ALTER COLUMN userid SET DEFAULT auth.uid();

-- Projects table
ALTER TABLE projects
  ALTER COLUMN userid SET DEFAULT auth.uid();

-- Estimates table
ALTER TABLE estimates
  ALTER COLUMN userid SET DEFAULT auth.uid();

-- Time entries table
ALTER TABLE time_entries
  ALTER COLUMN userid SET DEFAULT auth.uid();

-- Recurring invoices table
ALTER TABLE recurring_invoices
  ALTER COLUMN userid SET DEFAULT auth.uid();

-- ============================================================================
-- PART 3: Fix INSERT policies for all tables to work with DEFAULT
-- ============================================================================

-- Clients: Ensure INSERT policy works with default userid
DROP POLICY IF EXISTS "insert_own_clients" ON clients;
CREATE POLICY "insert_own_clients" ON clients
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = userid OR userid IS NULL);

-- Invoices: Ensure INSERT policy works with default userid
DROP POLICY IF EXISTS "insert_own_invoices" ON invoices;
CREATE POLICY "insert_own_invoices" ON invoices
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = userid OR userid IS NULL);

-- Projects
DROP POLICY IF EXISTS "insert_own_projects" ON projects;
CREATE POLICY "insert_own_projects" ON projects
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = userid OR userid IS NULL);

-- Estimates
DROP POLICY IF EXISTS "insert_own_estimates" ON estimates;
CREATE POLICY "insert_own_estimates" ON estimates
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = userid OR userid IS NULL);

-- Time entries
DROP POLICY IF EXISTS "insert_own_time_entries" ON time_entries;
CREATE POLICY "insert_own_time_entries" ON time_entries
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = userid OR userid IS NULL);

-- Recurring invoices
DROP POLICY IF EXISTS "insert_own_recurring_invoices" ON recurring_invoices;
CREATE POLICY "insert_own_recurring_invoices" ON recurring_invoices
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = userid OR userid IS NULL);
