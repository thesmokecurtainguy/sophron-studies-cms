#!/bin/bash

# Verification script for migration files
echo "🔍 Verifying Migration Files in Sanity CMS Repo"
echo "================================================"
echo ""

# Check scripts directory
echo "📁 Checking scripts directory:"
if [ -f "scripts/migrate-content.js" ]; then
    echo "✅ scripts/migrate-content.js ($(wc -l < scripts/migrate-content.js) lines)"
else
    echo "❌ scripts/migrate-content.js - MISSING!"
fi

if [ -f "scripts/MIGRATION_GUIDE.md" ]; then
    echo "✅ scripts/MIGRATION_GUIDE.md"
else
    echo "❌ scripts/MIGRATION_GUIDE.md - MISSING!"
fi

if [ -f "scripts/README.md" ]; then
    echo "✅ scripts/README.md"
else
    echo "❌ scripts/README.md - MISSING!"
fi

echo ""
echo "📄 Checking root documentation files:"

if [ -f "QUICK_START.md" ]; then
    echo "✅ QUICK_START.md"
else
    echo "❌ QUICK_START.md - MISSING!"
fi

if [ -f "MIGRATION_SUMMARY.md" ]; then
    echo "✅ MIGRATION_SUMMARY.md"
else
    echo "❌ MIGRATION_SUMMARY.md - MISSING!"
fi

if [ -f "MIGRATION_COMPLETE.md" ]; then
    echo "✅ MIGRATION_COMPLETE.md"
else
    echo "❌ MIGRATION_COMPLETE.md - MISSING!"
fi

if [ -f "ENV_MIGRATION.txt" ]; then
    echo "✅ ENV_MIGRATION.txt"
else
    echo "❌ ENV_MIGRATION.txt - MISSING!"
fi

echo ""
echo "🔒 Checking .gitignore:"
if grep -q ".env.migration" .gitignore; then
    echo "✅ .env.migration entries added to .gitignore"
else
    echo "❌ .env.migration not found in .gitignore!"
fi

echo ""
echo "✅ Testing script syntax:"
if node -c scripts/migrate-content.js 2>/dev/null; then
    echo "✅ migrate-content.js syntax is valid!"
else
    echo "❌ migrate-content.js has syntax errors!"
fi

echo ""
echo "================================================"
echo "✅ Verification Complete!"
echo ""
echo "Next steps:"
echo "1. Open QUICK_START.md for instructions"
echo "2. Get your API tokens from Sanity"
echo "3. Run: DRY_RUN=true node scripts/migrate-content.js"

