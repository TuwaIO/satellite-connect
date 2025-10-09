import { ChevronUpIcon } from '@heroicons/react/24/solid';

export function ToTopButton() {
  return (
    <button
      type="button"
      className="flex w-full h-6 cursor-default items-center justify-center bg-[var(--tuwa-bg-secondary)] text-[var(--tuwa-text-primary)]"
    >
      <ChevronUpIcon className="w-4 h-4" />
    </button>
  );
}
