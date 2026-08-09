import { useLocalStorage } from '@uidotdev/usehooks'

import type { HistoryEntry, Scripture } from '../lib/types'

export default function useHistory() {
  const [history, setHistory] = useLocalStorage<HistoryEntry[]>(
    's5-history',
    []
  )
  function addHistory(scripture: Scripture) {
    const { bibleParam } = scripture
    const entry = {
      bibleParam,
      date: new Date(),
    }
    setHistory([entry, ...history])
  }
  function clearHistory() {
    setHistory([])
  }
  return { history, clearHistory, addHistory, setHistory }
}
