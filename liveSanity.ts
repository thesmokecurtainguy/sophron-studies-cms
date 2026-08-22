/**
 * Single source of truth for live Sophron Studies Sanity identity.
 * Must match Melissa's Studio / live site: o1brandp / private / sophron-studies.
 * Do not point these at the abandoned project (7a9l1mtl / production).
 */
export const projectId = 'o1brandp' as const
export const dataset = 'private' as const
export const studioHost = 'sophron-studies' as const

if (projectId !== 'o1brandp' || dataset !== 'private' || studioHost !== 'sophron-studies') {
  throw new Error(
    `liveSanity identity mismatch: expected o1brandp/private/sophron-studies, got ${projectId}/${dataset}/${studioHost}`,
  )
}
