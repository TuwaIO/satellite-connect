import '@/styles/app.css';

import { Head } from 'nextra/components';
import { getPageMap } from 'nextra/page-map';
import { Layout } from 'nextra-theme-docs';
import { Navbar } from '../components/NavBar';
import { Footer } from '../components/Footer';
import NextTopLoader from 'nextjs-toploader';

// --- Metadata Configuration ---
export const metadata = {
  title: {
    default: 'Satellite Connect Documentation',
    template: '%s – Satellite Connect',
  },
  description:
    'Official documentation for the Satellite Connect, the headless state management system for connect Web3 wallet.',

  keywords: [
    'Satellite Connect',
    'headless',
    'state management',
    'transaction tracking',
    'web3',
    'zustand',
    'wagmi',
    'viem',
    'typescript',
  ],
  authors: [{ name: 'TUWA', url: 'https://github.com/TuwaIO' }],

  openGraph: {
    title: 'Satellite Connect Documentation',
    description: 'The official documentation for the headless state management system for connect Web3 wallet.',
    url: 'https://satellite.docs.tuwa.io/',
    siteName: 'Pulsar Engine Docs',
    images: [
      {
        url: 'https://raw.githubusercontent.com/TuwaIO/workflows/refs/heads/main/preview/preview-logo.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Satellite Connect Documentation',
    description: 'The official documentation for the headless state management system for connect Web3 wallet.',
    images: ['https://raw.githubusercontent.com/TuwaIO/workflows/refs/heads/main/preview/preview-logo.png'],
  },
};

export default async function RootLayout({ children }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <Head>
        <meta name="apple-mobile-web-app-title" content="Satellite Connect Docs" />
      </Head>
      <body>
        <Layout
          navbar={<Navbar key="navbar" />}
          footer={<Footer key="footer" />}
          pageMap={await getPageMap()}
          docsRepositoryBase="https://github.com/TuwaIO/satellite-connect/tree/main/apps/docs"
          navigation={{ prev: true, next: true }}
        >
          <NextTopLoader color="#6366f1" showSpinner={false} />
          {children}
        </Layout>
      </body>
    </html>
  );
}
