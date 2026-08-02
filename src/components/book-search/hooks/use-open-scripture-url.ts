import useGetScriptureUrl from './use-get-scripture-url'
import useScriptureUrlType from './use-scripture-url-type'
import { transformScripturetoBibleParam } from '../lib'
import type { Scripture } from '../lib/types'

export default function useOpenScriptureUrl() {
  const { scriptureUrlType } = useScriptureUrlType()
  const getScriptureUrl = useGetScriptureUrl()

  const openScriptureUrl = (scripture: Scripture) => {
    const bibleParam = transformScripturetoBibleParam(scripture)
    const scriptureUrl = getScriptureUrl(bibleParam)
    const target =
      scriptureUrlType === 'jwlibrary'
        ? '_self'
        : scriptureUrlType === 'wol'
          ? '_blank'
          : '_blank'
    window.open(scriptureUrl, target)
  }
  return openScriptureUrl
}
