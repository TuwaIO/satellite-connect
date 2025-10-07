import { useSatelliteConnectStore } from '@tuwaio/satellite-react';
import { motion } from 'framer-motion';
import { FC, useState } from 'react';

import { ConnectedContent } from '@/components/ui/ConnectButton/ConnectedContent';
import { WaitForConnectionContent } from '@/components/ui/ConnectButton/WaitForConnectionContent';
import { ConnectedModal } from '@/components/ui/ConnectedModal/ConnectedModal';
import { ConnectModal } from '@/components/ui/ConnectModal/ConnectModal';
import { InitialChains } from '@/components/ui/types';

export interface ConnectButtonProps extends InitialChains {
  /** CSS classes to apply to the button */
  className?: string;
  withBalance?: boolean;
  withChain?: boolean;
  onClick: () => void;
}

export const ConnectButton: FC<Omit<ConnectButtonProps, 'onClick'>> = ({
  className,
  solanaRPCUrls,
  appChains,
  withBalance,
  withChain,
}) => {
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [isConnectedModalOpen, setIsConnectedModalOpen] = useState(false);
  const activeWallet = useSatelliteConnectStore((store) => store.activeWallet);

  const handleClick = () => {
    if (activeWallet?.isConnected) {
      setIsConnectedModalOpen(true);
    } else {
      setIsConnectModalOpen(true);
    }
  };

  return (
    <>
      <motion.div
        layout
        className="relative"
        transition={{
          layout: {
            duration: 0.2,
            ease: [0.1, 0.1, 0.2, 1],
          },
        }}
      >
        {activeWallet?.isConnected ? (
          <ConnectedContent
            onClick={handleClick}
            withBalance={withBalance}
            withChain={withChain}
            solanaRPCUrls={solanaRPCUrls}
            appChains={appChains}
          />
        ) : (
          <WaitForConnectionContent className={className} onClick={handleClick} />
        )}
      </motion.div>

      <ConnectModal
        isOpen={isConnectModalOpen}
        setIsOpen={setIsConnectModalOpen}
        appChains={appChains}
        solanaRPCUrls={solanaRPCUrls}
      />
      <ConnectedModal isOpen={isConnectedModalOpen} setIsOpen={setIsConnectedModalOpen} />
    </>
  );
};
