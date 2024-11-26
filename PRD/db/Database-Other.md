# **Database Other Configurations**

## **1. Backup Procedures**

### **1.1 Backup Configuration**
```sql
-- Configure WAL archiving
ALTER SYSTEM SET archive_mode = on;
ALTER SYSTEM SET archive_command = 'test ! -f /path/to/archive/%f && cp %p /path/to/archive/%f';
ALTER SYSTEM SET archive_timeout = '1h';

-- Configure retention
ALTER SYSTEM SET wal_keep_segments = 32;
```

### **1.2 Backup Scripts**
```bash
#!/bin/bash

# Full backup
pg_dump -Fc -f "/path/to/backups/full_$(date +%Y%m%d).dump" database_name

# Incremental backup via WAL archiving
pg_basebackup -D /path/to/backups/base -Ft -Xs -P
```

### **1.3 Restore Procedures**
```bash
#!/bin/bash

# Restore from full backup
pg_restore -d database_name "/path/to/backups/full_backup.dump"

# Point-in-time recovery
restore_command = 'cp /path/to/archive/%f %p'
recovery_target_time = '2023-01-01 00:00:00'
```

## **2. Monitoring**

### **2.1 Performance Monitoring Views**
```sql
-- Create monitoring schema
CREATE SCHEMA monitoring;

-- Add GP role monitoring
CREATE VIEW monitoring.gp_role_audit AS
SELECT
    u.email,
    up.first_name,
    up.last_name,
    up.is_gp_user,
    gr.role_type as gp_role,
    gr.created_at as role_assigned,
    gr.created_by as assigned_by
FROM user_profiles up
JOIN auth.users u ON up.user_id = u.id
LEFT JOIN gp_roles gr ON up.user_id = gr.user_id
WHERE up.is_gp_user = true
AND gr.deleted_at IS NULL;

-- Add GP action monitoring
CREATE VIEW monitoring.gp_actions AS
SELECT
    a.activity_type,
    a.title,
    a.description,
    u.email as performed_by,
    gr.role_type as gp_role,
    a.created_at
FROM activities a
JOIN user_profiles up ON a.user_id = up.user_id
JOIN auth.users u ON up.user_id = u.id
JOIN gp_roles gr ON up.user_id = gr.user_id
WHERE up.is_gp_user = true
AND gr.deleted_at IS NULL
ORDER BY a.created_at DESC;

-- Table size monitoring
CREATE VIEW monitoring.table_sizes AS
SELECT
    schemaname,
    relname,
    pg_size_pretty(pg_total_relation_size(relid)) as total_size,
    pg_size_pretty(pg_relation_size(relid)) as table_size,
    pg_size_pretty(pg_total_relation_size(relid) - pg_relation_size(relid)) as index_size
FROM pg_catalog.pg_statio_user_tables
ORDER BY pg_total_relation_size(relid) DESC;

-- Index usage monitoring
CREATE VIEW monitoring.index_usage AS
SELECT
    schemaname,
    tablename,
    indexname,
    idx_scan as number_of_scans,
    idx_tup_read as tuples_read,
    idx_tup_fetch as tuples_fetched
FROM pg_catalog.pg_statio_user_indexes;

-- Query performance monitoring
CREATE VIEW monitoring.slow_queries AS
SELECT
    query,
    calls,
    total_time,
    mean_time,
    rows
FROM pg_stat_statements
ORDER BY total_time DESC;
```

### **2.2 Health Check Views**
```sql
-- Connection monitoring
CREATE VIEW monitoring.connection_stats AS
SELECT
    datname,
    numbackends,
    xact_commit,
    xact_rollback,
    blks_read,
    blks_hit,
    tup_returned,
    tup_fetched,
    tup_inserted,
    tup_updated,
    tup_deleted
FROM pg_stat_database;

-- Lock monitoring
CREATE VIEW monitoring.locks AS
SELECT
    locktype,
    relation::regclass,
    mode,
    granted,
    pid
FROM pg_locks
WHERE NOT granted;

-- Transaction monitoring
CREATE VIEW monitoring.transaction_stats AS
SELECT
    pid,
    usename,
    application_name,
    client_addr,
    backend_start,
    xact_start,
    query_start,
    state
FROM pg_stat_activity
WHERE state != 'idle';
```

## **3. Troubleshooting**

