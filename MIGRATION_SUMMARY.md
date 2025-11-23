# 🚀 Sanity Content Migration - Complete Setup

## ✅ What I've Created

I've built a production-ready Node.js migration script that will safely move all your content from the organization's Sanity project (`o1brandp`) to your personal project (`7a9l1mtl`).

### 📦 Files Created

1. **scripts/migrate-content.js** - The main migration script (1000+ lines)
2. **scripts/MIGRATION_GUIDE.md** - Comprehensive documentation with examples
3. **scripts/README.md** - Quick reference guide
4. **ENV_MIGRATION.txt** - Template for environment variables

---

## 🎯 What Gets Migrated

### Content Types
- ✅ **All Products** (50+) with complete data:
  - Name, slug, description, price
  - Multiple images with alt text
  - Categories (as references)
  - Sizes array
  - External URLs
  - SEO metadata (title, description, keywords, OG image)
  - Structured data (SKU, GTIN, availability, ratings)
  
- ✅ **All Blog Posts** (4) with:
  - Title, slug, excerpt
  - Full content (portable text)
  - Cover image
  - Author (as reference)
  - Published date, reading time
  - Category string
  - Tags array
  - Featured flag
  - SEO metadata

- ✅ **All Categories** (product categories):
  - Title, slug, description
  - SEO metadata

- ✅ **All Authors** (blog post authors):
  - Name, slug, bio
  - Avatar image

- ✅ **All Images/Assets**:
  - Downloaded from source
  - Re-uploaded to destination
  - References updated throughout all documents

---

## 🔧 Setup Instructions

### Step 1: Get Your Sanity API Tokens

You need two tokens - one for reading from source, one for writing to destination.

