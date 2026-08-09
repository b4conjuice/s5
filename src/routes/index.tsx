import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Cog6ToothIcon } from '@heroicons/react/20/solid'

import BookSearch from '@/components/book-search'
import Modal from '@/components/ui/modal'
import SelectScriptureUrlType from '@/components/book-search/components/select-scripture-url-type'
import Menu from '@/components/menu'
import HistoryList from '@/components/history-list'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  return (
    <>
      <main className='flex grow flex-col p-4'>
        <div className='flex grow flex-col justify-between gap-4'>
          <div className='flex justify-between'>
            <h1 className='font-bold'>s5 🔍</h1>
          </div>
          <div className='flex grow flex-col justify-end gap-4'>
            <h2 className='text-cb-light-blue'>recent history</h2>
            <HistoryList limit={5} />
            <BookSearch />
          </div>
        </div>
      </main>
      <footer className='bg-cb-dusty-blue sticky bottom-0 flex items-center justify-between px-2 pt-2 pb-6'>
        <div className='flex space-x-4'>
          <Menu />
        </div>
        <div className='flex space-x-4'>
          <button
            type='button'
            onClick={() => {
              setIsModalOpen(true)
            }}
            className='text-cb-yellow hover:text-cb-yellow/75'
          >
            <Cog6ToothIcon className='h-6 w-6' />
          </button>
          <Modal
            isOpen={isModalOpen}
            setIsOpen={setIsModalOpen}
            title='where would you like to open scripture?'
          >
            <SelectScriptureUrlType />
          </Modal>
        </div>
      </footer>
    </>
  )
}
