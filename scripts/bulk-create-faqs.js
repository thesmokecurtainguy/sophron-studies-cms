/**
 * Bulk Create FAQ Categories and FAQs
 * 
 * This script:
 * 1. Creates/verifies FAQ categories exist
 * 2. Creates FAQ documents with questions and placeholder answers
 * 
 * Usage: node scripts/bulk-create-faqs.js YOUR_SANITY_TOKEN
 * 
 * To get your token:
 * 1. Go to https://www.sanity.io/manage
 * 2. Select your project
 * 3. Go to API > Tokens
 * 4. Create a new token with Editor permissions
 */

const { createClient } = require('@sanity/client')

// Get the token from command line arguments
const token = process.argv[2]

if (!token) {
  console.error('❌ Error: Sanity token is required')
  console.error('Usage: node scripts/bulk-create-faqs.js YOUR_SANITY_TOKEN')
  console.error('\nTo get your token:')
  console.error('1. Go to https://www.sanity.io/manage')
  console.error('2. Select your project')
  console.error('3. Go to API > Tokens')
  console.error('4. Create a new token with Editor permissions')
  process.exit(1)
}

// Sanity client configuration
const client = createClient({
  projectId: '7a9l1mtl',
  dataset: 'private',
  useCdn: false,
  token: token,
  apiVersion: '2023-05-03'
})

// Minimal blank answer block (required by schema validation - min 1 block required)
// This creates an empty block that satisfies validation but appears blank in the editor
const blankAnswer = [
  {
    _type: 'block',
    _key: 'blank',
    style: 'normal',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: 'blank-span',
        text: '', // Empty text - will appear blank
        marks: []
      }
    ]
  }
]

// FAQ Categories to create
const categories = [
  {
    title: 'About Our Studies',
    slug: 'about-our-studies',
    description: 'Questions about what makes Sophron Studies unique and how to get started',
    order: 1
  },
  {
    title: 'Ordering & Shipping',
    slug: 'ordering-shipping',
    description: 'Information about purchasing, shipping, and bulk orders',
    order: 2
  },
  {
    title: 'Using the Studies',
    slug: 'using-the-studies',
    description: 'Practical guidance on how to use and complete the studies',
    order: 3
  },
  {
    title: 'Leader Resources',
    slug: 'leader-resources',
    description: 'Resources and guidance for study leaders and facilitators',
    order: 4
  },
  {
    title: 'Theology & Doctrine',
    slug: 'theology-doctrine',
    description: 'Questions about theological foundations and denominational alignment',
    order: 5
  },
  {
    title: 'Returns & Policies',
    slug: 'returns-policies',
    description: 'Return policies, damaged items, cancellations, and refunds',
    order: 6
  }
]

// FAQs organized by category slug
const faqsByCategory = {
  'about-our-studies': [
    'What makes Sophron Studies different from other Bible study programs?',
    'What does \'reformed theology\' mean, and why does it matter for Bible study?',
    'Are your studies appropriate for beginners, or do I need Bible study experience?',
    'How long does each study take to complete?',
    'Can I use these studies for personal study, or are they designed for groups?',
    'What Bible translation do you recommend for these studies?'
  ],
  'ordering-shipping': [
    'Do you offer digital/downloadable versions of your studies?',
    'What are your shipping times and costs?',
    'Do you ship internationally?',
    'Can I purchase in bulk for my church or small group?',
    'Do you offer wholesale pricing for bookstores or ministries?',
    'What payment methods do you accept?'
  ],
  'using-the-studies': [
    'What materials do I need besides the workbook?',
    'How much time should I spend on each lesson?',
    'Can I skip around, or should I follow the study in order?',
    'What if I miss a week—can I catch up?',
    'Are the studies better done individually or in a group?'
  ],
  'leader-resources': [
    'Do I need the leader guide, or is the study workbook enough?',
    'What\'s included in the leader guide?',
    'How do I facilitate a good Bible study discussion?',
    'What if someone in my group asks a theological question I can\'t answer?',
    'Can I make copies of the study for my group members?',
    'How many women should be in a study group?'
  ],
  'theology-doctrine': [
    'What does \'sophron\' mean?',
    'What denominations align with Sophron Studies\' theology?',
    'Do you hold to the doctrines of grace/Calvinism?',
    'What is your view on women in ministry and teaching?',
    'Can women from other theological traditions use these studies?'
  ],
  'returns-policies': [
    'What is your return policy?',
    'What if my book arrives damaged?',
    'Can I cancel my order?',
    'How long does a refund take?'
  ]
}

/**
 * Create or verify FAQ categories exist
 */
