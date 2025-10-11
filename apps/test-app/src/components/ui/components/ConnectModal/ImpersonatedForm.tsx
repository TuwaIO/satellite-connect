import { cn } from '@tuwaio/nova-core';

interface ImpersonateFormProps {
  impersonatedAddress: string;
  setImpersonatedAddress: (value: string) => void;
}

export function ImpersonatedForm({ impersonatedAddress, setImpersonatedAddress }: ImpersonateFormProps) {
  return (
    <div>
      <label htmlFor="address" className="block text-sm text-[var(--tuwa-text-secondary)]">
        Enter wallet address to impersonate
      </label>
      <input
        id="address"
        type="text"
        value={impersonatedAddress}
        onChange={(e) => setImpersonatedAddress(e.target.value)}
        placeholder="0x..."
        className={cn(
          'mt-1 w-full p-3 rounded-xl',
          'bg-[var(--tuwa-bg-secondary)]',
          'border border-[var(--tuwa-border-primary)]',
          'text-[var(--tuwa-text-primary)]',
          'placeholder:text-[var(--tuwa-text-secondary)]',
          'focus:outline-none focus:ring-2 focus:ring-[var(--tuwa-border-primary)]',
        )}
      />
    </div>
  );
}
