-- Add ON UPDATE CASCADE to invoices foreign key
DO $$ 
BEGIN
  -- Try to drop the constraint if it exists (assuming standard naming)
  -- We search for the constraint name just in case
  DECLARE
    constraint_name text;
  BEGIN
    SELECT conname INTO constraint_name
    FROM pg_constraint
    WHERE conrelid = 'public.invoices'::regclass
    AND confrelid = 'public.users'::regclass
    AND contype = 'f';
    
    IF constraint_name IS NOT NULL THEN
      EXECUTE 'ALTER TABLE public.invoices DROP CONSTRAINT ' || constraint_name;
      EXECUTE 'ALTER TABLE public.invoices ADD CONSTRAINT ' || constraint_name || ' FOREIGN KEY (userid) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE';
    END IF;
  END;
END $$;

-- Add ON UPDATE CASCADE to clients foreign key
DO $$ 
BEGIN
  DECLARE
    constraint_name text;
  BEGIN
    SELECT conname INTO constraint_name
    FROM pg_constraint
    WHERE conrelid = 'public.clients'::regclass
    AND confrelid = 'public.users'::regclass
    AND contype = 'f';
    
    IF constraint_name IS NOT NULL THEN
      EXECUTE 'ALTER TABLE public.clients DROP CONSTRAINT ' || constraint_name;
      EXECUTE 'ALTER TABLE public.clients ADD CONSTRAINT ' || constraint_name || ' FOREIGN KEY (userid) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE';
    END IF;
  END;
END $$;

-- Add ON UPDATE CASCADE to feedback foreign key (if it exists and links to users)
DO $$ 
BEGIN
  DECLARE
    constraint_name text;
  BEGIN
    SELECT conname INTO constraint_name
    FROM pg_constraint
    WHERE conrelid = 'public.feedback'::regclass
    AND confrelid = 'public.users'::regclass
    AND contype = 'f';
    
    IF constraint_name IS NOT NULL THEN
      EXECUTE 'ALTER TABLE public.feedback DROP CONSTRAINT ' || constraint_name;
      EXECUTE 'ALTER TABLE public.feedback ADD CONSTRAINT ' || constraint_name || ' FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE';
    END IF;
  END;
END $$;
