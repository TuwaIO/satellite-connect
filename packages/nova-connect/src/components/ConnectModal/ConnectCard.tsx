/**
 * @file ConnectCard component with comprehensive customization options for wallet connection cards.
 */

import { Web3Icon } from '@bgd-labs/react-web3-icons';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { ChevronRightIcon } from '@heroicons/react/24/solid';
import { cn, isTouchDevice } from '@tuwaio/nova-core';
import { OrbitAdapter } from '@tuwaio/orbit-core';
import React, { ComponentType, forwardRef, memo, useCallback, useMemo } from 'react';

import { useNovaConnectLabels } from '../../hooks/useNovaConnectLabels';
import { getNetworkIcon } from '../../utils';
import { RecentBadge } from './RecentBadge';

// --- Types ---

/**
 * Network data for display
 */
interface NetworkData {
  /** Network adapter */
  adapter: OrbitAdapter;
  /** Chain ID for icon display */
  chainId?: number | string;
  /** Network display name */
  name?: string;
  /** Network index in list */
  index: number;
}

/**
 * Connect card data
 */
export interface ConnectCardData {
  /** Primary title/name */
  title: string;
  /** Optional subtitle */
  subtitle?: string;
  /** Whether card is recent */
  isRecent: boolean;
  /** Whether touch device */
  isTouch: boolean;
  /** Info link URL */
  infoLink?: string;
  /** Network adapters */
  adapters?: OrbitAdapter[];
  /** Whether only one network */
  isOnlyOneNetwork?: boolean;
  /** Network count for overflow */
  networkCount: number;
  /** Visible networks */
  visibleNetworks: NetworkData[];
  /** Overflow count */
  overflowCount: number;
}

// --- Network Icons Component Props ---
type NetworkIconsContainerProps = {
  className?: string;
  children: React.ReactNode;
  role?: string;
  'aria-label'?: string;
  cardData: ConnectCardData;
} & React.RefAttributes<HTMLDivElement>;

type NetworkIconProps = {
  className?: string;
  children: React.ReactNode;
  role?: string;
  'aria-label'?: string;
  networkData: NetworkData;
  cardData: ConnectCardData;
} & React.RefAttributes<HTMLDivElement>;

type NetworkOverflowProps = {
  className?: string;
  children: React.ReactNode;
  role?: string;
  'aria-label'?: string;
  overflowCount: number;
  cardData: ConnectCardData;
} & React.RefAttributes<HTMLDivElement>;

/**
 * NetworkIcons customization options
 */
export type NetworkIconsCustomization = {
  /** Custom components */
  components?: {
    /** Custom container wrapper */
    Container?: ComponentType<NetworkIconsContainerProps>;
    /** Custom network icon */
    NetworkIcon?: ComponentType<NetworkIconProps>;
    /** Custom overflow indicator */
    OverflowIndicator?: ComponentType<NetworkOverflowProps>;
  };
  /** Custom class name generators */
  classNames?: {
    /** Function to generate container classes */
    container?: (params: { cardData: ConnectCardData }) => string;
    /** Function to generate network icon classes */
    networkIcon?: (params: { networkData: NetworkData; cardData: ConnectCardData }) => string;
    /** Function to generate overflow indicator classes */
    overflowIndicator?: (params: { overflowCount: number; cardData: ConnectCardData }) => string;
  };
};

/**
 * Props for the NetworkIcons component
 */
interface NetworkIconsProps {
  /** Array of network adapters to display as icons */
  adapters?: OrbitAdapter[];
  /** Whether only one network is available */
  isOnlyOneNetwork?: boolean;
  /** Card data for context */
  cardData: ConnectCardData;
  /** Customization options */
  customization?: NetworkIconsCustomization;
}

// --- Connect Card Component Props ---
type CardContainerProps = {
  className?: string;
  children: React.ReactNode;
  type?: 'button';
  onClick?: () => void;
  'aria-label'?: string;
  'aria-describedby'?: string;
  cardData: ConnectCardData;
} & React.RefAttributes<HTMLButtonElement>;

type CardContentProps = {
  className?: string;
  children: React.ReactNode;
  cardData: ConnectCardData;
} & React.RefAttributes<HTMLDivElement>;

