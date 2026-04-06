import {defineField, defineType} from 'sanity'

export const newsletterCampaignType = defineType({
  name: 'newsletterCampaign',
  title: 'Newsletter Campaigns',
  type: 'document',
  description:
    'One campaign per email send. Use this to draft Melissa’s note, pick featured shop and blog items, and track draft → ready → sent.',
  fields: [
    defineField({
      name: 'title',
      title: 'Campaign name (internal)',
      type: 'string',
      description:
        'A name only you and the team see in the CMS—e.g. “April 2026 Newsletter”. It does not need to match the subject line subscribers see.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'previewText',
      title: 'Email preview text',
      type: 'string',
      description:
        'The short line many inboxes show next to or below the subject (“preheader”). Aim for a clear teaser; keep it brief so it does not get cut off.',
      validation: (Rule) => Rule.required().max(150),
    }),
    defineField({
      name: 'messageFromMelissa',
      title: 'Message from Melissa',
      type: 'text',
      description:
        'Melissa’s personal note for this issue—the main letter-style message readers see in the email body. Plain text works here; paste or write it as you want it to read.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'featuredProduct',
      title: 'Featured product (New Release)',
      type: 'reference',
      to: [{type: 'product'}],
      description:
        'Optional. Choose one product to highlight as “New Release” in this campaign—the link and details come from the product document.',
    }),
    defineField({
      name: 'featuredPost',
      title: 'Featured post (From the Blog)',
      type: 'reference',
      to: [{type: 'post'}],
      description:
        'Optional. Choose one blog post to highlight as “From the Blog”—title, excerpt, and imagery can be pulled from the post when the email is built.',
    }),
    defineField({
      name: 'status',
      title: 'Campaign status',
      type: 'string',
      description:
        'Where this campaign is in your workflow: still writing (draft), approved and ready to send (ready), or already sent to the list (sent).',
      options: {
        list: [
          {title: 'Draft', value: 'draft'},
          {title: 'Ready to send', value: 'ready'},
          {title: 'Sent', value: 'sent'},
        ],
        layout: 'radio',
      },
      initialValue: 'draft',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'sentAt',
      title: 'Sent at',
      type: 'datetime',
      description:
        'Optional. Record when this newsletter actually went out—helps for history and avoiding duplicate sends.',
    }),
  ],
})
