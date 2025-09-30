-- Fix the user_role enum to include 'driver'
ALTER TYPE user_role ADD VALUE 'driver' AFTER 'staff';

-- Update the get_current_user_role function to handle the new role
CREATE OR REPLACE FUNCTION public.get_current_user_role()
 RETURNS text
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT COALESCE(role::text, 'parent') FROM public.profiles WHERE user_id = auth.uid();
$function$;

-- Ensure proper default role assignment in handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  user_role_value user_role;
BEGIN
  -- Get the role from metadata, default to 'parent' if invalid or missing
  BEGIN
    user_role_value := COALESCE((new.raw_user_meta_data->>'role')::user_role, 'parent');
  EXCEPTION WHEN invalid_text_representation THEN
    user_role_value := 'parent';
  END;
  
  INSERT INTO public.profiles (user_id, email, full_name, role, role_updated_by, role_updated_at)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    user_role_value,
    new.id, -- Self-assigned initial role
    now()
  );
  RETURN new;
END;
$function$;