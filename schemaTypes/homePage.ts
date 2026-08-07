import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  description: 'Manage content and sections for the website homepage',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Internal title for the home page in Sanity Studio (e.g., "Home Page Content")',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      description: 'Search engine optimization metadata',
    }),
    defineField({
      name: 'heroSection',
      title: 'Hero Section',
      type: 'heroSection', // Will reference the heroSection object type
    }),
    defineField({
      name: 'definitionSection',
      title: 'Definition Section',
      type: 'definitionSection', // Will reference the definitionSection object type
    }),
    defineField({
        name: 'featuredBlogPostSection',
        title: 'Featured Blog Post Section',
        type: 'featuredBlogPostSection', // Will reference the featuredBlogPostSection object type
    }),
    defineField({
      name: 'upcomingReleaseSection',
      title: 'Releases',
      type: 'object',
      fields: [
        defineField({
          name: 'newRelease',
          title: 'Coming Soon',
          type: 'reference',
          to: [{ type: 'upcomingReleaseSection' }],
        }),
        defineField({
          name: 'showNewRelease',
          title: 'Show Coming Soon Section',
          type: 'boolean',
          description: 'Toggle to show/hide the Coming Soon section on the website',
          initialValue: false,
        }),
        defineField({
          name: 'comingSoon',
          title: 'Coming Soon',
          type: 'reference',
          to: [{ type: 'upcomingReleaseSection' }],
        }),
        defineField({
          name: 'showComingSoon',
          title: 'Show Coming Soon Section',
          type: 'boolean',
          description: 'Toggle to show/hide the Coming Soon section on the website',
          initialValue: false,
        }),
      ],
    }),
    defineField({
        name: 'newsletterSection',
        title: 'Newsletter Section',
        type: 'reference',
        to: [{ type: 'newsletterSection' }],
        description: 'Reference to the global newsletter configuration',
    }),
    defineField({
        name: 'testimonialsSection',
        title: 'Testimonials Section',
        type: 'testimonialsSection',
        description: 'Customer testimonials and reviews',
    }),
    // Add other sections as needed (e.g., featured shop items)
  ],
  preview: {
    select: {
      title: 'title',
    },
    prepare(selection) {
      return {title: selection.title || 'Home Page'}
    },
  },
}) 