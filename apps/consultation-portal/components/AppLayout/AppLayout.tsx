import Head from 'next/head'
import localization from './AppLayout.json'

const AppLayout = ({ children }) => {
  const loc = localization['appLayout']
  return (
    <div>
      <Head>
        <title>{loc.title}</title>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        ></link>
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        ></link>
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        ></link>
        {/* <link rel="manifest" href="/site.webmanifest"></link>
        <link rel="shortcut icon" href="/favicon.ico" /> */}
      </Head>
      {children}
    </div>
  )
}

export default AppLayout
