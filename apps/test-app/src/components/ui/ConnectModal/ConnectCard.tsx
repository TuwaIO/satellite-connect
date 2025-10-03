import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { cn } from '@tuwaio/nova-core';

interface ConnectCardProp {
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  infoLink?: string;
}

export function ConnectCard({ onClick, title, icon, infoLink, subtitle }: ConnectCardProp) {
  return (
    <button
      type="button"
      className={cn(
        'group',
        'cursor-pointer w-full p-4 rounded-xl transition-colors relative',
        'bg-[var(--tuwa-bg-secondary)] hover:bg-[var(--tuwa-bg-muted)]',
        'border border-[var(--tuwa-border-primary)]',
        'flex items-center justify-between',
        'disabled:opacity-50 disabled:cursor-not-allowed',
      )}
      onClick={onClick}
    >
      <div className="flex items-center gap-3 transition duration-300 ease-in-out text-[var(--tuwa-text-primary)] group-hover:text-[var(--tuwa-text-accent)]">
        <div className="transition duration-300 ease-in-out group-hover:scale-115">{icon}</div>
        <div className="flex flex-col gap-1 items-start">
          {title}
          {subtitle && <span className="text-sm text-[var(--tuwa-text-secondary)]">{subtitle}</span>}
        </div>
      </div>
      {infoLink && (
        <a
          className="absolute top-[2px] right-[2px] text-[var(--tuwa-text-secondary)] transition duration-300 ease-in-out active:scale-75 hover:scale-110 group-hover:text-[var(--tuwa-text-primary)]"
          onClick={(e) => e.stopPropagation()}
          href={infoLink}
          target="_blank"
        >
          <InformationCircleIcon width={20} height={20} />
        </a>
      )}
    </button>
  );
}
