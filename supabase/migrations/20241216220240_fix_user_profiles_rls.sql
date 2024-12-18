-- Enable RLS on user_profiles table
ALTER TABLE "public"."user_profiles" ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can read their own profile" ON "public"."user_profiles";

-- Add RLS policy to allow users to read their own profile
CREATE POLICY "Users can read their own profile"
ON "public"."user_profiles"
FOR SELECT
USING (auth.uid() = user_id);
