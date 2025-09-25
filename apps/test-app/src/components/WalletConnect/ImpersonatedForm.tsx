import { cn } from '@tuwaio/nova-core';
import { OrbitAdapter } from '@tuwaio/orbit-core';
import { impersonatedHelpers, WalletType } from '@tuwaio/satellite-core';
import { useSatelliteConnectStore } from '@tuwaio/satellite-react';
import { FC, useState } from 'react';

interface ImpersonateFormProps {
  onBack: () => void;
  onClose: () => void;
}

export const ImpersonateForm: FC<ImpersonateFormProps> = ({ onBack, onClose }) => {
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const connect = useSatelliteConnectStore((store) => store.connect);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedAddress = address.trim();

    if (trimmedAddress) {
      try {
        setIsLoading(true);
        const isEVM = trimmedAddress.startsWith('0x');
        impersonatedHelpers.setImpersonated(trimmedAddress);
        await connect({
          walletType: `${isEVM ? OrbitAdapter.EVM : OrbitAdapter.SOLANA}:impersonatedconnector` as WalletType,
          chainId: isEVM ? 1 : 'mainnet',
        });
        onClose();
      } catch (error) {
        console.error('Failed to connect impersonated wallet:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="address" className="block text-sm text-[var(--tuwa-text-secondary)]">
          Enter wallet address to impersonate
        </label>
        <input
          id="address"
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="0x... or ...sol"
          className={cn(
            'mt-1 w-full p-3 rounded-xl',
            'bg-[var(--tuwa-bg-secondary)]',
            'border border-[var(--tuwa-border-primary)]',
            'text-[var(--tuwa-text-primary)]',
            'placeholder:text-[var(--tuwa-text-secondary)]',
            'focus:outline-none focus:ring-2 focus:ring-[var(--tuwa-border-primary)]',
          )}
          disabled={isLoading}
        />
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={!address.trim() || isLoading}
          className={cn(
            'flex-1 p-3 rounded-xl font-medium',
            'bg-[var(--tuwa-bg-secondary)] hover:bg-[var(--tuwa-bg-muted)]',
            'text-[var(--tuwa-text-primary)]',
            'border border-[var(--tuwa-border-primary)]',
            'disabled:opacity-50 disabled:cursor-not-allowed',
          )}
        >
          {isLoading ? 'Connecting...' : 'Connect'}
        </button>

        <button
          type="button"
          onClick={onBack}
          disabled={isLoading}
          className={cn(
            'flex-1 p-3 rounded-xl',
            'text-[var(--tuwa-text-secondary)]',
            'hover:bg-[var(--tuwa-bg-secondary)]',
            'border border-[var(--tuwa-border-primary)]',
            'disabled:opacity-50 disabled:cursor-not-allowed',
          )}
        >
          Back
        </button>
      </div>
    </form>
  );
};
