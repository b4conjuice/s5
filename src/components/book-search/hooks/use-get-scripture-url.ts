import { getScriptureUrl } from '../lib'
import useScriptureUrlType from './use-scripture-url-type'

export default function useGetScriptureUrl() {
  const { scriptureUrlType } = useScriptureUrlType()

  return (bibleParam: string) => getScriptureUrl(bibleParam, scriptureUrlType)
}
