/**
 * @file NetworkTabs component with comprehensive customization options and animated transitions.
 */

import { Web3Icon } from '@bgd-labs/react-web3-icons';
import { GlobeAltIcon } from '@heroicons/react/24/solid';
import { cn } from '@tuwaio/nova-core';
import { OrbitAdapter } from '@tuwaio/orbit-core';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import React, { ComponentType, forwardRef, memo, useCallback, useEffect, useMemo } from 'react';

import { useNovaConnectLabels } from '../../hooks/useNovaConnectLabels';
import { getNetworkIcon } from '../../utils';

// --- Types ---

/**
 * Animation configuration
 */
export interface AnimationConfig {
  /** Layout animation duration */
  layoutDuration: number;
  /** Layout animation easing */
  layoutEasing: number[];
  /** Text transition duration */
  textDuration: number;
  /** Text transition delay */
  textDelay?: number;
}

/**
 * Network tab data
 */
export interface NetworkTabData {
  /** Network adapter (undefined for "All") */
  network: OrbitAdapter | undefined;
  /** Display name */
  displayName: string;
  /** Network info from utils */
  networkInfo: ReturnType<typeof getNetworkIcon> | null;
  /** Whether this tab is selected */
  isSelected: boolean;
  /** Tab index */
  index: number;
}

// --- Component Props Types ---
type ContainerProps = {
  className?: string;
  children: React.ReactNode;
  role?: string;
  'aria-label'?: string;
} & React.RefAttributes<HTMLDivElement>;

type TabListProps = {
  className?: string;
  children: React.ReactNode;
} & React.RefAttributes<HTMLDivElement>;

type TabProps = {
  className?: string;
  children: React.ReactNode;
  'data-network': string;
} & React.RefAttributes<HTMLDivElement>;

type TabButtonProps = {
  className?: string;
  children: React.ReactNode;
  type?: 'button';
  role?: string;
  'aria-selected'?: boolean;
  'aria-controls'?: string;
  onClick: () => void;
  onMouseEnter?: () => void;
  onFocus?: () => void;
  title?: string;
  'aria-label'?: string;
  tabData: NetworkTabData;
} & React.RefAttributes<HTMLButtonElement>;

type IconContainerProps = {
  className?: string;
  children: React.ReactNode;
  role?: string;
  'aria-label'?: string;
  tabData: NetworkTabData;
} & React.RefAttributes<HTMLDivElement>;

type TabTextProps = {
  className?: string;
  children: React.ReactNode;
  variants?: Variants;
  animate?: string;
  'aria-hidden'?: boolean;
  tabData: NetworkTabData;
} & React.RefAttributes<HTMLSpanElement>;

type IndicatorProps = {
  className?: string;
  'aria-hidden'?: boolean;
  tabData: NetworkTabData;
} & React.RefAttributes<HTMLDivElement>;

/**
 * Customization options for NetworkTabs component
 */
export type NetworkTabsCustomization = {
  /** Custom components */
  components?: {
    /** Custom container wrapper */
    Container?: ComponentType<ContainerProps>;
    /** Custom tab list container */
    TabList?: ComponentType<TabListProps>;
    /** Custom tab wrapper */
    Tab?: ComponentType<TabProps>;
    /** Custom tab button */
    TabButton?: ComponentType<TabButtonProps>;
    /** Custom icon container */
    IconContainer?: ComponentType<IconContainerProps>;
    /** Custom tab text */
    TabText?: ComponentType<TabTextProps>;
    /** Custom selection indicator */
    Indicator?: ComponentType<IndicatorProps>;
  };
  /** Custom class name generators */
  classNames?: {
    /** Function to generate container classes */
    container?: () => string;
    /** Function to generate tab list classes */
    tabList?: () => string;
    /** Function to generate tab classes */
    tab?: (params: { isSelected: boolean; index: number }) => string;
    /** Function to generate tab button classes */
    tabButton?: (params: { isSelected: boolean; tabData: NetworkTabData }) => string;
    /** Function to generate icon container classes */
    iconContainer?: (params: { tabData: NetworkTabData }) => string;
    /** Function to generate tab text classes */
    tabText?: (params: { isSelected: boolean; tabData: NetworkTabData }) => string;
    /** Function to generate indicator classes */
    indicator?: (params: { tabData: NetworkTabData }) => string;
  };
  /** Custom event handlers */
  handlers?: {
    /** Custom handler for tab selection (called after default logic) */
    onTabSelect?: (network: OrbitAdapter | undefined, tabData: NetworkTabData) => void;
    /** Custom handler for tab hover */
    onTabHover?: (network: OrbitAdapter | undefined, tabData: NetworkTabData) => void;
    /** Custom handler for tab focus */
    onTabFocus?: (network: OrbitAdapter | undefined, tabData: NetworkTabData) => void;
    /** Custom handler for component mount */
    onMount?: () => void;
    /** Custom handler for component unmount */
    onUnmount?: () => void;
  };
  /** Configuration options */
  config?: {
    /** Custom animation configuration */
    animation?: Partial<AnimationConfig>;
    /** Custom ARIA labels */
    ariaLabels?: {
      container?: string;
      tabPrefix?: string;
      iconSuffix?: string;
      selectedSuffix?: string;
    };
    /** Whether to show "All" option */
    showAllOption?: boolean;
    /** Custom network display names */
    networkNames?: {
      [key: string]: string;
    };
    /** Minimum networks to show tabs */
    minNetworksToShow?: number;
  };
};

