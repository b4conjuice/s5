import { createFileRoute } from '@tanstack/react-router'
import { useRef, useState } from 'react'
import { ArrowDownOnSquareIcon, TrashIcon } from '@heroicons/react/20/solid'
import { useCopyToClipboard, useLocalStorage } from '@uidotdev/usehooks'

import BookSearch from '@/components/book-search'
import Menu from '@/components/menu'
import Textarea from '@/components/textarea'
import useTextarea from '@/lib/useTextarea'
import type { Scripture } from '@/components/book-search/lib/types'
import ConfirmModal from '@/components/confirm-modal'

export const Route = createFileRoute('/gems/new')({
  component: RouteComponent,
})
const NEW_GEM_URL = (bibleParam: string) =>
  `https://sfour.dlopez.app/gems/${bibleParam}/new`

function RouteComponent() {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [copiedText, copyToClipboard] = useCopyToClipboard()
  const searchRef = useRef<HTMLInputElement | null>(null)
  const [text, setText] = useLocalStorage('sfour-new-gem-text', '')
  const [selectedScripture, setSelectedScripture] =
    useLocalStorage<Scripture | null>('sfour-selected-scripture', null)
  const textarea = useTextarea({ text, setText })
  const canSave = text !== '' && selectedScripture !== null
  return (
    <>
      <main className='flex grow flex-col'>
        {selectedScripture !== null ? (
          <Textarea
            {...textarea}
            textareaProps={{
              placeholder: `new gem for ${selectedScripture.asString}`,
            }}
          />
        ) : (
          <div className='p-4'>
            <p>select scripture for your new gem</p>
          </div>
        )}
      </main>
      <footer className='bg-cb-dusty-blue sticky bottom-0 flex flex-col space-y-2 px-2 pt-2 pb-6'>
        <BookSearch
          searchRef={searchRef}
          onSelectBook={scripture => {
            setSelectedScripture(scripture)
          }}
          showRecentCommands
          placeholder='select scripture'
        />
        <div className='flex items-center justify-between'>
          <div className='flex space-x-4'>
            <Menu />
          </div>
          <div className='flex space-x-4'>
            <button
              className='text-red-700 hover:text-red-700/75 disabled:pointer-events-none disabled:opacity-25'
              type='button'
              onClick={async () => {
                setIsConfirmModalOpen(true)
              }}
              disabled={!canSave}
            >
              <TrashIcon className='h-6 w-6' />
            </button>
            <button
              className='text-cb-yellow hover:text-cb-yellow/75 disabled:pointer-events-none disabled:opacity-25'
              type='button'
              onClick={async () => {
                if (selectedScripture !== null) {
                  await copyToClipboard(text)
                  window.open(
                    NEW_GEM_URL(selectedScripture.bibleParam),
                    '_blank'
                  )
                }
              }}
              disabled={!canSave}
            >
              <ArrowDownOnSquareIcon className='h-6 w-6' />
            </button>
          </div>
        </div>
      </footer>
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        setIsOpen={setIsConfirmModalOpen}
        action={() => {
          setText('')
          setSelectedScripture(null)
        }}
      >
        are you sure clear the gem?
      </ConfirmModal>
    </>
  )
}
