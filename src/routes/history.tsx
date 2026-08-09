import { createFileRoute } from '@tanstack/react-router'

import HistoryList from '@/components/history-list'
import Menu from '@/components/menu'

export const Route = createFileRoute('/history')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <main className='flex grow flex-col p-4'>
        <div className='flex grow flex-col justify-between gap-4'>
          <div className='flex justify-between'>
            <h1 className='font-bold'>history</h1>
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
    </>
  )
}