type IconContainerProps = {
  className?: string;
  children: React.ReactNode;
  role?: string;
  'aria-label'?: string;
  cardData: ConnectCardData;
} & React.RefAttributes<HTMLDivElement>;

type IconWrapperProps = {
  className?: string;
  children: React.ReactNode;
  cardData: ConnectCardData;
} & React.RefAttributes<HTMLDivElement>;

type TextContainerProps = {
  className?: string;
  children: React.ReactNode;
  cardData: ConnectCardData;
} & React.RefAttributes<HTMLDivElement>;

type TitleProps = {
  className?: string;
  children: React.ReactNode;
  role?: string;
  'aria-level'?: number;
  cardData: ConnectCardData;
} & React.RefAttributes<HTMLSpanElement>;

type SubtitleProps = {
  className?: string;
  children: React.ReactNode;
  id?: string;
  role?: string;
  cardData: ConnectCardData;
} & React.RefAttributes<HTMLSpanElement>;

type InfoLinkProps = {
  className?: string;
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  href?: string;
  target?: string;
  rel?: string;
  'aria-label'?: string;
  cardData: ConnectCardData;
} & React.RefAttributes<HTMLAnchorElement>;

type RecentBadgeWrapperProps = {
  className?: string;
  children: React.ReactNode;
  'aria-label'?: string;
  cardData: ConnectCardData;
} & React.RefAttributes<HTMLDivElement>;

type ChevronProps = {
  className?: string;
  children: React.ReactNode;
  'aria-hidden'?: boolean;
  cardData: ConnectCardData;
} & React.RefAttributes<HTMLDivElement>;

/**
 * ConnectCard customization options
 */
export type ConnectCardCustomization = {
  /** Custom components */
  components?: {
    /** Custom card container */
    Container?: ComponentType<CardContainerProps>;
    /** Custom card content */
    Content?: ComponentType<CardContentProps>;
    /** Custom icon container */
    IconContainer?: ComponentType<IconContainerProps>;
    /** Custom icon wrapper */
    IconWrapper?: ComponentType<IconWrapperProps>;
    /** Custom text container */
    TextContainer?: ComponentType<TextContainerProps>;
    /** Custom title */
    Title?: ComponentType<TitleProps>;
    /** Custom subtitle */
    Subtitle?: ComponentType<SubtitleProps>;
    /** Custom info link */
    InfoLink?: ComponentType<InfoLinkProps>;
    /** Custom recent badge wrapper */
    RecentBadgeWrapper?: ComponentType<RecentBadgeWrapperProps>;
    /** Custom chevron */
    Chevron?: ComponentType<ChevronProps>;
  };
  /** Custom class name generators */
  classNames?: {
    /** Function to generate container classes */
    container?: (params: { cardData: ConnectCardData }) => string;
    /** Function to generate content classes */
    content?: (params: { cardData: ConnectCardData }) => string;
    /** Function to generate icon container classes */
    iconContainer?: (params: { cardData: ConnectCardData }) => string;
    /** Function to generate icon wrapper classes */
    iconWrapper?: (params: { cardData: ConnectCardData }) => string;
    /** Function to generate text container classes */
    textContainer?: (params: { cardData: ConnectCardData }) => string;
    /** Function to generate title classes */
    title?: (params: { cardData: ConnectCardData }) => string;
    /** Function to generate subtitle classes */
    subtitle?: (params: { cardData: ConnectCardData }) => string;
    /** Function to generate info link classes */
    infoLink?: (params: { cardData: ConnectCardData }) => string;
    /** Function to generate recent badge wrapper classes */
    recentBadgeWrapper?: (params: { cardData: ConnectCardData }) => string;
    /** Function to generate chevron classes */
    chevron?: (params: { cardData: ConnectCardData }) => string;
  };
  /** Custom event handlers */
  handlers?: {
    /** Custom click handler */
    onClick?: (cardData: ConnectCardData, originalHandler: () => void) => void;
    /** Custom info link click handler */
    onInfoClick?: (cardData: ConnectCardData, event: React.MouseEvent) => void;
    /** Custom hover handler */
    onHover?: (cardData: ConnectCardData, isHovering: boolean) => void;
  };
  /** Configuration options */
  config?: {
    /** Custom ARIA labels */
    ariaLabels?: {
      card?: (cardData: ConnectCardData) => string;
      icon?: (cardData: ConnectCardData) => string;
      infoLink?: (cardData: ConnectCardData) => string;
      recentBadge?: (cardData: ConnectCardData) => string;
    };
    /** Custom animation settings */
    animation?: {
      hoverScale?: string;
      transitionDuration?: string;
      chevronTransform?: string;
    };
  };
  /** NetworkIcons customization */
  networkIcons?: NetworkIconsCustomization;
};

