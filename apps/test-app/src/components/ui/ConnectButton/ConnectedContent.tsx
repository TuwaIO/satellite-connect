import { Web3Icon } from '@bgd-labs/react-web3-icons';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import { cn, textCenterEllipsis } from '@tuwaio/nova-core';
import { formatWalletChainId } from '@tuwaio/orbit-core';
import { getAdapterFromWalletType } from '@tuwaio/satellite-core';
import { useSatelliteConnectStore } from '@tuwaio/satellite-react';
import { useState } from 'react';

import { ConnectButtonProps } from '@/components/ui/ConnectButton/ConnectButton';
import { useGetWalletNameAndAvatar } from '@/components/ui/hooks/useGetWalletNameAndAvatar';
import { useWalletNativeBalance } from '@/components/ui/hooks/useWalletNativeBalance';
import { getChainsListByWalletType } from '@/components/ui/utils/getChainsListByWalletType';
import { WalletAvatar } from '@/components/ui/WalletInfo/WalletAvatar';

/**
 * ConnectedContent
 * * Displays the key information for the connected wallet:
 * native token balance, wallet avatar, and resolved name (ENS or abbreviated address).
 */
export function ConnectedContent({
  withBalance,
  withChain,
  className,
  onClick,
  appChains,
  solanaRPCUrls,
}: ConnectButtonProps) {
  const wallet = useSatelliteConnectStore((state) => state.activeWallet);
  const switchNetwork = useSatelliteConnectStore((state) => state.switchNetwork);

  const { ensAvatar, ensNameAbbreviated } = useGetWalletNameAndAvatar(6);
  const { balance } = useWalletNativeBalance();

  const [isChainsListOpen, setIsChainsListOpen] = useState(false);

  if (!wallet) return null;

  const formattedBalance = balance?.value ? parseFloat(balance.value).toFixed(3) : '0.000';
  const displayName = ensNameAbbreviated ? ensNameAbbreviated : textCenterEllipsis(wallet?.address, 5, 5);

  const chainsList = getChainsListByWalletType({ walletType: wallet.walletType, appChains, solanaRPCUrls });

  return (
    <div className="relative flex items-center gap-2">
      {withChain && (
        <>
          <button
            type="button"
            onClick={() => setIsChainsListOpen(!isChainsListOpen)}
            className="[&>img]:w-[24px] [&>img]:h-[24px]"
          >
            <Web3Icon chainId={formatWalletChainId(wallet.chainId, getAdapterFromWalletType(wallet.walletType))} />
            <ChevronDownIcon className="w-3 h-3" />
          </button>
          {chainsList.map((chain) => {
            return (
              <button type="button" onClick={() => switchNetwork(chain)} key={chain}>
                <p>{chain}</p>
              </button>
            );
          })}
        </>
      )}

      <button
        type="button"
        onClick={onClick}
        className={cn(
          'cursor-pointer inline-flex items-center justify-center gap-2 px-4 py-2',
          'rounded-xl font-medium text-sm transition-all duration-200',
          'hover:scale-[1.02] active:scale-[0.98]',
          'focus:outline-none focus:ring-2 focus:ring-offset-2',
          'focus:ring-offset-[var(--tuwa-bg-primary)]',
          [
            'bg-[var(--tuwa-bg-secondary)]',
            'text-[var(--tuwa-text-primary)]',
            'hover:bg-[var(--tuwa-bg-muted)]',
            'focus:ring-[var(--tuwa-text-secondary)]',
            'border border-[var(--tuwa-border-primary)]',
          ],
          className,
        )}
      >
        {withBalance && (
          <div className="relative flex items-center pr-2 gap-2 text-[var(--tuwa-text-secondary)]">
            <span className="font-semibold mr-1">{formattedBalance}</span>
            <div className="absolute top-1/2 right-0 transform -translate-y-1/2 h-4 w-[1px] bg-[var(--tuwa-border-primary)]" />
          </div>
        )}

        <div className={cn('flex items-center space-x-2', { 'pl-2': withBalance })}>
          <WalletAvatar address={wallet.address} ensAvatar={ensAvatar} />
          <span className="text-[var(--tuwa-text-primary)] font-medium">{displayName}</span>
        </div>
      </button>
    </div>
  );
}
