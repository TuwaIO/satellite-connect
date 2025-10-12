import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';

import { ToBottomButton } from '../ToBottomButton';
import { ToTopButton } from '../ToTopButton';
import { ChainListRenderer } from './ChainListRenderer';

interface ChainListProps {
  chainsList: (string | number)[];
  selectValue: string;
  handleValueChange: (newChainId: string) => void;
  getChainData: (chain: string | number) => { formattedChainId: string | number; chain: string | number };
  onClose: () => void;
}

export const ScrollableChainList: React.FC<ChainListProps> = ({
  chainsList,
  selectValue,
  handleValueChange,
  getChainData,
  onClose,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showTopButton, setShowTopButton] = useState(false);
  const [showBottomButton, setShowBottomButton] = useState(false);

  const updateScrollButtons = () => {
    const container = containerRef.current;
    if (!container) return;
    const { scrollTop, scrollHeight, clientHeight } = container;
    setShowTopButton(scrollTop > 0);
    setShowBottomButton(scrollTop + clientHeight < scrollHeight - 1);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    updateScrollButtons();
    container.addEventListener('scroll', updateScrollButtons);
    const resizeObserver = new ResizeObserver(updateScrollButtons);
    resizeObserver.observe(container);
    return () => {
      container.removeEventListener('scroll', updateScrollButtons);
      resizeObserver.disconnect();
    };
  }, [chainsList]);

  const scrollToExtreme = (isTop: boolean) => {
    const container = containerRef.current;
    if (container) {
      container.scrollTo({
        top: isTop ? 0 : container.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="relative py-[24px]">
      <AnimatePresence>
        <motion.div
          key="top-button"
          animate={{ opacity: showTopButton ? 1 : 0 }}
          className="absolute top-0 z-10 w-full opacity-0"
          onClick={() => scrollToExtreme(true)}
        >
          <ToTopButton />
        </motion.div>
      </AnimatePresence>

      <div
        className="NovaCustomScroll relative flex w-full flex-col p-2 gap-1 max-h-[312px] overflow-x-hidden overflow-y-auto"
        ref={containerRef}
      >
        <ChainListRenderer
          chainsList={chainsList}
          selectValue={selectValue}
          handleValueChange={handleValueChange}
          getChainData={getChainData}
          onClose={onClose}
          isMobile={true}
        />
      </div>

      <AnimatePresence>
        <motion.div
          key="bottom-button"
          animate={{ opacity: showBottomButton ? 1 : 0 }}
          className="absolute bottom-0 z-10 w-full opacity-0"
          onClick={() => scrollToExtreme(false)}
        >
          <ToBottomButton />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
