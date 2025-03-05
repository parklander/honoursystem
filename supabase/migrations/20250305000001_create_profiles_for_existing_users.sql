-- Create profiles for existing users who don't have one
INSERT INTO public.user_profiles (id, full_name)
SELECT 
    au.id,
    COALESCE(au.raw_user_meta_data->>'full_name', au.email)
FROM auth.users au
LEFT JOIN public.user_profiles up ON up.id = au.id
WHERE up.id IS NULL; 