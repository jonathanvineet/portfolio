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

      <nav className="fixed-nav" role="navigation" aria-label="Main navigation">
        <ul className="nav-dots">
          <li><a href="#home" className="nav-dot active" data-section="home" aria-label="Navigate to Home"><span>Home</span></a></li>
          <li><a href="#about" className="nav-dot" data-section="about" aria-label="Navigate to About"><span>About</span></a></li>
          <li><a href="#work" className="nav-dot" data-section="work" aria-label="Navigate to Works"><span>Works</span></a></li>
          <li><a href="#skills" className="nav-dot" data-section="skills" aria-label="Navigate to Skills"><span>Skills</span></a></li>
          <li><a href="#contact" className="nav-dot" data-section="contact" aria-label="Navigate to Contact"><span>Contact</span></a></li>
        </ul>
      </nav>

      <Component {...pageProps} />
    </>
  )
}
