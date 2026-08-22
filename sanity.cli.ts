import {defineCliConfig} from 'sanity/cli'
import {dataset, projectId, studioHost} from './liveSanity'

export default defineCliConfig({
  api: {
    projectId,
    dataset,
  },
  studioHost,
  /**
   * Enable auto-updates for studios.
   * Learn more at https://www.sanity.io/docs/cli#auto-updates
   */
  autoUpdates: true,
})
