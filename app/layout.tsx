import './globals.css'
import { EB_Garamond } from 'next/font/google'

const garamond = EB_Garamond({
  subsets: ['latin'],
  display: 'swap',
})

export const metadata = {
  title: 'Audie',
  description: 'Upload Audio Files',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={garamond.className}>
      <body>{children}</body>
    </html>
  )
}
