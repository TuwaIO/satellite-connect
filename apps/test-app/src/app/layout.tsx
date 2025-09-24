import '@/styles/app.css';

import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Head from 'next/head';
import { ReactNode } from 'react';

import { Providers } from '@/providers';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Pulsar & Cosmos SDK: Next.js + RainbowKit Example',
  description:
    'An example demonstrating the integration of Pulsar transaction tracking with a Next.js application using RainbowKit.',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Head>
        <meta name="apple-mobile-web-app-title" content="Pulsar & Cosmos SDK: Next.js + RainbowKit Example" />
      </Head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
