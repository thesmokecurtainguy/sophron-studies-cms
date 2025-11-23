# Sanity Migration Scripts

## 📁 Contents

- **migrate-content.js** - Complete migration script for moving all content between Sanity projects
- **MIGRATION_GUIDE.md** - Comprehensive guide with step-by-step instructions

## 🚀 Quick Start

### 1. Set Environment Variables

Copy the values from `ENV_MIGRATION.txt` in the root, replace with your tokens, and run in your terminal:

```bash
export SANITY_SOURCE_PROJECT_ID=o1brandp
export SANITY_SOURCE_TOKEN=your_source_read_token_here
export SANITY_SOURCE_DATASET=production

export SANITY_DEST_PROJECT_ID=7a9l1mtl
export SANITY_DEST_TOKEN=your_destination_write_token_here
export SANITY_DEST_DATASET=production

export SANITY_API_VERSION=2023-05-03
```

### 2. Test First (Dry Run)

```bash
DRY_RUN=true node scripts/migrate-content.js
```

### 3. Run Migration

```bash
node scripts/migrate-content.js
```

## 📖 Full Documentation

See [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) for complete instructions, troubleshooting, and examples.

## ⚡ Command Reference

```bash
# Dry run (test mode - no changes)
DRY_RUN=true node scripts/migrate-content.js

# Verify only (check counts)
VERIFY_ONLY=true node scripts/migrate-content.js

# Full migration
node scripts/migrate-content.js
```

## 🔑 Getting Sanity API Tokens

1. Go to https://www.sanity.io/manage
2. Select your project
3. Navigate to Settings > API > Tokens
4. Create token:
   - **Source project**: Read permissions
   - **Destination project**: Write permissions

## 🎯 What Gets Migrated

- ✅ Products (50+) with all fields
- ✅ Blog Posts (4) with all content
- ✅ Categories
- ✅ Authors
- ✅ All images/assets

## 🛡️ Safety

- Never deletes anything
- Checks for duplicates
- Continues on errors
- Detailed error reporting

