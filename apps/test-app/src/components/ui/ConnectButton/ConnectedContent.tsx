import { Web3Icon } from '@bgd-labs/react-web3-icons';
import { cn, textCenterEllipsis } from '@tuwaio/nova-core';
import { formatWalletChainId } from '@tuwaio/orbit-core';
import { getAdapterFromWalletType } from '@tuwaio/satellite-core';
import { useSatelliteConnectStore } from '@tuwaio/satellite-react';

import { ConnectButtonProps } from '@/components/ui/ConnectButton/ConnectButton';
import { useGetWalletNameAndAvatar } from '@/components/ui/hooks/useGetWalletNameAndAvatar';
import { useWalletNativeBalance } from '@/components/ui/hooks/useWalletNativeBalance';
import { WalletAvatar } from '@/components/ui/WalletInfo/WalletAvatar';

/**
 * ConnectedContent
 * * Displays the key information for the connected wallet:
 * native token balance, wallet avatar, and resolved name (ENS or abbreviated address).
 */
export function ConnectedContent({ withBalance }: Pick<ConnectButtonProps, 'withBalance'>) {
  const wallet = useSatelliteConnectStore((state) => state.activeWallet);

  const { ensAvatar, ensNameAbbreviated } = useGetWalletNameAndAvatar(6);
  const { balance } = useWalletNativeBalance();

  if (!wallet) return null;

  const formattedBalance = balance?.value ? parseFloat(balance.value).toFixed(3) : '0.000';
  const displayName = ensNameAbbreviated ? ensNameAbbreviated : textCenterEllipsis(wallet?.address, 5, 5);

  return (
    <>
      {withBalance && (
        <div className="relative flex items-center pr-2 gap-2 text-[var(--tuwa-text-secondary)] [&>img]:w-[24px] [&>img]:h-[24px]">
          <Web3Icon chainId={formatWalletChainId(wallet.chainId, getAdapterFromWalletType(wallet.walletType))} />
          <span className="font-semibold mr-1">{formattedBalance}</span>
          <div className="absolute top-1/2 right-0 transform -translate-y-1/2 h-4 w-[1px] bg-[var(--tuwa-border-primary)]" />
        </div>
      )}

      <div className={cn('flex items-center space-x-2', { 'pl-2': withBalance })}>
        <WalletAvatar address={wallet.address} ensAvatar={ensAvatar} />
        <span className="text-[var(--tuwa-text-primary)] font-medium">{displayName}</span>
      </div>
    </>
  );
}
