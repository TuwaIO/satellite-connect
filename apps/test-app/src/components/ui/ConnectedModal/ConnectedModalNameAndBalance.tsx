import { cn, useCopyToClipboard } from '@tuwaio/nova-core';
import { motion } from 'framer-motion';

export function ConnectedModalNameAndBalance({
  address,
  ensNameAbbreviated,
  balance,
  isLoading,
}: {
  address: string;
  ensNameAbbreviated: string;
  balance: { value: string; symbol: string } | null;
  isLoading: boolean;
}) {
  const { copy, isCopied } = useCopyToClipboard();

  return (
    <div className="flex w-full flex-col items-center justify-start gap-2 min-h-[60px]">
      <div className="flex items-center gap-3 relative text-[var(--tuwa-text-primary)]">
        <p className="text-xl font-bold">{ensNameAbbreviated}</p>
        <button
          type="button"
          onClick={() => copy(address)}
          className={cn(
            'cursor-pointer flex items-center justify-center text-sm text-[var(--tuwa-text-tertiary)] hover:opacity-60 transition absolute right-[-26px]',
            {
              'text-[var(--tuwa-success-text)]': isCopied,
            },
          )}
        >
          {isCopied ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <motion.path
                d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 0 1 9 9v.375M10.125 2.25A3.375 3.375 0 0 1 13.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 0 1 3.375 3.375M9 15l2.25 2.25L15 12"
                strokeLinecap="round"
                strokeLinejoin="round"
                variants={{
                  hidden: { pathLength: 0, opacity: 0 },
                  visible: { pathLength: 1, opacity: 1 },
                }}
                initial="hidden"
                animate="visible"
                exit="hidden"
                transition={{
                  duration: 0.5,
                  ease: 'easeInOut',
                }}
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <motion.path
                d="M16.5 8.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v8.25A2.25 2.25 0 0 0 6 16.5h2.25m8.25-8.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-7.5A2.25 2.25 0 0 1 8.25 18v-1.5m8.25-8.25h-6a2.25 2.25 0 0 0-2.25 2.25v6"
                strokeLinecap="round"
                strokeLinejoin="round"
                variants={{
                  hidden: { pathLength: 0, opacity: 0 },
                  visible: { pathLength: 1, opacity: 1 },
                }}
                initial="hidden"
                animate="visible"
                exit="hidden"
                transition={{
                  duration: 0.5,
                  ease: 'easeInOut',
                }}
              />
            </svg>
          )}
        </button>
      </div>

      <>
        {isLoading ? (
          <div className="animate-pulse rounded-xl h-5 w-24 bg-[var(--tuwa-bg-muted)] " />
        ) : (
          <p className="flex items-center gap-1 text-sm text-[var(--tuwa-text-tertiary)]">
            {balance?.value}
            <span>{balance?.symbol}</span>
          </p>
        )}
      </>
    </div>
  );
}