async function createCategories() {
  console.log('\n📁 Step 1: Creating/verifying FAQ categories...\n')
  
  const categoryMap = new Map()
  
  for (const category of categories) {
    try {
      // Check if category already exists
      const existing = await client.fetch(
        `*[_type == "faqCategory" && slug.current == $slug][0]`,
        { slug: category.slug }
      )
      
      if (existing) {
        console.log(`✅ Category "${category.title}" already exists (ID: ${existing._id})`)
        categoryMap.set(category.slug, existing._id)
        
        // Update order if needed
        if (existing.order !== category.order) {
          await client
            .patch(existing._id)
            .set({ order: category.order })
            .commit()
          console.log(`   Updated order to ${category.order}`)
        }
      } else {
        // Create new category
        const newCategory = {
          _type: 'faqCategory',
          title: category.title,
          slug: { _type: 'slug', current: category.slug },
          description: category.description,
          order: category.order
        }
        
        const created = await client.create(newCategory)
        console.log(`✅ Created category "${category.title}" (ID: ${created._id})`)
        categoryMap.set(category.slug, created._id)
      }
    } catch (error) {
      console.error(`❌ Error processing category "${category.title}":`, error.message)
    }
  }
  
  return categoryMap
}

/**
 * Create FAQs for a category
 */
async function createFaqsForCategory(categorySlug, categoryId, questions) {
  const results = {
    created: 0,
    skipped: 0,
    errors: 0
  }
  
  for (let i = 0; i < questions.length; i++) {
    const question = questions[i]
    const order = i + 1
    
    try {
      // Check if FAQ already exists
      const existing = await client.fetch(
        `*[_type == "faq" && question == $question && category._ref == $categoryId][0]`,
        { question, categoryId }
      )
      
      if (existing) {
        console.log(`   ⏭️  Skipped: "${question.substring(0, 60)}..." (already exists)`)
        results.skipped++
        
        // Update order if needed
        if (existing.order !== order) {
          await client
            .patch(existing._id)
            .set({ order })
            .commit()
          console.log(`      Updated order to ${order}`)
        }
        continue
      }
      
      // Create new FAQ
      const newFaq = {
        _type: 'faq',
        question: question,
        answer: blankAnswer, // Blank answer (empty block to satisfy validation)
        category: {
          _type: 'reference',
          _ref: categoryId
        },
        order: order
      }
      
      const created = await client.create(newFaq)
      console.log(`   ✅ Created FAQ #${order}: "${question.substring(0, 60)}..."`)
      results.created++
    } catch (error) {
      console.error(`   ❌ Error creating FAQ "${question.substring(0, 60)}...":`, error.message)
      results.errors++
    }
  }
  
  return results
}

/**
 * Main function to create all FAQs
 */
async function createAllFaqs() {
  console.log('\n🚀 Starting bulk FAQ creation...\n')
  
  try {
    // Step 1: Create categories
    const categoryMap = await createCategories()
    
    if (categoryMap.size === 0) {
      console.error('\n❌ No categories were created or found. Aborting.')
      return
    }
    
    // Step 2: Create FAQs
    console.log('\n📝 Step 2: Creating FAQ documents...\n')
    
    let totalCreated = 0
    let totalSkipped = 0
    let totalErrors = 0
    
    for (const [categorySlug, categoryId] of categoryMap) {
      const questions = faqsByCategory[categorySlug]
      
      if (!questions || questions.length === 0) {
        console.log(`⚠️  No questions found for category: ${categorySlug}`)
        continue
      }
      
      // Get category title for display
      const category = categories.find(c => c.slug === categorySlug)
      const categoryTitle = category ? category.title : categorySlug
      
      console.log(`\n📂 Category: ${categoryTitle}`)
      console.log(`   Creating ${questions.length} FAQs...\n`)
      
      const results = await createFaqsForCategory(categorySlug, categoryId, questions)
      
      totalCreated += results.created
      totalSkipped += results.skipped
      totalErrors += results.errors
      
      console.log(`\n   Summary: ${results.created} created, ${results.skipped} skipped, ${results.errors} errors`)
    }
    
    // Final summary
    console.log('\n' + '='.repeat(60))
    console.log('✨ Bulk FAQ creation complete!')
    console.log('='.repeat(60))
    console.log(`✅ Created: ${totalCreated} FAQs`)
    console.log(`⏭️  Skipped: ${totalSkipped} FAQs (already existed)`)
    console.log(`❌ Errors: ${totalErrors} FAQs`)
    console.log('\n💡 Next steps:')
    console.log('   1. Go to Sanity Studio')
    console.log('   2. Navigate to FAQ documents')
    console.log('   3. Fill in the answers (currently blank/empty)')
    console.log('\n')
    
  } catch (error) {
    console.error('\n❌ Fatal error:', error)
    process.exit(1)
  }
}

// Run the script
createAllFaqs()

