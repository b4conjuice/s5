import { createFileRoute } from '@tanstack/react-router'
import { useRef, useState } from 'react'
import {
  DocumentDuplicateIcon,
  ListBulletIcon,
  PencilSquareIcon,
  TrashIcon,
} from '@heroicons/react/20/solid'
import { useCopyToClipboard, useLocalStorage } from '@uidotdev/usehooks'

import BookSearch from '@/components/book-search'
import Menu from '@/components/menu'
import { transformScripturetoBibleParam } from '@/components/book-search/lib'
import BibleParamList from '@/components/bible-param-list'

export const Route = createFileRoute('/lists/new')({
  component: RouteComponent,
})

const DEFAULT_LIST = {
  title: '',
  items: [],
}

const TABS = ['default', 'edit'] as const
type Tab = (typeof TABS)[number]
const initialTab = 'default'

function RouteComponent() {
  // TODO: get initial tab from search params
  // const [searchParams, setSearchParams] = useSearchParams()
  // const initialTab = searchParams.get('tab') as Tab
  const [tab, setTab] = useState<Tab | null>(initialTab ?? 'default')
  const [copiedText, copyToClipboard] = useCopyToClipboard()
  const searchRef = useRef<HTMLInputElement | null>(null)

  const [list, setList] = useLocalStorage<{
    title: string
    items: string[]
  }>('s5-new-list', DEFAULT_LIST)
  const title = list.title
  const items = list.items
  const canSave = list.title !== '' && items.length > 0

  const body = items.join('\n\n')
  const noteTitle = `= ${list.title}`
  const note = noteTitle + '\n\n' + body
  return (
    <>
      <main className='flex grow flex-col p-4'>
        {tab === 'edit' ? (
          <textarea
            className='border-cobalt bg-cobalt caret-cb-yellow not-read-only:focus:border-cb-light-blue h-full w-full grow focus:ring-0'
            value={note}
            onChange={e => {
              const newText = e.target.value
              const [newTitle, ...newBody] = newText.split('\n\n')
              const listTitle = newTitle.replace('= ', '')
              setList({
                title: listTitle,
                items: newBody,
              })
            }}
          />
        ) : (
          <div className='flex flex-col gap-4'>
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
        )}
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
              className='flex w-full justify-center text-red-700 hover:text-red-700 disabled:pointer-events-none disabled:opacity-25'
              type='button'
              onClick={() => {
                setList(DEFAULT_LIST)
              }}
              disabled={!canSave}
            >
              <TrashIcon className='h-6 w-6' />
            </button>
            <button
              className='text-cb-yellow hover:text-cb-yellow flex w-full justify-center disabled:pointer-events-none disabled:opacity-25'
              type='button'
              onClick={async () => {
                await copyToClipboard(note)
              }}
              disabled={!canSave}
            >
              <DocumentDuplicateIcon className='h-6 w-6' />
            </button>
            <button
              className='text-cb-yellow hover:text-cb-yellow/75 disabled:text-cb-light-blue disabled:pointer-events-none'
              type='button'
              onClick={() => {
                setTab('default')
              }}
              disabled={tab === 'default'}
            >
              <ListBulletIcon className='h-6 w-6' />
            </button>
            <button
              className='text-cb-yellow hover:text-cb-yellow/75 disabled:text-cb-light-blue disabled:pointer-events-none'
              type='button'
              onClick={() => {
                setTab('edit')
              }}
              disabled={tab === 'edit'}
            >
              <PencilSquareIcon className='h-6 w-6' />
            </button>
          </div>
        </div>
      </footer>
    </>
  )
}
