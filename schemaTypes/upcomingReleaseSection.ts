import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'upcomingReleaseSection',
  title: 'Upcoming Releases',
  type: 'document',
  description: 'Featured upcoming product releases and announcements',
  fieldsets: [
    {
      name: 'settings',
      title: 'Display Settings',
      options: {
        collapsible: true,
        collapsed: false,
        columns: 2
      }
    },
    {
      name: 'title',
      title: 'Section Title',
      options: {
        collapsible: true,
        collapsed: true,
        columns: 2
      }
    },
    {
      name: 'content',
      title: 'Content & Button',
      options: {
        collapsible: true,
        collapsed: true,
      }
    },
    {
      name: 'images',
      title: 'Images',
      options: {
        collapsible: true,
        collapsed: true,
        columns: 2
      }
    }
  ],
  fields: [
    defineField({
      name: 'internalTitle',
      title: 'Internal Title',
      type: 'string',
      description: 'Identifier for this upcoming release within Sanity Studio (e.g., "Fall 2024 Book Release")',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'status',
      title: 'Release Status',
      type: 'string',
      fieldset: 'settings',
      options: {
        list: [
          { title: 'Coming Soon', value: 'comingSoon' },
          { title: 'Coming Soon', value: 'newRelease' }
        ],
        layout: 'radio'
      },
      initialValue: 'comingSoon',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'backgroundTheme',
      title: 'Background Theme',
      type: 'string',
      fieldset: 'settings',
      options: {
        list: [
          { title: 'Dark', value: 'dark' },
          { title: 'Light', value: 'light' }
        ],
        layout: 'radio'
      },
      initialValue: 'dark',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'titlePart1',
      title: 'Title Line 1',
      type: 'string',
      fieldset: 'title',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'titlePart2',
      title: 'Title Line 2',
      type: 'string',
      fieldset: 'title',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'text',
      title: 'Promotional Text',
      type: 'blockContent', // Rich text
      fieldset: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'buttonText',
      title: 'Button Text',
      type: 'string',
      fieldset: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'buttonLink',
      title: 'Button Link',
      type: 'url',
      fieldset: 'content',
      validation: (Rule) => Rule.uri({allowRelative: true}), // Allow relative links (e.g., /shop) or absolute URLs
    }),
    defineField({
      name: 'image1',
      title: 'Back Image',
      type: 'image',
      fieldset: 'images',
      options: {hotspot: true},
      fields: [defineField({ name: 'alt', type: 'string', title: 'Alt text', validation: (Rule) => Rule.required() })],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image2',
      title: 'Cover Image',
      type: 'image',
      fieldset: 'images',
      options: {hotspot: true},
      fields: [defineField({ name: 'alt', type: 'string', title: 'Alt text', validation: (Rule) => Rule.required() })],
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'internalTitle',
      media: 'image1',
    },
    prepare(selection) {
        const { title, media } = selection
        return {
            title: title || 'Untitled Upcoming Release',
            media: media,
        }
    }
  }
}) 