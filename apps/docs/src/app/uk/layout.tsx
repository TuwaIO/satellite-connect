import type { ReactNode } from 'react';

import { RootDocument, rootMetadata } from '../rootDocument';

export const metadata = rootMetadata;

export default function RootLayout({ children }: { children: ReactNode }) {
  return <RootDocument lang="uk">{children}</RootDocument>;
}
