import { defineField, defineType } from 'sanity'

/**
 * FAQ Schema
 * Individual FAQ items with questions and answers
 */
export default defineType({
  name: 'faq',
  title: 'FAQ',
  type: 'document',
  icon: () => '❓',
  fields: [
    defineField({
      name: 'question',
      title: 'Question',
      type: 'string',
      description: 'The FAQ question (100-200 characters recommended)',
      validation: (Rule) =>
        Rule.required()
          .min(10)
          .max(200)
          .warning('Questions should be between 10-200 characters for best readability'),
    }),
    defineField({
      name: 'answer',
      title: 'Answer',
      type: 'array',
      description: 'The answer to the question (supports rich text formatting)',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H3', value: 'h3' },
            { title: 'H4', value: 'h4' },
            { title: 'Quote', value: 'blockquote' },
          ],
          lists: [
            { title: 'Bullet', value: 'bullet' },
            { title: 'Number', value: 'number' },
          ],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
              { title: 'Code', value: 'code' },
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  {
                    name: 'href',
                    type: 'url',
                    title: 'URL',
                    validation: (Rule) =>
                      Rule.uri({
                        allowRelative: true,
                        scheme: ['http', 'https', 'mailto'],
                      }),
                  },
                  {
                    name: 'blank',
                    type: 'boolean',
                    title: 'Open in new tab',
                    initialValue: false,
                  },
                ],
              },
            ],
          },
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'faqCategory' }],
      description: 'The category this FAQ belongs to',
      validation: (Rule) => Rule.required(),
      options: {
        disableNew: true,
      },
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Number for sorting FAQs within the category (lower numbers appear first)',
      validation: (Rule) => Rule.min(0).integer(),
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      description: 'Tags for searchability and filtering',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      description: 'Highlight this FAQ on the homepage',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      question: 'question',
      category: 'category.title',
      featured: 'featured',
      order: 'order',
    },
    prepare({ question, category, featured, order }) {
      return {
        title: question || 'Untitled Question',
        subtitle: [
          category && `Category: ${category}`,
          featured && '⭐ Featured',
          order !== undefined && `Order: ${order}`,
        ]
          .filter(Boolean)
          .join(' • '),
        media: featured ? '⭐' : '❓',
      }
    },
  },
  orderings: [
    {
      title: 'Order (Low to High)',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
    {
      title: 'Order (High to Low)',
      name: 'orderDesc',
      by: [{ field: 'order', direction: 'desc' }],
    },
    {
      title: 'Category, then Order',
      name: 'categoryOrder',
      by: [
        { field: 'category.title', direction: 'asc' },
        { field: 'order', direction: 'asc' },
      ],
    },
    {
      title: 'Featured First',
      name: 'featuredFirst',
      by: [
        { field: 'featured', direction: 'desc' },
        { field: 'order', direction: 'asc' },
      ],
    },
  ],
})

