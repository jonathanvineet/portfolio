import Head from 'next/head'
import Script from 'next/script'
import '../styles.css'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      {/* Load legacy client script after hydration to avoid SSR mismatches */}
      <Script src="/script.js" strategy="afterInteractive" />
      <Component {...pageProps} />
    </>
  )
}