/**
 * Props for the ConnectCard component
 */
interface ConnectCardProps {
  /** Click handler for the connect card */
  onClick: () => void;
  /** Icon element to display for the wallet/connector */
  icon: React.ReactNode;
  /** Primary title/name of the wallet/connector */
  title: string;
  /** Optional subtitle/description text */
  subtitle?: string;
  /** Optional URL for additional information */
  infoLink?: string;
  /** Whether this connector was recently used */
  isRecent?: boolean;
  /** Array of network adapters to display as icons */
  adapters?: OrbitAdapter[];
  /** Whether only one network is available */
  isOnlyOneNetwork?: boolean;
  /** Custom CSS classes for styling the container */
  className?: string;
  /** Customization options */
  customization?: ConnectCardCustomization;
}

// --- Default NetworkIcons Sub-Components ---
const DefaultNetworkIconsContainer = forwardRef<HTMLDivElement, NetworkIconsContainerProps>(
  // eslint-disable-next-line
  ({ children, className, cardData, ...props }, ref) => (
    <div ref={ref} className={className} {...props}>
      {children}
    </div>
  ),
);
DefaultNetworkIconsContainer.displayName = 'DefaultNetworkIconsContainer';

const DefaultNetworkIcon = forwardRef<HTMLDivElement, NetworkIconProps>(
  // eslint-disable-next-line
  ({ children, className, cardData, networkData, ...props }, ref) => (
    <div ref={ref} className={className} {...props}>
      {children}
    </div>
  ),
);
DefaultNetworkIcon.displayName = 'DefaultNetworkIcon';

const DefaultNetworkOverflow = forwardRef<HTMLDivElement, NetworkOverflowProps>(
  // eslint-disable-next-line
  ({ children, className, cardData, ...props }, ref) => (
    <div ref={ref} className={className} {...props}>
      {children}
    </div>
  ),
);
DefaultNetworkOverflow.displayName = 'DefaultNetworkOverflow';

/**
 * NetworkIcons component - Displays network chain icons for supported networks with full customization
 *
 * Shows up to 3 network icons with an overflow indicator for additional networks.
 * Hidden when only one network is available or no adapters are provided.
 * Supports complete customization of all child components and styling.
 *
 * @example Basic usage
 * ```tsx
 * <NetworkIcons
 *   adapters={[ethereum, polygon]}
 *   isOnlyOneNetwork={false}
 *   cardData={cardData}
 * />
 * ```
 *
 * @example With customization
 * ```tsx
 * <NetworkIcons
 *   adapters={networkAdapters}
 *   isOnlyOneNetwork={false}
 *   cardData={cardData}
 *   customization={{
 *     components: {
 *       NetworkIcon: CustomNetworkIcon
 *     },
 *     classNames: {
 *       container: ({ cardData }) => `custom-networks ${cardData.isTouch ? 'touch' : 'mouse'}`
 *     }
 *   }}
 * />
 * ```
 */
