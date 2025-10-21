/**
 * @file Highly customizable chain list renderer with comprehensive styling and behavior control.
 * @module ChainListRenderer
 */

import { Web3Icon } from '@bgd-labs/react-web3-icons';
import { getChainName } from '@bgd-labs/react-web3-icons/dist/utils';
import * as Select from '@radix-ui/react-select';
import { cn } from '@tuwaio/nova-core';
import {
  type AnyResolvedKeyframe,
  type LegacyAnimationControls,
  motion,
  type TargetAndTransition,
  type Transition,
  type VariantLabels,
} from 'framer-motion';
import React, {
  type ComponentPropsWithoutRef,
  type ComponentType,
  type ElementRef,
  forwardRef,
  ReactNode,
  useCallback,
  useMemo,
} from 'react';

import { useNovaConnectLabels } from '../../hooks/useNovaConnectLabels';

// === TYPES AND INTERFACES ===

/**
 * Chain data structure returned by getChainData function
 */
interface ChainData {
  formattedChainId: string | number;
  chain: string | number;
}

/**
 * Props for custom chain icon component
 */
interface CustomChainIconProps {
  chainId: string | number;
  className?: string;
  'aria-hidden'?: boolean;
}

/**
 * Props for custom chain content component
 */
interface CustomChainContentProps {
  chainId: string | number;
  isActive: boolean;
  icon: ReactNode;
  children?: ReactNode;
}

/**
 * Props for custom active indicator component
 */
interface CustomActiveIndicatorProps {
  isActive: boolean;
  label: string;
  className?: string;
}

/**
 * Animation configuration for container
 */
interface ContainerAnimationConfig {
  initial?: TargetAndTransition | VariantLabels | LegacyAnimationControls | undefined;
  animate?: TargetAndTransition | VariantLabels | LegacyAnimationControls | undefined;
  exit?: TargetAndTransition | VariantLabels | LegacyAnimationControls | undefined;
  transition?: Transition<AnyResolvedKeyframe>;
}

/**
 * Animation configuration for items
 */
interface ItemAnimationConfig {
  initial?: TargetAndTransition | VariantLabels | LegacyAnimationControls | undefined;
  animate?: TargetAndTransition | VariantLabels | LegacyAnimationControls | undefined;
  transition?: Transition<AnyResolvedKeyframe>;
}

/**
 * Comprehensive customization options for ChainListRenderer
 */
export interface ChainListRendererCustomization {
  /** Custom components */
  components?: {
    /** Custom chain icon component */
    ChainIcon?: ComponentType<CustomChainIconProps>;
    /** Custom chain content layout component */
    ChainContent?: ComponentType<CustomChainContentProps>;
    /** Custom active indicator component */
    ActiveIndicator?: ComponentType<CustomActiveIndicatorProps>;
  };
  /** Custom class name generators */
  classNames?: {
    /** Container classes */
    container?: (params: { isMobile: boolean; itemCount: number }) => string;
    /** Item classes */
    item?: (params: { isActive: boolean; isMobile: boolean; chainId: string | number }) => string;
    /** Content wrapper classes */
    content?: (params: { isActive: boolean; isMobile: boolean }) => string;
    /** Icon classes */
    icon?: (params: { isActive: boolean; chainId: string | number }) => string;
    /** Chain name classes */
    chainName?: (params: { isActive: boolean; isMobile: boolean }) => string;
    /** Active indicator classes */
    activeIndicator?: (params: { isMobile: boolean }) => string;
  };
  /** Custom event handlers */
  handlers?: {
    /** Custom click handler wrapper */
    onClick?: (
      originalHandler: () => void,
      context: { chainId: string | number; chainName: string; isActive: boolean },
    ) => void;
    /** Custom keydown handler wrapper */
    onKeyDown?: (
      originalHandler: (event: React.KeyboardEvent) => void,
      event: React.KeyboardEvent,
      context: { chainId: string | number; chainName: string; isActive: boolean },
    ) => void;
    /** Chain selection handler wrapper */
    onSelect?: (
      originalHandler: (chainId: string) => void,
      chainId: string,
      context: { chainName: string; isActive: boolean },
    ) => void;
  };
  /** Animation configuration */
  animations?: {
    /** Container animation */
    container?: ContainerAnimationConfig;
    /** Item animation */
    item?: ItemAnimationConfig;
  };
  /** Behavior configuration */
  behavior?: {
    /** Auto-focus first item */
    autoFocus?: boolean;
    /** Enable animation on mount */
    animateOnMount?: boolean;
    /** Show loading states */
    showLoading?: boolean;
    /** Custom loading message */
    loadingMessage?: string;
  };
}

