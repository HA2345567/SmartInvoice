-- Enable RLS for users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own profile
CREATE POLICY "Users can view their own profile" 
ON public.users FOR SELECT 
USING (auth.uid()::text = id);

-- Allow users to insert their own profile (crucial for signup)
-- This allows an authenticated user to insert a row where the ID matches their UUID
CREATE POLICY "Users can insert their own profile" 
ON public.users FOR INSERT 
WITH CHECK (auth.uid()::text = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update their own profile" 
ON public.users FOR UPDATE 
USING (auth.uid()::text = id);

-- Allow users to delete their own profile (optional)
-- CREATE POLICY "Users can delete their own profile" 
-- ON public.users FOR DELETE 
-- USING (auth.uid() = id);
