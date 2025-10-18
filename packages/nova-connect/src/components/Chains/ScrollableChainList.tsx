import { AnimatePresence, motion } from 'framer-motion';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { useNovaConnectLabels } from '../../hooks/useNovaConnectLabels';
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
  const labels = useNovaConnectLabels();
  const containerRef = useRef<HTMLDivElement>(null);
  const [showTopButton, setShowTopButton] = useState(false);
  const [showBottomButton, setShowBottomButton] = useState(false);

  const updateScrollButtons = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    setShowTopButton(scrollTop > 0);
    setShowBottomButton(scrollTop + clientHeight < scrollHeight - 1);
  }, []);

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
  }, [chainsList, updateScrollButtons]);

  const scrollToExtreme = useCallback((isTop: boolean) => {
    const container = containerRef.current;
    if (container) {
      container.scrollTo({
        top: isTop ? 0 : container.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, []);

  const handleTopButtonClick = useCallback(() => {
    scrollToExtreme(true);
  }, [scrollToExtreme]);

  const handleBottomButtonClick = useCallback(() => {
    scrollToExtreme(false);
  }, [scrollToExtreme]);

  return (
    <div className="novacon:relative novacon:py-[24px]" role="region" aria-label={labels.chainListContainer}>
      <AnimatePresence>
        {showTopButton && (
          <motion.div
            key="top-button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="novacon:absolute novacon:top-0 novacon:z-10 novacon:w-full"
          >
            <ToTopButton
              onClick={handleTopButtonClick}
              aria-label={labels.scrollToTop}
              className="novacon:w-full novacon:focus:outline-none novacon:focus:ring-2 novacon:focus:ring-[var(--tuwa-border-primary)] novacon:focus:ring-offset-2 novacon:rounded"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className="NovaCustomScroll novacon:relative novacon:flex novacon:w-full novacon:flex-col novacon:p-2 novacon:gap-1 novacon:max-h-[312px] novacon:overflow-x-hidden novacon:overflow-y-auto"
        ref={containerRef}
        role="listbox"
        aria-label={labels.selectChain}
        tabIndex={0}
        onKeyDown={(event) => {
          // Handle arrow key navigation within the scrollable area
          if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
            // Let the ChainListRenderer handle the focus management
            return;
          }
          // Handle Page Up/Page Down for large scrolls
          if (event.key === 'PageUp') {
            event.preventDefault();
            const container = containerRef.current;
            if (container) {
              container.scrollBy({ top: -container.clientHeight * 0.8, behavior: 'smooth' });
            }
          }
          if (event.key === 'PageDown') {
            event.preventDefault();
            const container = containerRef.current;
            if (container) {
              container.scrollBy({ top: container.clientHeight * 0.8, behavior: 'smooth' });
            }
          }
        }}
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
        {showBottomButton && (
          <motion.div
            key="bottom-button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="novacon:absolute novacon:bottom-0 novacon:z-10 novacon:w-full"
          >
            <ToBottomButton
              onClick={handleBottomButtonClick}
              aria-label={labels.scrollToBottom}
              className="novacon:w-full novacon:focus:outline-none novacon:focus:ring-2 novacon:focus:ring-[var(--tuwa-border-primary)] novacon:focus:ring-offset-2 novacon:rounded"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