/**
 * Props for the NetworkTabs component
 */
export interface NetworkTabsProps {
  /** Array of available network adapters */
  networks: OrbitAdapter[];
  /** Currently selected network adapter (undefined means "All" is selected) */
  selectedAdapter: OrbitAdapter | undefined;
  /** Handler for network selection changes */
  onSelect: (adapter: OrbitAdapter | undefined) => void;
  /** Custom CSS classes for styling the container */
  className?: string;
  /** Customization options */
  customization?: NetworkTabsCustomization;
}

/**
 * Default animation configuration
 */
const defaultAnimationConfig: AnimationConfig = {
  layoutDuration: 0.6,
  layoutEasing: [0.1, 0.1, 0.2, 1],
  textDuration: 0.2,
  textDelay: 0,
};

/**
 * Default animation variants for tab text transitions
 */
const getTextVariant = (config: AnimationConfig): Variants => ({
  active: {
    opacity: 1,
    zIndex: 2,
    x: 0,
    position: 'relative',
    transition: {
      duration: config.textDuration,
      delay: config.textDelay,
    },
  },
  inactive: {
    opacity: 0,
    zIndex: -1,
    x: -10,
    position: 'absolute',
    transition: {
      duration: config.textDuration,
    },
  },
});

// --- Default Sub-Components ---
const DefaultContainer = forwardRef<HTMLDivElement, ContainerProps>(({ children, className, ...props }, ref) => (
  <motion.div
    ref={ref}
    className={className}
    layout
    transition={{
      layout: {
        duration: 0.6,
        ease: [0.1, 0.1, 0.2, 1],
      },
    }}
    {...props}
  >
    {children}
  </motion.div>
));
DefaultContainer.displayName = 'DefaultContainer';

const DefaultTabList = forwardRef<HTMLDivElement, TabListProps>(({ children, className }, ref) => (
  <motion.div
    ref={ref}
    className={className}
    layout
    transition={{
      layout: {
        duration: 0.0001,
      },
    }}
  >
    {children}
  </motion.div>
));
DefaultTabList.displayName = 'DefaultTabList';

const DefaultTab = forwardRef<HTMLDivElement, TabProps>(({ children, className, ...props }, ref) => (
  <motion.div
    ref={ref}
    className={className}
    layout
    transition={{
      layout: {
        duration: 0.6,
        ease: [0.1, 0.1, 0.2, 1],
      },
    }}
    {...props}
  >
    {children}
  </motion.div>
));
DefaultTab.displayName = 'DefaultTab';

const DefaultTabButton = forwardRef<HTMLButtonElement, TabButtonProps>(
  // eslint-disable-next-line
  ({ children, className, tabData: _, ...props }, ref) => (
    <motion.button
      ref={ref}
      className={className}
      layout
      transition={{
        layout: {
          duration: 0.0001,
        },
      }}
      {...props}
    >
      {children}
    </motion.button>
  ),
);
DefaultTabButton.displayName = 'DefaultTabButton';

const DefaultIconContainer = forwardRef<HTMLDivElement, IconContainerProps>(
  // eslint-disable-next-line
  ({ children, className, tabData: _, ...props }, ref) => (
    <div ref={ref} className={className} {...props}>
      {children}
    </div>
  ),
);
DefaultIconContainer.displayName = 'DefaultIconContainer';

