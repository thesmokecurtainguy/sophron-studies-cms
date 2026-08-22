/**
 * This script adds predefined categories to Sanity
 * Run this script with: `node add-categories-simple.js YOUR_TOKEN_HERE`
 */
const { createClient } = require('@sanity/client')

// Get the token from command line arguments
const token = process.argv[2];

if (!token) {
  console.error('Error: Token is required');
  console.error('Usage: node add-categories-simple.js YOUR_TOKEN_HERE');
  process.exit(1);
}

// Live Sophron Studies identity (must match liveSanity.ts)
const client = createClient({
  projectId: 'o1brandp',
  dataset: 'private',
  useCdn: false, // `false` to ensure fresh data
  token: token, // Use the token passed as argument
  apiVersion: '2023-05-03'
})

// Define the categories to add
const categories = [
  {
    _type: 'category',
    title: 'Old Testament',
    slug: { _type: 'slug', current: 'old-testament' },
    description: 'Studies focused on the Old Testament'
  },
  {
    _type: 'category',
    title: 'New Testament',
    slug: { _type: 'slug', current: 'new-testament' },
    description: 'Studies focused on the New Testament'
  },
  {
    _type: 'category',
    title: 'Prayer Books',
    slug: { _type: 'slug', current: 'prayer-books' },
    description: 'Books and studies about prayer'
  },
  {
    _type: 'category',
    title: 'Topical Devotionals',
    slug: { _type: 'slug', current: 'topical-devotionals' },
    description: 'Devotionals organized by topic'
  },
  {
    _type: 'category',
    title: 'Seasonal Books',
    slug: { _type: 'slug', current: 'seasonal-books' },
    description: 'Books for specific seasons like Advent, Lent, etc.'
  },
  {
    _type: 'category',
    title: 'Sophron Tweens & Teens',
    slug: { _type: 'slug', current: 'tweens-teens' },
    description: 'Studies designed for tweens and teens'
  },
  {
    _type: 'category',
    title: 'Sophron Kids',
    slug: { _type: 'slug', current: 'kids' },
    description: 'Studies designed for children'
  }
]

// Function to create categories
async function createCategories() {
  console.log('Creating categories...')
  
  // For each category, create a transaction
  const transaction = client.transaction()
  
  for (const category of categories) {
    console.log(`Processing category: ${category.title}`)
    
    try {
      // Check if category already exists
      const existingCategory = await client.fetch(
        `*[_type == "category" && slug.current == $slug][0]`,
        { slug: category.slug.current }
      )
      
      if (existingCategory) {
        console.log(`Category "${category.title}" already exists, skipping.`)
        continue
      }
      
      // Create the category
      transaction.create(category)
    } catch (error) {
      console.error(`Error processing category ${category.title}:`, error)
    }
  }
  
  // Commit all transactions
  try {
    const result = await transaction.commit()
    console.log('Successfully created categories!')
    console.log(result)
  } catch (error) {
    console.error('Error creating categories:', error)
  }
}

// Run the function
createCategories() 