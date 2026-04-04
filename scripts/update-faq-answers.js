/**
 * Update existing SPA FAQ documents with answer content (Portable Text).
 *
 * Usage: node scripts/update-faq-answers.js YOUR_SANITY_TOKEN
 *
 * To get your token:
 * 1. Go to https://www.sanity.io/manage
 * 2. Select your project
 * 3. Go to API > Tokens
 * 4. Create a new token with Editor permissions
 */

const { createClient } = require('@sanity/client')
const { randomUUID } = require('crypto')

const token = process.argv[2]

if (!token) {
  console.error('❌ Error: Sanity token is required')
  console.error('Usage: node scripts/update-faq-answers.js YOUR_SANITY_TOKEN')
  console.error('\nTo get your token:')
  console.error('1. Go to https://www.sanity.io/manage')
  console.error('2. Select your project')
  console.error('3. Go to API > Tokens')
  console.error('4. Create a new token with Editor permissions')
  process.exit(1)
}

const client = createClient({
  projectId: 'o1brandp',
  dataset: 'private',
  useCdn: false,
  token,
  apiVersion: '2023-05-03',
})

function toPortableTextAnswer(text) {
  return [
    {
      _type: 'block',
      _key: randomUUID(),
      style: 'normal',
      markDefs: [],
      children: [
        {
          _type: 'span',
          _key: randomUUID(),
          text,
          marks: [],
        },
      ],
    },
  ]
}

/**
 * Match if document question starts with or contains any of the given strings.
 * @param {string} docQuestion
 * @param {string[]} matchTexts
 */
function questionMatches(docQuestion, matchTexts) {
  const q = (docQuestion || '').trim()
  if (!q) return false
  return matchTexts.some((mq) => {
    const m = mq.trim()
    return q.startsWith(m) || q.includes(m)
  })
}

/**
 * FAQ updates. Extra strings in matchQuestions cover variants from older bulk imports
 * (e.g. "programs" vs "materials", or different dash spacing).
 */