/**
 * Props for the ChainListRenderer component
 */
export interface ChainListRendererProps {
  /** List of chain identifiers to render */
  chainsList: (string | number)[];
  /** Currently selected chain value */
  selectValue: string;
  /** Handler for chain selection changes */
  handleValueChange: (newChainId: string) => void;
  /** Function to get formatted chain data */
  getChainData: (chain: string | number) => ChainData;
  /** Handler called when list should close */
  onClose: () => void;
  /** Whether this is being rendered on mobile */
  isMobile?: boolean;
  /** Custom CSS classes for container (added to defaults) */
  className?: string;
  /** Custom CSS classes for individual items (added to defaults) */
  itemClassName?: string;
  /** Comprehensive customization options */
  customization?: ChainListRendererCustomization;
  /** ARIA label for the list container */
  'aria-label'?: string;
  /** Loading state */
  isLoading?: boolean;
  /** Error state */
  error?: string | null;
}

// === DEFAULT COMPONENTS ===

/**
 * Default chain icon component using Web3Icon
 */
const DefaultChainIcon: React.FC<CustomChainIconProps> = ({ chainId, className, ...props }) => (
  <Web3Icon chainId={chainId} className={className} {...props} />
);

/**
 * Default chain content component
 */
const DefaultChainContent: React.FC<CustomChainContentProps> = ({ icon, children }) => (
  <div className="novacon:flex novacon:items-center novacon:space-x-3 novacon:[&_img]:w-6 novacon:[&_img]:h-6">
    <div aria-hidden="true">{icon}</div>
    {children}
  </div>
);

/**
 * Default active indicator component
 */
const DefaultActiveIndicator: React.FC<CustomActiveIndicatorProps> = ({ isActive, label, className }) => {
  if (!isActive) return null;

  return (
    <>
      <span
        className={cn(
          'novacon:ml-auto novacon:text-xs novacon:font-semibold novacon:w-2 novacon:h-2 novacon:rounded-full novacon:bg-[var(--tuwa-success-text)]',
          className,
        )}
        aria-label={label}
        role="status"
      />
      <span className="novacon:sr-only">{label}</span>
    </>
  );
};

/**
 * Enhanced SelectItem component for desktop use
 */
const SelectItemBase = forwardRef<ElementRef<typeof Select.Item>, ComponentPropsWithoutRef<typeof Select.Item>>(
  ({ children, className, ...props }, forwardedRef) => {
    const labels = useNovaConnectLabels();
    const isActive = props.value === props['aria-selected'];
    return (
      <Select.Item
        ref={forwardedRef}
        className={cn(
          // Base styles
          'novacon:flex novacon:items-center novacon:w-full novacon:text-left novacon:px-2 novacon:py-2',
          'novacon:rounded-md novacon:transition-colors novacon:space-x-3 novacon:cursor-pointer novacon:outline-none',
          // Interactive states
          'novacon:text-[var(--tuwa-text-primary)] novacon:hover:bg-[var(--tuwa-bg-muted)]',
          'novacon:focus:bg-[var(--tuwa-bg-muted)] novacon:focus:outline-none',
          'novacon:focus:ring-2 novacon:focus:ring-[var(--tuwa-border-primary)] novacon:focus:ring-offset-2',
          // Active state
          { 'novacon:bg-[var(--tuwa-bg-muted)]': isActive },
          // Custom classes
          className,
        )}
        role="option"
        aria-selected={isActive}
        tabIndex={0}
        {...props}
      >
        {children}
        {isActive && <DefaultActiveIndicator isActive={true} label={labels.connected} className="novacon:ml-auto" />}
      </Select.Item>
    );
  },
);
SelectItemBase.displayName = 'SelectItemBase';

