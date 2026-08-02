import { getBibleParam, getBook, getScriptureUrl } from '../lib'
import type { BookName, BookNumber } from '../lib/types'
import useScriptureUrlType from '../hooks/use-scripture-url-type'

export default function ChapterNav({
  bookIdentifer,
}: {
  bookIdentifer: BookNumber | BookName
}) {
  const { scriptureUrlType } = useScriptureUrlType()
  const book = getBook(bookIdentifer)
  const { chapters, bookNumber } = book
  return (
    <ul className='grid grid-cols-6 gap-2'>
      {Array.from(
        {
          length: chapters,
        },
        (_, i) => i + 1
      ).map((chapter: number) => {
        const bibleParam = getBibleParam({ bookNumber, chapter: chapter })
        const scriptureUrl = getScriptureUrl(bibleParam, scriptureUrlType)
        return (
          <li key={chapter}>
            <a
              href={scriptureUrl}
              className='text-cb-pink hover:text-cb-pink/75 py-4 group-first:pt-0'
            >
              {chapter}
            </a>
          </li>
        )
      })}
    </ul>
  )
}
