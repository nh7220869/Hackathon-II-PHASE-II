import type { Metadata } from 'next'
import './globals.css'
import Providers from '@/components/providers/Providers'

export const metadata: Metadata = {
  title: 'Phase II - Todo App',
  description: 'Full-stack todo application with authentication',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" >
      <body suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