const NetworkIcons = memo(
  forwardRef<HTMLDivElement, NetworkIconsProps>(({ adapters, isOnlyOneNetwork, cardData, customization }, ref) => {
    const labels = useNovaConnectLabels();

    // Extract customization options
    const {
      Container: CustomContainer = DefaultNetworkIconsContainer,
      NetworkIcon: CustomNetworkIcon = DefaultNetworkIcon,
      OverflowIndicator: CustomOverflowIndicator = DefaultNetworkOverflow,
    } = customization?.components ?? {};

    /**
     * Generate visible networks data
     */
    const visibleNetworksData = useMemo(() => {
      if (!adapters?.length) return [];
      return adapters.slice(0, 3).map(
        (adapter, index): NetworkData => ({
          adapter,
          chainId: getNetworkIcon(adapter)?.chainId,
          name: getNetworkIcon(adapter)?.name,
          index,
        }),
      );
    }, [adapters]);

    /**
     * Calculate overflow count
     */
    // eslint-disable-next-line
    const overflowCount = useMemo(() => {
      return adapters?.length ? Math.max(0, adapters.length - 3) : 0;
    }, [adapters?.length]);

    // Early returns
    if (!adapters?.length) return null;
    if (isOnlyOneNetwork) return null;

    return (
      <CustomContainer
        ref={ref}
        className={
          customization?.classNames?.container?.({ cardData }) ??
          cn(
            'novacon:absolute novacon:-bottom-1 novacon:-right-1 novacon:w-full novacon:flex novacon:items-center novacon:justify-end',
          )
        }
        role="group"
        aria-label={labels.listOfNetworks}
        cardData={cardData}
      >
        {visibleNetworksData.map((networkData) => (
          <CustomNetworkIcon
            key={networkData.adapter}
            className={
              customization?.classNames?.networkIcon?.({ networkData, cardData }) ??
              cn(
                'novacon:w-4 novacon:h-4 novacon:rounded-full novacon:border novacon:border-[var(--tuwa-border-primary)] novacon:bg-[var(--tuwa-bg-primary)] novacon:flex novacon:items-center novacon:justify-center',
                {
                  'novacon:-ml-2': networkData.index > 0,
                },
              )
            }
            role="img"
            aria-label={`Network ${networkData.chainId || networkData.adapter}`}
            networkData={networkData}
            cardData={cardData}
          >
            <Web3Icon chainId={networkData.chainId} />
          </CustomNetworkIcon>
        ))}
        {overflowCount > 0 && (
          <CustomOverflowIndicator
            className={
              customization?.classNames?.overflowIndicator?.({ overflowCount, cardData }) ??
              cn(
                'novacon:w-4 novacon:h-4 novacon:rounded-full novacon:border novacon:border-[var(--tuwa-border-primary)] novacon:bg-[var(--tuwa-bg-primary)] novacon:-ml-2 novacon:flex novacon:items-center novacon:justify-center novacon:text-[8px]',
              )
            }
            role="img"
            aria-label={`${overflowCount} additional networks`}
            overflowCount={overflowCount}
            cardData={cardData}
          >
            +{overflowCount}
          </CustomOverflowIndicator>
        )}
      </CustomContainer>
    );
  }),
);
NetworkIcons.displayName = 'NetworkIcons';

// --- Default ConnectCard Sub-Components ---
const DefaultCardContainer = forwardRef<HTMLButtonElement, CardContainerProps>(
  // eslint-disable-next-line
  ({ children, className, cardData, ...props }, ref) => (
    <button ref={ref} className={className} {...props}>
      {children}
    </button>
  ),
);
DefaultCardContainer.displayName = 'DefaultCardContainer';

const DefaultCardContent = forwardRef<HTMLDivElement, CardContentProps>(
  // eslint-disable-next-line
  ({ children, className, cardData }, ref) => (
    <div ref={ref} className={className}>
      {children}
    </div>
  ),
);
DefaultCardContent.displayName = 'DefaultCardContent';

const DefaultIconContainer = forwardRef<HTMLDivElement, IconContainerProps>(
  // eslint-disable-next-line
  ({ children, className, cardData, ...props }, ref) => (
    <div ref={ref} className={className} {...props}>
      {children}
    </div>
  ),
);
DefaultIconContainer.displayName = 'DefaultIconContainer';

const DefaultIconWrapper = forwardRef<HTMLDivElement, IconWrapperProps>(
  // eslint-disable-next-line
  ({ children, className, cardData }, ref) => (
    <div ref={ref} className={className}>
      {children}
    </div>
  ),
);
DefaultIconWrapper.displayName = 'DefaultIconWrapper';

const DefaultTextContainer = forwardRef<HTMLDivElement, TextContainerProps>(
  // eslint-disable-next-line
  ({ children, className, cardData }, ref) => (
    <div ref={ref} className={className}>
      {children}
    </div>
  ),
);
DefaultTextContainer.displayName = 'DefaultTextContainer';

const DefaultTitle = forwardRef<HTMLSpanElement, TitleProps>(
  // eslint-disable-next-line
  ({ children, className, cardData, ...props }, ref) => (
    <span ref={ref} className={className} {...props}>
      {children}
    </span>
  ),
);
DefaultTitle.displayName = 'DefaultTitle';

