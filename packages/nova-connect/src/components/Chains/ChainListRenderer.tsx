import { Web3Icon } from '@bgd-labs/react-web3-icons';
import { getChainName } from '@bgd-labs/react-web3-icons/dist/utils';
import * as Select from '@radix-ui/react-select';
import { cn } from '@tuwaio/nova-core';
import React, { type ComponentPropsWithoutRef, type ElementRef, forwardRef } from 'react';

import { useNovaConnectLabels } from '../../hooks/useNovaConnectLabels';

interface ChainData {
  formattedChainId: string | number;
  chain: string | number;
}

interface ChainListRendererProps {
  chainsList: (string | number)[];
  selectValue: string;
  handleValueChange: (newChainId: string) => void;
  getChainData: (chain: string | number) => ChainData;
  onClose: () => void;
  isMobile?: boolean;
}

const SelectItemBase = forwardRef<ElementRef<typeof Select.Item>, ComponentPropsWithoutRef<typeof Select.Item>>(
  ({ children, className, ...props }, forwardedRef) => {
    const labels = useNovaConnectLabels();
    const isActive = props.value === props['aria-label'];

    return (
      <Select.Item
        ref={forwardedRef}
        className={cn(
          'flex items-center w-full text-left px-2 py-2 rounded-md transition-colors space-x-3 cursor-pointer outline-none',
          'text-[var(--tuwa-text-primary)] hover:bg-[var(--tuwa-bg-muted)] focus:bg-[var(--tuwa-bg-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--tuwa-border-primary)] focus:ring-offset-2',
          { 'bg-[var(--tuwa-bg-muted)]': isActive },
          className,
        )}
        role="option"
        aria-selected={isActive}
        tabIndex={0}
        {...props}
      >
        {children}
        {isActive && (
          <>
            <span
              className="ml-auto text-xs font-semibold w-2 h-2 rounded-full bg-[var(--tuwa-success-text)]"
              aria-label={labels.connected}
              role="status"
            />
            <span className="sr-only">{labels.connected}</span>
          </>
        )}
      </Select.Item>
    );
  },
);
SelectItemBase.displayName = 'SelectItemBase';

export const ChainListRenderer: React.FC<ChainListRendererProps> = ({
  chainsList,
  selectValue,
  handleValueChange,
  getChainData,
  onClose,
  isMobile = false,
}) => {
  const labels = useNovaConnectLabels();

  return (
    <div role="listbox" aria-label={labels.selectChain}>
      {chainsList.map((chain) => {
        const { formattedChainId } = getChainData(chain);
        const isActive = String(formattedChainId) === selectValue;
        const chainName = getChainName(formattedChainId);

        const itemClasses = cn(
          'flex items-center w-full text-left px-2 py-2 rounded-md transition-colors space-x-3 cursor-pointer outline-none',
          'text-[var(--tuwa-text-primary)] hover:bg-[var(--tuwa-bg-muted)] focus:bg-[var(--tuwa-bg-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--tuwa-border-primary)] focus:ring-offset-2',
          { 'bg-[var(--tuwa-bg-muted)]': isActive },
        );

        const content = (
          <div className="flex items-center space-x-3 [&_img]:w-6 [&_img]:h-6">
            <div aria-hidden="true">
              <Web3Icon chainId={formattedChainId} />
            </div>
            <span className="text-sm font-medium">{chainName}</span>
          </div>
        );

        const handleClick = () => {
          handleValueChange(String(formattedChainId));
          onClose();
        };

        const handleKeyDown = (event: React.KeyboardEvent) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handleClick();
          }
        };

        if (isMobile) {
          return (
            <div
              key={chain}
              onClick={handleClick}
              onKeyDown={handleKeyDown}
              className={cn(itemClasses, 'justify-between')}
              role="option"
              aria-selected={isActive}
              aria-label={`${labels.chainOption}: ${chainName}`}
              tabIndex={0}
            >
              {content}
              {isActive && (
                <div className="flex items-center space-x-2 text-xs font-semibold text-[var(--tuwa-text-tertiary)]">
                  <span aria-label={labels.connected}>{labels.connected}</span>
                  <span
                    className="ml-auto text-xs font-semibold w-2 h-2 rounded-full bg-[var(--tuwa-success-text)]"
                    aria-hidden="true"
                    role="status"
                  />
                </div>
              )}
            </div>
          );
        }

        return (
          <SelectItemBase
            value={String(formattedChainId)}
            aria-label={`${labels.chainOption}: ${chainName}`}
            key={chain}
            onSelect={handleClick}
          >
            {content}
          </SelectItemBase>
        );
      })}
    </div>
  );
};
