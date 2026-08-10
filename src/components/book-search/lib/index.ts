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

function formatBibleParam({
  bookNumber,
  chapter = 1,
  verse = 1,
}: {
  bookNumber: BookNumber | string | number
  chapter?: number
  verse?: number | [number, number]
}) {
  return `${String(bookNumber).padStart(2, '0')}${String(chapter).padStart(3, '0')}${verse.toString().padStart(3, '0')}`
}

export function getBibleParam({
  bookNumber,
  chapter,
  verse,
}: {
  bookNumber: BookNumber | string | number
  chapter?: number
  verse?: number | [number, number]
}) {
  if (Array.isArray(verse)) {
    return verse
      .map(v => formatBibleParam({ bookNumber, chapter, verse: v }))
      .join('-')
  }
  return formatBibleParam({ bookNumber, chapter, verse })
}

function sliceScriptureFromBibleParam(bibleParam: string) {
  const bookNumber = Number(bibleParam.slice(0, 2)) as BookNumber
  const chapter = Number(bibleParam.slice(2, 5))
  const verse = Number(bibleParam.slice(5, 8))
  return { bookNumber, chapter, verse }
}

// bibleParam = <booknumber><chapter><verse>
// example = 01001001
// multiple verses = 01001001-01001003
export function transformBibleParamToScripture(bibleParam: string) {
  // mutliple verses
  if (bibleParam.length === 17 && bibleParam.includes('-')) {
    const [first, second] = bibleParam.split('-')
    const { bookNumber, chapter, verse } = sliceScriptureFromBibleParam(first)
    const { verse: secondVerse } = sliceScriptureFromBibleParam(second)
    if (secondVerse <= verse) {
      console.log(
        `transformBibleParamToScripture: invalid bibleParam ${bibleParam}: verses must be in ascending order`
      )
      return ''
    }
    const book = bookNumberToBookMap[bookNumber]
    const bookName = book.name

    const verseSeperator = secondVerse === verse + 1 ? ', ' : '-'
    const scripture: Scripture = {
      bibleParam,
      bookName,
      bookNumber,
      chapter,
      verse: [verse, secondVerse],
      asString: `${bookName} ${chapter}:${verse}${verseSeperator}${secondVerse}`,
    }
    return scripture
  }
  if (bibleParam.length !== 8) {
    console.error(
      `transformTextToScripture: invalid bibleParam ${bibleParam}: must be 8 characters`
    )
    return ''
  }
  const { bookNumber, chapter, verse } =
    sliceScriptureFromBibleParam(bibleParam)
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

function splitOnce(str: string, separator: string) {
  const index = str.indexOf(separator)
  if (index === -1) return [str]
  return [str.slice(0, index), str.slice(index + separator.length)]
}

const DEFAULT_VERSE = '001'
export function transformScriptureStringtoBibleParam(scripture: string) {
  const scriptureSplitByColon = scripture.split(':')
  const bookVerse =
    scriptureSplitByColon.length > 1 ? scriptureSplitByColon.pop() : undefined
  const bookAndChapter = [...scriptureSplitByColon].join(' ')
  const bookAndChapterSplitBySpace = bookAndChapter.split(' ')
  const bookChapter =
    bookAndChapterSplitBySpace.length > 1
      ? bookAndChapterSplitBySpace.pop()
      : undefined
  const bookName = bookAndChapterSplitBySpace.join(' ')

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

  const bookIndex = findBookIndex(bookName as BookName) // TODO: use getBook?
  if (bookIndex < 0) {
    console.log(
      `transformScriptureStringtoBibleParam: bookName '${bookName}' not found`
    )
    return ''
  }
  const bookNumber = bookIndex + 1
  const verses = !bookVerse
    ? [DEFAULT_VERSE]
    : bookVerse.includes(', ')
      ? bookVerse.split(', ')
      : bookVerse.includes(',')
        ? bookVerse.split(',')
        : bookVerse.includes('-')
          ? bookVerse.split('-')
          : [bookVerse]
  if (verses.some(verse => isNaN(Number(verse)) || verse === '')) {
    console.log(
      `transformScriptureStringtoBibleParam: invalid verse '${bookVerse}' in scripture string '${scripture}'`
    )
    return ''
  }
  const verse: number | [number, number] | undefined =
    verses.length === 0
      ? undefined
      : verses.length === 1
        ? Number(verses[0])
        : verses.length === 2
          ? [Number(verses[0]), Number(verses[1])]
          : undefined
  const bibleParam = getBibleParam({
    bookNumber,
    chapter,
    verse,
  })
  return bibleParam
}
export function transformScripturetoBibleParam(scripture: Partial<Scripture>) {
  const { bookName, chapter, verse, bibleParam: maybeBibleParam } = scripture
  if (maybeBibleParam) {
    return maybeBibleParam
  }
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
  const bookNumber =
    scripture.bookNumber ?? bookNameToBookMap[bookName as BookName].bookNumber
  const bibleParam = getBibleParam({
    bookNumber,
    chapter,
    verse,
  })
  return bibleParam
}

export function getScriptureUrl(
  bibleParam: string,
  scriptureUrlType: ScriptureUrlType = 'jwlibrary'
) {
  const scripture = transformBibleParamToScripture(bibleParam)
  if (scripture === '') {
    return ''
  }
  const { bookNumber, chapter, verse } = scripture
  const wolBibleText = Array.isArray(verse)
    ? `${bookNumber}/${chapter}#v=${bookNumber}:${chapter}:${verse[0]}-${bookNumber}:${chapter}:${verse[1]}`
    : `${bookNumber}/${chapter}/${verse}`

  const scriptureUrlBase = scriptureUrlTypeToUrlMap[scriptureUrlType]
  const scriptureInUrl = scriptureUrlType === 'wol' ? wolBibleText : bibleParam
  const scriptureUrl = `${scriptureUrlBase}${scriptureInUrl}`
  return scriptureUrl
}
