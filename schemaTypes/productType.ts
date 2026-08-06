// sanity/schemaTypes/productType.ts
import { defineField, defineType } from 'sanity'

export const productType = defineType({
  name: 'product',
  title: 'Products',
  type: 'document',
  description: 'Individual products for the shop',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }], // hotspot enables image cropping
      validation: (Rule) => Rule.required().min(1), // Require at least one image
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'blockContent', // Use your existing blockContent schema
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'price',
      title: 'Price ($)',
      type: 'number',
      validation: (Rule) => Rule.positive(), // Price must be positive when present
      description: 'Price in USD (leave empty for external products)',
    }),
    defineField({
      name: 'externalUrl',
      title: 'External Product URL',
      type: 'url',
      description: 'Link to external website where this product can be purchased (alternative to setting a price)',
    }),
    defineField({
      name: 'isAvailable',
      title: 'Is Available?',
      type: 'boolean',
      description: 'Check this box if the product should be visible and purchasable on the site.',
      initialValue: true,
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'category' } }],
      description: 'Assign one or more categories for filtering products',
    }),
    defineField({
      name: 'sizes',
      title: 'Available Sizes',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Optional: Add sizes for products like apparel (e.g., S, M, L, XL)',
      options: {
        list: [
          { title: 'Extra Small', value: 'XS' },
          { title: 'Small', value: 'S' },
          { title: 'Medium', value: 'M' },
          { title: 'Large', value: 'L' },
          { title: 'Extra Large', value: 'XL' },
          { title: 'XXL', value: 'XXL' },
        ],
      },
    }),
    defineField({
      name: 'difficulty',
      title: 'Difficulty',
      type: 'string',
      description: 'Study difficulty level',
      options: {
        list: [
          { title: 'Beginner', value: 'Beginner' },
          { title: 'Intermediate', value: 'Intermediate' },
          { title: 'Advanced', value: 'Advanced' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'duration',
      title: 'Duration',
      type: 'string',
      description: 'How long the study takes (e.g. "8 weeks")',
    }),
    defineField({
      name: 'targetAudience',
      title: 'Target Audience',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Who this study is designed for',
    }),
    defineField({
      name: 'includesLeaderGuide',
      title: 'Includes Leader Guide?',
      type: 'boolean',
      description: 'Whether this product includes a leader guide',
      initialValue: false,
    }),
    defineField({
      name: 'shortDescription',
      title: 'Short Description',
      type: 'text',
      rows: 3,
      description: '1–2 sentences for category/listing pages',
    }),
    defineField({
      name: 'relatedProducts',
      title: 'Related Products',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'product' } }],
      description: 'Other products to suggest alongside this one',
    }),
    defineField({
      name: 'samplePages',
      title: 'Sample Pages',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
      description: 'Sample page images for product previews',
    }),
    defineField({
      name: 'faqs',
      title: 'FAQs',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'question',
              title: 'Question',
              type: 'string',
            }),
            defineField({
              name: 'answer',
              title: 'Answer',
              type: 'text',
              rows: 4,
            }),
          ],
          preview: {
            select: {
              title: 'question',
              subtitle: 'answer',
            },
          },
        },
      ],
      description: 'Product-specific frequently asked questions',
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      description: 'Search engine optimization metadata',
    }),
    defineField({
      name: 'structuredData',
      title: 'Structured Data',
      type: 'object',
      description: 'Product schema.org / rich-result metadata',
      fields: [
        defineField({
          name: 'brand',
          title: 'Brand',
          type: 'string',
        }),
        defineField({
          name: 'sku',
          title: 'SKU',
          type: 'string',
        }),
        defineField({
          name: 'gtin',
          title: 'GTIN',
          type: 'string',
        }),
        defineField({
          name: 'mpn',
          title: 'MPN',
          type: 'string',
        }),
        defineField({
          name: 'availability',
          title: 'Availability',
          type: 'string',
        }),
        defineField({
          name: 'condition',
          title: 'Condition',
          type: 'string',
        }),
        defineField({
          name: 'aggregateRating',
          title: 'Aggregate Rating',
          type: 'object',
          fields: [
            defineField({
              name: 'ratingValue',
              title: 'Rating Value',
              type: 'number',
            }),
            defineField({
              name: 'reviewCount',
              title: 'Review Count',
              type: 'number',
            }),
          ],
        }),
      ],
    }),
  ],
  validation: (Rule) => Rule.custom((doc: any) => {
    const hasPrice = doc?.price && doc.price > 0;
    const hasExternalUrl = doc?.externalUrl && doc.externalUrl.length > 0;
    
    if (hasPrice && hasExternalUrl) {
      return 'A product cannot have both a price and an external URL. Please choose one or the other.';
    }
    
    if (!hasPrice && !hasExternalUrl) {
      return 'A product must have either a price or an external URL.';
    }
    
    return true;
  }),
  preview: {
    select: {
      title: 'name',
      media: 'images.0.asset', // Show the first image in the preview
      isAvailable: 'isAvailable',
      price: 'price',
      externalUrl: 'externalUrl',
    },
    prepare(selection) {
      const { title, media, isAvailable, externalUrl } = selection
      let subtitle = '';
      
      if (!isAvailable) {
        subtitle = 'Hidden';
      } else if (externalUrl) {
        subtitle = 'External Product';
      } else {
        subtitle = 'Available';
      }
      
      return {
        title: title,
        subtitle: subtitle,
        media: media,
      }
    },
  },
})
