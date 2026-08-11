import { useState } from 'react'
import { ArrowTopRightOnSquareIcon, TrashIcon } from '@heroicons/react/20/solid'
import { format } from 'date-fns'

import useHistory from '@/components/book-search/hooks/use-history'
import {
  getScriptureUrl,
  transformBibleParamToScripture,
} from '@/components/book-search/lib'
import useScriptureUrlType from '@/components/book-search/hooks/use-scripture-url-type'
import ConfirmModal from '@/components/confirm-modal'
import type { HistoryEntry } from '@/components/book-search/lib/types'

type HistoryEntryToBeDeleted = HistoryEntry & {
  scriptureAsString: string
  index: number
}

export default function HistoryList({ limit }: { limit?: number }) {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [historyEntryToBeDeleted, setHistoryEntryToBeDeleted] =
    useState<HistoryEntryToBeDeleted | null>(null)
  const { history, setHistory } = useHistory()
  const { scriptureUrlType } = useScriptureUrlType()
  return (
    <>
      {history.length > 0 ? (
        <ul className='divide-cb-dusty-blue divide-y'>
          {[...(limit !== undefined ? history.slice(0, limit) : history)].map(
            (historyEntry, index) => {
              const { bibleParam, date } = historyEntry
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
                    <button
                      className='text-red-700 hover:text-red-700/75'
                      type='button'
                      onClick={() => {
                        setHistoryEntryToBeDeleted({
                          ...historyEntry,
                          scriptureAsString: scripture.asString ?? '',
                          index,
                        })
                        setIsConfirmModalOpen(true)
                      }}
                    >
                      <TrashIcon className='h-6 w-6' />
                    </button>
                  </div>
                </li>
              )
            }
          )}
        </ul>
      ) : (
        <p>no history</p>
      )}
      {historyEntryToBeDeleted !== null ? (
        <ConfirmModal
          isOpen={isConfirmModalOpen}
          setIsOpen={setIsConfirmModalOpen}
          title='are you sure you want remove this history entry?'
          action={() => {
            const newHistory = [...history]
            newHistory.splice(historyEntryToBeDeleted.index, 1)
            setHistory(newHistory)
            setIsConfirmModalOpen(false)
            setHistoryEntryToBeDeleted(null)
          }}
        >
          <div>{historyEntryToBeDeleted.scriptureAsString}</div>
          <div className='text-cb-white/50 text-sm'>
            {format(historyEntryToBeDeleted.date, 'MMM d, yyyy')}
          </div>
        </ConfirmModal>
      ) : null}
    </>
  )
}
