/**
 * @file ChainSelector component - A highly customizable chain selector with support for desktop and mobile devices.
 * @module ChainSelector
 */

import { Web3Icon } from '@bgd-labs/react-web3-icons';
import { getChainName } from '@bgd-labs/react-web3-icons/dist/utils';
import * as Select from '@radix-ui/react-select';
import {
  ChevronArrowWithAnim,
  CloseIcon,
  cn,
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@tuwaio/nova-core';
import { formatWalletChainId } from '@tuwaio/orbit-core';
import { getAdapterFromWalletType } from '@tuwaio/orbit-core';
import { motion, type Transition } from 'framer-motion';
import React, {
  ComponentPropsWithoutRef,
  ComponentType,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { useNovaConnect } from '../../hooks/useNovaConnect';
import { useNovaConnectLabels } from '../../hooks/useNovaConnectLabels';
import { InitialChains } from '../../types';
import { getChainsListByWalletType, getChainsListByWalletTypeAsync, getWalletChains } from '../../utils';
import { ConnectButtonProps } from '../ConnectButton/ConnectButton';
import { SelectContentAnimated, SelectContentAnimatedProps } from '../SelectContentAnimated';
import { ChainListRenderer, ChainListRendererCustomization } from './ChainListRenderer';
import { ScrollableChainList, ScrollableChainListCustomization } from './ScrollableChainList';

/**
 * Context for the chain selection trigger button.
 */
type ChainTriggerButtonContext = {
  /** The currently formatted chain ID */
  currentFormattedChainId: string | number;
  /** Value for the Select component */
  selectValue: string;
  /** Whether the chain list is open */
  isChainsListOpen: boolean;
  /** Whether the device is mobile */
  isMobile: boolean;
  /** The name of the chain */
  chainName: string;
};

/**
 * Props for a custom trigger icon component.
 */
type CustomTriggerIconProps = {
  /** Chain ID */
  chainId: string | number;
  /** CSS class */
  className?: string;
  /** Whether hidden from screen readers */
  'aria-hidden'?: boolean;
};

/**
 * Props for a custom trigger content component.
 */
type CustomTriggerContentProps = {
  /** Chain icon */
  icon: ReactNode;
  /** Chain name */
  chainName: string;
  /** Whether the device is mobile */
  isMobile: boolean;
  /** Whether the list is open */
  isOpen: boolean;
  /** The currently formatted chain ID */
  currentFormattedChainId: string | number;
};

/**
 * Props for a custom trigger arrow component.
 */
type CustomTriggerArrowProps = {
  /** Whether the list is open */
  isOpen: boolean;
  /** CSS class */
  className?: string;
  /** Whether hidden from screen readers */
  'aria-hidden'?: boolean;
};

/**
 * Props for a custom loading state display.
 */
type CustomLoadingStateProps = {
  /** CSS class */
  className?: string;
  /** ARIA label */
  'aria-label': string;
};

/**
 * Props for a custom display for a single chain (when no selector is needed).
 */
type CustomSingleChainDisplayProps = {
  /** Chain ID */
  chainId: string | number;
  /** Chain name */
  chainName: string;
  /** CSS class */
  className?: string;
  /** ARIA label */
  'aria-label': string;
};

/**
 * Props for a custom desktop selector wrapper.
 */
type CustomDesktopSelectorProps = {
  /** Child elements */
  children: ReactNode;
  /** CSS class */
  className?: string;
  /** ARIA label */
  'aria-label': string;
};

/**
 * Props for a custom mobile selector wrapper.
 */
type CustomMobileSelectorProps = {
  /** Child elements */
  children: ReactNode;
  /** CSS class */
  className?: string;
  /** ARIA label */
  'aria-label': string;
};

/**
 * Props for a custom dialog header component.
 */
type CustomDialogHeaderProps = {
  /** Title text */
  title: string;
  /** Close handler */
  onClose: () => void;
  /** CSS class */
  className?: string;
};

/**
 * Animation easing parameters for framer-motion.
 */
type AnimationEasing = [number, number, number, number] | string;

/**
 * Customization options for the ChainTriggerButton.
 */
export type ChainTriggerButtonCustomization = {
  /** Overrides for the button/trigger props */
  buttonProps?: Partial<ComponentPropsWithoutRef<'button'>>;
  /** Overrides for the Select.Trigger props (desktop only) */
  selectTriggerProps?: Partial<ComponentPropsWithoutRef<typeof Select.Trigger>>;
  /** Custom component overrides */
  components?: {
    /** Custom chain icon component */
    Icon?: ComponentType<CustomTriggerIconProps>;
    /** Custom trigger content wrapper */
    Content?: ComponentType<CustomTriggerContentProps>;
    /** Custom arrow/chevron component */
    Arrow?: ComponentType<CustomTriggerArrowProps>;
  };
  /** Custom CSS class generators */
  classNames?: {
    /** Function to generate wrapper classes */
    wrapper?: (params: { isMobile: boolean; isOpen: boolean }) => string;
    /** Function to generate button/trigger classes */
    button?: (params: { isMobile: boolean; isOpen: boolean; hasMultipleChains: boolean }) => string;
    /** Function to generate inner content classes */
    innerContent?: (params: { isMobile: boolean; isOpen: boolean }) => string;
    /** Function to generate icon wrapper classes */
    iconWrapper?: (params: { isMobile: boolean }) => string;
    /** Function to generate chain name classes */
    chainName?: (params: { isMobile: boolean; isVisible: boolean }) => string;
    /** Function to generate arrow wrapper classes */
    arrowWrapper?: (params: { isMobile: boolean }) => string;
  };
  /** Custom event handlers */
  handlers?: {
    /** Wrapper for the click handler */
    onClick?: (
      originalHandler: () => void,
      event: React.MouseEvent<HTMLButtonElement>,
      context: ChainTriggerButtonContext,
    ) => void;
    /** Wrapper for the key down handler */
    onKeyDown?: (
      originalHandler: (event: React.KeyboardEvent) => void,
      event: React.KeyboardEvent,
      context: ChainTriggerButtonContext,
    ) => void;
  };
  /** Animation settings */
  animations?: {
    /** Layout animation settings */
    layout?: {
      duration?: number;
      ease?: AnimationEasing;
    };
    /** Inner content animation settings */
    innerContent?: {
      duration?: number;
    };
  };
};

/**
 * Comprehensive customization options for the ChainSelector.
 */
export type ChainSelectorCustomization = {
  /** Custom component overrides */
  components?: {
    /** Custom loading state component */
    LoadingState?: ComponentType<CustomLoadingStateProps>;
    /** Custom component for displaying a single chain */
    SingleChainDisplay?: ComponentType<CustomSingleChainDisplayProps>;
    /** Custom wrapper for the desktop selector */
    DesktopSelector?: ComponentType<CustomDesktopSelectorProps>;
    /** Custom wrapper for the mobile selector */
    MobileSelector?: ComponentType<CustomMobileSelectorProps>;
    /** Custom dialog header component */
    DialogHeader?: ComponentType<CustomDialogHeaderProps>;
  };
  /** Custom CSS class generators */
  classNames?: {
    /** Classes for the main container */
    container?: (params: { hasMultipleChains: boolean; isLoading: boolean }) => string;
    /** Classes for the desktop wrapper */
    desktopWrapper?: (params: { chainCount: number }) => string;
    /** Classes for the mobile wrapper */
    mobileWrapper?: (params: { chainCount: number }) => string;
    /** Classes for the loading state */
    loadingState?: () => string;
    /** Classes for the single chain display */
    singleChainDisplay?: () => string;
    /** Classes for the dialog content */
    dialogContent?: (params: { chainCount: number }) => string;
    /** Classes for the dialog inner container */
    dialogInnerContainer?: () => string;
  };
  /** Custom event handlers */
  handlers?: {
    /** Wrapper for the chain change handler */
    onChainChange?: (originalHandler: (newChainId: string) => void, newChainId: string) => void;
    /** Wrapper for the dialog close handler */
    onDialogClose?: (originalHandler: () => void) => void;
  };
  /** Customization for sub-components */
  triggerButton?: ChainTriggerButtonCustomization;
  /** Customization for the Select content */
  selectContent?: Partial<SelectContentAnimatedProps>;
  /** Customization for the chain list renderer (desktop) */
  chainListRenderer?: ChainListRendererCustomization;
  /** Customization for the scrollable chain list (mobile) */
  scrollableChainList?: ScrollableChainListCustomization;
};

/**
 * Props for the ChainTriggerButton component.
 */
interface ChainTriggerButtonProps {
  /** The currently formatted chain ID */
  currentFormattedChainId: string | number;
  /** The value of the select component */
  selectValue: string;
  /** Whether the chain list is currently open */
  isChainsListOpen: boolean;
  /** Function to toggle the visibility of the chain list */
  onToggle: () => void;
  /** Whether it's displayed on a mobile device */
  isMobile: boolean;
  /** Whether multiple chains are available */
  hasMultipleChains?: boolean;
  /** Customization options */
  customization?: ChainTriggerButtonCustomization;
}

// --- Default Components ---

/**
 * Default trigger icon.
 */
const DefaultTriggerIcon = ({ chainId, className, ...props }: CustomTriggerIconProps) => {
  return <Web3Icon chainId={chainId} className={className} {...props} />;
};

/**
 * Default trigger content.
 */
const DefaultTriggerContent = ({ icon, chainName, isMobile }: CustomTriggerContentProps) => {
  return (
    <>
      <div className="novacon:flex novacon:items-center novacon:sm:space-x-2 novacon:[&_img]:w-6 novacon:[&_img]:h-6">
        <div aria-hidden="true">{icon}</div>
        {isMobile ? (
          <span className="novacon:hidden novacon:sm:inline-block novacon:sr-only novacon:sm:not-sr-only">
            {chainName}
          </span>
        ) : (
          <Select.Value asChild>
            <span className="novacon:hidden novacon:sm:inline-block novacon:sr-only novacon:sm:not-sr-only">
              {chainName}
            </span>
          </Select.Value>
        )}
      </div>
    </>
  );
};

/**
 * Default trigger arrow.
 */
const DefaultTriggerArrow = ({ isOpen, className, ...props }: CustomTriggerArrowProps) => {
  return <ChevronArrowWithAnim isOpen={isOpen} className={className} {...props} />;
};

/**
 * Default loading state component.
 */
const DefaultLoadingState = ({ className, 'aria-label': ariaLabel }: CustomLoadingStateProps) => {
  return (
    <div className={className} role="status" aria-label={ariaLabel}>
      <div className="novacon:w-6 novacon:h-6 novacon:bg-gray-300 novacon:rounded-full" aria-hidden="true" />
      <div className="novacon:w-20 novacon:h-4 novacon:bg-gray-300 novacon:rounded" aria-hidden="true" />
    </div>
  );
};

/**
 * Default display for a single chain.
 */
const DefaultSingleChainDisplay = ({
  chainId,
  chainName,
  className,
  'aria-label': ariaLabel,
}: CustomSingleChainDisplayProps) => {
  return (
    <div className={className} role="img" aria-label={ariaLabel}>
      <Web3Icon chainId={chainId} />
      <span className="novacon:sr-only">{chainName}</span>
    </div>
  );
};

/**
 * Default desktop selector wrapper.
 */
const DefaultDesktopSelector = ({ children, className, 'aria-label': ariaLabel }: CustomDesktopSelectorProps) => {
  return (
    <div className={className} role="region" aria-label={ariaLabel}>
      {children}
    </div>
  );
};

/**
 * Default mobile selector wrapper.
 */
const DefaultMobileSelector = ({ children, className, 'aria-label': ariaLabel }: CustomMobileSelectorProps) => {
  return (
    <div className={className} role="region" aria-label={ariaLabel}>
      {children}
    </div>
  );
};

/**
 * Default dialog header component.
 */
const DefaultDialogHeader = ({ title, onClose, className }: CustomDialogHeaderProps) => {
  const labels = useNovaConnectLabels();

  return (
    <DialogHeader className={className}>
      <DialogTitle>{title}</DialogTitle>
      <DialogClose asChild>
        <button
          type="button"
          aria-label={labels.closeModal}
          className="novacon:cursor-pointer novacon:rounded-full novacon:p-1
           novacon:text-[var(--tuwa-text-tertiary)] novacon:transition-colors
           novacon:hover:bg-[var(--tuwa-bg-muted)] novacon:hover:text-[var(--tuwa-text-primary)]
           novacon:focus:outline-none novacon:focus:ring-2 novacon:focus:ring-[var(--tuwa-border-primary)] novacon:focus:ring-offset-2"
          onClick={onClose}
        >
          <CloseIcon />
        </button>
      </DialogClose>
    </DialogHeader>
  );
};

// --- Default Event Handlers ---

/**
 * Default click handler.
 */
const defaultClickHandler = (
  originalHandler: () => void,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _event: React.MouseEvent<HTMLButtonElement>,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _context: ChainTriggerButtonContext,
) => {
  originalHandler();
};

/**
 * Default key down handler.
 */
const defaultKeyDownHandler = (
  originalHandler: (event: React.KeyboardEvent) => void,
  event: React.KeyboardEvent,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _context: ChainTriggerButtonContext,
) => {
  originalHandler(event);
};

/**
 * Default chain change handler.
 */
const defaultChainChangeHandler = (originalHandler: (newChainId: string) => void, newChainId: string) => {
  originalHandler(newChainId);
};

/**
 * Default dialog close handler.
 */
const defaultDialogCloseHandler = (originalHandler: () => void) => {
  originalHandler();
};

/**
 * Trigger button component for chain selection.
 */
const ChainTriggerButton: React.FC<ChainTriggerButtonProps> = ({
  currentFormattedChainId,
  isChainsListOpen,
  onToggle,
  isMobile,
  hasMultipleChains = true,
  customization,
}) => {
  const labels = useNovaConnectLabels();
  const chainName = getChainName(currentFormattedChainId);

  // Extract custom components
  const {
    Icon = DefaultTriggerIcon,
    Content = DefaultTriggerContent,
    Arrow = DefaultTriggerArrow,
  } = customization?.components ?? {};

  const { onClick: customClickHandler = defaultClickHandler, onKeyDown: customKeyDownHandler = defaultKeyDownHandler } =
    customization?.handlers ?? {};

  // Animation configuration
  const layoutAnimation = customization?.animations?.layout ?? {
    duration: 0.2,
    ease: [0.4, 1, 0.4, 1] as AnimationEasing,
  };
  const innerContentAnimation = useMemo(
    () => customization?.animations?.innerContent ?? { duration: 0.0001 },
    [customization?.animations?.innerContent],
  );

  /**
   * Handles keyboard navigation for the trigger button.
   */
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      const context: ChainTriggerButtonContext = {
        currentFormattedChainId,
        selectValue: String(currentFormattedChainId),
        isChainsListOpen,
        isMobile,
        chainName,
      };

      const originalHandler = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onToggle();
        }
        if (e.key === 'Escape' && isChainsListOpen) {
          e.preventDefault();
          onToggle();
        }
      };

      customKeyDownHandler(originalHandler, event, context);
    },
    [customKeyDownHandler, currentFormattedChainId, isChainsListOpen, isMobile, chainName, onToggle],
  );

  /**
   * Handles click events for the mobile button.
   */
  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      const context: ChainTriggerButtonContext = {
        currentFormattedChainId,
        selectValue: String(currentFormattedChainId),
        isChainsListOpen,
        isMobile,
        chainName,
      };

      customClickHandler(onToggle, event, context);
    },
    [customClickHandler, currentFormattedChainId, isChainsListOpen, isMobile, chainName, onToggle],
  );

  // Generate classes and styles
  const wrapperClasses = useMemo(() => {
    if (customization?.classNames?.wrapper) {
      return customization.classNames.wrapper({ isMobile, isOpen: isChainsListOpen });
    }
    return 'novacon:relative';
  }, [customization, isMobile, isChainsListOpen]);

  const buttonClasses = useMemo(() => {
    if (customization?.classNames?.button) {
      return customization.classNames.button({ isMobile, isOpen: isChainsListOpen, hasMultipleChains });
    }

    return cn(
      'novacon:cursor-pointer novacon:inline-flex novacon:items-center novacon:justify-center',
      'novacon:rounded-xl novacon:font-medium novacon:text-sm novacon:transition-all novacon:duration-200',
      'novacon:hover:scale-[1.02] novacon:active:scale-[0.98]',
      'novacon:focus:outline-none novacon:focus:ring-2 novacon:focus:ring-offset-2 novacon:focus:ring-offset-[var(--tuwa-bg-primary)] novacon:focus:ring-[var(--tuwa-border-primary)]',
      'novacon:bg-[var(--tuwa-bg-secondary)] novacon:text-[var(--tuwa-text-primary)] novacon:hover:bg-[var(--tuwa-bg-muted)]',
      {
        'novacon:ring-2 novacon:ring-[var(--tuwa-text-accent)] novacon:border novacon:border-transparent':
          isChainsListOpen,
        'novacon:border novacon:border-[var(--tuwa-border-primary)]': !isChainsListOpen,
      },
      'novacon:[&_img]:w-4 novacon:[&_img]:h-4',
    );
  }, [customization, isMobile, isChainsListOpen, hasMultipleChains]);

  const innerContentClasses = useMemo(() => {
    if (customization?.classNames?.innerContent) {
      return customization.classNames.innerContent({ isMobile, isOpen: isChainsListOpen });
    }
    return 'novacon:inline-flex novacon:items-center novacon:justify-center novacon:gap-2 novacon:px-2 sm:novacon:px-4 novacon:min-w-[60px] novacon:min-h-[42px] novacon:py-1';
  }, [customization, isMobile, isChainsListOpen]);

  /**
   * Creates the inner content with the correct motion wrapper.
   */
  const innerContent = useMemo(() => {
    const iconElement = <Icon chainId={currentFormattedChainId} aria-hidden={true} />;
    const arrowElement = <Arrow isOpen={isChainsListOpen} aria-hidden={true} />;

    return (
      <motion.div
        layout
        className={innerContentClasses}
        transition={{ layout: { duration: innerContentAnimation.duration } }}
      >
        <Content
          icon={iconElement}
          chainName={chainName}
          isMobile={isMobile}
          isOpen={isChainsListOpen}
          currentFormattedChainId={currentFormattedChainId}
        />

        {isMobile ? (
          <div aria-hidden="true">{arrowElement}</div>
        ) : (
          <Select.Icon asChild>
            <div aria-hidden="true">{arrowElement}</div>
          </Select.Icon>
        )}
      </motion.div>
    );
  }, [
    Icon,
    Arrow,
    Content,
    currentFormattedChainId,
    isChainsListOpen,
    chainName,
    isMobile,
    innerContentClasses,
    innerContentAnimation,
  ]);

  /**
   * Accessibility attributes for screen readers.
   */
  const ariaLabel = `${labels.chainSelector}: ${labels.currentChain} ${chainName}. ${labels.openChainSelector}`;
  const ariaExpanded = isChainsListOpen;
  const ariaHaspopup = 'listbox' as const;

  // Merge button props
  const mobileButtonProps = useMemo(
    () => ({
      ...customization?.buttonProps,
      type: 'button' as const,
      'aria-label': ariaLabel,
      'aria-expanded': ariaExpanded,
      'aria-haspopup': ariaHaspopup,
      className: buttonClasses,
      onClick: handleClick,
      onKeyDown: handleKeyDown,
    }),
    [customization?.buttonProps, ariaLabel, ariaExpanded, buttonClasses, handleClick, handleKeyDown],
  );

  const selectTriggerProps = useMemo(
    () => ({
      ...customization?.selectTriggerProps,
      'aria-label': ariaLabel,
      className: buttonClasses,
      onKeyDown: handleKeyDown,
    }),
    [customization?.selectTriggerProps, ariaLabel, buttonClasses, handleKeyDown],
  );

  return (
    <motion.div layout className={wrapperClasses} transition={{ layout: layoutAnimation } as Transition}>
      {isMobile ? (
        <button {...mobileButtonProps}>{innerContent}</button>
      ) : (
        <Select.Trigger {...selectTriggerProps}>{innerContent}</Select.Trigger>
      )}
    </motion.div>
  );
};

