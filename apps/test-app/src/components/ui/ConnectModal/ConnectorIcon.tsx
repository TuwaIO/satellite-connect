import { Web3Icon } from '@bgd-labs/react-web3-icons';
import Image from 'next/image';

interface ConnectorIconProps {
  icon?: string;
  name: string;
  size?: number;
}

export function ConnectorIcon({ icon, name, size }: ConnectorIconProps) {
  const localSize = size || 32;

  return (
    <>
      {icon ? (
        <Image src={icon.trim()} alt={name} width={localSize} height={localSize} />
      ) : (
        <Web3Icon walletKey={name} width={localSize} height={localSize} />
      )}
    </>
  );
}
