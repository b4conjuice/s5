import { useLocalStorage } from '@uidotdev/usehooks'

import type { ScriptureUrlType } from '../lib/types'

export default function useScriptureUrlType() {
  const [scriptureUrlType, setScriptureUrlType] =
    useLocalStorage<ScriptureUrlType>('s4-scripture-url-type', 'jwlibrary')
  return { scriptureUrlType, setScriptureUrlType }
}
