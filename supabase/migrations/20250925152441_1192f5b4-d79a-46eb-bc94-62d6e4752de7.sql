-- Enable Row Level Security on schools table
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;

-- Create a security definer function to get current user role (to avoid RLS recursion)
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role::text FROM public.profiles WHERE user_id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = public;

-- Policy 1: Admins can manage all school data (full access)
CREATE POLICY "Admins can manage all school data" 
ON public.schools 
FOR ALL 
USING (public.get_current_user_role() = 'admin')
WITH CHECK (public.get_current_user_role() = 'admin');

-- Policy 2: Staff can view all school information (read-only)
CREATE POLICY "Staff can view all school information" 
ON public.schools 
FOR SELECT 
USING (public.get_current_user_role() = 'staff');

-- Policy 3: Teachers, parents, and drivers can view basic school info (excluding sensitive contact details)
-- This policy only allows access to non-sensitive fields
CREATE POLICY "Authenticated users can view basic school info" 
ON public.schools 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL AND 
  public.get_current_user_role() IN ('teacher', 'parent', 'driver')
);

-- Note: For the selective column access (excluding sensitive data for non-admin/staff users),
-- we'll need to handle this at the application level by creating views or specific queries
-- that only select the appropriate columns based on user roles.