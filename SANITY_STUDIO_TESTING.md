# Sanity Studio Local Testing Guide

## Configuration Summary

### Current Configuration (`sanity.config.ts`)

- **Project ID:** `o1brandp`
- **Dataset:** `private`
- **Sanity Version:** `^3.99.0` (Sanity v3)
- **Configuration:** Hardcoded in `sanity.config.ts` (no `.env` file needed)

## Step-by-Step Testing Instructions

### 1. Install Dependencies

```bash
# Navigate to CMS repo
cd /Users/mcphajomo/Documents/GitHub/sophron-studies-cms-main

# Install all dependencies
npm install
```

**Expected output:**
- Creates `node_modules/` folder
- Installs Sanity CLI and dependencies
- Takes 1-2 minutes

### 2. Start Sanity Studio

```bash
# Start the development server
npm run dev
```

**Expected output:**
```
✔ Sanity Studio is running at http://localhost:3333
```

**URL:** `http://localhost:3333`

The Studio will automatically open in your default browser. If it doesn't, manually navigate to `http://localhost:3333`.

### 3. Verify Connection to LIVE Project

When Sanity Studio opens, check these indicators:

#### ✅ **Connection Indicators:**

1. **Browser URL Bar:**
   - Should show: `http://localhost:3333`
   - NOT showing: `https://sanity.io` or any cloud URL

2. **Login Screen:**
   - You'll be prompted to log in with your Sanity account
   - This authenticates you to access the LIVE project

3. **After Login - Check Project Info:**
   - Look at the top-left corner of Studio
   - Should show project name: **"sophron-studies"**
   - This confirms you're connected to the correct project

4. **Content Verification:**
   - Navigate to **"📝 Blog"** → **"Blog Posts"**
   - You should see existing blog posts from the LIVE project
   - Navigate to **"🛍️ Shop"** → **"Products"**
   - You should see existing products from the LIVE project
   - **If you see real content, you're connected to LIVE!**

5. **Dataset Indicator:**
   - Check the browser's developer console (F12)
   - Look for API calls to: `https://o1brandp.api.sanity.io`
   - This confirms connection to project `o1brandp` with dataset `private`

#### ⚠️ **Warning Signs (NOT Connected):**

- Empty content lists (no blog posts, no products)
- "Create your first document" messages
- Different project name in Studio
- Error messages about project not found

### 4. Safety Confirmation

#### ✅ **READ-ONLY Operations (Safe):**
- **Viewing content** - 100% safe, no changes made
- **Browsing documents** - Safe, read-only
- **Opening Studio** - Safe, just connects to view data

#### ⚠️ **WRITE Operations (Will Affect LIVE):**
- **Creating new documents** - Creates in LIVE dataset
- **Editing existing documents** - Updates LIVE data
- **Deleting documents** - Deletes from LIVE dataset
- **Publishing changes** - Makes changes live immediately

#### 🛡️ **Protection Measures:**

1. **You're on a feature branch** (`feature/phase-1-faq-schemas`)
   - Schema changes won't affect production until merged
   - But document changes (content) WILL affect live data

2. **Dataset is `private`**
   - This is typically a development/staging dataset
   - Verify with team if this is truly "live" or a staging environment

3. **No Schema Changes Yet**
   - You haven't added FAQ schemas yet
   - Current schemas match what's deployed
   - Safe to browse and verify connection

### 5. Test Checklist

Before proceeding with schema changes, verify:

- [ ] Dependencies installed successfully (`node_modules/` exists)
- [ ] Studio starts without errors (`npm run dev` works)
- [ ] Studio opens at `http://localhost:3333`
- [ ] Can log in with Sanity account
- [ ] Project name shows as "sophron-studies"
- [ ] Can see existing blog posts
- [ ] Can see existing products
- [ ] Browser console shows API calls to `o1brandp.api.sanity.io`
- [ ] No error messages in Studio

## Important Notes

### About the Dataset: `private`

The dataset is named `private`. This could mean:
- **Development/Staging dataset** - Safe for testing
- **Private production dataset** - Contains live data

**Action Required:** Verify with your team:
- Is `private` the live production dataset?
- Or is there a separate `production` dataset?
- Should you be testing against a different dataset?

### About Schema Changes

- **Adding new schemas** (like FAQ) is safe while on a feature branch
- Schema changes only take effect when:
  1. You commit and push the schema files
  2. The changes are deployed to Sanity Studio
  3. The Studio is restarted/redeployed

- **Content changes** (creating/editing documents) affect live data immediately
- **Schema changes** (adding new document types) don't affect existing content

## Troubleshooting

### Studio Won't Start

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Can't Log In

- Check you have access to project `o1brandp`
- Verify your Sanity account has permissions
- Try logging out and back in at sanity.io

### No Content Showing

- Verify you're logged in
- Check browser console for errors
- Verify project ID matches: `o1brandp`
- Check dataset name: `private`

### Wrong Project

- Check `sanity.config.ts` - project ID should be `o1brandp`
- Verify you're in the correct repository
- Check you have access to the project

## Next Steps After Verification

Once you've confirmed Studio connects correctly:

1. ✅ **Don't create/edit any content** (unless testing)
2. ✅ **Proceed with adding FAQ schemas** (safe on feature branch)
3. ✅ **Test schema locally** before pushing
4. ✅ **Create PR** for review before merging

---

**Remember:** Opening Studio is safe. Making content changes will affect live data. Schema changes are safe on a feature branch until deployed.

