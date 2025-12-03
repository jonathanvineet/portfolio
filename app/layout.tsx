import '../styles/globals.css'
import type { Metadata } from 'next'
import Nav from './components/Nav'
import PageLoader from './components/PageLoader'

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
      <head>
        <style dangerouslySetInnerHTML={{__html: `
          body { 
            overflow: hidden;
          }
          .page-content {
            opacity: 0;
            transition: opacity 0.3s ease-in;
          }
          .page-content.loaded {
            opacity: 1;
          }
        `}} />
      </head>
      <body>
        <PageLoader />
        <div className="page-content loaded">
          <Nav />
          {children}
        </div>
      </body>
    </html>
  )
}