### **3.1 Diagnostic Views**
```sql
-- Add GP access diagnostic view
CREATE VIEW monitoring.gp_access_diagnostic AS
SELECT
    u.email,
    up.first_name,
    up.last_name,
    up.is_gp_user,
    up.is_lp_user,
    gr.role_type as gp_role,
    COUNT(DISTINCT r.account_id) as lp_account_count,
    STRING_AGG(DISTINCT r.role_type, ', ') as lp_roles
FROM user_profiles up
JOIN auth.users u ON up.user_id = u.id
LEFT JOIN gp_roles gr ON up.user_id = gr.user_id
LEFT JOIN roles r ON up.user_id = r.user_id
WHERE (up.is_gp_user = true OR up.is_lp_user = true)
AND up.deleted_at IS NULL
GROUP BY u.email, up.first_name, up.last_name, up.is_gp_user, up.is_lp_user, gr.role_type;

-- Table bloat check
CREATE VIEW monitoring.table_bloat AS
SELECT
    schemaname,
    tablename,
    pg_size_pretty(bloat_size) as bloat_size,
    bloat_ratio
FROM (
    SELECT
        schemaname,
        tablename,
        pg_total_relation_size(tablename::regclass) as total_size,
        pg_relation_size(tablename::regclass) as table_size,
        pg_total_relation_size(tablename::regclass) - pg_relation_size(tablename::regclass) as bloat_size,
        round(100 * (pg_total_relation_size(tablename::regclass) - pg_relation_size(tablename::regclass))::numeric / pg_total_relation_size(tablename::regclass), 2) as bloat_ratio
    FROM pg_tables
    WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
) as bloat_stats;

-- Long-running queries
CREATE VIEW monitoring.active_queries AS
SELECT
    pid,
    age(clock_timestamp(), query_start) as duration,
    query,
    state
FROM pg_stat_activity
WHERE state != 'idle'
ORDER BY duration DESC;

-- Dead tuple accumulation
CREATE VIEW monitoring.dead_tuples AS
SELECT
    schemaname,
    relname,
    n_dead_tup,
    n_live_tup,
    round(100 * n_dead_tup::numeric / nullif(n_live_tup, 0), 2) as dead_tuple_ratio
FROM pg_stat_user_tables
ORDER BY n_dead_tup DESC;
```

### **3.2 Maintenance Procedures**
```sql
-- Regular VACUUM
CREATE OR REPLACE FUNCTION maintenance.vacuum_tables()
RETURNS void AS $$
DECLARE
    table_name text;
BEGIN
    FOR table_name IN 
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public'
    LOOP
        EXECUTE 'VACUUM ANALYZE ' || table_name;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Index maintenance
CREATE OR REPLACE FUNCTION maintenance.reindex_tables()
RETURNS void AS $$
DECLARE
    index_name text;
BEGIN
    FOR index_name IN 
        SELECT indexname 
        FROM pg_indexes 
        WHERE schemaname = 'public'
    LOOP
        EXECUTE 'REINDEX INDEX ' || index_name;
    END LOOP;
END;
$$ LANGUAGE plpgsql;
```

## **4. Migration Procedures**

### **4.1 Pre-Migration Checks**
```sql
-- Check foreign key constraints
SELECT
    conname as constraint_name,
    conrelid::regclass as table_name,
    confrelid::regclass as referenced_table,
    contype as constraint_type
FROM pg_constraint
WHERE contype = 'f'
ORDER BY conrelid::regclass::text, conname;

-- Check index coverage
SELECT
    schemaname,
    tablename,
    indexname,
    idx_scan,
    idx_tup_read,
    idx_tup_fetch
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;
```

### **4.2 Migration Steps**
1. **Preparation**
   ```sql
   -- Create backup
   pg_dump -Fc -f "pre_migration_backup.dump" database_name
   
   -- Disable triggers
   ALTER TABLE table_name DISABLE TRIGGER ALL;
   ```

2. **Schema Migration**
   ```sql
   -- Create new tables
   BEGIN;
   -- Execute schema changes from Database-Schemas.md
   COMMIT;
   ```

3. **Data Migration**
   ```sql
   -- Migrate data
   INSERT INTO new_table (
       SELECT columns 
       FROM old_table
   );
   ```

4. **Post-Migration**
   ```sql
   -- Enable triggers
   ALTER TABLE table_name ENABLE TRIGGER ALL;
   
   -- Verify constraints
   ALTER TABLE table_name VALIDATE CONSTRAINT constraint_name;
   
   -- Update statistics
   ANALYZE VERBOSE;
   ```

### **4.3 Rollback Procedures**
```sql
-- Rollback plan
BEGIN;
    -- Drop new objects
    DROP TABLE IF EXISTS new_table;
    
    -- Restore original state
    \i rollback_script.sql
COMMIT;

-- Restore from backup if needed
pg_restore -d database_name "pre_migration_backup.dump"
```

## **5. Notes**

1. **Backup Strategy**
   - Full backups daily
   - WAL archiving continuous
   - Retention period 30 days
   - Test restores monthly

2. **Monitoring Strategy**
   - Check performance views daily
   - Monitor slow queries hourly
   - Track connection counts
   - Alert on lock contentions

3. **Maintenance Strategy**
   - VACUUM ANALYZE weekly
   - Reindex monthly
   - Update statistics daily
   - Check for bloat weekly

4. **Migration Strategy**
   - Always have rollback plan
   - Test migrations in staging
   - Maintain audit trail
   - Verify data integrity

5. **Troubleshooting Guidelines**
   - Check logs first
   - Monitor system resources
   - Track query performance
   - Document all issues
