import { Web3Icon } from '@bgd-labs/react-web3-icons';
import { getChainName } from '@bgd-labs/react-web3-icons/dist/utils';
import * as Select from '@radix-ui/react-select';
import { cn } from '@tuwaio/nova-core';
import React, { type ComponentPropsWithoutRef, type ElementRef, forwardRef } from 'react';

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
    const isActive = props.value === props['aria-label'];

    return (
      <Select.Item
        ref={forwardedRef}
        className={cn(
          'flex items-center w-full text-left px-2 py-2 rounded-md transition-colors space-x-3 cursor-pointer outline-none',
          'text-[var(--tuwa-text-primary)] hover:bg-[var(--tuwa-bg-muted)]',
          { 'bg-[var(--tuwa-bg-muted)]': isActive },
          className,
        )}
        {...props}
      >
        {children}
        {isActive && (
          <span className="ml-auto text-xs font-semibold w-2 h-2 rounded-full bg-[var(--tuwa-success-text)]" />
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
  return (
    <>
      {chainsList.map((chain) => {
        const { formattedChainId } = getChainData(chain);
        const isActive = String(formattedChainId) === selectValue;

        const itemClasses = cn(
          'flex items-center w-full text-left px-2 py-2 rounded-md transition-colors space-x-3 cursor-pointer outline-none',
          'text-[var(--tuwa-text-primary)] hover:bg-[var(--tuwa-bg-muted)]',
          { 'bg-[var(--tuwa-bg-muted)]': isActive },
        );

        const content = (
          <div className="flex items-center space-x-3 [&_img]:w-6 [&_img]:h-6">
            <Web3Icon chainId={formattedChainId} />
            <span className="text-sm font-medium">{getChainName(formattedChainId)}</span>
          </div>
        );

        const onClick = () => {
          handleValueChange(String(formattedChainId));
          onClose();
        };

        if (isMobile) {
          return (
            <div key={chain} onClick={onClick} className={cn(itemClasses, 'justify-between')}>
              {content}
              {isActive && (
                <div className="flex items-center space-x-2 text-xs font-semibold text-[var(--tuwa-text-tertiary)]">
                  <span>Connected</span>
                  <span className="ml-auto text-xs font-semibold w-2 h-2 rounded-full bg-[var(--tuwa-success-text)]" />
                </div>
              )}
            </div>
          );
        }

        return (
          <SelectItemBase value={String(formattedChainId)} aria-label={selectValue} key={chain} onSelect={onClick}>
            {content}
          </SelectItemBase>
        );
      })}
    </>
  );
};
