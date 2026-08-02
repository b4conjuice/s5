import books, { getBibleParam, getScriptureUrl } from '../lib'
import useScriptureUrlType from '../hooks/use-scripture-url-type'

export default function BookNav() {
  const { scriptureUrlType } = useScriptureUrlType()
  return (
    <ul className='grid grid-cols-6 gap-2'>
      {books.map(([bookNumber, book]) => {
        const bookName = book.name
        const shortBookName = bookName.replace('.', '').slice(0, 4)
        const bibleParam = getBibleParam({ bookNumber })
        const scriptureUrl = getScriptureUrl(bibleParam, scriptureUrlType)
        return (
          <li key={bookName} className='group'>
            <a
              href={scriptureUrl}
              className='text-cb-pink hover:text-cb-pink/75'
              target='_blank'
            >
              {shortBookName}
            </a>
          </li>
        )
      })}
    </ul>
  )
}
