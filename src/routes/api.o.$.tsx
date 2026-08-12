import { createFileRoute } from '@tanstack/react-router'

import {
  getScriptureUrl,
  transformScriptureStringtoBibleParam,
} from '@/components/book-search/lib'

const SCRIPTURE_URL_TYPE = 'wol'

export const Route = createFileRoute('/api/o/$')({
  server: {
    handlers: {
      GET: async function handler({ params }) {
        const { _splat: scriptureString } = params
        if (scriptureString === undefined || scriptureString === '') {
          return new Response(
            JSON.stringify({
              error: 'invalid scripture string',
              s: scriptureString,
            }),
            {
              status: 400,
              headers: {
                'Content-Type': 'application/json',
              },
            }
          )
        }
        const bibleParam = transformScriptureStringtoBibleParam(scriptureString)
        if (bibleParam === '') {
          return new Response(
            JSON.stringify({
              error: 'invalid bibleParam',
              s: scriptureString,
            }),
            {
              status: 400,
              headers: {
                'Content-Type': 'application/json',
              },
            }
          )
        }
        const scriptureUrl = getScriptureUrl(bibleParam, SCRIPTURE_URL_TYPE)
        return new Response(null, {
          status: 302,
          headers: {
            Location: scriptureUrl,
          },
        })
      },
    },
  },
})
