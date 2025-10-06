import { Web3Icon } from '@bgd-labs/react-web3-icons';
import { cn, StarsBackground } from '@tuwaio/nova-core';
import { AnimatePresence, motion } from 'framer-motion';

import NoSSR from '@/components/ui/NoSSR';

export function GetWallet() {
  return (
    <div className="m-[-16px]">
      <div className="relative w-full h-[250px] overflow-hidden p-4">
        <NoSSR>
          <StarsBackground />
        </NoSSR>
        <div className="absolute inset-0 z-1 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]"></div>
        <AnimatePresence>
          <motion.div
            animate={{ opacity: 1, scale: 1 }}
            initial={{ opacity: 0, scale: 0.1 }}
            className="relative z-2 w-full h-full px-2 md:px-4"
          >
            <div
              className={cn(
                'absolute top-[5%] left-[5%] animate-float duration-800 delay-200',
                'w-[80px] h-[80px] md:w-[95px] md:h-[95px] [&>img]:w-full [&>img]:h-full [&>svg]:w-full [&>svg]:h-full',
              )}
            >
              <Web3Icon walletKey="metamask" />
            </div>

            <div
              className={cn(
                'absolute top-[10%] right-[10%] animate-float direction-reverse duration-3000 delay-2000',
                'w-[60px] h-[60px] md:w-[75px] md:h-[75px] [&>img]:w-full [&>img]:h-full [&>svg]:w-full [&>svg]:h-full',
              )}
            >
              <Web3Icon walletKey="trustwallet" />
            </div>

            <div
              className={cn(
                'absolute top-[25%] left-1/2 -translate-x-1/2 animate-float duration-1000 delay-2500',
                'w-[75px] h-[75px] md:w-[90px] md:h-[90px] [&>img]:w-full [&>img]:h-full [&>svg]:w-full [&>svg]:h-full',
              )}
            >
              <Web3Icon walletKey="coinbasewallet" />
            </div>

            <div
              className={cn(
                'absolute bottom-[10%] left-[10%] animate-float direction-reverse duration-5000 delay-1500',
                'w-[75px] h-[75px] md:w-[85px] md:h-[85px] [&>img]:w-full [&>img]:h-full [&>svg]:w-full [&>svg]:h-full',
              )}
            >
              <Web3Icon walletKey="bravewallet" />
            </div>

            <div
              className={cn(
                'absolute bottom-[15%] right-[15%] animate-float duration-6000 delay-400',
                'w-[50px] h-[50px] md:w-[70px] md:h-[70px] [&>img]:w-full [&>img]:h-full [&>svg]:w-full [&>svg]:h-full',
              )}
            >
              <Web3Icon walletKey="exoduswallet" />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="text-center pb-4 px-2 md:px-4">
        <h3 className="font-bold mb-2 text-xl text-[var(--tuwa-text-primary)]">Start Exploring Web3</h3>
        <p className="text-[var(--tuwa-text-secondary)]">
          Your wallet is the key to the digital world and the technology that makes exploring web3 possible.
        </p>
      </div>
    </div>
  );
}