const FAQ_UPDATES = [
  {
    matchQuestions: [
      'What makes Sophron Studies different from other Bible study materials?',
      'What makes Sophron Studies different from other Bible study programs?',
    ],
    answer:
      "Sophron Studies is grounded in Reformed theology and uses the inductive Bible study method — observation, interpretation, and application. Our studies are written specifically for women by Melissa McPhail, who holds to the Westminster Confession of Faith. Rather than telling you what to think, we equip you to dig into Scripture yourself and draw sound conclusions rooted in the doctrines of grace.",
  },
  {
    matchQuestions: [
      "What does 'reformed theology' mean, and why does it matter for Bible study?",
    ],
    answer:
      'Reformed theology holds to the five points of Calvinism (TULIP) and the doctrines of grace — the belief that God is completely sovereign in salvation. Sophron Studies aligns with the Westminster Confession of Faith. While we are aware of areas of friendly disagreement between Reformed traditions (such as between the Westminster Confession and the 1689 London Baptist Confession), our studies focus on the core of Reformed theology that unites us rather than the distinctives that divide.',
  },
  {
    matchQuestions: [
      'Are your studies appropriate for beginners, or do I need Bible knowledge first?',
      'Are your studies appropriate for beginners, or do I need Bible study experience?',
    ],
    answer:
      'Absolutely appropriate for beginners. Our studies are designed to meet women where they are. The inductive method actually teaches you how to study the Bible as you go, so no prior experience is required.',
  },
  {
    matchQuestions: ['How long does each study take to complete?'],
    answer:
      'Study length varies by title, but most range from 8 to 12 weeks. Each study clearly indicates its length so you can plan accordingly.',
  },
  {
    matchQuestions: [
      'Can I use these studies for personal study, or are they designed for groups?',
    ],
    answer:
      'Both. While the studies are designed with group discussion in mind, they work equally well for personal study. Many women use them individually and then bring their insights to a group setting.',
  },
  {
    matchQuestions: [
      'What Bible translation do you recommend for these studies?',
    ],
    answer:
      'We recommend the ESV, NASB, CSB, or NIV. The ESV and NASB are particularly well-suited for inductive study due to their accuracy and readability. The CSB is a newer translation that has become popular in Reformed circles and works beautifully alongside our studies.',
  },
  {
    matchQuestions: [
      'Do you offer digital/downloadable versions of your studies?',
    ],
    answer:
      'Currently our studies are only available as printed workbooks. We believe there is something valuable about having a physical book you can write in, mark up, and return to. Digital versions are not available at this time, but stay tuned for updates through the upcoming Sophron app.',
  },
  {
    matchQuestions: ['What are your shipping times and costs?'],
    answer:
      'Orders placed directly through our website typically ship via USPS and arrive within 7 to 10 days. Shipping costs are calculated at checkout based on your location and order size.',
  },
  {
    matchQuestions: ['Do you ship internationally?'],
    answer:
      'We do ship internationally, but we cannot guarantee delivery timeframes for international orders as they are subject to customs and local postal services. For faster and more reliable delivery, we recommend purchasing through Amazon or watching for availability on the upcoming Sophron app.',
  },
  {
    matchQuestions: [
      'Can I purchase in bulk for my church or small group?',
    ],
    answer:
      'Yes. We offer bulk pricing for orders of 10 or more copies. Please reach out to us via email to discuss your needs and we will work out a discount for you.',
  },
  {
    matchQuestions: [
      'Do you offer wholesale pricing for bookstores or ministries?',
    ],
    answer:
      'Yes, wholesale pricing is available for qualifying bookstores and ministries. Please contact us via email with details about your organization and order needs and we will be happy to discuss pricing.',
  },
  {
    matchQuestions: ['What payment methods do you accept?'],
    answer:
      'We accept all major credit and debit cards through our secure checkout. Payment is processed at the time of order.',
  },
  {
    matchQuestions: ['What materials do I need besides the workbook?'],
    answer:
      'You will need a Bible in your preferred translation (we recommend ESV, NASB, CSB, or NIV), a pen or pencil, and colored pencils or highlighters for marking your Bible or workbook. A notebook for additional observations is optional but helpful.',
  },
  {
    matchQuestions: ['How much time should I spend on each lesson?'],
    answer:
      'Most lessons are designed for 30 to 60 minutes of personal study time. If you are in a group, plan for an additional 60 to 90 minutes for discussion. The more time you invest, the more you will get out of it.',
  },
  {
    matchQuestions: [
      'Can I skip around, or should I follow the study in order?',
    ],
    answer:
      'We recommend following the study in order. Our studies are designed to build on each other progressively, and skipping ahead can cause you to miss important context and connections.',
  },
  {
    matchQuestions: [
      'What if I miss a week — can I catch up?',
      'What if I miss a week—can I catch up?',
    ],
    answer:
      'Yes. Each lesson stands on its own well enough that you can catch up without too much difficulty. We recommend completing the missed lesson on your own before rejoining the group so you stay connected to the flow of the study.',
  },
  {
    matchQuestions: [
      'Are the studies better done individually or in a group?',
    ],
    answer:
      'Both are valuable, but there is something special about studying with other women. Group discussion brings out insights you might miss on your own and creates accountability and community. That said, solo study is absolutely worthwhile and many women do both.',
  },
  {
    matchQuestions: [
      'Do I need the leader guide, or is the study workbook enough?',
    ],
    answer:
      'The study workbook is complete on its own for personal study. The leader guide is designed for women facilitating a group and includes discussion questions, teaching notes, and guidance for leading well. Please note that not all studies currently have a companion leader guide, though we are actively working on them. If you are leading a study that does not yet have a leader guide, please reach out to us via email and we will do our best to help.',
  },
  {
    matchQuestions: ["What's included in the leader guide?"],
    answer:
      'The leader guide includes facilitation tips, expanded discussion questions, theological notes to help you answer tough questions, suggested time breakdowns for your group meeting, and encouragement for the leader.',
  },
  {
    matchQuestions: ['How do I facilitate a good Bible study discussion?'],
    answer:
      'The best discussions happen when the leader asks good questions and then gets out of the way. Encourage women to share their own observations from the text, resist the urge to fill silence immediately, and keep the group anchored in what Scripture actually says. Our leader guides provide specific guidance for each lesson.',
  },
  {
    matchQuestions: [
      "What if someone in my group asks a theological question I can't answer?",
    ],
    answer:
      "That is completely normal and nothing to be afraid of. It is always okay to say I don't know, but let's find out together. Write the question down, do some research, and bring the answer back the following week. Modeling humility and a love of learning is itself a gift to your group.",
  },
  {
    matchQuestions: ['Can I make copies of the study for my group members?'],
    answer:
      'No. Each participant should have their own copy of the workbook. Copying the material is a violation of copyright. Bulk pricing is available for groups of 10 or more — please contact us for details.',
  },
  {
    matchQuestions: ['How many women should be in a study group?'],
    answer:
      'There is no perfect number, but most groups work best with 4 to 12 women. Smaller groups allow for deeper discussion, while larger groups bring more diverse perspectives. Groups larger than 12 can be split into smaller discussion circles.',
  },
  {
    matchQuestions: ["What does 'sophron' mean?"],
    answer:
      "Sophron is a Greek word that appears in the New Testament, particularly in Titus 2, and is translated variously as sober-minded, self-controlled, sensible, or prudent. It describes a woman who thinks clearly, lives wisely, and is grounded in sound doctrine. It is the perfect word to describe what these studies aim to cultivate.",
  },
  {
    matchQuestions: ["What denominations align with Sophron Studies' theology?"],
    answer:
      'Sophron Studies aligns most closely with Reformed and Presbyterian traditions, including the Presbyterian Church in America (PCA), the Orthodox Presbyterian Church (OPC), the Associate Reformed Presbyterian Church (ARP), Reformed Baptist churches, and other denominations that hold to the doctrines of grace. Women from a wide range of evangelical backgrounds have found the studies valuable.',
  },
  {
    matchQuestions: ['Do you hold to the doctrines of grace/Calvinism?'],
    answer:
      'Yes. Sophron Studies holds to the five points of Calvinism — Total Depravity, Unconditional Election, Limited Atonement, Irresistible Grace, and Perseverance of the Saints — and aligns with the Westminster Confession of Faith.',
  },
  {
    matchQuestions: ['What is your view on women in ministry and teaching?'],
    answer:
      "Sophron Studies holds to complementarianism — the belief that men and women are equal in dignity and value before God but have different and complementary roles. We believe the office of elder and pastor is reserved for qualified men. Our studies are written for women and are intended to be used in women's ministry contexts. We also believe it is entirely appropriate for mothers to lead their children through these studies as a way of teaching them how to study Scripture inductively.",
  },
  {
    matchQuestions: [
      'Can women from other theological traditions use these studies?',
    ],
    answer:
      'Yes. While our studies are rooted in Reformed theology, women from other evangelical traditions have found them deeply valuable. The inductive method is broadly applicable, and the theological content is handled with care. We simply want to be upfront about where we stand so there are no surprises.',
  },
  {
    matchQuestions: ['What is your return policy?'],
    answer:
      'We accept returns on books that are in the same condition in which they were received — unmarked and undamaged. Return postage is the responsibility of the customer. Please contact us via email before sending a return so we can provide instructions.',
  },
  {
    matchQuestions: ['What if my book arrives damaged?'],
    answer:
      'If your book arrives damaged, please contact us right away with a photo of the damage and we will make it right. We want you to have a book you can actually use.',
  },
  {
    matchQuestions: ['Can I cancel my order?'],
    answer:
      'We process orders quickly, so cancellations need to be requested as soon as possible after ordering. Please contact us immediately via email if you need to cancel. Once an order has shipped, it cannot be cancelled but may be eligible for return.',
  },
  {
    matchQuestions: ['How long does a refund take?'],
    answer:
      'Once we receive your returned book and verify its condition, refunds are typically processed within 5 to 7 business days. Please note that if a returned book has marks, writing, or damage, we reserve the right to charge the full price of the book.',
  },
]