// === MAIN COMPONENT ===

/**
 * Highly customizable chain list renderer with comprehensive styling and behavior control.
 */
export const ChainListRenderer: React.FC<ChainListRendererProps> = ({
  chainsList,
  selectValue,
  handleValueChange,
  getChainData,
  onClose,
  isMobile = false,
  className,
  itemClassName,
  customization,
  'aria-label': ariaLabel,
  isLoading = false,
  error = null,
}) => {
  const labels = useNovaConnectLabels();

  // Extract customization options with defaults
  const {
    ChainIcon = DefaultChainIcon,
    ChainContent = DefaultChainContent,
    ActiveIndicator = DefaultActiveIndicator,
  } = customization?.components ?? {};

  const animations = customization?.animations;
  const behavior = customization?.behavior ?? {};

  // Memoize container classes and styles
  const containerClasses = useMemo(() => {
    const customClasses = customization?.classNames?.container?.({ isMobile, itemCount: chainsList.length });
    return cn(customClasses, className);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customization?.classNames?.container, isMobile, chainsList.length, className]);

  // Create event handlers at top level to avoid hooks violations
  const createClickHandler = useCallback(
    (formattedChainId: string | number, chainName: string, isActive: boolean) => {
      const originalHandler = () => {
        if (customization?.handlers?.onSelect) {
          customization.handlers.onSelect(handleValueChange, String(formattedChainId), { chainName, isActive });
        } else {
          handleValueChange(String(formattedChainId));
        }
        onClose();
      };

      return () => {
        if (customization?.handlers?.onClick) {
          customization.handlers.onClick(originalHandler, {
            chainId: formattedChainId,
            chainName,
            isActive,
          });
        } else {
          originalHandler();
        }
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [customization?.handlers?.onSelect, customization?.handlers?.onClick, handleValueChange, onClose],
  );

  const createKeyDownHandler = useCallback(
    (clickHandler: () => void, formattedChainId: string | number, chainName: string, isActive: boolean) => {
      const originalHandler = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          clickHandler();
        }
      };

      return (event: React.KeyboardEvent) => {
        if (customization?.handlers?.onKeyDown) {
          customization.handlers.onKeyDown(originalHandler, event, {
            chainId: formattedChainId,
            chainName,
            isActive,
          });
        } else {
          originalHandler(event);
        }
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [customization?.handlers?.onKeyDown],
  );

  // Handle loading state
  if (isLoading) {
    const loadingMessage = behavior.loadingMessage || `${labels.loading}...`;
    return (
      <div
        className={cn('novacon:flex novacon:justify-center novacon:items-center novacon:py-4', containerClasses)}
        role="status"
        aria-label={loadingMessage}
      >
        <span className="novacon:text-sm novacon:text-[var(--tuwa-text-secondary)]">{loadingMessage}</span>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div
        className={cn('novacon:flex novacon:justify-center novacon:items-center novacon:py-4', containerClasses)}
        role="alert"
        aria-live="assertive"
      >
        <span className="novacon:text-sm novacon:text-[var(--tuwa-text-error)]">{error}</span>
      </div>
    );
  }

  // Handle empty state
  if (chainsList.length === 0) {
    return (
      <div
        className={cn('novacon:flex novacon:justify-center novacon:items-center novacon:py-4', containerClasses)}
        role="status"
      >
        <span className="novacon:text-sm novacon:text-[var(--tuwa-text-secondary)]">{labels.noConnectorsFound}</span>
      </div>
    );
  }

  // Main render method for individual chain items
  const renderChainItem = (chain: string | number) => {
    const { formattedChainId } = getChainData(chain);
    const isActive = String(formattedChainId) === selectValue;
    const chainName = getChainName(formattedChainId);

    // Generate custom classes and styles
    const itemClasses = customization?.classNames?.item?.({ isActive, isMobile, chainId: formattedChainId })
      ? customization?.classNames?.item?.({ isActive, isMobile, chainId: formattedChainId })
      : cn(
          // Default item styles
          'novacon:flex novacon:items-center novacon:w-full novacon:text-left novacon:px-2 novacon:py-2',
          'novacon:rounded-md novacon:transition-colors novacon:space-x-3 novacon:cursor-pointer novacon:outline-none',
          'novacon:text-[var(--tuwa-text-primary)] novacon:hover:bg-[var(--tuwa-bg-muted)]',
          'novacon:focus:bg-[var(--tuwa-bg-muted)] novacon:focus:outline-none',
          'novacon:focus:ring-2 novacon:focus:ring-[var(--tuwa-border-primary)] novacon:focus:ring-offset-2',
          { 'novacon:bg-[var(--tuwa-bg-muted)]': isActive, 'novacon:justify-between': isMobile },
          // Custom classes
          itemClassName,
        );

    const iconClasses = customization?.classNames?.icon?.({ isActive, chainId: formattedChainId });

    const chainNameClasses = customization?.classNames?.chainName?.({ isActive, isMobile });

    // Create event handlers
    const handleClick = createClickHandler(formattedChainId, chainName, isActive);
    const handleKeyDown = createKeyDownHandler(handleClick, formattedChainId, chainName, isActive);

    // Create icon element
    const iconElement = <ChainIcon chainId={formattedChainId} className={iconClasses} aria-hidden={true} />;

    // Create content element
    const contentElement = (
      <ChainContent chainId={formattedChainId} isActive={isActive} icon={iconElement}>
        <span className={cn('novacon:text-sm novacon:font-medium', chainNameClasses)}>{chainName}</span>
      </ChainContent>
    );

    // Create active indicator
    const activeIndicatorClasses = customization?.classNames?.activeIndicator?.({ isMobile });

    const activeIndicator = isMobile ? (
      <div className="novacon:flex novacon:items-center novacon:space-x-2 novacon:text-xs novacon:font-semibold novacon:text-[var(--tuwa-text-tertiary)]">
        <span aria-label={labels.connected}>{labels.connected}</span>
        <ActiveIndicator isActive={isActive} label={labels.connected} className={activeIndicatorClasses} />
      </div>
    ) : (
      <ActiveIndicator isActive={isActive} label={labels.connected} className={activeIndicatorClasses} />
    );

    const ariaLabel = `${labels.chainOption}: ${chainName}`;

    // Render mobile version
    if (isMobile) {
      const MotionItem = animations?.item ? motion.div : 'div';
      const motionProps = animations?.item || {};

      return (
        <MotionItem
          key={chain}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          className={itemClasses}
          role="option"
          aria-selected={isActive}
          aria-label={ariaLabel}
          tabIndex={0}
          {...motionProps}
        >
          {contentElement}
          {activeIndicator}
        </MotionItem>
      );
    }

    // Render desktop version with Select.Item
    return (
      <SelectItemBase
        key={chain}
        value={String(formattedChainId)}
        aria-label={ariaLabel}
        onSelect={handleClick}
        className={itemClasses}
      >
        {contentElement}
      </SelectItemBase>
    );
  };

  // Container animation wrapper
  const MotionContainer = animations?.container ? motion.div : 'div';
  const containerMotionProps = animations?.container || {};

  return (
    <MotionContainer
      role="listbox"
      aria-label={ariaLabel || labels.selectChain}
      className={containerClasses}
      {...containerMotionProps}
    >
      {chainsList.map(renderChainItem)}
    </MotionContainer>
  );
};
