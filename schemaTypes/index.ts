import {authorType} from './authorType'
import {blogHeroType} from './blogHeroType'
import blockContent from './blockContent'
import definitionSection from './definitionSection'
import featuredBlogPostSection from './featuredBlogPostSection'
import heroSection from './heroSection'
import homePage from './homePage'
import newsletterSection from './newsletterSection'
import {postType} from './postType'
import upcomingReleaseSection from './upcomingReleaseSection'
import aboutPage from './aboutPage'
import aboutHeroSection from './aboutHeroSection'
import aboutBioSection from './aboutBioSection'
import aboutGallerySection from './aboutGallerySection'
import { productType } from './productType'
import { categoryType } from './categoryType'
import testimonialsSection from './testimonialsSection'
import faqCategory from './faqCategory'
import faq from './faq'

export const schemaTypes = [
  // Document types
  homePage,
  aboutPage,
  newsletterSection,
  postType,
  authorType,
  blogHeroType,
  productType,
  categoryType,
  upcomingReleaseSection,
  faqCategory,
  faq,

  // Object types (used within documents)
  blockContent,
  heroSection,
  definitionSection,
  featuredBlogPostSection,
  aboutHeroSection,
  aboutBioSection,
  aboutGallerySection,
  testimonialsSection,
]