async function main() {
  console.log('\n🚀 Fetching FAQ documents from Sanity...\n')

  const faqs = await client.fetch(`*[_type == "faq"]{_id, question}`)

  if (!faqs.length) {
    console.warn('⚠️  No FAQ documents found. Nothing to update.')
    return
  }

  console.log(`Found ${faqs.length} FAQ document(s) in the dataset.\n`)

  const usedIds = new Set()
  let updatedCount = 0
  let errorCount = 0
  const notFound = []

  for (let i = 0; i < FAQ_UPDATES.length; i++) {
    const entry = FAQ_UPDATES[i]
    const doc = faqs.find(
      (f) => !usedIds.has(f._id) && questionMatches(f.question, entry.matchQuestions)
    )

    if (!doc) {
      const label = entry.matchQuestions[0]
      console.warn(`⚠️  No matching document for (${i + 1}/${FAQ_UPDATES.length}): "${label}"`)
      notFound.push(label)
      continue
    }

    try {
      const answer = toPortableTextAnswer(entry.answer)
      await client.patch(doc._id).set({ answer }).commit()
      usedIds.add(doc._id)
      updatedCount++
      console.log(
        ` ${updatedCount}. ✅ Updated (${i + 1}/${FAQ_UPDATES.length}): "${doc.question}"`
      )
    } catch (err) {
      errorCount++
      console.error(`❌ Failed to update "${doc.question}":`, err.message || err)
    }
  }

  console.log('\n' + '='.repeat(60))
  console.log('Summary')
  console.log('='.repeat(60))
  console.log(`✅ Updated: ${updatedCount}`)
  console.log(`📋 FAQ update definitions: ${FAQ_UPDATES.length}`)
  console.log(`❌ Errors: ${errorCount}`)
  if (notFound.length) {
    console.log(`⚠️  No match for ${notFound.length} definition(s):`)
    notFound.forEach((q) => console.log(`   - ${q}`))
  }
  console.log('')
}

main().catch((err) => {
  console.error('\n❌ Fatal error:', err)
  process.exit(1)
})
