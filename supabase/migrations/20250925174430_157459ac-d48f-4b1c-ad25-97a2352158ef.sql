-- CRITICAL SECURITY FIX: Prevent role privilege escalation
-- Drop the existing update policy that allows users to update their role
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Add audit trail columns for role changes
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS role_updated_by uuid REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS role_updated_at timestamp with time zone;

-- Create new policy that allows users to update their profile EXCEPT the role field
CREATE POLICY "Users can update their own profile except role" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (
  auth.uid() = user_id AND 
  -- Prevent role changes by ensuring the role remains the same
  role = (SELECT role FROM public.profiles WHERE user_id = auth.uid())
);

-- Create admin-only function for role updates with audit trail
CREATE OR REPLACE FUNCTION public.update_user_role(
  target_user_id uuid,
  new_role user_role
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_user_role user_role;
BEGIN
  -- Check if current user is admin
  SELECT role INTO current_user_role 
  FROM public.profiles 
  WHERE user_id = auth.uid();
  
  IF current_user_role != 'admin' THEN
    RAISE EXCEPTION 'Access denied: Only administrators can update user roles';
  END IF;
  
  -- Update the role with audit trail
  UPDATE public.profiles 
  SET 
    role = new_role,
    role_updated_by = auth.uid(),
    role_updated_at = now(),
    updated_at = now()
  WHERE user_id = target_user_id;
  
  -- Log the role change
  INSERT INTO public.notifications (user_id, title, message, type, metadata)
  VALUES (
    target_user_id,
    'Role Updated',
    'Your role has been updated by an administrator',
    'system',
    jsonb_build_object(
      'previous_role', (SELECT role FROM public.profiles WHERE user_id = target_user_id),
      'new_role', new_role,
      'updated_by', auth.uid(),
      'timestamp', now()
    )
  );
END;
$$;

-- Create policy for admins to call the role update function
-- This is handled by the function's security definer, but we document it here

-- Additional security: Create a trigger to prevent direct role updates
CREATE OR REPLACE FUNCTION public.prevent_direct_role_update()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  -- Allow initial role assignment (when role_updated_by is NULL)
  IF OLD.role IS NULL THEN
    RETURN NEW;
  END IF;
  
  -- Prevent role changes unless done through the admin function
  IF OLD.role != NEW.role AND NEW.role_updated_by IS NULL THEN
    RAISE EXCEPTION 'Role updates must be performed through administrative functions';
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger to enforce role update restrictions
DROP TRIGGER IF EXISTS prevent_unauthorized_role_updates ON public.profiles;
CREATE TRIGGER prevent_unauthorized_role_updates
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_direct_role_update();

-- Update the handle_new_user function to set initial role_updated_by
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name, role, role_updated_by, role_updated_at)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    COALESCE((new.raw_user_meta_data->>'role')::user_role, 'parent'),
    new.id, -- Self-assigned initial role
    now()
  );
  RETURN new;
END;
$$;