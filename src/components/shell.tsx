import { HeadContent, Scripts } from '@tanstack/react-router'

import Layout from '@/components/layout'

export default function Shell({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <head>
        <HeadContent />
        <link rel='manifest' href='/manifest.json' />
        <link rel='icon' type='image/x-icon' href='/favicon.png' />
        <link rel='shortcut icon' type='image/x-icon' href='/favicon.png' />
        <link rel='apple-touch-icon' href='/icon.png' />
      </head>
      <body>
        <Layout>{children}</Layout>
        <Scripts />
      </body>
    </html>
  )
}
