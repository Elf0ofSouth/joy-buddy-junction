-- Fix security warnings for has_role function
-- 1. Ensure search_path is set (already done but let's be explicit)
-- 2. Revoke execute from public and authenticated (since we use it in RLS policies, RLS will still work because the policy owner is typically the one checking)
-- Actually, RLS policies check the function, so it needs to be executable by the roles using the policy.
-- But we can restrict it to service_role and authenticated, and then use it in policies.

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, text) FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, text) FROM anon;

GRANT EXECUTE ON FUNCTION public.has_role(uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, text) TO service_role;

-- Fix search path for handle_updated_at
ALTER FUNCTION public.handle_updated_at() SET search_path = public;
REVOKE EXECUTE ON FUNCTION public.handle_updated_at() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.handle_updated_at() TO authenticated;
GRANT EXECUTE ON FUNCTION public.handle_updated_at() TO service_role;
