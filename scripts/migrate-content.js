#!/usr/bin/env node

/**
 * ========================================
 * SANITY CONTENT MIGRATION SCRIPT
 * ========================================
 * 
 * Migrates products, blog posts, categories, authors, and images
 * from source Sanity project (o1brandp) to destination project (7a9l1mtl)
 * 
 * Usage:
 *   DRY_RUN=true node scripts/migrate-content.js       # Test run (no changes)
 *   VERIFY_ONLY=true node scripts/migrate-content.js   # Only verify counts
 *   node scripts/migrate-content.js                    # Full migration
 * 
 * Required Environment Variables:
 *   SANITY_SOURCE_PROJECT_ID
 *   SANITY_SOURCE_TOKEN
 *   SANITY_DEST_PROJECT_ID
 *   SANITY_DEST_TOKEN
 *   SANITY_API_VERSION
 */

const { createClient } = require('@sanity/client');
const https = require('https');
const http = require('http');
const readline = require('readline');
const fs = require('fs');
const path = require('path');

// ========================================
// CONFIGURATION
// ========================================

const CONFIG = {
  source: {
    projectId: process.env.SANITY_SOURCE_PROJECT_ID || 'o1brandp',
    token: process.env.SANITY_SOURCE_TOKEN,
    dataset: process.env.SANITY_SOURCE_DATASET || 'production',
  },
  destination: {
    projectId: process.env.SANITY_DEST_PROJECT_ID || '7a9l1mtl',
    token: process.env.SANITY_DEST_TOKEN,
    dataset: process.env.SANITY_DEST_DATASET || 'production',
  },
  apiVersion: process.env.SANITY_API_VERSION || '2023-05-03',
  dryRun: process.env.DRY_RUN === 'true',
  verifyOnly: process.env.VERIFY_ONLY === 'true',
};

// ========================================
// VALIDATION
// ========================================

function validateConfig() {
  const errors = [];
  
  if (!CONFIG.source.token) {
    errors.push('❌ SANITY_SOURCE_TOKEN is required');
  }
  if (!CONFIG.destination.token) {
    errors.push('❌ SANITY_DEST_TOKEN is required');
  }
  
  if (errors.length > 0) {
    console.error('\n🚨 Configuration Errors:\n');
    errors.forEach(err => console.error(`  ${err}`));
    console.error('\nPlease set the required environment variables.\n');
    process.exit(1);
  }
}

// ========================================
// CLIENT SETUP
// ========================================

let sourceClient, destClient;

try {
  sourceClient = createClient({
    projectId: CONFIG.source.projectId,
    dataset: CONFIG.source.dataset,
    token: CONFIG.source.token,
    apiVersion: CONFIG.apiVersion,
    useCdn: false,
  });

  destClient = createClient({
    projectId: CONFIG.destination.projectId,
    dataset: CONFIG.destination.dataset,
    token: CONFIG.destination.token,
    apiVersion: CONFIG.apiVersion,
    useCdn: false,
  });
} catch (error) {
  console.error('❌ Failed to create Sanity clients:', error.message);
  process.exit(1);
}

// ========================================
// MIGRATION STATE
// ========================================

const migrationState = {
  images: {
    assetMap: new Map(), // oldAssetId -> newAssetId
    urlMap: new Map(),   // oldUrl -> newAssetId
    processed: new Set(),
    failed: [],
  },
  categories: {
    idMap: new Map(), // oldId -> newId
    processed: new Set(),
    failed: [],
  },
  authors: {
    idMap: new Map(), // oldId -> newId
    processed: new Set(),
    failed: [],
  },
  products: {
    migrated: 0,
    failed: [],
  },
  posts: {
    migrated: 0,
    failed: [],
  },
};

// ========================================
// LOGGING UTILITIES
// ========================================

function log(message, ...args) {
  console.log(`[${new Date().toISOString()}] ${message}`, ...args);
}

function logSuccess(message, ...args) {
  console.log(`✅ ${message}`, ...args);
}

function logError(message, ...args) {
  console.error(`❌ ${message}`, ...args);
}

