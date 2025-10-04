import { cn, StarsBackground } from '@tuwaio/nova-core';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import React, { useState } from 'react';

import NoSSR from '@/components/ui/NoSSR';

import DigitalPassportImage from '../assets/digitalPassport.png';
import WalletImage from '../assets/wallet.png';

const slidesData = [
  {
    id: 1,
    image: DigitalPassportImage,
    title: 'The Key to a New Internet',
    description:
      'Your wallet is more than just storage. Think of it as your digital passport that lets you truly own, display, and exchange every digital asset you hold, from crypto tokens to unique NFTs.',
  },
  {
    id: 2,
    image: WalletImage,
    title: 'Log In Without the Hassle',
    description:
      'Skip the endless sign-up forms! Your wallet is your unique access pass. Just connect it, and the website instantly recognizes you. It saves you time and protects your privacy.',
  },
];

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: '0%',
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? '100%' : '-100%',
    opacity: 0,
    position: 'absolute',
  }),
};

export const AboutWallets: React.FC = () => {
  const [[page, direction], setPage] = useState([0, 0]);

  const slideIndex = Math.abs(page % slidesData.length);

  const goToSlide = (index: number) => {
    const newDirection = index > slideIndex ? 1 : -1;
    setPage([index, newDirection]);
  };

  return (
    <div className="relative m-[-16px]">
      <div className="relative z-1 overflow-hidden">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={page}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="flex flex-col justify-start"
          >
            <div className="flex justify-center relative pt-4">
              <NoSSR>
                <StarsBackground />
              </NoSSR>
              <div className="absolute inset-0 z-1 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]"></div>
              <AnimatePresence mode="wait">
                <motion.div
                  animate={{ opacity: 1, scale: 1 }}
                  initial={{ opacity: 0, scale: 0.1 }}
                  transition={{ delay: 0.1 }}
                >
                  <Image
                    width={250}
                    height={250}
                    className="relative z-2 rounded-full"
                    src={slidesData[slideIndex].image}
                    alt={slidesData[slideIndex].title}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="text-center relative z-3 p-4">
              <h2 className="text-xl font-bold text-[var(--tuwa-text-primary)] mb-2">{slidesData[slideIndex].title}</h2>
              <p className="text-[var(--tuwa-text-secondary)]">{slidesData[slideIndex].description}</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex justify-center space-x-2 mt-6 relative z-3 mx-4 mb-4">
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-1 h-[2px] w-full bg-[var(--tuwa-border-primary)] " />
        <div className="flex gap-2 px-4 bg-[var(--tuwa-bg-secondary)] relative z-2">
          {slidesData.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                'cursor-pointer h-2 rounded-full transition-all duration-300 focus:outline-none bg-[var(--tuwa-border-primary)] w-2 hover:bg-[var(--tuwa-text-accent)]',
                { 'bg-[var(--tuwa-text-accent)] w-6': slideIndex === index },
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
