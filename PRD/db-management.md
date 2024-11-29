# Supabase Command Guide and Workflows

## Command Details

### Setup & Authentication
```bash
# Install Supabase CLI locally
pnpm install supabase --save-dev

# Check if you're logged into Supabase
# Use this to verify your authentication status
pnpm supabase login status

# Connect local project to Supabase cloud project
# The project-ref is found in your Supabase dashboard URL
pnpm supabase link --project-ref lszdhhcpjrcbciuftnit
```

### Database Sync Commands
```bash
# PULL: Download schema from cloud to local
# Use this to update your local db with cloud changes
pnpm supabase db pull

# PUSH: Upload local schema changes to cloud
# Use this to apply your local changes to the cloud
pnpm supabase db push

# Generate TypeScript types from current database schema
# Updates your local types file with latest db structure
pnpm supabase gen types typescript > src/types/database.ts

# Show what changes would sync to cloud before pushing
# Preview changes without applying them
pnpm supabase db remote changes

# Get the URL showing pending migration details
# Useful for reviewing changes before applying
pnpm supabase db remote commit --show-url
```

### Local Development Commands
```bash
# Start local Supabase instance
# Runs local version of all Supabase services
pnpm supabase start

# Stop local Supabase instance
# Shuts down all local Supabase services
pnpm supabase stop

# Reset local database to clean state
# Drops everything and reapplies migrations
pnpm supabase db reset

# Reset AND sync with linked project
# Use when you want to match cloud exactly
pnpm supabase db reset --linked
```

### Migration Commands
```bash
# Create a new migration file
# Use for tracking database changes
pnpm supabase migration new <migration-name>

# Show all migrations and their status
pnpm supabase migration list

# Apply any pending migrations
pnpm supabase migration up

# Check if migrations are properly applied
pnpm supabase migration verify
```

## Common Workflows

### 1. Initial Project Setup
```bash
# 1. Install CLI
pnpm install supabase --save-dev

# 2. Log in to Supabase
pnpm supabase login

# 3. Link to your cloud project
pnpm supabase link --project-ref <project-ref>

# 4. Pull current database schema
pnpm supabase db pull

# 5. Generate TypeScript types (if already linked)
pnpm supabase gen types typescript --linked
```

### 2. Refresh Local from Cloud
```bash
# 1. Pull latest schema
pnpm supabase db pull

# 2. Update TypeScript types
pnpm supabase gen types typescript --linked > src/types/database.ts

# 3. Reset local DB to match cloud (if needed)
pnpm supabase db reset --linked
```

### 3. Push Local Changes to Cloud
```bash
# 1. Review pending changes
pnpm supabase db remote changes

# 2. Optional: Check detailed change URL
pnpm supabase db remote commit --show-url

# 3. Push changes to cloud
pnpm supabase db push
```

### 4. Creating and Applying Migrations
```bash
# 1. Create new migration
pnpm supabase migration new add_users_table

# 2. Edit the migration file in supabase/migrations

# 3. Apply migration locally
pnpm supabase db reset

# 4. Verify migration
pnpm supabase migration verify

# 5. Push to cloud
pnpm supabase db push
```

### 5. Troubleshooting Steps
```bash
# 1. Check Supabase status
pnpm supabase status

# 2. View error logs
pnpm supabase logs

# 3. Reset to clean state
pnpm supabase db reset --linked

# 4. Regenerate types
pnpm supabase gen types typescript --linked > src/types/database.ts
```

## Important Notes

1. **Pull vs Push**
   - `db pull`: Downloads cloud schema to local
   - `db push`: Uploads local changes to cloud
   - Always pull before making local changes

2. **Reset Commands**
   - `db reset`: Cleans local DB only
   - `db reset --linked`: Cleans and syncs with cloud
   - Use `--linked` when you want to match cloud exactly

3. **Type Generation**
   - Always regenerate types after schema changes
   - Required for TypeScript type safety
   - Run after pulls and migrations

4. **Migration Files**
   - Live in `supabase/migrations`
   - Named with timestamps
   - Applied in chronological order

5. **Best Practices**
   - Always review changes before pushing
   - Back up data before major changes
   - Keep local and cloud in sync
   - Test migrations locally first


   Other

   supabase db dump > supabase/migrations/schema.sql