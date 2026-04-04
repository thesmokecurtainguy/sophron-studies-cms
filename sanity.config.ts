import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'sophron-studies',

  projectId: 'o1brandp',
  dataset: 'private',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            // Pages Section
            S.listItem()
              .title('📄 Pages')
              .child(
                S.list()
                  .title('Site Pages')
                  .items([
                    S.listItem()
                      .title('Home Page')
                      .child(S.document().schemaType('homePage').documentId('homePage')),
                    S.listItem()
                      .title('About Page')
                      .child(S.document().schemaType('aboutPage').documentId('aboutPage')),
                    S.listItem()
                      .title('Blog Page Header')
                      .child(S.document().schemaType('blogHero').documentId('blogHero')),
                    S.listItem()
                      .title('Newsletter Config')
                      .child(S.document().schemaType('newsletterSection').documentId('newsletterSection')),
                  ])
              ),

            // Blog Section
            S.listItem()
              .title('📝 Blog')
              .child(
                S.list()
                  .title('Blog Content')
                  .items([
                    S.listItem()
                      .title('Blog Posts')
                      .child(S.documentTypeList('post').title('Blog Posts')),
                    S.listItem()
                      .title('Authors')
                      .child(S.documentTypeList('author').title('Authors')),
                  ])
              ),

            // Shop Section
            S.listItem()
              .title('🛍️ Shop')
              .child(
                S.list()
                  .title('Shop Management')
                  .items([
                    S.listItem()
                      .title('Products')
                      .child(S.documentTypeList('product').title('Products')),
                    S.listItem()
                      .title('Product Categories')
                      .child(S.documentTypeList('category').title('Product Categories')),
                    S.listItem()
                      .title('Upcoming Releases')
                      .child(S.documentTypeList('upcomingReleaseSection').title('Upcoming Releases')),
                  ])
              ),

            // Divider
            S.divider(),

            // Quick access to all content types (for advanced users)
            ...S.documentTypeListItems().filter(
              (listItem) => {
                const id = listItem.getId()
                return id && !['homePage', 'aboutPage', 'blogHero', 'newsletterSection', 'post', 'author', 'product', 'category', 'upcomingReleaseSection'].includes(id)
              }
            ),
          ])
    }),
    visionTool()
  ],

  schema: {
    types: schemaTypes,
  },
})
