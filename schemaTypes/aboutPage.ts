import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'aboutPage',
  title: 'About Page',
  type: 'document',
  description: 'Manage content and sections for the about page',
  fieldsets: [
    {
      name: 'hero',
      title: 'Hero Section',
      options: {
        collapsible: true,
        collapsed: true,
      }
    },
    {
      name: 'content',
      title: 'Content Sections',
      options: {
        collapsible: true,
        collapsed: true,
      }
    },
    {
      name: 'cta',
      title: 'Call-to-Action Sections',
      options: {
        collapsible: true,
        collapsed: true,
        // columns: 2
      }
    }
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Internal title for the about page in Sanity Studio (e.g., "About Page Content")',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      description: 'Search engine optimization metadata',
    }),
    defineField({
      name: 'aboutHeroSection',
      title: 'About Hero Section',
      type: 'aboutHeroSection',
      fieldset: 'hero',
    }),
    defineField({
      name: 'aboutBioSection',
      title: 'About Bio Section',
      type: 'aboutBioSection',
      fieldset: 'content',
    }),
    defineField({
      name: 'aboutGallerySection',
      title: 'About Gallery Section',
      type: 'aboutGallerySection',
      fieldset: 'content',
    }),
    defineField({
      name: 'newsletterSection',
      title: 'Newsletter Section',
      type: 'reference',
      fieldset: 'cta',
      to: [{ type: 'newsletterSection' }],
      description: 'Reference to the global newsletter configuration',
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
    prepare(selection) {
      return { title: selection.title || 'About Page' }
    },
  },
}) 