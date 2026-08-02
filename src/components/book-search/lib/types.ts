import type { bookNumberToBookMap, scriptureUrlTypeToUrlMap } from './constants'

export type BookNumber = keyof typeof bookNumberToBookMap
export type Book = (typeof bookNumberToBookMap)[BookNumber]
export type BookName = (typeof bookNumberToBookMap)[BookNumber]['name']

export type Scripture = {
  bibleParam: string // TODO: rename to bibleParam
  bookName: string
  bookNumber: number
  chapter: number
  verse: number
  asString?: string
}

export type ScriptureUrlType = keyof typeof scriptureUrlTypeToUrlMap
export type ScriptureUrl = (typeof scriptureUrlTypeToUrlMap)[ScriptureUrlType]
// export const scriptureUrlTypes = ['jwlibrary', 'jworg', 'wol']
// export type ScriptureUrl = (typeof scriptureUrlTypes)[number]
