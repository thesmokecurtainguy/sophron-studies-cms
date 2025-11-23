# ⚡ Quick Start - Sanity Migration

## Copy-Paste Commands (Step-by-Step)

### Step 1: Get API Tokens

1. **Source token (READ):** https://www.sanity.io/manage/personal/project/o1brandp/settings/api
2. **Destination token (WRITE):** https://www.sanity.io/manage/personal/project/7a9l1mtl/settings/api

### Step 2: Set Environment Variables

Copy these lines, **replace with your actual tokens**, and paste in terminal:

```bash
export SANITY_SOURCE_PROJECT_ID=o1brandp
export SANITY_SOURCE_TOKEN=paste_your_source_token_here
export SANITY_SOURCE_DATASET=production

export SANITY_DEST_PROJECT_ID=7a9l1mtl
export SANITY_DEST_TOKEN=paste_your_destination_token_here
export SANITY_DEST_DATASET=production

export SANITY_API_VERSION=2023-05-03
```

**Verify:**

```bash
echo "Source: $SANITY_SOURCE_TOKEN"
echo "Dest: $SANITY_DEST_TOKEN"
```

### Step 3: Test (Dry Run)

```bash
DRY_RUN=true node scripts/migrate-content.js
```

✅ Look for: "🎉 Migration completed!"

### Step 4: Check Counts

```bash
VERIFY_ONLY=true node scripts/migrate-content.js
```

✅ Verify counts look correct

### Step 5: Run Real Migration

```bash
node scripts/migrate-content.js
```

- Type `YES` when prompted
- Wait 10-30 minutes
- Check for "🎉 Migration completed!"

### Step 6: Verify

Go to: https://www.sanity.io/manage/personal/project/7a9l1mtl

Check products, posts, categories, and authors appear.

---

## If Something Goes Wrong

**Re-run safely:**
```bash
node scripts/migrate-content.js
```

The script skips existing documents, so it's safe to re-run!

---

## That's It!

See **MIGRATION_SUMMARY.md** for complete documentation.