function logWarning(message, ...args) {
  console.warn(`⚠️  ${message}`, ...args);
}

function logProgress(current, total, message) {
  const percent = ((current / total) * 100).toFixed(1);
  console.log(`📊 Progress: ${current}/${total} (${percent}%) - ${message}`);
}

// ========================================
// USER CONFIRMATION
// ========================================

async function confirmMigration(sourceCounts, destCounts) {
  if (CONFIG.dryRun || CONFIG.verifyOnly) {
    return true;
  }

  console.log('\n' + '='.repeat(60));
  console.log('🚨 MIGRATION CONFIRMATION REQUIRED');
  console.log('='.repeat(60));
  console.log('\nSource Project:', CONFIG.source.projectId);
  console.log('  Products:', sourceCounts.products);
  console.log('  Posts:', sourceCounts.posts);
  console.log('  Categories:', sourceCounts.categories);
  console.log('  Authors:', sourceCounts.authors);
  console.log('\nDestination Project:', CONFIG.destination.projectId);
  console.log('  Existing Products:', destCounts.products);
  console.log('  Existing Posts:', destCounts.posts);
  console.log('  Existing Categories:', destCounts.categories);
  console.log('  Existing Authors:', destCounts.authors);
  console.log('\n⚠️  This will create NEW documents in the destination project.');
  console.log('⚠️  Existing documents will NOT be deleted.');
  console.log('\n' + '='.repeat(60));

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question('\n⚡ Type "YES" to proceed with migration: ', (answer) => {
      rl.close();
      resolve(answer.trim().toUpperCase() === 'YES');
    });
  });
}

// ========================================
// FETCH DATA FROM SOURCE
// ========================================

async function fetchAllProducts() {
  log('Fetching all products from source...');
  const query = `*[_type == "product" && !(_id in path("drafts.**"))] {
    _id,
    _type,
    name,
    slug,
    images,
    description,
    price,
    externalUrl,
    isAvailable,
    categories,
    sizes,
    seo,
    structuredData,
    _createdAt,
    _updatedAt
  }`;
  
  try {
    const products = await sourceClient.fetch(query);
    logSuccess(`Found ${products.length} products`);
    return products;
  } catch (error) {
    logError('Failed to fetch products:', error.message);
    throw error;
  }
}

async function fetchAllPosts() {
  log('Fetching all blog posts from source...');
  const query = `*[_type == "post" && !(_id in path("drafts.**"))] {
    _id,
    _type,
    title,
    slug,
    excerpt,
    content,
    coverImage,
    author,
    publishedAt,
    readingTime,
    category,
    tags,
    featured,
    seo,
    _createdAt,
    _updatedAt
  }`;
  
  try {
    const posts = await sourceClient.fetch(query);
    logSuccess(`Found ${posts.length} posts`);
    return posts;
  } catch (error) {
    logError('Failed to fetch posts:', error.message);
    throw error;
  }
}

async function fetchAllCategories() {
  log('Fetching all categories from source...');
  const query = `*[_type == "category" && !(_id in path("drafts.**"))] {
    _id,
    _type,
    title,
    slug,
    description,
    seo,
    _createdAt,
    _updatedAt
  }`;
  
  try {
    const categories = await sourceClient.fetch(query);
    logSuccess(`Found ${categories.length} categories`);
    return categories;
  } catch (error) {
    logError('Failed to fetch categories:', error.message);
    throw error;
  }
}

async function fetchAllAuthors() {
  log('Fetching all authors from source...');
  const query = `*[_type == "author" && !(_id in path("drafts.**"))] {
    _id,
    _type,
    name,
    slug,
    avatar,
    bio,
    _createdAt,
    _updatedAt
  }`;
  
  try {
    const authors = await sourceClient.fetch(query);
    logSuccess(`Found ${authors.length} authors`);
    return authors;
  } catch (error) {
    logError('Failed to fetch authors:', error.message);
    throw error;
  }
}

