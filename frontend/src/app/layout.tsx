import type { Metadata } from 'next'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: 'ResumeIQ - AI Resume Analysis & Optimization',
  description: 'Analyze your resume against job descriptions, identify skill gaps, and get AI-powered optimization recommendations.',
  keywords: ['resume', 'AI', 'job matching', 'career', 'optimization'],
  authors: [{ name: 'ResumeIQ Team' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        {children}
      </body>
    </html>
  )
}
