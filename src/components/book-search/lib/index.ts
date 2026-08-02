import {
  bookNumberToBookMap,
  bookNameToBookMap,
  scriptureUrlTypeToUrlMap,
} from './constants'
import type { BookName, BookNumber, Scripture, ScriptureUrlType } from './types'

const booksAsArray = Object.entries(bookNumberToBookMap)
const bookNames = Object.keys(bookNameToBookMap) as BookName[]

export default booksAsArray
export { bookNumberToBookMap, bookNameToBookMap, bookNames }

export function getBook(bookIdentifer: BookNumber | BookName) {
  if (typeof bookIdentifer === 'number') {
    return {
      ...bookNumberToBookMap[bookIdentifer],
      bookNumber: bookIdentifer,
    }
  } else {
    return { ...bookNameToBookMap[bookIdentifer], bookName: bookIdentifer }
  }
}

export function getBibleParam({
  bookNumber,
  chapter,
  verse,
}: {
  bookNumber: BookNumber | string | number
  chapter?: number
  verse?: number
}) {
  return `${bookNumber.toString().padStart(2, '0')}${(chapter ?? 1).toString().padStart(3, '0')}${(verse ?? 1).toString().padStart(3, '0')}`
}

// bibleParam = <booknumber><chapter><verse>
// example = 01001001
export function transformBibleParamToScripture(bibleParam: string) {
  if (bibleParam.length !== 8) {
    console.error(
      `transformTextToScripture: invalid bibleParam ${bibleParam}: must be 8 characters`
    )
    return ''
  }
  const bookNumber = Number(bibleParam.slice(0, 2)) as BookNumber
  const chapter = Number(bibleParam.slice(2, 5))
  const verse = Number(bibleParam.slice(5, 8))
  const book = bookNumberToBookMap[bookNumber]
  const bookName = book.name
  // if (!bookName) { // TODO: confirm if this is needed
  //   console.log(
  //     `transformTextToScripture: bookName not found, invalid bookNumber ${bookNumber} (first 3 characters of text)`
  //   )
  //   return ''
  // }
  const scripture: Scripture = {
    bibleParam,
    bookName,
    bookNumber,
    chapter,
    verse,
    asString: `${bookName} ${chapter}:${verse}`,
  }
  return scripture
}

const normalizeBookName = (bookName: BookName) =>
  bookName.replace(' ', ' ').toLowerCase()
const normalizedBookNames = bookNames.map(normalizeBookName)
function findBookIndex(bookName: BookName) {
  const normalizedBookName = normalizeBookName(bookName)
  const bookIndexWithNoChanges = normalizedBookNames.indexOf(normalizedBookName)
  if (bookIndexWithNoChanges > -1) {
    return bookIndexWithNoChanges
  }
  if (!normalizedBookName.includes('.')) {
    const bookNameWithPeriodAdded = `${normalizedBookName}.`
    const bookIndexWithPeriodAdded = normalizedBookNames.indexOf(
      bookNameWithPeriodAdded
    )
    if (bookIndexWithPeriodAdded > -1) {
      return bookIndexWithPeriodAdded
    }
  }
  return -1
}

const DEFAULT_VERSE = '001'
function transformScriptureStringtoBibleParam(scripture: string) {
  const scriptureSplit = scripture.split(' ')
  const bookChapterVerse = scriptureSplit.pop() // get last item
  const bookName = scriptureSplit.join(' ') as BookName
  const [bookChapter, bookVerse] = bookChapterVerse?.split(':') ?? []

  if (!bookName || !bookChapter) {
    // TODO: review bookName
    console.log(
      `transformScriptureStringtoBibleParam: invalid scripture string '${scripture}': must follow this format: <bookName> <chapter>`
    )
    return ''
  }
  const chapter = Number(bookChapter)
  if (isNaN(chapter)) {
    console.log(
      `transformScriptureStringtoBibleParam: invalid chapter '${bookChapter}' in scripture string '${scripture}'`
    )
    return ''
  }

  const bookIndex = findBookIndex(bookName) // TODO: use getBook?
  if (bookIndex < 0) {
    console.log(
      `transformScriptureStringtoBibleParam: bookName '${bookName}' not found`
    )
    return ''
  }
  const bookNumber = bookIndex + 1
  const verse = bookVerse ? String(bookVerse).padStart(3, '0') : DEFAULT_VERSE
  const bibleParam = `${String(bookNumber).padStart(2, '0')}${bookChapter.padStart(3, '0')}${verse}` // TODO: use getBibleParam
  const bibleParam2 = getBibleParam({
    bookNumber,
    chapter,
    verse: Number(verse),
  })
  return bibleParam
}
export function transformScripturetoBibleParam(
  scripture: string | Partial<Scripture>
) {
  if (typeof scripture === 'string') {
    return transformScriptureStringtoBibleParam(scripture)
  } else {
    const { bookName, chapter, verse } = scripture
    if (!bookName || !chapter) {
      if (!bookName && !chapter) {
        console.log(
          'transformScripturetoBibleParam: scripture object is missing bookName and chapter'
        )
      } else {
        if (!bookName) {
          console.log(
            'transformScripturetoBibleParam: scripture object is missing bookName'
          )
        } else {
          console.log(
            'transformScripturetoBibleParam: scripture object is missing chapter'
          )
        }
      }
      return ''
    }
    // const bookNumber = books.indexOf(bookName) + 1 // TODO: check if bookNumber is on `scripture`
    const bookNumber =
      scripture.bookNumber ?? bookNameToBookMap[bookName as BookName].bookNumber
    const bibleParam = `${String(bookNumber).padStart(2, '0')}${String(chapter).padStart(3, '0')}${verse ? `${verse}`.padStart(3, '0') : DEFAULT_VERSE}` // TODO: use getBibleParam
    const bibleParam2 = getBibleParam({
      bookNumber,
      chapter,
      verse,
    })
    return bibleParam
  }
}

export function getScriptureUrl(
  bibleParam: string,
  scriptureUrlType: ScriptureUrlType = 'jwlibrary'
) {
  const scripture = transformBibleParamToScripture(bibleParam)
  const { bookNumber, chapter, verse } = scripture as Scripture
  const wolBibleText = `${bookNumber}/${chapter}/${verse}`

  const scriptureUrlBase = scriptureUrlTypeToUrlMap[scriptureUrlType]
  const scriptureInUrl = scriptureUrlType === 'wol' ? wolBibleText : bibleParam
  const scriptureUrl = `${scriptureUrlBase}${scriptureInUrl}`
  return scriptureUrl
}
