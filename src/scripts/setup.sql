-- Setup auth schema and policies
CREATE SCHEMA IF NOT EXISTS auth;

-- Ensure auth.users table exists
CREATE TABLE IF NOT EXISTS auth.users (
  id uuid PRIMARY KEY,
  email text UNIQUE NOT NULL
);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA auth TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA auth TO postgres, service_role;
GRANT SELECT ON ALL TABLES IN SCHEMA auth TO anon, authenticated;

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE gp_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE beneficial_owners ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable all access for service role" ON user_profiles
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Enable all access for service role" ON gp_roles
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Enable all access for service role" ON companies
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Enable all access for service role" ON accounts
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Enable all access for service role" ON investments
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Enable all access for service role" ON beneficial_owners
  FOR ALL USING (auth.role() = 'service_role');
