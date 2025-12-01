import '../styles/globals.css'
import type { Metadata } from 'next'
import Nav from './components/Nav'

export const metadata: Metadata = {
  title: 'Portfolio | Wayne Enterprises Style',
  description: 'Modern dark-tech portfolio with Batman/Wayne Enterprises aesthetic',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Nav />
        {children}
      </body>
    </html>
  )
}
