'use client';

import { useTheme } from 'next-themes';
import { Prism } from 'react-syntax-highlighter';

import NoSSR from '@/components/NoSSR';

interface CodeHighlighterProps {
  children: string | string[];
  language?: string;
}

export function CodeHighlighter({ children, language }: CodeHighlighterProps) {
  const { resolvedTheme } = useTheme();

  return (
    <div className="border-t border-[var(--tuwa-border-secondary)]">
      <NoSSR>
        <Prism
          language={language ?? 'bash'}
          customStyle={{ margin: 0, background: 'transparent' }}
          style={
            resolvedTheme === 'dark'
              ? // eslint-disable-next-line @typescript-eslint/no-require-imports
                require('react-syntax-highlighter/dist/esm/styles/prism').materialOceanic
              : // eslint-disable-next-line @typescript-eslint/no-require-imports
                require('react-syntax-highlighter/dist/esm/styles/prism').materialLight
          }
        >
          {String(children).replace(/\n$/, '')}
        </Prism>
      </NoSSR>
    </div>
  );
}
