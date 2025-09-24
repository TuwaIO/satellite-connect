'use client';

import { CommandLineIcon } from '@heroicons/react/24/outline';
import { Tabs } from 'nextra/components';

import { CodeBlock } from '@/components/CodeBlock';
import { CodeHighlighter } from '@/components/CodeHighlighter';

const tabsItems = [
  {
    title: 'pnpm',
    command: 'pnpm add',
  },
  {
    title: 'bun',
    command: 'bun add',
  },
  {
    title: 'npm',
    command: 'npm install',
  },
  {
    title: 'yarn',
    command: 'yarn add',
  },
];

export function PackageInstallationTabs({ packagesList }: { packagesList?: string }) {
  const packages = packagesList
    ? packagesList
    : '@tuwaio/pulsar-core @tuwaio/pulsar-evm @tuwaio/pulsar-react @wagmi/core viem zustand immer dayjs';

  return (
    <div className="my-4">
      <Tabs items={tabsItems.map((tab) => tab.title)}>
        {tabsItems.map((tab) => (
          <Tabs.Tab key={tab.title}>
            <CodeBlock title="Terminal" titleIcons={<CommandLineIcon />} textToCopy={`${tab.command} ${packages}`}>
              <CodeHighlighter language="bash">{`${tab.command} ${packages}`}</CodeHighlighter>
            </CodeBlock>
          </Tabs.Tab>
        ))}
      </Tabs>
    </div>
  );
}