#### Get Source Token (READ permission):
1. Go to https://www.sanity.io/manage
2. Click on your **o1brandp** project
3. Go to **Settings** → **API** → **Tokens**
4. Click **Add API Token**
5. Name: `Migration Read Token`
6. Permissions: **Read**
7. **Copy the token immediately** (you can't see it again!)

#### Get Destination Token (WRITE permission):
1. Go to https://www.sanity.io/manage
2. Click on your **7a9l1mtl** project
3. Go to **Settings** → **API** → **Tokens**
4. Click **Add API Token**
5. Name: `Migration Write Token`
6. Permissions: **Editor** or **Write**
7. **Copy the token immediately**

---

### Step 2: Set Environment Variables

Open your terminal and run these commands (replace with your actual tokens):

```bash
export SANITY_SOURCE_PROJECT_ID=o1brandp
export SANITY_SOURCE_TOKEN=skAbCdEfGhIjKlMnOpQrStUvWxYz123456789
export SANITY_SOURCE_DATASET=production

export SANITY_DEST_PROJECT_ID=7a9l1mtl
export SANITY_DEST_TOKEN=skZyXwVuTsRqPoNmLkJiHgFeDcBa987654321
export SANITY_DEST_DATASET=production

export SANITY_API_VERSION=2023-05-03
```

**Verify they're set:**

```bash
echo $SANITY_SOURCE_TOKEN
echo $SANITY_DEST_TOKEN
```

You should see your tokens printed.

---

### Step 3: Test First (DRY RUN)

**ALWAYS start with a dry run!** This simulates everything without making any changes:

```bash
DRY_RUN=true node scripts/migrate-content.js
```

**Expected output:**

```
🚀 SANITY CONTENT MIGRATION SCRIPT
============================================================
🔍 DRY RUN MODE - No changes will be made

Source Project:      o1brandp
Destination Project: 7a9l1mtl

[Timestamp] Fetching document counts...
✅ Found 52 products
✅ Found 4 posts
✅ Found 8 categories
✅ Found 2 authors

============================================================
📁 MIGRATING CATEGORIES
============================================================
📊 Progress: 1/8 (12.5%) - Migrating category: Skincare
✅ [DRY RUN] Would create category: Skincare
...

============================================================
📊 MIGRATION REPORT
============================================================

✅ Successfully Migrated:
  Categories: 8
  Authors:    2
  Images:     125
  Products:   52
  Posts:      4

🎉 Migration completed!
```

---

### Step 4: Verify Counts

Check what's in each project without migrating:

```bash
VERIFY_ONLY=true node scripts/migrate-content.js
```

**Output shows:**

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

---

### Step 5: Run the Real Migration

When ready:

```bash
node scripts/migrate-content.js
```

**The script will:**

1. ✅ Show you a summary and ask for confirmation
2. ✅ Prompt you to type `YES` to proceed
3. ✅ Migrate content in this order:
   - Categories (needed first for product references)
   - Authors (needed for post references)
   - Products with all images
   - Posts with all images
4. ✅ Show real-time progress
5. ✅ Verify the migration
6. ✅ Print a detailed report

---

## 📊 What to Expect During Migration

### Real-Time Progress

You'll see detailed logging like:

```
============================================================
📁 MIGRATING CATEGORIES
============================================================
📊 Progress: 1/8 (12.5%) - Migrating category: Skincare
✅ Created category: Skincare (category-abc123def456)
📊 Progress: 2/8 (25.0%) - Migrating category: Hair Care
✅ Created category: Hair Care (category-ghi789jkl012)

============================================================
👤 MIGRATING AUTHORS
============================================================
📊 Progress: 1/2 (50.0%) - Migrating author: Jane Smith
Migrating image: jane-avatar.jpg
✅ Migrated image: jane-avatar.jpg -> image-mno345pqr678
✅ Created author: Jane Smith (author-stu901vwx234)

============================================================
🛍️  MIGRATING PRODUCTS
============================================================
📊 Progress: 1/52 (1.9%) - Migrating product: Lavender Face Cream
Migrating image: lavender-cream-front.jpg
✅ Migrated image: lavender-cream-front.jpg -> image-yza567bcd890
Migrating image: lavender-cream-back.jpg
✅ Migrated image: lavender-cream-back.jpg -> image-efg123hij456
✅ Created product: Lavender Face Cream (product-klm789nop012)
```

### Time Estimate

- **Small dataset** (4 posts, 10 products): 2-5 minutes
- **Your dataset** (4 posts, 50+ products): 10-30 minutes
- Image downloads/uploads take the most time

---

## 🛡️ Safety Features

### ✅ No Deletions
- Script NEVER deletes anything from either project
- Only creates new documents in destination

### ✅ Duplicate Detection
- Checks if documents already exist (by slug)
- Skips existing documents
- Maps existing IDs for references

### ✅ Error Isolation
- If one product fails, others continue
- Detailed logging for each error
- Complete report at the end

### ✅ Relationship Preservation
- Product → Category references remapped to new IDs
- Post → Author references remapped to new IDs
- All image references updated correctly

---

## 📋 Final Report

After migration completes, you'll see:

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

🔍 VERIFYING MIGRATION
============================================================

Source Project Counts:
  Products:   52
  Posts:      4
  Categories: 8
  Authors:    2

Destination Project Counts:
  Products:   52
  Posts:      4
  Categories: 8
  Authors:    2

📋 Spot Checking Random Products...
✅ Verified: Lavender Face Cream
✅ Verified: Rose Water Toner
✅ Verified: Coconut Hair Mask
✅ Verified: Green Tea Serum
✅ Verified: Shea Butter Lotion

🎉 Migration completed!
```

---

## ✅ Post-Migration Checklist

After successful migration:

### 1. Verify in Sanity Studio

- Go to https://www.sanity.io/manage
- Open your destination project (`7a9l1mtl`)
- Browse through:
  - Products section
  - Blog posts section
  - Categories
  - Authors
- Check that all content appears correctly

### 2. Test Random Items

**Products:**
- Open 3-5 random products
- Verify all fields are populated
- Check that images load correctly
- Verify categories are linked

**Blog Posts:**
- Open each post (you have 4)
- Verify content is complete
- Check cover images display
- Verify author attribution

### 3. Check Your Frontend

If your frontend is already configured for `7a9l1mtl`:
- No code changes needed!
- Browse your site to verify content displays

### 4. Clean Up (Optional)

For security:
- Revoke the migration tokens from both Sanity projects
- Clear your environment variables:
  ```bash
  unset SANITY_SOURCE_TOKEN
  unset SANITY_DEST_TOKEN
  ```

---

## 🔄 Re-running or Updating

### If Some Items Failed

The migration continues even if individual items fail. To retry:

```bash
node scripts/migrate-content.js
```

The script will skip existing documents and only create missing ones.

### If You Add More Content Later

You can safely re-run the migration:

```bash
node scripts/migrate-content.js
```

Existing documents are detected by slug and skipped automatically.

---

## 🚨 Troubleshooting

### Problem: "Configuration Errors - Token Required"

**Solution:**
```bash
# Make sure environment variables are set
echo $SANITY_SOURCE_TOKEN
echo $SANITY_DEST_TOKEN

# If empty, set them again
export SANITY_SOURCE_TOKEN=your_token_here
export SANITY_DEST_TOKEN=your_token_here
```

### Problem: "Failed to download image"

**Cause:** Network issue or image no longer exists in source

**Solution:** Script will continue with other items. Check the final report for failed images. You can re-run to retry.

### Problem: "Author reference not found"

**Cause:** Author wasn't migrated successfully

**Solution:** Check the authors section of the migration report. The script migrates authors before posts to prevent this.

### Problem: Script is very slow

**Normal!** Large image downloads take time:
- 50+ products with 2-3 images each = 100-150 images
- Each image is downloaded and re-uploaded
- Can take 10-30 minutes total
- Progress is logged in real-time

---

## 📞 Common Questions

### Q: Will this delete my existing content in destination?
**A:** No, the script only creates new documents. Existing content is preserved.

### Q: What if I already have some products in destination?
**A:** Script checks for duplicates by slug and skips them. Only missing products are created.

### Q: Will Stripe IDs and external URLs be preserved?
**A:** Yes! All product fields including `externalUrl` and `structuredData` are copied exactly as-is.

### Q: Can I cancel mid-migration?
**A:** Yes, press Ctrl+C. Documents created so far will remain. Re-run to continue.

### Q: How do I know if it worked?
**A:** The script includes automatic verification that spot-checks random products and compares counts.

---

## 🎯 Quick Command Reference

```bash
# Set environment variables (required first!)
export SANITY_SOURCE_PROJECT_ID=o1brandp
export SANITY_SOURCE_TOKEN=your_source_token
export SANITY_DEST_PROJECT_ID=7a9l1mtl
export SANITY_DEST_TOKEN=your_dest_token
export SANITY_API_VERSION=2023-05-03

# Test run (no changes)
DRY_RUN=true node scripts/migrate-content.js

# Verify counts only
VERIFY_ONLY=true node scripts/migrate-content.js

# Full migration
node scripts/migrate-content.js

# Re-run to retry failures or add new content
node scripts/migrate-content.js
```

---

## 📚 Schema Information (For Reference)

The script migrates these exact schemas from your TypeScript types:

### Product Schema
```typescript
{
  _type: "product",
  name: string,
  slug: { current: string },
  images: Array<{ asset: { _ref: string }, alt: string }>,
  description: BlockContent,
  price: number,
  externalUrl: string,
  isAvailable: boolean,
  categories: Array<{ _ref: string }>,
  sizes: Array<string>,
  seo: { metaTitle, metaDescription, metaKeywords, ogImage, ... },
  structuredData: { brand, sku, gtin, availability, ... }
}
```

### Post Schema
```typescript
{
  _type: "post",
  title: string,
  slug: { current: string },
  excerpt: string,
  content: BlockContent,
  coverImage: { asset: { _ref: string }, alt: string },
  author: { _ref: string },
  publishedAt: string,
  readingTime: string,
  category: string,
  tags: Array<string>,
  featured: boolean,
  seo: { ... }
}
```

All nested objects, arrays, and references are preserved exactly.

---

## ✨ Next Steps

1. **Get your API tokens** from Sanity
2. **Set environment variables** in your terminal
3. **Run dry run** to test: `DRY_RUN=true node scripts/migrate-content.js`
4. **Run migration**: `node scripts/migrate-content.js`
5. **Verify** in Sanity Studio
6. **Celebrate!** 🎉

---

## 📖 Additional Documentation

- **scripts/MIGRATION_GUIDE.md** - Detailed guide with examples
- **scripts/README.md** - Quick reference
- **ENV_MIGRATION.txt** - Environment variable template

---

**Ready to start? Run the dry run first:**

```bash
DRY_RUN=true node scripts/migrate-content.js
```

Good luck! 🚀