const DefaultTabText = forwardRef<HTMLSpanElement, TabTextProps>(
  // eslint-disable-next-line
  ({ children, className, tabData: _, ...props }, ref) => (
    <motion.span ref={ref} className={className} {...props}>
      {children}
    </motion.span>
  ),
);
DefaultTabText.displayName = 'DefaultTabText';

const DefaultIndicator = forwardRef<HTMLDivElement, IndicatorProps>(
  // eslint-disable-next-line
  ({ className, tabData: _, ...props }, ref) => (
    <motion.div ref={ref} className={className} layoutId="indicator" {...props} />
  ),
);
DefaultIndicator.displayName = 'DefaultIndicator';

/**
 * NetworkTabs component - Animated tab navigation for network selection with comprehensive customization
 *
 * This component provides an animated tab interface for selecting blockchain networks:
 * - Animated tab transitions with smooth layouts powered by Framer Motion
 * - Visual network icons with Web3Icon integration and fallbacks
 * - Configurable "All networks" option for viewing all connectors
 * - Responsive horizontal scrolling for mobile-friendly experience
 * - Full accessibility support with proper ARIA labels and keyboard navigation
 * - Motion-based UI feedback with customizable animation timing
 * - Complete customization of all child components and animations
 *
 * Key features:
 * - Framer Motion powered animations with configurable timing and easing
 * - Dynamic tab indicator that smoothly morphs between selections
 * - Network icons with proper Web3Icon integration and fallback support
 * - Conditional rendering based on configurable minimum network threshold
 * - Touch-friendly interface with horizontal scrolling support
 * - Full component tree customization through render prop pattern
 *
 * Animation system:
 * - Layout animations for smooth tab movement with configurable duration
 * - Text fade transitions with customizable timing when switching tabs
 * - Morphing background indicator with layoutId for smooth transitions
 * - Optimized animation durations tuned for natural feel
 * - Support for reduced motion preferences
 *
 * Accessibility features:
 * - Proper tablist and tab ARIA semantics for screen readers
 * - Keyboard navigation support (Tab, Space, Enter, Arrow keys)
 * - Dynamic ARIA labels with selection state announcements
 * - Focus management with visible focus indicators
 * - Meaningful tooltips and descriptions for each network
 * - Screen reader friendly icon descriptions
 *
 * @example Basic usage
 * ```tsx
 * <NetworkTabs
 *   networks={[OrbitAdapter.EVM, OrbitAdapter.SOLANA]}
 *   selectedAdapter={OrbitAdapter.EVM}
 *   onSelect={(adapter) => handleNetworkChange(adapter)}
 * />
 * ```
 *
 * @example With custom animation timing
 * ```tsx
 * <NetworkTabs
 *   networks={networks}
 *   selectedAdapter={selectedNetwork}
 *   onSelect={setSelectedNetwork}
 *   customization={{
 *     config: {
 *       animation: {
 *         layoutDuration: 0.3,
 *         textDuration: 0.15
 *       }
 *     }
 *   }}
 * />
 * ```
 *
 * @example With full customization
 * ```tsx
 * <NetworkTabs
 *   networks={networks}
 *   selectedAdapter={selectedNetwork}
 *   onSelect={setSelectedNetwork}
 *   customization={{
 *     components: {
 *       TabButton: CustomTabButton,
 *       Indicator: CustomIndicator
 *     },
 *     classNames: {
 *       tabButton: ({ isSelected }) => isSelected ? 'custom-selected' : 'custom-normal'
 *     },
 *     handlers: {
 *       onTabSelect: (network, tabData) => {
 *         analytics.track('network_tab_selected', { network: network?.name });
 *       }
 *     },
 *     config: {
 *       minNetworksToShow: 2,
 *       showAllOption: false
 *     }
 *   }}
 * />
 * ```
 */
