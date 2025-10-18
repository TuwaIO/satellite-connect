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
          'novacon:flex novacon:items-center novacon:w-full novacon:text-left novacon:px-2 novacon:py-2 novacon:rounded-md novacon:transition-colors novacon:space-x-3 novacon:cursor-pointer novacon:outline-none',
          'novacon:text-[var(--tuwa-text-primary)] novacon:hover:bg-[var(--tuwa-bg-muted)] novacon:focus:bg-[var(--tuwa-bg-muted)] novacon:focus:outline-none novacon:focus:ring-2 novacon:focus:ring-[var(--tuwa-border-primary)] novacon:focus:ring-offset-2',
          { 'novacon:bg-[var(--tuwa-bg-muted)]': isActive },
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
              className="novacon:ml-auto novacon:text-xs novacon:font-semibold novacon:w-2 novacon:h-2 novacon:rounded-full novacon:bg-[var(--tuwa-success-text)]"
              aria-label={labels.connected}
              role="status"
            />
            <span className="novacon:sr-only">{labels.connected}</span>
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
          'novacon:flex novacon:items-center novacon:w-full novacon:text-left novacon:px-2 novacon:py-2 novacon:rounded-md novacon:transition-colors novacon:space-x-3 novacon:cursor-pointer novacon:outline-none',
          'novacon:text-[var(--tuwa-text-primary)] novacon:hover:bg-[var(--tuwa-bg-muted)] novacon:focus:bg-[var(--tuwa-bg-muted)] novacon:focus:outline-none novacon:focus:ring-2 novacon:focus:ring-[var(--tuwa-border-primary)] novacon:focus:ring-offset-2',
          { 'novacon:bg-[var(--tuwa-bg-muted)]': isActive },
        );

        const content = (
          <div className="novacon:flex novacon:items-center novacon:space-x-3 novacon:[&_img]:w-6 novacon:[&_img]:h-6">
            <div aria-hidden="true">
              <Web3Icon chainId={formattedChainId} />
            </div>
            <span className="novacon:text-sm novacon:font-medium">{chainName}</span>
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
              className={cn(itemClasses, 'novacon:justify-between')}
              role="option"
              aria-selected={isActive}
              aria-label={`${labels.chainOption}: ${chainName}`}
              tabIndex={0}
            >
              {content}
              {isActive && (
                <div className="novacon:flex novacon:items-center novacon:space-x-2 novacon:text-xs novacon:font-semibold novacon:text-[var(--tuwa-text-tertiary)]">
                  <span aria-label={labels.connected}>{labels.connected}</span>
                  <span
                    className="novacon:ml-auto novacon:text-xs novacon:font-semibold novacon:w-2 novacon:h-2 novacon:rounded-full novacon:bg-[var(--tuwa-success-text)]"
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
