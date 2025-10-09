import { Web3Icon } from '@bgd-labs/react-web3-icons';
import { formatWalletName } from '@tuwaio/satellite-core';
import Image from 'next/image';

interface ConnectorIconProps {
  icon?: string;
  name: string;
  size?: number;
}

export function WalletIcon({ icon, name, size }: ConnectorIconProps) {
  const localSize = size || 32;

  return (
    <>
      {icon ? (
        <Image src={icon.trim()} alt={formatWalletName(name)} width={localSize} height={localSize} />
      ) : (
        <Web3Icon walletKey={name} width={localSize} height={localSize} />
      )}
    </>
  );
}
