import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'https://codechamber.com'),
  title: {
    default: 'CodeChamber — Excellence in Full Stack & Edge Engineering',
    template: '%s | CodeChamber',
  },
  description:
    'Excellence in Full Stack & Edge Engineering. Building scalable IoT pipelines, edge compute platforms, and cloud-native systems.',
  icons: {
    icon: [
      {
        media: '(prefers-color-scheme: light)',
        url: '/codechamber_favicon_light.png',
        href: '/codechamber_favicon_light.png',
      },
      {
        media: '(prefers-color-scheme: dark)',
        url: '/codechamber_favicon_dark.png',
        href: '/codechamber_favicon_dark.png',
      },
    ],
    shortcut: '/codechamber_favicon_dark.png',
    apple: '/codechamber_favicon_dark.png',
  },
  keywords: [
    'CodeChamber', 'Full Stack Engineer', 'IoT Engineer', 'Edge Computing', 'Next.js', 'Node.js',
    'Python', 'Docker', 'Kubernetes', 'Kafka', 'GPS Telemetry', 'WebRTC', 'NVIDIA Jetson',
  ],
  authors: [{ name: 'CodeChamber' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'CodeChamber — Excellence in Full Stack & Edge Engineering',
    description: 'Excellence in Full Stack & Edge Engineering специализируюсь на IoT, edge compute, и cloud-native системах.',
    siteName: 'CodeChamber',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'CodeChamber Portfolio' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CodeChamber — Excellence in Full Stack & Edge Engineering',
    description: 'Excellence in Full Stack & Edge Engineering специализируюсь на IoT, edge compute, и cloud-native системах.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  var isDark = theme ? theme === 'dark' : true;
                  if (isDark) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: 'CodeChamber',
              jobTitle: 'Senior Full Stack & Edge Systems Engineer',
              url: process.env.NEXTAUTH_URL || 'https://codechamber.com',
              sameAs: [
                'https://linkedin.com/company/codechamber',
                'https://github.com/codechamber',
              ],
            }),
          }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#1e293b',
              color: '#f1f5f9',
              border: '1px solid #334155',
            },
          }}
        />
      </body>
    </html>
  )
}
