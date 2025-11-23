import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  description: 'Search engine optimization settings',
  fields: [
    defineField({
      name: 'metaTitle',
      title: 'Meta Title',
      type: 'string',
      description: 'SEO title (50-60 characters recommended)',
      validation: (Rule) => Rule.max(60).warning('Titles over 60 characters may be truncated in search results'),
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      rows: 3,
      description: 'SEO description (150-160 characters recommended)',
      validation: (Rule) => Rule.max(160).warning('Descriptions over 160 characters may be truncated in search results'),
    }),
    defineField({
      name: 'ogImage',
      title: 'Open Graph Image',
      type: 'image',
      description: 'Image for social sharing (recommended: 1200x630px)',
      options: {
        hotspot: true,
      },
    }),
  ],
})