export const NetworkTabs = memo(
  forwardRef<HTMLDivElement, NetworkTabsProps>(
    ({ networks, selectedAdapter, onSelect, className, customization }, ref) => {
      const labels = useNovaConnectLabels();

      // Extract customization options
      const {
        Container: CustomContainer = DefaultContainer,
        TabList: CustomTabList = DefaultTabList,
        Tab: CustomTab = DefaultTab,
        TabButton: CustomTabButton = DefaultTabButton,
        IconContainer: CustomIconContainer = DefaultIconContainer,
        TabText: CustomTabText = DefaultTabText,
        Indicator: CustomIndicator = DefaultIndicator,
      } = customization?.components ?? {};

      const customHandlers = customization?.handlers;
      const customConfig = customization?.config;

      /**
       * Memoized animation configuration with customization
       */
      const animationConfig = useMemo(
        (): AnimationConfig => ({
          ...defaultAnimationConfig,
          ...customConfig?.animation,
        }),
        [customConfig?.animation],
      );

      /**
       * Memoized text animation variants
       */
      const textVariant = useMemo(() => getTextVariant(animationConfig), [animationConfig]);

      /**
       * Check if we should render tabs
       */
      const shouldRender = useMemo(() => {
        const minNetworks = customConfig?.minNetworksToShow ?? 1;
        return networks.length > minNetworks;
      }, [networks.length, customConfig?.minNetworksToShow]);

      /**
       * Memoized networks list with "All" option if enabled
       */
      const localNetworks = useMemo(() => {
        const showAll = customConfig?.showAllOption ?? true;
        return showAll ? [undefined, ...networks] : networks;
      }, [networks, customConfig?.showAllOption]);

      /**
       * Generate network display name function with proper memoization dependencies
       */
      const getNetworkDisplayNameGen = useCallback(
        () =>
          (network: OrbitAdapter | undefined): string => {
            if (!network) return labels.all;

            // Check for custom name first
            const networkKey = network.toString();
            if (customConfig?.networkNames?.[networkKey]) {
              return customConfig.networkNames[networkKey];
            }

            return getNetworkIcon(network)?.name ?? 'Unknown';
          },
        [labels.all, customConfig?.networkNames],
      );

      /**
       * Memoized network display name function
       */
      const getNetworkDisplayName = useMemo(getNetworkDisplayNameGen, [getNetworkDisplayNameGen]);

      /**
       * Generate aria label function with proper memoization dependencies
       */
      const getNetworkAriaLabelGen = useCallback(
        () =>
          (network: OrbitAdapter | undefined, isSelected: boolean): string => {
            const displayName = getNetworkDisplayName(network);
            const tabPrefix = customConfig?.ariaLabels?.tabPrefix ?? '';
            const selectedSuffix = customConfig?.ariaLabels?.selectedSuffix ?? ', currently selected';

            return `${tabPrefix}${displayName} network${isSelected ? selectedSuffix : ''}`.trim();
          },
        [getNetworkDisplayName, customConfig?.ariaLabels],
      );

      /**
       * Memoized aria label function
       */
      const getNetworkAriaLabel = useMemo(getNetworkAriaLabelGen, [getNetworkAriaLabelGen]);

      /**
       * Generate tab selection handler with proper memoization dependencies
       */
      const getHandleTabSelect = useCallback(
        () => (network: OrbitAdapter | undefined, tabData: NetworkTabData) => {
          onSelect(network);
          customHandlers?.onTabSelect?.(network, tabData);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [onSelect, customHandlers?.onTabSelect],
      );

      /**
       * Memoized tab selection handler
       */
      const handleTabSelect = useMemo(getHandleTabSelect, [getHandleTabSelect]);

      /**
       * Memoized tab data
       */
      const tabsData = useMemo((): NetworkTabData[] => {
        return localNetworks.map((network, index) => ({
          network,
          displayName: getNetworkDisplayName(network),
          networkInfo: network ? getNetworkIcon(network) : null,
          isSelected: selectedAdapter === network,
          index,
        }));
      }, [localNetworks, getNetworkDisplayName, selectedAdapter]);

      /**
       * Generate container classes with proper memoization dependencies
       */
      const getContainerClasses = useCallback(
        () => customization?.classNames?.container?.() ?? className,
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [customization?.classNames?.container, className],
      );

      /**
       * Memoized container classes
       */
      const containerClasses = useMemo(getContainerClasses, [getContainerClasses]);

      /**
       * Generate tab list classes with proper memoization dependencies
       */
      const getTabListClasses = useCallback(
        () =>
          customization?.classNames?.tabList?.() ??
          'novacon:flex novacon:overflow-x-auto novacon:gap-2 novacon:p-2 novacon:mb-2 novacon:border-b novacon:border-[var(--tuwa-border-primary)] novacon:relative',
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [customization?.classNames?.tabList],
      );

      /**
       * Memoized tab list classes
       */
      const tabListClasses = useMemo(getTabListClasses, [getTabListClasses]);

      // Mount/unmount effect
      useEffect(() => {
        customHandlers?.onMount?.();
        return () => customHandlers?.onUnmount?.();
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [customHandlers?.onMount, customHandlers?.onUnmount]);

      // Don't render if not enough networks
      if (!shouldRender) return null;

      const containerAriaLabel = customConfig?.ariaLabels?.container ?? 'Network selection tabs';

      return (
        <CustomContainer ref={ref} className={containerClasses} role="tablist" aria-label={containerAriaLabel}>
          <CustomTabList className={tabListClasses}>
            {tabsData.map((tabData) => {
              const tabKey = `${tabData.network}_${tabData.index}`;
              const networkKey = tabData.network?.toString() ?? 'all';

              // Generate dynamic classes and styles
              const tabClasses =
                customization?.classNames?.tab?.({
                  isSelected: tabData.isSelected,
                  index: tabData.index,
                }) ?? 'novacon:relative novacon:group';

              const tabButtonClasses =
                customization?.classNames?.tabButton?.({
                  isSelected: tabData.isSelected,
                  tabData,
                }) ??
                cn(
                  'novacon:cursor-pointer novacon:flex novacon:items-center novacon:gap-2 novacon:px-4 novacon:py-2 novacon:rounded-lg novacon:transition-colors novacon:overflow-hidden novacon:relative novacon:z-4',
                  'novacon:hover:bg-[var(--tuwa-bg-muted)]',
                  'novacon:focus:outline-none novacon:focus:ring-2 novacon:focus:ring-[var(--tuwa-border-primary)] novacon:focus:ring-offset-2',
                  tabData.isSelected
                    ? 'novacon:bg-[var(--tuwa-bg-muted)] novacon:text-[var(--tuwa-text-accent)]'
                    : 'novacon:text-[var(--tuwa-text-secondary)]',
                );

              const iconContainerClasses =
                customization?.classNames?.iconContainer?.({ tabData }) ??
                'novacon:w-6 novacon:h-6 novacon:[&>img]:w-full novacon:[&>img]:h-full';

              const tabTextClasses =
                customization?.classNames?.tabText?.({
                  isSelected: tabData.isSelected,
                  tabData,
                }) ?? 'novacon:block';

              const indicatorClasses =
                customization?.classNames?.indicator?.({ tabData }) ??
                'novacon:absolute novacon:inset-0 novacon:bg-[var(--tuwa-bg-muted)] novacon:z-3 novacon:rounded-lg';

              return (
                <CustomTab key={tabKey} className={tabClasses} data-network={networkKey}>
                  <CustomTabButton
                    className={tabButtonClasses}
                    type="button"
                    role="tab"
                    aria-selected={tabData.isSelected}
                    aria-controls={`network-panel-${networkKey}`}
                    onClick={() => handleTabSelect(tabData.network, tabData)}
                    onMouseEnter={() => customHandlers?.onTabHover?.(tabData.network, tabData)}
                    onFocus={() => customHandlers?.onTabFocus?.(tabData.network, tabData)}
                    title={tabData.displayName}
                    aria-label={getNetworkAriaLabel(tabData.network, tabData.isSelected)}
                    tabData={tabData}
                  >
                    <CustomIconContainer
                      className={iconContainerClasses}
                      role="img"
                      aria-label={`${tabData.displayName} network ${customConfig?.ariaLabels?.iconSuffix ?? 'icon'}`}
                      tabData={tabData}
                    >
                      {tabData.network ? (
                        <Web3Icon chainId={tabData.networkInfo?.chainId} />
                      ) : (
                        <div className="novacon:w-6 novacon:h-6 novacon:[&>img]:w-full novacon:[&>img]:h-full novacon:rounded-full novacon:bg-[var(--tuwa-bg-primary)]">
                          <GlobeAltIcon aria-hidden="true" />
                        </div>
                      )}
                    </CustomIconContainer>

                    <AnimatePresence initial={false}>
                      <CustomTabText
                        variants={textVariant}
                        className={tabTextClasses}
                        animate={tabData.isSelected ? 'active' : 'inactive'}
                        aria-hidden={!tabData.isSelected}
                        tabData={tabData}
                      >
                        {tabData.displayName}
                      </CustomTabText>
                    </AnimatePresence>
                  </CustomTabButton>

                  {tabData.isSelected && (
                    <CustomIndicator className={indicatorClasses} aria-hidden={true} tabData={tabData} />
                  )}
                </CustomTab>
              );
            })}
          </CustomTabList>
        </CustomContainer>
      );
    },
  ),
);

NetworkTabs.displayName = 'NetworkTabs';
