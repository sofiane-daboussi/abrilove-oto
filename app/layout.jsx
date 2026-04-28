import '../src/styles/global.css'
import { Playfair_Display, DM_Sans, Poppins } from 'next/font/google'

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-playfair',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  display: 'swap',
  variable: '--font-dm-sans',
})

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['600', '700'],
  display: 'swap',
  variable: '--font-poppins',
})

export const metadata = {
  title: 'Abrilove',
  icons: { icon: '/images/favicon.png' },
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className={`${playfair.variable} ${dmSans.variable} ${poppins.variable}`}>
      <head>
        <link rel="icon" href="/images/favicon.png" type="image/png" />
        <meta name="theme-color" content="#660A43" />
        <link rel="dns-prefetch" href="https://js.stripe.com" />
        <link rel="dns-prefetch" href="https://api.stripe.com" />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-MT07XFRPSM" />
        <script dangerouslySetInnerHTML={{ __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-MT07XFRPSM');
        `}} />
      </head>
      <body>{children}</body>
    </html>
  )
}
