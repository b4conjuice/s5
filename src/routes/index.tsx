import { createFileRoute } from '@tanstack/react-router'

import BookSearch from '@/components/book-search'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  return (
    <main className='flex grow flex-col p-4'>
      <div className='flex grow flex-col gap-4'>
        <h1 className='font-bold'>s5 🔍</h1>
        <div className='flex grow flex-col justify-end gap-4'>
          <BookSearch />
        </div>
      </div>
    </main>
  )
}
