import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import {
  ArrowUpTrayIcon,
  CheckIcon,
  TrashIcon,
  XMarkIcon,
} from '@heroicons/react/20/solid'

import HistoryList from '@/components/history-list'
import Menu from '@/components/menu'
import useHistory from '@/components/book-search/hooks/use-history'
import Modal from '@/components/ui/modal'
import type { HistoryEntry } from '@/components/book-search/lib/types'

export const Route = createFileRoute('/history')({
  component: RouteComponent,
})

function RouteComponent() {
  const [importText, setImportText] = useState('')
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)
  const { history, clearHistory, setHistory } = useHistory() // TODO: use history in history-list
  return (
    <>
      <main className='flex grow flex-col p-4'>
        <div className='flex grow flex-col justify-between gap-4'>
          <div className='flex items-center justify-between'>
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
            <button
              type='button'
              onClick={() => {
                setIsExportModalOpen(true)
              }}
            >
              <ArrowUpTrayIcon className='h-6 w-6' />
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
      <Modal
        isOpen={isExportModalOpen}
        setIsOpen={setIsExportModalOpen}
        title='import/export history'
      >
        {history.length > 0 && (
          <>
            <textarea
              className='bg-cobalt w-full p-4'
              defaultValue={JSON.stringify(history)}
            />
            <button
              onClick={async () => {
                // await copyToClipboard(btoa(JSON.stringify(history)))
                // toast.success('copied export code to clipboard')
              }}
            >
              export
            </button>
            <hr className='border-cb-white/25' />
          </>
        )}
        <textarea
          className='bg-cobalt w-full p-4'
          value={importText}
          onChange={e => {
            setImportText(e.target.value)
          }}
        />
        <button
          onClick={() => {
            const newHistory = JSON.parse(importText) as HistoryEntry[]
            setHistory(newHistory)
            // toast.success('updated history')
            setImportText('')
          }}
          disabled={!importText}
          className='disabled:pointer-events-none disabled:opacity-25'
        >
          import
        </button>
      </Modal>
    </>
  )
}
