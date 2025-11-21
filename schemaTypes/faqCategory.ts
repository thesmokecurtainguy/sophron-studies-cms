import { defineField, defineType } from 'sanity'

/**
 * FAQ Category Schema
 * Categories for organizing FAQs into logical groups
 */
export default defineType({
  name: 'faqCategory',
  title: 'FAQ Category',
  type: 'document',
  icon: () => '📁',
  fields: [
    defineField({
      name: 'title',
      title: 'Category Title',
      type: 'string',
      description: 'The name of the FAQ category (e.g., "Shipping", "Returns", "Products")',
      validation: (Rule) => Rule.required().min(2).max(100),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'URL-friendly identifier (auto-generated from title)',
      options: {
        source: 'title',
        maxLength: 96,
        slugify: (input: string) =>
          input
            .toLowerCase()
            .replace(/\s+/g, '-')
            .slice(0, 96),
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Optional introductory text for this category',
      rows: 3,
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Number for sorting categories (lower numbers appear first)',
      validation: (Rule) => Rule.min(0).integer(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      order: 'order',
    },
    prepare({ title, order }) {
      return {
        title: title || 'Untitled Category',
        subtitle: order !== undefined ? `Order: ${order}` : 'No order set',
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
      title: 'Title (A-Z)',
      name: 'titleAsc',
      by: [{ field: 'title', direction: 'asc' }],
    },
  ],
})

