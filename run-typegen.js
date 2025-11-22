#!/usr/bin/env node
const { execSync } = require('child_process');

try {
  console.log('🔄 Extracting schema...');
  execSync('npx sanity schema extract', { stdio: 'inherit' });
  
  console.log('🔄 Generating TypeScript types...');
  execSync('npx sanity typegen generate', { stdio: 'inherit' });
  
  console.log('✅ TypeScript types generated successfully!');
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}

