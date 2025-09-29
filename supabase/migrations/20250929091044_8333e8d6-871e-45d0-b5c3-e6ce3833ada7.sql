-- Fix function search path security issue
ALTER FUNCTION public.get_current_user_role() SET search_path = 'public';
ALTER FUNCTION public.count_users_by_role() SET search_path = 'public';
ALTER FUNCTION public.update_user_role(uuid, user_role) SET search_path = 'public';
ALTER FUNCTION public.prevent_direct_role_update() SET search_path = 'public';
ALTER FUNCTION public.handle_new_user() SET search_path = 'public';