/**
 * Props for the ChainSelector component.
 */
export interface ChainSelectorProps extends InitialChains, Pick<ConnectButtonProps, 'store'> {
  /** Comprehensive customization options */
  customization?: ChainSelectorCustomization;
  /** Custom CSS classes for the main container */
  className?: string;
  /** Custom ARIA label for the selector */
  'aria-label'?: string;
}

/**
 * The main chain selector component.
 * Supports both desktop (dropdown) and mobile (dialog modal) interfaces.
 *
 * @param props - Props for the ChainSelector component
 * @returns The chain selector component or null if no wallet is connected
 */
export function ChainSelector({
  appChains,
  solanaRPCUrls,
  store,
  customization,
  className,
  'aria-label': ariaLabel,
}: ChainSelectorProps) {
  const labels = useNovaConnectLabels();
  const { activeWallet } = useNovaConnect();
  const { isChainsListOpen, setIsChainsListOpen, isChainsListOpenMobile, setIsChainsListOpenMobile } = useNovaConnect();

  // State to manage dynamic chain loading
  const [chainsList, setChainsList] = useState<(string | number)[]>([]);
  const [isLoadingChains, setIsLoadingChains] = useState(false);

  // Use refs to track loading state and prevent parallel fetches
  const loadingRef = useRef(false);
  const walletTypeRef = useRef<string | null>(null);

  // Extract custom components
  const {
    LoadingState = DefaultLoadingState,
    SingleChainDisplay = DefaultSingleChainDisplay,
    DesktopSelector = DefaultDesktopSelector,
    MobileSelector = DefaultMobileSelector,
    DialogHeader = DefaultDialogHeader,
  } = customization?.components ?? {};

  const {
    onChainChange: customChainChangeHandler = defaultChainChangeHandler,
    onDialogClose: customDialogCloseHandler = defaultDialogCloseHandler,
  } = customization?.handlers ?? {};

  // Generate all classes and styles upfront to avoid conditional useMemo
  const containerClasses = useMemo(() => {
    if (customization?.classNames?.container) {
      return customization.classNames.container({
        hasMultipleChains: chainsList.length > 1,
        isLoading: isLoadingChains,
      });
    }
    return className;
    // eslint-disable-next-line
  }, [customization?.classNames?.container, chainsList.length, isLoadingChains, className]);

  const loadingStateClasses = useMemo(() => {
    if (customization?.classNames?.loadingState) {
      return customization.classNames.loadingState();
    }
    return 'novacon:flex novacon:items-center novacon:space-x-2 novacon:[&_img]:w-6 novacon:[&_img]:h-6 novacon:animate-pulse';
    // eslint-disable-next-line
  }, [customization?.classNames?.loadingState]);

  const singleChainDisplayClasses = useMemo(() => {
    if (customization?.classNames?.singleChainDisplay) {
      return customization.classNames.singleChainDisplay();
    }
    return 'novacon:flex novacon:items-center novacon:space-x-2 novacon:[&_img]:w-6 novacon:[&_img]:h-6';
    // eslint-disable-next-line
  }, [customization?.classNames?.singleChainDisplay]);

  const desktopWrapperClasses = useMemo(() => {
    if (customization?.classNames?.desktopWrapper) {
      return customization.classNames.desktopWrapper({ chainCount: chainsList.length });
    }
    return 'novacon:hidden novacon:sm:block';
    // eslint-disable-next-line
  }, [customization?.classNames?.desktopWrapper, chainsList.length]);

  const mobileWrapperClasses = useMemo(() => {
    if (customization?.classNames?.mobileWrapper) {
      return customization.classNames.mobileWrapper({ chainCount: chainsList.length });
    }
    return 'novacon:sm:hidden';
    // eslint-disable-next-line
  }, [customization?.classNames?.mobileWrapper, chainsList.length]);

  const dialogContentClasses = useMemo(() => {
    if (customization?.classNames?.dialogContent) {
      return customization.classNames.dialogContent({ chainCount: chainsList.length });
    }
    return cn('novacon:w-full novacon:sm:max-w-md');
    // eslint-disable-next-line
  }, [customization?.classNames?.dialogContent, chainsList.length]);

  const dialogInnerContainerClasses = useMemo(() => {
    if (customization?.classNames?.dialogInnerContainer) {
      return customization.classNames.dialogInnerContainer();
    }
    return cn('novacon:relative novacon:flex novacon:w-full novacon:flex-col');
    // eslint-disable-next-line
  }, [customization?.classNames?.dialogInnerContainer]);

  /**
   * Handles switching networks when the user selects a different chain.
   */
  const handleChainChange = useCallback(
    (newChainId: string) => {
      const originalHandler = (chainId: string) => {
        store?.getState().switchNetwork(chainId);
      };

      customChainChangeHandler(originalHandler, newChainId);
    },
    [store, customChainChangeHandler],
  );

  /**
   * Retrieves chain formatting data for display purposes.
   */
  const getChainData = useCallback(
    (chain: string | number) => {
      if (!activeWallet) return { formattedChainId: chain, chain };

      return {
        formattedChainId: formatWalletChainId(chain, getAdapterFromWalletType(activeWallet.walletType)),
        chain,
      };
    },
    [activeWallet],
  );

  /**
   * Loads the chain list dynamically with async and fallback support.
   */
  useEffect(() => {
    // Reset state on wallet change/disconnect
    if (!activeWallet) {
      setChainsList([]);
      setIsLoadingChains(false);
      loadingRef.current = false;
      walletTypeRef.current = null;
      return;
    }

    // Don't fetch if same wallet type and already loading/loaded
    if (walletTypeRef.current === activeWallet.walletType && (loadingRef.current || chainsList.length > 0)) {
      return;
    }

    // Setup loading state
    if (loadingRef.current) return;
    loadingRef.current = true;
    walletTypeRef.current = activeWallet.walletType;
    setIsLoadingChains(true);

    // Safely extract wallet chains using common utility
    const walletChains = getWalletChains(activeWallet);

    const loadChains = async () => {
      try {
        // Try async version first for better functionality
        const asyncChains = await getChainsListByWalletTypeAsync({
          walletType: activeWallet.walletType,
          appChains,
          solanaRPCUrls,
          chains: walletChains,
        });

        if (asyncChains.length > 0) {
          setChainsList(asyncChains);
          return;
        }
      } catch (asyncError) {
        console.warn('Async chain loading failed, falling back to sync method:', asyncError);
      }

      // Fallback to sync version
      try {
        const syncChains = getChainsListByWalletType({
          walletType: activeWallet.walletType,
          appChains,
          solanaRPCUrls,
          chains: walletChains,
        });

        setChainsList(syncChains);
      } catch (syncError) {
        console.error('Both async and sync chain loading failed:', syncError);
        setChainsList([]); // Ensure valid array
      } finally {
        setIsLoadingChains(false);
        loadingRef.current = false;
      }
    };

    loadChains();
  }, [activeWallet, appChains, solanaRPCUrls, chainsList.length]);

  /**
   * Handles closing the mobile dialog.
   */
  const handleDialogClose = useCallback(() => {
    const originalHandler = () => setIsChainsListOpenMobile(false);
    customDialogCloseHandler(originalHandler);
  }, [customDialogCloseHandler, setIsChainsListOpenMobile]);

  /**
   * Memoized loading state check.
   */
  const isLoading = useMemo(() => isLoadingChains && chainsList.length === 0, [isLoadingChains, chainsList.length]);

  // Early return if no wallet is connected
  if (!activeWallet) return null;

  // Current chain info
  const currentFormattedChainId = formatWalletChainId(
    activeWallet.chainId,
    getAdapterFromWalletType(activeWallet.walletType),
  );

  const selectValue = String(currentFormattedChainId);
  const chainName = getChainName(currentFormattedChainId);

  // Show loading state while chains are fetching
  if (isLoading) {
    return <LoadingState className={loadingStateClasses} aria-label={`${labels.loading}...`} />;
  }

  // Display single chain - no selector needed
  if (chainsList.length <= 1) {
    return (
      <SingleChainDisplay
        chainId={currentFormattedChainId}
        chainName={chainName}
        className={singleChainDisplayClasses}
        aria-label={`${labels.currentChain}: ${chainName}`}
      />
    );
  }

  const finalAriaLabel = ariaLabel || labels.chainSelector;

  // Main selector UI for multiple chains
  return (
    <div className={containerClasses}>
      {/* Desktop View - Dropdown */}
      <DesktopSelector className={desktopWrapperClasses} aria-label={finalAriaLabel}>
        <Select.Root
          value={selectValue}
          onValueChange={handleChainChange}
          open={isChainsListOpen}
          onOpenChange={setIsChainsListOpen}
        >
          <ChainTriggerButton
            currentFormattedChainId={currentFormattedChainId}
            isChainsListOpen={isChainsListOpen}
            onToggle={() => setIsChainsListOpen(!isChainsListOpen)}
            selectValue={selectValue}
            isMobile={false}
            hasMultipleChains={chainsList.length > 1}
            customization={customization?.triggerButton}
          />
          <SelectContentAnimated className="novacon:w-[210px]" {...customization?.selectContent}>
            <ChainListRenderer
              chainsList={chainsList}
              selectValue={selectValue}
              handleValueChange={handleChainChange}
              getChainData={getChainData}
              onClose={() => setIsChainsListOpen(false)}
              isMobile={false}
              customization={customization?.chainListRenderer}
            />
          </SelectContentAnimated>
        </Select.Root>
      </DesktopSelector>

      {/* Mobile View - Dialog Modal */}
      <MobileSelector className={mobileWrapperClasses} aria-label={finalAriaLabel}>
        <ChainTriggerButton
          currentFormattedChainId={currentFormattedChainId}
          isChainsListOpen={isChainsListOpenMobile}
          onToggle={() => setIsChainsListOpenMobile(true)}
          selectValue={selectValue}
          isMobile={true}
          hasMultipleChains={chainsList.length > 1}
          customization={customization?.triggerButton}
        />

        <Dialog open={isChainsListOpenMobile} onOpenChange={setIsChainsListOpenMobile}>
          <DialogContent className={dialogContentClasses} aria-describedby="chain-selector-description">
            <div className={dialogInnerContainerClasses}>
              <DialogHeader title={labels.switchNetworks} onClose={handleDialogClose} />

              <div id="chain-selector-description" className="novacon:sr-only">
                {labels.selectChain}
              </div>

              <ScrollableChainList
                chainsList={chainsList}
                selectValue={selectValue}
                handleValueChange={handleChainChange}
                getChainData={getChainData}
                onClose={() => setIsChainsListOpenMobile(false)}
                customization={customization?.scrollableChainList}
              />
            </div>
          </DialogContent>
        </Dialog>
      </MobileSelector>
    </div>
  );
}
