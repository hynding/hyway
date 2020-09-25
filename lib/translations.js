import { StateManager } from './states'

export const translate = (from, dictionary) => (dictionary || StateManager.read('translator') || {})[from] || from