async function getDocumentCounts(client) {
  const counts = {};
  
  try {
    counts.products = await client.fetch(`count(*[_type == "product" && !(_id in path("drafts.**"))])`);
    counts.posts = await client.fetch(`count(*[_type == "post" && !(_id in path("drafts.**"))])`);
    counts.categories = await client.fetch(`count(*[_type == "category" && !(_id in path("drafts.**"))])`);
    counts.authors = await client.fetch(`count(*[_type == "author" && !(_id in path("drafts.**"))])`);
  } catch (error) {
    logError('Failed to get document counts:', error.message);
    throw error;
  }
  
  return counts;
}

// ========================================
// IMAGE/ASSET MIGRATION
// ========================================

function extractImageReferences(doc) {
  const refs = new Set();
  
  function traverse(obj) {
    if (!obj || typeof obj !== 'object') return;
    
    // Check for image asset references
    if (obj._type === 'image' && obj.asset && obj.asset._ref) {
      refs.add(obj.asset._ref);
    }
    
    // Recursively check arrays and objects
    if (Array.isArray(obj)) {
      obj.forEach(traverse);
    } else {
      Object.values(obj).forEach(traverse);
    }
  }
  
  traverse(doc);
  return Array.from(refs);
}

async function downloadImage(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    
    protocol.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: ${response.statusCode}`));
        return;
      }
      
      const chunks = [];
      response.on('data', (chunk) => chunks.push(chunk));
      response.on('end', () => resolve(Buffer.concat(chunks)));
      response.on('error', reject);
    }).on('error', reject);
  });
}

async function migrateImage(assetId) {
  if (migrationState.images.assetMap.has(assetId)) {
    return migrationState.images.assetMap.get(assetId);
  }
  
  if (migrationState.images.processed.has(assetId)) {
    return null; // Already tried and failed
  }
  
  migrationState.images.processed.add(assetId);
  
  try {
    // Fetch asset metadata from source
    const asset = await sourceClient.fetch(`*[_id == $id][0]`, { id: assetId });
    
    if (!asset || !asset.url) {
      logWarning(`Asset not found: ${assetId}`);
      return null;
    }
    
    log(`Migrating image: ${asset.originalFilename || assetId}`);
    
    if (CONFIG.dryRun) {
      logSuccess(`[DRY RUN] Would migrate: ${asset.originalFilename}`);
      const fakeId = `image-${Date.now()}-${Math.random()}`;
      migrationState.images.assetMap.set(assetId, fakeId);
      return fakeId;
    }
    
    // Download the image
    const imageBuffer = await downloadImage(asset.url);
    
    // Upload to destination
    const uploadedAsset = await destClient.assets.upload('image', imageBuffer, {
      filename: asset.originalFilename || 'image',
      contentType: asset.mimeType,
    });
    
    logSuccess(`Migrated image: ${asset.originalFilename} -> ${uploadedAsset._id}`);
    migrationState.images.assetMap.set(assetId, uploadedAsset._id);
    migrationState.images.urlMap.set(asset.url, uploadedAsset._id);
    
    return uploadedAsset._id;
  } catch (error) {
    logError(`Failed to migrate image ${assetId}:`, error.message);
    migrationState.images.failed.push({ assetId, error: error.message });
    return null;
  }
}

function updateImageReferences(obj, assetMap) {
  if (!obj || typeof obj !== 'object') return obj;
  
  if (Array.isArray(obj)) {
    return obj.map(item => updateImageReferences(item, assetMap));
  }
  
  const updated = { ...obj };
  
  // Update image asset references
  if (updated._type === 'image' && updated.asset && updated.asset._ref) {
    const oldRef = updated.asset._ref;
    const newRef = assetMap.get(oldRef);
    
    if (newRef) {
      updated.asset = { ...updated.asset, _ref: newRef };
    } else {
      logWarning(`No mapping found for image asset: ${oldRef}`);
    }
  }
  
  // Recursively update nested objects
  Object.keys(updated).forEach(key => {
    if (typeof updated[key] === 'object' && updated[key] !== null) {
      updated[key] = updateImageReferences(updated[key], assetMap);
    }
  });
  
  return updated;
}

// ========================================
// CATEGORY MIGRATION
// ========================================

async function migrateCategories(categories) {
  log(`\n${'='.repeat(60)}`);
  log('📁 MIGRATING CATEGORIES');
  log('='.repeat(60));
  
  for (let i = 0; i < categories.length; i++) {
    const category = categories[i];
    logProgress(i + 1, categories.length, `Migrating category: ${category.title}`);
    
    try {
      // Check if category already exists by slug
      const existing = await destClient.fetch(
        `*[_type == "category" && slug.current == $slug][0]`,
        { slug: category.slug?.current }
      );
      
      if (existing) {
        logWarning(`Category already exists: ${category.title}, mapping to existing`);
        migrationState.categories.idMap.set(category._id, existing._id);
        migrationState.categories.processed.add(category._id);
        continue;
      }
      
      if (CONFIG.dryRun) {
        logSuccess(`[DRY RUN] Would create category: ${category.title}`);
        const fakeId = `category-${Date.now()}-${Math.random()}`;
        migrationState.categories.idMap.set(category._id, fakeId);
        migrationState.categories.processed.add(category._id);
        continue;
      }
      
      // Prepare category document (remove internal fields)
      const { _id, _createdAt, _updatedAt, _rev, ...categoryData } = category;
      
      // Process any images in SEO
      if (categoryData.seo?.ogImage) {
        const imageRefs = extractImageReferences(categoryData.seo.ogImage);
        for (const ref of imageRefs) {
          await migrateImage(ref);
        }
        categoryData.seo.ogImage = updateImageReferences(
          categoryData.seo.ogImage,
          migrationState.images.assetMap
        );
      }
      
      // Create in destination
      const created = await destClient.create(categoryData);
      
      logSuccess(`Created category: ${category.title} (${created._id})`);
      migrationState.categories.idMap.set(category._id, created._id);
      migrationState.categories.processed.add(category._id);
      
    } catch (error) {
      logError(`Failed to migrate category ${category.title}:`, error.message);
      migrationState.categories.failed.push({
        id: category._id,
        title: category.title,
        error: error.message,
      });
    }
  }
  
  logSuccess(`\nCategories migrated: ${migrationState.categories.processed.size}`);
  if (migrationState.categories.failed.length > 0) {
    logWarning(`Categories failed: ${migrationState.categories.failed.length}`);
  }
}

// ========================================
// AUTHOR MIGRATION
// ========================================

async function migrateAuthors(authors) {
  log(`\n${'='.repeat(60)}`);
  log('👤 MIGRATING AUTHORS');
  log('='.repeat(60));
  
  for (let i = 0; i < authors.length; i++) {
    const author = authors[i];
    logProgress(i + 1, authors.length, `Migrating author: ${author.name}`);
    
    try {
      // Check if author already exists by slug or name
      const existing = await destClient.fetch(
        `*[_type == "author" && (slug.current == $slug || name == $name)][0]`,
        { slug: author.slug?.current, name: author.name }
      );
      
      if (existing) {
        logWarning(`Author already exists: ${author.name}, mapping to existing`);
        migrationState.authors.idMap.set(author._id, existing._id);
        migrationState.authors.processed.add(author._id);
        continue;
      }
      
      if (CONFIG.dryRun) {
        logSuccess(`[DRY RUN] Would create author: ${author.name}`);
        const fakeId = `author-${Date.now()}-${Math.random()}`;
        migrationState.authors.idMap.set(author._id, fakeId);
        migrationState.authors.processed.add(author._id);
        continue;
      }
      
      // Prepare author document (remove internal fields)
      const { _id, _createdAt, _updatedAt, _rev, ...authorData } = author;
      
      // Migrate avatar image if present
      if (authorData.avatar) {
        const imageRefs = extractImageReferences(authorData.avatar);
        for (const ref of imageRefs) {
          await migrateImage(ref);
        }
        authorData.avatar = updateImageReferences(
          authorData.avatar,
          migrationState.images.assetMap
        );
      }
      
      // Create in destination
      const created = await destClient.create(authorData);
      
      logSuccess(`Created author: ${author.name} (${created._id})`);
      migrationState.authors.idMap.set(author._id, created._id);
      migrationState.authors.processed.add(author._id);
      
    } catch (error) {
      logError(`Failed to migrate author ${author.name}:`, error.message);
      migrationState.authors.failed.push({
        id: author._id,
        name: author.name,
        error: error.message,
      });
    }
  }
  
  logSuccess(`\nAuthors migrated: ${migrationState.authors.processed.size}`);
  if (migrationState.authors.failed.length > 0) {
    logWarning(`Authors failed: ${migrationState.authors.failed.length}`);
  }
}

// ========================================
// PRODUCT MIGRATION
// ========================================

async function migrateProducts(products) {
  log(`\n${'='.repeat(60)}`);
  log('🛍️  MIGRATING PRODUCTS');
  log('='.repeat(60));
  
  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    logProgress(i + 1, products.length, `Migrating product: ${product.name}`);
    
    try {
      // Check if product already exists
      const existing = await destClient.fetch(
        `*[_type == "product" && slug.current == $slug][0]`,
        { slug: product.slug?.current }
      );
      
      if (existing) {
        logWarning(`Product already exists: ${product.name}, skipping`);
        continue;
      }
      
      if (CONFIG.dryRun) {
        logSuccess(`[DRY RUN] Would create product: ${product.name}`);
        migrationState.products.migrated++;
        continue;
      }
      
      // Prepare product document (remove internal fields)
      const { _id, _createdAt, _updatedAt, _rev, ...productData } = product;
      
      // Migrate all product images
      if (productData.images && Array.isArray(productData.images)) {
        for (const image of productData.images) {
          const imageRefs = extractImageReferences(image);
          for (const ref of imageRefs) {
            await migrateImage(ref);
          }
        }
        productData.images = updateImageReferences(
          productData.images,
          migrationState.images.assetMap
        );
      }
      
      // Migrate SEO image if present
      if (productData.seo?.ogImage) {
        const imageRefs = extractImageReferences(productData.seo.ogImage);
        for (const ref of imageRefs) {
          await migrateImage(ref);
        }
        productData.seo.ogImage = updateImageReferences(
          productData.seo.ogImage,
          migrationState.images.assetMap
        );
      }
      
      // Update category references
      if (productData.categories && Array.isArray(productData.categories)) {
        productData.categories = productData.categories.map(ref => {
          if (ref._ref) {
            const newRef = migrationState.categories.idMap.get(ref._ref);
            if (newRef) {
              return { ...ref, _ref: newRef };
            } else {
              logWarning(`No mapping for category reference: ${ref._ref}`);
              return ref;
            }
          }
          return ref;
        });
      }
      
      // Create in destination
      const created = await destClient.create(productData);
      
      logSuccess(`Created product: ${product.name} (${created._id})`);
      migrationState.products.migrated++;
      
    } catch (error) {
      logError(`Failed to migrate product ${product.name}:`, error.message);
      migrationState.products.failed.push({
        id: product._id,
        name: product.name,
        error: error.message,
      });
    }
  }
  
  logSuccess(`\nProducts migrated: ${migrationState.products.migrated}`);
  if (migrationState.products.failed.length > 0) {
    logWarning(`Products failed: ${migrationState.products.failed.length}`);
  }
}

// ========================================
// BLOG POST MIGRATION
// ========================================

async function migratePosts(posts) {
  log(`\n${'='.repeat(60)}`);
  log('📝 MIGRATING BLOG POSTS');
  log('='.repeat(60));
  
  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    logProgress(i + 1, posts.length, `Migrating post: ${post.title}`);
    
    try {
      // Check if post already exists
      const existing = await destClient.fetch(
        `*[_type == "post" && slug.current == $slug][0]`,
        { slug: post.slug?.current }
      );
      
      if (existing) {
        logWarning(`Post already exists: ${post.title}, skipping`);
        continue;
      }
      
      if (CONFIG.dryRun) {
        logSuccess(`[DRY RUN] Would create post: ${post.title}`);
        migrationState.posts.migrated++;
        continue;
      }
      
      // Prepare post document (remove internal fields)
      const { _id, _createdAt, _updatedAt, _rev, ...postData } = post;
      
      // Migrate cover image
      if (postData.coverImage) {
        const imageRefs = extractImageReferences(postData.coverImage);
        for (const ref of imageRefs) {
          await migrateImage(ref);
        }
        postData.coverImage = updateImageReferences(
          postData.coverImage,
          migrationState.images.assetMap
        );
      }
      
      // Migrate SEO image if present
      if (postData.seo?.ogImage) {
        const imageRefs = extractImageReferences(postData.seo.ogImage);
        for (const ref of imageRefs) {
          await migrateImage(ref);
        }
        postData.seo.ogImage = updateImageReferences(
          postData.seo.ogImage,
          migrationState.images.assetMap
        );
      }
      
      // Update author reference
      if (postData.author && postData.author._ref) {
        const newAuthorRef = migrationState.authors.idMap.get(postData.author._ref);
        if (newAuthorRef) {
          postData.author = { ...postData.author, _ref: newAuthorRef };
        } else {
          logWarning(`No mapping for author reference: ${postData.author._ref}`);
        }
      }
      
      // Create in destination
      const created = await destClient.create(postData);
      
      logSuccess(`Created post: ${post.title} (${created._id})`);
      migrationState.posts.migrated++;
      
    } catch (error) {
      logError(`Failed to migrate post ${post.title}:`, error.message);
      migrationState.posts.failed.push({
        id: post._id,
        title: post.title,
        error: error.message,
      });
    }
  }
  
  logSuccess(`\nPosts migrated: ${migrationState.posts.migrated}`);
  if (migrationState.posts.failed.length > 0) {
    logWarning(`Posts failed: ${migrationState.posts.failed.length}`);
  }
}

// ========================================
// VERIFICATION
// ========================================

async function verifyMigration() {
  log(`\n${'='.repeat(60)}`);
  log('🔍 VERIFYING MIGRATION');
  log('='.repeat(60));
  
  const sourceCounts = await getDocumentCounts(sourceClient);
  const destCounts = await getDocumentCounts(destClient);
  
  console.log('\nSource Project Counts:');
  console.log(`  Products:   ${sourceCounts.products}`);
  console.log(`  Posts:      ${sourceCounts.posts}`);
  console.log(`  Categories: ${sourceCounts.categories}`);
  console.log(`  Authors:    ${sourceCounts.authors}`);
  
  console.log('\nDestination Project Counts:');
  console.log(`  Products:   ${destCounts.products}`);
  console.log(`  Posts:      ${destCounts.posts}`);
  console.log(`  Categories: ${destCounts.categories}`);
  console.log(`  Authors:    ${destCounts.authors}`);
  
  // Spot check: verify 3-5 random products
  console.log('\n📋 Spot Checking Random Products...');
  
  const sourceProducts = await sourceClient.fetch(
    `*[_type == "product" && !(_id in path("drafts.**"))] | order(_createdAt desc) [0...5] { name, slug, price, images }`
  );
  
  for (const product of sourceProducts) {
    const destProduct = await destClient.fetch(
      `*[_type == "product" && slug.current == $slug][0]`,
      { slug: product.slug?.current }
    );
    
    if (destProduct) {
      const fieldsMatch = destProduct.name === product.name && destProduct.price === product.price;
      const imagesMatch = destProduct.images?.length === product.images?.length;
      
      if (fieldsMatch && imagesMatch) {
        logSuccess(`Verified: ${product.name}`);
      } else {
        logWarning(`Mismatch: ${product.name} - fields: ${fieldsMatch}, images: ${imagesMatch}`);
      }
    } else {
      logError(`Missing: ${product.name}`);
    }
  }
  
  return { sourceCounts, destCounts };
}

// ========================================
// FINAL REPORT
// ========================================

function printFinalReport() {
  log(`\n${'='.repeat(60)}`);
  log('📊 MIGRATION REPORT');
  log('='.repeat(60));
  
  console.log('\n✅ Successfully Migrated:');
  console.log(`  Categories: ${migrationState.categories.processed.size}`);
  console.log(`  Authors:    ${migrationState.authors.processed.size}`);
  console.log(`  Images:     ${migrationState.images.assetMap.size}`);
  console.log(`  Products:   ${migrationState.products.migrated}`);
  console.log(`  Posts:      ${migrationState.posts.migrated}`);
  
  if (
    migrationState.categories.failed.length > 0 ||
    migrationState.authors.failed.length > 0 ||
    migrationState.images.failed.length > 0 ||
    migrationState.products.failed.length > 0 ||
    migrationState.posts.failed.length > 0
  ) {
    console.log('\n❌ Failed Items:');
    
    if (migrationState.categories.failed.length > 0) {
      console.log(`  Categories: ${migrationState.categories.failed.length}`);
      migrationState.categories.failed.forEach(f => 
        console.log(`    - ${f.title}: ${f.error}`)
      );
    }
    
    if (migrationState.authors.failed.length > 0) {
      console.log(`  Authors: ${migrationState.authors.failed.length}`);
      migrationState.authors.failed.forEach(f => 
        console.log(`    - ${f.name}: ${f.error}`)
      );
    }
    
    if (migrationState.images.failed.length > 0) {
      console.log(`  Images: ${migrationState.images.failed.length}`);
      migrationState.images.failed.forEach(f => 
        console.log(`    - ${f.assetId}: ${f.error}`)
      );
    }
    
    if (migrationState.products.failed.length > 0) {
      console.log(`  Products: ${migrationState.products.failed.length}`);
      migrationState.products.failed.forEach(f => 
        console.log(`    - ${f.name}: ${f.error}`)
      );
    }
    
    if (migrationState.posts.failed.length > 0) {
      console.log(`  Posts: ${migrationState.posts.failed.length}`);
      migrationState.posts.failed.forEach(f => 
        console.log(`    - ${f.title}: ${f.error}`)
      );
    }
  }
  
  console.log('\n' + '='.repeat(60));
}

// ========================================
// MAIN EXECUTION
// ========================================

async function main() {
  console.log('\n' + '='.repeat(60));
  console.log('🚀 SANITY CONTENT MIGRATION SCRIPT');
  console.log('='.repeat(60));
  
  if (CONFIG.dryRun) {
    console.log('\n🔍 DRY RUN MODE - No changes will be made\n');
  }
  
  if (CONFIG.verifyOnly) {
    console.log('\n🔍 VERIFY ONLY MODE - Only checking counts\n');
  }
  
  // Validate configuration
  validateConfig();
  
  console.log('\nSource Project:     ', CONFIG.source.projectId);
  console.log('Destination Project:', CONFIG.destination.projectId);
  console.log('API Version:        ', CONFIG.apiVersion);
  console.log('');
  
  try {
    // Get initial counts
    log('Fetching document counts...');
    const sourceCounts = await getDocumentCounts(sourceClient);
    const destCounts = await getDocumentCounts(destClient);
    
    if (CONFIG.verifyOnly) {
      await verifyMigration();
      return;
    }
    
    // Confirm migration
    const confirmed = await confirmMigration(sourceCounts, destCounts);
    if (!confirmed) {
      console.log('\n❌ Migration cancelled by user.\n');
      return;
    }
    
    console.log('\n✅ Starting migration...\n');
    
    // Fetch all data
    const categories = await fetchAllCategories();
    const authors = await fetchAllAuthors();
    const products = await fetchAllProducts();
    const posts = await fetchAllPosts();
    
    // Migrate in order (dependencies first)
    await migrateCategories(categories);
    await migrateAuthors(authors);
    await migrateProducts(products);
    await migratePosts(posts);
    
    // Verify results
    await verifyMigration();
    
    // Print final report
    printFinalReport();
    
    logSuccess('\n🎉 Migration completed!\n');
    
  } catch (error) {
    logError('\n💥 Migration failed with error:');
    console.error(error);
    process.exit(1);
  }
}

// Run the migration
main();

