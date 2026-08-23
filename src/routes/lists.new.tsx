import { createFileRoute } from '@tanstack/react-router'
import { useRef } from 'react'
import { DocumentDuplicateIcon } from '@heroicons/react/20/solid'
import { useCopyToClipboard, useLocalStorage } from '@uidotdev/usehooks'

import BookSearch from '@/components/book-search'
import Menu from '@/components/menu'
import { transformScripturetoBibleParam } from '@/components/book-search/lib'
import BibleParamList from '@/components/bible-param-list'

export const Route = createFileRoute('/lists/new')({
  component: RouteComponent,
})

function RouteComponent() {
  const [copiedText, copyToClipboard] = useCopyToClipboard()
  const searchRef = useRef<HTMLInputElement | null>(null)

  const [list, setList] = useLocalStorage<{
    title: string
    items: string[]
  }>('s5-new-list', { title: '', items: [] })
  const title = list.title
  const items = list.items
  const canSave = list.title !== '' && items.length > 0
  return (
    <>
      <main className='flex grow flex-col p-4'>
        <div className='flex flex-col gap-4 px-4'>
          <input
            className='bg-cobalt text-cb-white'
            type='text'
            value={title}
            onChange={e => {
              setList({
                ...list,
                title: e.target.value,
              })
            }}
            placeholder='title'
          />
          {items.length > 0 ? (
            <BibleParamList list={items} />
          ) : (
            <p>no scriptures yet</p>
          )}
        </div>
      </main>
      <footer className='bg-cb-dusty-blue sticky bottom-0 flex flex-col space-y-2 px-2 pt-2 pb-6'>
        <BookSearch
          searchRef={searchRef}
          onSelectBook={scripture => {
            const bibleParam = transformScripturetoBibleParam(scripture)
            setList({
              ...list,
              items: [...items, bibleParam],
            })
          }}
          showRecentCommands
          placeholder='add scripture'
        />
        <div className='flex items-center justify-between'>
          <div className='flex space-x-4'>
            <Menu />
          </div>
          <div className='flex space-x-4'>
            <button
              className='text-cb-yellow hover:text-cb-yellow flex w-full justify-center disabled:pointer-events-none disabled:opacity-25'
              type='button'
              onClick={async () => {
                const listTitle = `= ${list.title}`
                const body = items.join('\n\n')
                const text = listTitle + '\n\n' + body
                await copyToClipboard(text)
              }}
              disabled={!canSave}
            >
              <DocumentDuplicateIcon className='h-6 w-6' />
            </button>
          </div>
        </div>
      </footer>
    </>
  )
}
