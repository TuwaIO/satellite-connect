import { ChevronDownIcon } from '@heroicons/react/24/solid';

export function ToBottomButton() {
  return (
    <button
      type="button"
      className="flex w-full h-6 cursor-default items-center justify-center bg-[var(--tuwa-bg-secondary)] text-[var(--tuwa-text-primary)]"
    >
      <ChevronDownIcon className="w-4 h-4" />
    </button>
  );
}