const DefaultSubtitle = forwardRef<HTMLSpanElement, SubtitleProps>(
  // eslint-disable-next-line
  ({ children, className, cardData, ...props }, ref) => (
    <span ref={ref} className={className} {...props}>
      {children}
    </span>
  ),
);
DefaultSubtitle.displayName = 'DefaultSubtitle';

const DefaultInfoLink = forwardRef<HTMLAnchorElement, InfoLinkProps>(
  // eslint-disable-next-line
  ({ children, className, cardData, ...props }, ref) => (
    <a ref={ref} className={className} {...props}>
      {children}
    </a>
  ),
);
DefaultInfoLink.displayName = 'DefaultInfoLink';

const DefaultRecentBadgeWrapper = forwardRef<HTMLDivElement, RecentBadgeWrapperProps>(
  // eslint-disable-next-line
  ({ children, className, cardData, ...props }, ref) => (
    <div ref={ref} className={className} {...props}>
      {children}
    </div>
  ),
);
DefaultRecentBadgeWrapper.displayName = 'DefaultRecentBadgeWrapper';

const DefaultChevron = forwardRef<HTMLDivElement, ChevronProps>(
  // eslint-disable-next-line
  ({ children, className, cardData, ...props }, ref) => (
    <div ref={ref} className={className} {...props}>
      {children}
    </div>
  ),
);
DefaultChevron.displayName = 'DefaultChevron';

/**
 * ConnectCard component - Interactive card for wallet connection options with comprehensive customization
 *
 * This component provides a clickable card interface for wallet connectors with:
 * - Responsive design adapting to touch/mouse interfaces
 * - Network icons overlay showing supported networks
 * - Recent usage indicator badge
 * - Information link with external documentation
 * - Hover animations and visual feedback
 * - Full accessibility support with ARIA labels
 * - Keyboard navigation support
 * - Complete customization of all child components and styling
 *
 * @example Basic usage
 * ```tsx
 * <ConnectCard
 *   onClick={() => connect('metamask')}
 *   title="MetaMask"
 *   subtitle="Browser Extension"
 *   icon={<MetaMaskIcon />}
 *   adapters={[evm]}
 *   isRecent={true}
 *   infoLink="https://metamask.io/learn"
 * />
 * ```
 *
 * @example With full customization
 * ```tsx
 * <ConnectCard
 *   onClick={() => connect('walletconnect')}
 *   title="WalletConnect"
 *   icon={<WalletConnectIcon />}
 *   adapters={[ethereum, polygon]}
 *   customization={{
 *     components: {
 *       Container: CustomCardContainer,
 *       Title: CustomTitle
 *     },
 *     classNames: {
 *       container: ({ cardData }) => cardData.isTouch ? 'touch-card' : 'desktop-card'
 *     },
 *     handlers: {
 *       onClick: (cardData, originalHandler) => {
 *         analytics.track('card_clicked', { title: cardData.title });
 *         originalHandler();
 *       }
 *     }
 *   }}
 * />
 * ```
 */
