
import { pagesLoad, pagesActions } from 'rimecms/panel'

export const load = pagesLoad.collection.doc('pages')
export const actions = pagesActions.collection.doc('pages')