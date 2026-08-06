# Sanity Content Migration Guide

Complete guide for migrating content from your organization's Sanity project (`o1brandp`) to your personal Sanity project (`7a9l1mtl`).

## 📋 What Gets Migrated

### ✅ Content Types
- **Products** (50+): All product data including images, descriptions, pricing, categories, sizes, SEO, and structured data
- **Blog Posts** (4): Complete posts with content, images, authors, categories, tags, and SEO
- **Categories**: All product categories with descriptions and SEO
- **Authors**: All blog post authors with avatars and bios
- **Images/Assets**: All images referenced by the above content

### 🔄 Data Preservation
- All field values are preserved exactly as they are
- Image quality and metadata maintained
- SEO and structured data copied intact
- Relationships (categories, authors) are properly remapped to new IDs

## 🚀 Quick Start

### 1. Install Dependencies

The script requires `@sanity/client`. Check if it's installed:

```bash
npm list @sanity/client
```

If not installed:

```bash
npm install @sanity/client --save-dev
```

### 2. Get Your Sanity API Tokens

#### For Source Project (o1brandp) - READ Permission:
1. Go to https://www.sanity.io/manage
2. Select your **o1brandp** project
3. Navigate to **Settings > API > Tokens**
4. Click **Add API Token**
5. Name it: `Migration Read Token`
6. Permissions: **Read**
7. Copy the token immediately (you won't see it again!)

#### For Destination Project (7a9l1mtl) - WRITE Permission:
1. Go to https://www.sanity.io/manage
2. Select your **7a9l1mtl** project
3. Navigate to **Settings > API > Tokens**
4. Click **Add API Token**
5. Name it: `Migration Write Token`
6. Permissions: **Write** (or Editor/Administrator)
7. Copy the token immediately

### 3. Configure Environment Variables

Copy the example file:

```bash
cp .env.migration.example .env.migration
```

Edit `.env.migration` with your actual tokens:

```bash
# SOURCE PROJECT (o1brandp)
SANITY_SOURCE_PROJECT_ID=o1brandp
SANITY_SOURCE_TOKEN=skAbCdEfGhIjKlMnOpQrStUvWxYz123456789  # Your actual token
SANITY_SOURCE_DATASET=production

# DESTINATION PROJECT (7a9l1mtl)
SANITY_DEST_PROJECT_ID=7a9l1mtl
SANITY_DEST_TOKEN=skZyXwVuTsRqPoNmLkJiHgFeDcBa987654321  # Your actual token
SANITY_DEST_DATASET=production

SANITY_API_VERSION=2023-05-03
```

### 4. Load Environment Variables

```bash
set -a; source .env.migration; set +a
```

Verify they're loaded:

```bash
echo $SANITY_SOURCE_TOKEN
echo $SANITY_DEST_TOKEN
```

## 🧪 Test First (DRY RUN)

**ALWAYS run a dry run first!** This simulates the migration without making any changes:

```bash
DRY_RUN=true node scripts/migrate-content.js
```

You should see output like:

```
🚀 SANITY CONTENT MIGRATION SCRIPT
============================================================
🔍 DRY RUN MODE - No changes will be made

Source Project:      o1brandp
Destination Project: 7a9l1mtl

✅ Found 52 products
✅ Found 4 posts
✅ Found 8 categories
✅ Found 2 authors

============================================================
📁 MIGRATING CATEGORIES
============================================================
✅ [DRY RUN] Would create category: Skincare
✅ [DRY RUN] Would create category: Hair Care
...
```

## 📊 Verify Before Migrating

Check what's in each project without making changes:

```bash
VERIFY_ONLY=true node scripts/migrate-content.js
```

Output:

```
Source Project Counts:
  Products:   52
  Posts:      4
  Categories: 8
  Authors:    2

Destination Project Counts:
  Products:   0
  Posts:      0
  Categories: 0
  Authors:    0
```

## ⚡ Run the Migration

When you're ready:

```bash
node scripts/migrate-content.js
```

The script will:

1. **Show a confirmation prompt** with counts from both projects
2. **Ask you to type "YES"** to proceed
3. **Migrate in this order:**
   - Categories first (needed for product references)
   - Authors second (needed for post references)
   - Products with all their images
   - Blog posts with all their images

### During Migration

You'll see real-time progress:

```
============================================================
📁 MIGRATING CATEGORIES
============================================================
📊 Progress: 1/8 (12.5%) - Migrating category: Skincare
✅ Created category: Skincare (category-abc123)
📊 Progress: 2/8 (25.0%) - Migrating category: Hair Care
✅ Created category: Hair Care (category-def456)
...

============================================================
🛍️  MIGRATING PRODUCTS
============================================================
📊 Progress: 1/52 (1.9%) - Migrating product: Lavender Face Cream
Migrating image: lavender-cream.jpg
✅ Migrated image: lavender-cream.jpg -> image-xyz789
✅ Created product: Lavender Face Cream (product-ghi789)
...
```

### After Migration

The script will:

1. **Verify the migration** by comparing counts
2. **Spot-check 3-5 random products** to ensure data integrity
3. **Print a detailed report** showing:
   - Total items migrated
   - Any failures (if any)
   - Specific error messages for failed items

## 📈 Expected Results

### Success Output

```
============================================================
📊 MIGRATION REPORT
============================================================

✅ Successfully Migrated:
  Categories: 8
  Authors:    2
  Images:     127
  Products:   52
  Posts:      4

🎉 Migration completed!
```

### If Some Items Fail

The migration continues even if individual items fail:

```
============================================================
📊 MIGRATION REPORT
============================================================

✅ Successfully Migrated:
  Categories: 8
  Authors:    2
  Images:     125
  Products:   50
  Posts:      4

❌ Failed Items:
  Images: 2
    - image-abc123: Network timeout
    - image-def456: Invalid image format
  Products: 2
    - Product XYZ: Missing required field
```

## 🛡️ Safety Features

### ✅ No Deletions
- The script NEVER deletes anything from either project
- It only creates new documents in the destination

### ✅ Duplicate Detection
- Checks for existing documents by slug
- Skips documents that already exist
- Maps existing IDs for references

### ✅ Error Isolation
- If one product fails, others continue
- Detailed error logging for each failure
- Script completes and reports all issues at the end

### ✅ Relationship Preservation
- Product → Category references are remapped
- Post → Author references are remapped
- All image references are updated to new asset IDs

## 🔧 Troubleshooting

### Problem: "Configuration Errors"

```
❌ SANITY_SOURCE_TOKEN is required
```

**Solution:** Make sure environment variables are loaded:

```bash
set -a; source .env.migration; set +a
```

### Problem: "Failed to download image"

**Solution:** Network issues or image no longer exists. The script will continue with other items. Check the failed items report at the end.

### Problem: "Author reference not found"

**Solution:** The author must be migrated before posts. The script handles this automatically, but if you see this error, the author migration may have failed. Check the author migration section of the report.

### Problem: Script hangs or is very slow

**Solution:** 
- Large image downloads take time
- 50+ products with multiple images each can take 10-30 minutes
- Be patient! Progress is logged in real-time

## 📝 Post-Migration Checklist

After successful migration:

1. ✅ **Verify in Sanity Studio**
   - Go to https://www.sanity.io/manage
   - Open your destination project (7a9l1mtl)
   - Check that products, posts, categories appear correctly

2. ✅ **Test a few products**
   - Open 3-5 random products
   - Verify all fields are present
   - Check that images display correctly
   - Verify categories are linked

3. ✅ **Test blog posts**
   - Open each post
   - Verify content is complete
   - Check that cover images display
   - Verify author is linked correctly

4. ✅ **Update Your Frontend**
   - Your frontend should already be configured for the destination project
   - No code changes needed if already using 7a9l1mtl

5. ✅ **Clean Up** (Optional)
   - Revoke migration tokens from both projects
   - Delete `.env.migration` if it contains sensitive data

## 🔄 Re-running the Migration

If you need to migrate new content or retry failed items:

### Incremental Migration
The script automatically skips existing documents, so you can safely re-run it:

```bash
node scripts/migrate-content.js
```

Existing items are detected by slug and skipped.

### Full Re-migration
If you want to start fresh:

1. **Delete all content from destination project** (via Sanity Studio)
2. Run the migration script again

## 📞 Need Help?

If you encounter issues:

1. **Check the error messages** in the migration report
2. **Run in DRY_RUN mode** to diagnose without making changes
3. **Check Sanity project settings** to ensure tokens have correct permissions
4. **Verify network connectivity** for image downloads

## 🎯 Command Reference

```bash
# Test run (no changes)
DRY_RUN=true node scripts/migrate-content.js

# Verify counts only
VERIFY_ONLY=true node scripts/migrate-content.js

# Full migration
node scripts/migrate-content.js

# With environment file
set -a; source .env.migration; set +a && node scripts/migrate-content.js
```

## ⚠️ Important Notes

- **Backup First**: While the script doesn't delete anything, consider backing up your destination project before migrating
- **API Rate Limits**: Sanity has rate limits. Large migrations might need to be paused and resumed
- **Image Quality**: Images are downloaded and re-uploaded, preserving original quality
- **No Stripe Impact**: Product Stripe data is copied as-is. External URLs and Stripe IDs remain unchanged
- **Schema Must Match**: Both projects must have identical schemas for all document types being migrated

---

**Ready to migrate? Start with the dry run!**

```bash
DRY_RUN=true node scripts/migrate-content.js
```

