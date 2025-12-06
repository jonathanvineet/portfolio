// TypeScript cannot find type declarations for this global stylesheet side-effect import.
// Suppress the error because Next.js supports global CSS imports in the app directory.
// @ts-ignore
import '../styles/globals.css'
import type { Metadata } from 'next'
import Nav from './components/Nav'
import PageLoader from './components/PageLoader'

export const metadata: Metadata = {
  title: 'Portfolio | Wayne Enterprise',
  description: 'Modern dark-tech portfolio with Batman/Wayne Enterprises aesthetic',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body>
        <PageLoader />
        <div className="page-content">
          <Nav />
          {children}
        </div>
      </body>
    </html>
  )
}