export const ConnectCard = memo(
  forwardRef<HTMLButtonElement, ConnectCardProps>(
    (
      {
        onClick,
        title,
        icon,
        adapters,
        infoLink,
        subtitle,
        isRecent = false,
        isOnlyOneNetwork = false,
        className,
        customization,
      },
      ref,
    ) => {
      const labels = useNovaConnectLabels();

      // Extract customization options
      const {
        Container: CustomContainer = DefaultCardContainer,
        Content: CustomContent = DefaultCardContent,
        IconContainer: CustomIconContainer = DefaultIconContainer,
        IconWrapper: CustomIconWrapper = DefaultIconWrapper,
        TextContainer: CustomTextContainer = DefaultTextContainer,
        Title: CustomTitle = DefaultTitle,
        Subtitle: CustomSubtitle = DefaultSubtitle,
        InfoLink: CustomInfoLink = DefaultInfoLink,
        RecentBadgeWrapper: CustomRecentBadgeWrapper = DefaultRecentBadgeWrapper,
        Chevron: CustomChevron = DefaultChevron,
      } = customization?.components ?? {};

      const customHandlers = customization?.handlers;
      const customConfig = customization?.config;

      /**
       * Memoized touch device detection
       */
      const isTouch = useMemo(() => isTouchDevice(), []);

      /**
       * Memoized network data calculations
       */
      const networkStats = useMemo(() => {
        const networkCount = adapters?.length || 0;
        const visibleNetworks =
          adapters?.slice(0, 3).map(
            (adapter, index): NetworkData => ({
              adapter,
              chainId: getNetworkIcon(adapter)?.chainId,
              name: String(adapter),
              index,
            }),
          ) || [];
        const overflowCount = Math.max(0, networkCount - 3);

        return {
          networkCount,
          visibleNetworks,
          overflowCount,
        };
      }, [adapters]);

      /**
       * Memoized card data
       */
      const cardData = useMemo(
        (): ConnectCardData => ({
          title,
          subtitle,
          isRecent,
          isTouch,
          infoLink,
          adapters,
          isOnlyOneNetwork,
          ...networkStats,
        }),
        [title, subtitle, isRecent, isTouch, infoLink, adapters, isOnlyOneNetwork, networkStats],
      );

      /**
       * Memoized container classes
       */
      const containerClasses = useMemo(() => {
        if (customization?.classNames?.container) {
          return customization.classNames.container({ cardData });
        }

        const baseClasses =
          'novacon:group novacon:cursor-pointer novacon:p-4 novacon:rounded-xl novacon:transition-colors novacon:relative novacon:border novacon:border-[var(--tuwa-border-primary)] novacon:disabled:opacity-50 novacon:disabled:cursor-not-allowed novacon:bg-[var(--tuwa-bg-secondary)] novacon:hover:bg-[var(--tuwa-bg-muted)]';

        const touchClasses =
          'novacon:w-[125px] novacon:h-[125px] novacon:p-2 novacon:flex novacon:flex-col novacon:items-center novacon:justify-center novacon:text-center';

        const mouseClasses = [
          'novacon:w-full novacon:h-auto',
          'novacon:flex novacon:items-center novacon:justify-between',
        ];

        return cn(baseClasses, className, mouseClasses, { [touchClasses]: isTouch });
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [customization?.classNames?.container, cardData, className, isTouch]);

      /**
       * Memoized aria label
       */
      const cardAriaLabel = useMemo(() => {
        if (customConfig?.ariaLabels?.card) {
          return customConfig.ariaLabels.card(cardData);
        }

        const baseLabel = `${labels.connect} ${title}`;
        const recentText = isRecent ? ` (${labels.recent})` : '';
        const subtitleText = subtitle ? `, ${subtitle}` : '';
        const networkCount = adapters?.length ? `, supports ${adapters.length} networks` : '';

        return `${baseLabel}${recentText}${subtitleText}${networkCount}`;
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [
        customConfig?.ariaLabels?.card,
        cardData,
        labels.connect,
        labels.recent,
        title,
        isRecent,
        subtitle,
        adapters?.length,
      ]);

      /**
       * Handle click with customization
       */
      const handleClick = useCallback(() => {
        if (customHandlers?.onClick) {
          customHandlers.onClick(cardData, onClick);
        } else {
          onClick();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [customHandlers?.onClick, cardData, onClick]);

      /**
       * Handle info link click
       */
      const handleInfoClick = useCallback(
        (e: React.MouseEvent) => {
          e.stopPropagation();
          if (customHandlers?.onInfoClick) {
            customHandlers.onInfoClick(cardData, e);
          }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [customHandlers?.onInfoClick, cardData],
      );

      return (
        <CustomContainer
          ref={ref}
          type="button"
          className={containerClasses}
          onClick={handleClick}
          aria-label={cardAriaLabel}
          aria-describedby={subtitle ? `${title}-subtitle` : undefined}
          cardData={cardData}
        >
          <CustomContent
            className={
              customization?.classNames?.content?.({ cardData }) ??
              cn(
                'novacon:flex novacon:gap-3 novacon:transition novacon:duration-300 novacon:ease-in-out novacon:text-[var(--tuwa-text-primary)] novacon:group-hover:text-[var(--tuwa-text-accent)] novacon:items-center',
                {
                  'novacon:flex-col novacon:items-center novacon:gap-1': isTouch,
                },
              )
            }
            cardData={cardData}
          >
            <CustomIconContainer
              className={
                customization?.classNames?.iconContainer?.({ cardData }) ??
                cn(
                  'novacon:flex novacon:relative novacon:transition novacon:duration-300 novacon:ease-in-out group-hover:novacon:scale-115',
                )
              }
              role="img"
              aria-label={
                customConfig?.ariaLabels?.icon
                  ? customConfig.ariaLabels.icon(cardData)
                  : `${title} ${labels.walletIcon}`
              }
              cardData={cardData}
            >
              <CustomIconWrapper
                className={
                  customization?.classNames?.iconWrapper?.({ cardData }) ??
                  cn('novacon:[&_img]:w-[42px]! novacon:[&_img]:h-[auto]! novacon:sm:[&_img]:w-[32px]!')
                }
                cardData={cardData}
              >
                {icon}
              </CustomIconWrapper>
              <NetworkIcons
                adapters={adapters}
                isOnlyOneNetwork={isOnlyOneNetwork}
                cardData={cardData}
                customization={customization?.networkIcons}
              />
            </CustomIconContainer>

            <CustomTextContainer
              className={
                customization?.classNames?.textContainer?.({ cardData }) ??
                cn('novacon:flex novacon:flex-col novacon:gap-0.5 novacon:items-start', {
                  'novacon:items-center novacon:text-sm': isTouch,
                })
              }
              cardData={cardData}
            >
              <CustomTitle
                className={customization?.classNames?.title?.({ cardData }) ?? cn({ 'novacon:font-medium': isTouch })}
                role="heading"
                aria-level={3}
                cardData={cardData}
              >
                {title}
              </CustomTitle>
              {subtitle && (
                <CustomSubtitle
                  className={
                    customization?.classNames?.subtitle?.({ cardData }) ??
                    cn('novacon:text-[var(--tuwa-text-secondary)] novacon:text-sm', {
                      'novacon:text-[10px]': isTouch,
                    })
                  }
                  id={`${title}-subtitle`}
                  role="text"
                  cardData={cardData}
                >
                  {subtitle}
                </CustomSubtitle>
              )}
            </CustomTextContainer>
          </CustomContent>

          {infoLink && (
            <CustomInfoLink
              className={
                customization?.classNames?.infoLink?.({ cardData }) ??
                cn(
                  'novacon:absolute novacon:top-[2px] novacon:right-[2px] novacon:text-[var(--tuwa-text-secondary)] novacon:transition novacon:duration-300 novacon:ease-in-out novacon:active:scale-75 novacon:hover:scale-110 novacon:group-hover:text-[var(--tuwa-text-primary)]',
                )
              }
              onClick={handleInfoClick}
              href={infoLink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={
                customConfig?.ariaLabels?.infoLink
                  ? customConfig.ariaLabels.infoLink(cardData)
                  : `${labels.learnMore} ${labels.aboutWallets} ${title}`
              }
              cardData={cardData}
            >
              <InformationCircleIcon width={16} height={16} aria-hidden="true" />
            </CustomInfoLink>
          )}

          {isRecent && (
            <CustomRecentBadgeWrapper
              className={
                customization?.classNames?.recentBadgeWrapper?.({ cardData }) ??
                cn(
                  'novacon:absolute novacon:top-0.5 novacon:right-0.5 novacon:transition novacon:group-hover:opacity-0 novacon:group-hover:scale-90',
                )
              }
              aria-label={
                customConfig?.ariaLabels?.recentBadge
                  ? customConfig.ariaLabels.recentBadge(cardData)
                  : `${title} ${labels.recent}`
              }
              cardData={cardData}
            >
              <RecentBadge>{labels.recent}</RecentBadge>
            </CustomRecentBadgeWrapper>
          )}

          {!isTouch && (
            <CustomChevron
              className={
                customization?.classNames?.chevron?.({ cardData }) ??
                cn(
                  'novacon:w-5 novacon:h-5 novacon:transition novacon:duration-300 novacon:ease-in-out novacon:translate-x-[-10px] novacon:opacity-0 novacon:group-hover:translate-x-0 novacon:group-hover:opacity-100 novacon:text-[var(--tuwa-text-secondary)]',
                )
              }
              aria-hidden={true}
              cardData={cardData}
            >
              <ChevronRightIcon />
            </CustomChevron>
          )}
        </CustomContainer>
      );
    },
  ),
);

ConnectCard.displayName = 'ConnectCard';
