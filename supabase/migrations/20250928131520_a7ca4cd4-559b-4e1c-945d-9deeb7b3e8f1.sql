-- Create RPC function to count users by role for better performance
CREATE OR REPLACE FUNCTION public.count_users_by_role()
RETURNS TABLE(role user_role, count bigint)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $function$
  SELECT 
    p.role,
    COUNT(*) as count
  FROM public.profiles p
  WHERE p.is_active = true
  GROUP BY p.role
  ORDER BY p.role;
$function$;