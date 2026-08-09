import { createFileRoute } from '@tanstack/react-router'
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/20/solid'
import { format } from 'date-fns'

import Menu from '@/components/menu'
import useHistory from '@/components/book-search/hooks/use-history'
import {
  getScriptureUrl,
  transformBibleParamToScripture,
} from '@/components/book-search/lib'
import useScriptureUrlType from '@/components/book-search/hooks/use-scripture-url-type'

export const Route = createFileRoute('/history')({
  component: RouteComponent,
})

function RouteComponent() {
  const { history, clearHistory, setHistory } = useHistory()
  const { scriptureUrlType } = useScriptureUrlType()
  return (
    <>
      <main className='flex grow flex-col p-4'>
        <div className='flex grow flex-col justify-between gap-4'>
          <div className='flex justify-between'>
            <h1 className='font-bold'>history</h1>
          </div>
          <div className='flex flex-grow flex-col justify-between space-y-4'>
            {history.length > 0 ? (
              <ul className='divide-cb-dusty-blue divide-y'>
                {history.map(({ bibleParam, date }, index) => {
                  const scripture = transformBibleParamToScripture(bibleParam)
                  if (scripture === '') {
                    return null
                  }
                  const url = getScriptureUrl(bibleParam, scriptureUrlType)
                  // const booksUrl = scripture.verse
                  //   ? `/text/${scripture.text}`
                  //   : `/books/${scripture.bookNumber}/${scripture.chapter}`
                  return (
                    <li
                      key={index}
                      className='group flex items-center justify-between py-4 first:pt-0 last:pb-0'
                    >
                      <div>
                        <div>{scripture.asString}</div>
                        <div className='text-cb-white/50 text-sm'>
                          {format(date, 'MMM d, yyyy')}
                        </div>
                      </div>
                      <div className='flex space-x-4'>
                        {/* <Link
                          to={booksUrl}
                          className='text-cb-pink hover:text-cb-pink/75 block truncate'
                        >
                          <BookOpenIcon className='h-6 w-6' />
                        </Link> */}
                        <a
                          href={url}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='text-cb-pink hover:text-cb-pink/75 block truncate'
                        >
                          <ArrowTopRightOnSquareIcon className='h-6 w-6' />
                        </a>
                      </div>
                    </li>
                  )
                })}
              </ul>
            ) : (
              <p>no history</p>
            )}
          </div>
        </div>
      </main>
      <footer className='bg-cb-dusty-blue sticky bottom-0 flex items-center justify-between px-2 pt-2 pb-6'>
        <div className='flex space-x-4'>
          <Menu />
        </div>
        <div className='flex space-x-4'></div>
      </footer>
    </>
  )
}
