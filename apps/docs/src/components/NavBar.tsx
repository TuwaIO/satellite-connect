'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Navbar as NextraNavbar } from 'nextra-theme-docs';

import NoSSR from '@/components/NoSSR';

export function Navbar() {
  const { resolvedTheme } = useTheme();

  return (
    <NextraNavbar
      logo={
        <NoSSR>
          <Image
            width={50}
            height={50}
            src={
              resolvedTheme === 'dark'
                ? 'https://raw.githubusercontent.com/TuwaIO/workflows/refs/heads/main/preview/tuwaLogoWhite.svg'
                : 'https://raw.githubusercontent.com/TuwaIO/workflows/refs/heads/main/preview/tuwaLogoDark.svg'
            }
            alt="TUWA Logo"
          />
        </NoSSR>
      }
    >
      <div className="flex items-center gap-3">
        <Link
          href="https://stories.tuwa.io/?path=/docs/introduction--docs"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-1 px-2 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M16.71 16.71a1 1 0 0 0-.33-.21a7 7 0 0 0-9.09-8.93a1 1 0 0 0-.66.84a1 1 0 0 0 .5 1.05a5 5 0 0 1 2.83 4.84a1 1 0 0 0 .43.86a1 1 0 0 0 .93.11a3 3 0 0 1 3.85 1.79a1 1 0 0 0 1.84-.37z" />
          </svg>
          Storybook
        </Link>

        <Link
          href="https://npmjs.com/org/tuwaio"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M1.763 0C.786 0 0 .786 0 1.763v20.474C0 23.214.786 24 1.763 24h20.474c.977 0 1.763-.786 1.763-1.763V1.763C24 .786 23.214 0 22.237 0H1.763zM5.13 5.323l13.837.019-.009 13.836h-3.464l.01-10.382h-3.456L12.04 19.17H5.113l.017-13.847z" />
          </svg>
          NPM
        </Link>

        <Link
          href="https://github.com/TuwaIO/satellite-connect"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
          GitHub
        </Link>
      </div>
    </NextraNavbar>
  );
}
