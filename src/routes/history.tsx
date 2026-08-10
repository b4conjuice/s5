import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { CheckIcon, TrashIcon, XMarkIcon } from '@heroicons/react/20/solid'

import HistoryList from '@/components/history-list'
import Menu from '@/components/menu'
import useHistory from '@/components/book-search/hooks/use-history'
import Modal from '@/components/ui/modal'

export const Route = createFileRoute('/history')({
  component: RouteComponent,
})

function RouteComponent() {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const { history, clearHistory } = useHistory() // TODO: use history in history-list
  return (
    <>
      <main className='flex grow flex-col p-4'>
        <div className='flex grow flex-col justify-between gap-4'>
          <div className='flex items-center space-x-4'>
            <h1 className='font-bold'>history</h1>
            <button
              className='text-red-700 hover:text-red-700/75'
              type='button'
              onClick={() => {
                setIsConfirmModalOpen(true)
              }}
            >
              <TrashIcon className='h-6 w-6' />
            </button>
          </div>
          <div className='flex flex-grow flex-col justify-between space-y-4'>
            <HistoryList />
          </div>
        </div>
      </main>
      <footer className='bg-cb-dusty-blue sticky bottom-0 flex items-center justify-between px-2 pt-2 pb-6'>
        <div className='flex space-x-4'>
          <Menu />
        </div>
        <div className='flex space-x-4'></div>
      </footer>
      <Modal
        isOpen={isConfirmModalOpen}
        setIsOpen={setIsConfirmModalOpen}
        title='are you sure you want to clear history?'
      >
        <div className='flex space-x-4'>
          <button
            onClick={() => {
              clearHistory()
              setIsConfirmModalOpen(false)
            }}
          >
            <CheckIcon className='h-6 w-6' />
          </button>
          <button
            onClick={() => {
              setIsConfirmModalOpen(false)
            }}
          >
            <XMarkIcon className='h-6 w-6' />
          </button>
        </div>
      </Modal>
    </>
  )
}
