/**
 * @file ConnectorsSelections component with comprehensive customization options and categorized connector display.
 */

import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { cn, isTouchDevice } from '@tuwaio/nova-core';
import { formatWalletName, isSafeApp, OrbitAdapter } from '@tuwaio/orbit-core';
import React, { ComponentType, forwardRef, memo, useCallback, useMemo } from 'react';

import { ConnectContentType } from '../../hooks/useNovaConnect';
import { useNovaConnectLabels } from '../../hooks/useNovaConnectLabels';
import { InitialChains } from '../../types';
import { ConnectButtonProps } from '../ConnectButton/ConnectButton';
import { WalletIcon } from '../WalletIcon';
import { ConnectCard, ConnectCardCustomization } from './ConnectCard';
import { GroupedConnector } from './ConnectModal';
import { ConnectorsBlock, ConnectorsBlockCustomization } from './ConnectorsBlock';
import { Disclaimer } from './Disclaimer';

// --- Types ---

/**
 * Connector selections data for customization context
 */
export interface ConnectorsSelectionsData {
  /** Currently selected network adapter */
  selectedAdapter: OrbitAdapter | undefined;
  /** All available connectors */
  connectors: GroupedConnector[];
  /** Whether only one network is available */
  isOnlyOneNetwork: boolean;
  /** Whether device is touch-enabled */
  isTouch: boolean;
  /** Whether impersonated wallet is available */
  hasImpersonatedConnector: boolean;
  /** Whether impersonated section should be shown */
  showImpersonated: boolean;
  /** Filtered connector groups */
  connectorGroups: {
    installed: GroupedConnector[];
    popular: GroupedConnector[];
    impersonated?: GroupedConnector;
  };
  /** Current labels from i18n */
  labels: ReturnType<typeof useNovaConnectLabels>;
}

/**
 * Impersonate section data
 */
export interface ImpersonateSectionData {
  /** The impersonated wallet connector */
  connector: GroupedConnector;
  /** Whether device is touch-enabled */
  isTouch: boolean;
  /** Current labels from i18n */
  labels: ReturnType<typeof useNovaConnectLabels>;
  /** Section data for context */
  sectionsData: ConnectorsSelectionsData;
}

// --- Component Props Types ---
type ContainerProps = {
  className?: string;
  children: React.ReactNode;
  role?: string;
  'aria-label'?: string;
  selectionsData: ConnectorsSelectionsData;
} & React.RefAttributes<HTMLDivElement>;

type ContentWrapperProps = {
  className?: string;
  children: React.ReactNode;
  selectionsData: ConnectorsSelectionsData;
} & React.RefAttributes<HTMLDivElement>;

type ConnectorsAreaProps = {
  className?: string;
  children: React.ReactNode;
  role?: string;
  'aria-label'?: string;
  selectionsData: ConnectorsSelectionsData;
} & React.RefAttributes<HTMLDivElement>;

type ImpersonateSectionProps = {
  className?: string;
  children: React.ReactNode;
  role?: string;
  'aria-label'?: string;
  impersonateData: ImpersonateSectionData;
  selectionsData: ConnectorsSelectionsData;
} & React.RefAttributes<HTMLDivElement>;

type ImpersonateTitleProps = {
  className?: string;
  children: React.ReactNode;
  impersonateData: ImpersonateSectionData;
  selectionsData: ConnectorsSelectionsData;
} & React.RefAttributes<HTMLParagraphElement>;

type EmptyStateProps = {
  className?: string;
  children: React.ReactNode;
  role?: string;
  'aria-live'?: 'polite' | 'assertive' | 'off';
  onClick?: () => void;
  selectionsData: ConnectorsSelectionsData;
} & React.RefAttributes<HTMLDivElement>;

type DisclaimerSectionProps = {
  className?: string;
  children: React.ReactNode;
  selectionsData: ConnectorsSelectionsData;
} & React.RefAttributes<HTMLDivElement>;

/**
 * Customization options for ConnectorsSelections component
 */
export type ConnectorsSelectionsCustomization = {
  /** Custom components */
  components?: {
    /** Custom container wrapper */
    Container?: ComponentType<ContainerProps>;
    /** Custom content wrapper */
    ContentWrapper?: ComponentType<ContentWrapperProps>;
    /** Custom connectors area wrapper */
    ConnectorsArea?: ComponentType<ConnectorsAreaProps>;
    /** Custom impersonate section */
    ImpersonateSection?: ComponentType<ImpersonateSectionProps>;
    /** Custom impersonate title */
    ImpersonateTitle?: ComponentType<ImpersonateTitleProps>;
    /** Custom empty state */
    EmptyState?: ComponentType<EmptyStateProps>;
    /** Custom disclaimer section */
    DisclaimerSection?: ComponentType<DisclaimerSectionProps>;
  };
  /** Custom class name generators */
  classNames?: {
    /** Function to generate container classes */
    container?: (params: { selectionsData: ConnectorsSelectionsData }) => string;
    /** Function to generate content wrapper classes */
    contentWrapper?: (params: { selectionsData: ConnectorsSelectionsData }) => string;
    /** Function to generate connectors area classes */
    connectorsArea?: (params: { selectionsData: ConnectorsSelectionsData }) => string;
    /** Function to generate impersonate section classes */
    impersonateSection?: (params: {
      impersonateData: ImpersonateSectionData;
      selectionsData: ConnectorsSelectionsData;
    }) => string;
    /** Function to generate impersonate title classes */
    impersonateTitle?: (params: {
      impersonateData: ImpersonateSectionData;
      selectionsData: ConnectorsSelectionsData;
    }) => string;
    /** Function to generate empty state classes */
    emptyState?: (params: { selectionsData: ConnectorsSelectionsData }) => string;
    /** Function to generate disclaimer section classes */
    disclaimerSection?: (params: { selectionsData: ConnectorsSelectionsData }) => string;
  };
  /** Custom event handlers */
  handlers?: {
    /** Custom impersonate click handler */
    onImpersonateClick?: (
      impersonateData: ImpersonateSectionData,
      selectionsData: ConnectorsSelectionsData,
      originalHandler: () => void,
    ) => void;
    /** Custom empty state action handler */
    onEmptyStateAction?: (selectionsData: ConnectorsSelectionsData) => void;
  };
  /** Configuration options */
  config?: {
    /** Custom ARIA labels */
    ariaLabels?: {
      container?: (selectionsData: ConnectorsSelectionsData) => string;
      connectorsArea?: (selectionsData: ConnectorsSelectionsData) => string;
      impersonateSection?: (impersonateData: ImpersonateSectionData) => string;
    };
    /** Layout configuration */
    layout?: {
      /** Touch device classes for connectors area */
      touchConnectorsClasses?: string[];
      /** Mouse device classes for connectors area */
      mouseConnectorsClasses?: string[];
      /** Touch device classes for content wrapper */
      touchContentClasses?: string[];
      /** Mouse device classes for content wrapper */
      mouseContentClasses?: string[];
    };
    /** Show/hide features */
    features?: {
      /** Whether to show empty state */
      showEmptyState?: boolean;
      /** Whether to show disclaimer on touch devices */
      showDisclaimer?: boolean;
      /** Whether to show impersonate section */
      showImpersonate?: boolean;
    };
  };
  /** ConnectorsBlock customization for each connector block */
  connectorsBlock?: {
    /** Customization for installed connectors block */
    installed?: ConnectorsBlockCustomization;
    /** Customization for popular connectors block */
    popular?: ConnectorsBlockCustomization;
  };
  /** ConnectCard customization for impersonate card */
  impersonateCard?: ConnectCardCustomization;
};

/**
 * Props for the ConnectorsSelections component
 */
export interface ConnectorsSelectionsProps
  extends Pick<ConnectButtonProps, 'withImpersonated' | 'store'>,
    InitialChains {
  /** Currently selected network adapter */
  selectedAdapter: OrbitAdapter | undefined;
  /** Array of grouped wallet connectors */
  connectors: GroupedConnector[];
  /** Click handler for connector selection */
  onClick: (connector: GroupedConnector) => void;
  /** Function to set connection status */
  setIsConnected: (value: boolean) => void;
  /** Function to control modal open state */
  setIsOpen: (value: boolean) => void;
  /** Function to wait for connection prediction */
  waitForPredict: () => boolean | undefined;
  /** Function to set modal content type */
  setContentType: (contentType: ConnectContentType) => void;
  /** Whether only one network is available */
  isOnlyOneNetwork?: boolean;
  /** Customization options */
  customization?: ConnectorsSelectionsCustomization;
}

// --- Default Sub-Components ---
const DefaultContainer = forwardRef<HTMLDivElement, ContainerProps>(({ children, className, ...props }, ref) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { selectionsData: _selectionsData, ...restProps } = props;
  return (
    <div ref={ref} className={className} {...restProps}>
      {children}
    </div>
  );
});
DefaultContainer.displayName = 'DefaultContainer';

const DefaultContentWrapper = forwardRef<HTMLDivElement, ContentWrapperProps>(
  ({ children, className, ...props }, ref) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { selectionsData: _selectionsData, ...restProps } = props;
    return (
      <div ref={ref} className={className} {...restProps}>
        {children}
      </div>
    );
  },
);
DefaultContentWrapper.displayName = 'DefaultContentWrapper';

const DefaultConnectorsArea = forwardRef<HTMLDivElement, ConnectorsAreaProps>(
  ({ children, className, ...props }, ref) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { selectionsData: _selectionsData, ...restProps } = props;
    return (
      <div ref={ref} className={className} {...restProps}>
        {children}
      </div>
    );
  },
);
DefaultConnectorsArea.displayName = 'DefaultConnectorsArea';

const DefaultImpersonateSection = forwardRef<HTMLDivElement, ImpersonateSectionProps>(
  ({ children, className, ...props }, ref) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { impersonateData: _impersonateData, selectionsData: _selectionsData, ...restProps } = props;
    return (
      <div ref={ref} className={className} {...restProps}>
        {children}
      </div>
    );
  },
);
DefaultImpersonateSection.displayName = 'DefaultImpersonateSection';

const DefaultImpersonateTitle = forwardRef<HTMLParagraphElement, ImpersonateTitleProps>(
  ({ children, className, ...props }, ref) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { impersonateData: _impersonateData, selectionsData: _selectionsData, ...restProps } = props;
    return (
      <p ref={ref} className={className} {...restProps}>
        {children}
      </p>
    );
  },
);
DefaultImpersonateTitle.displayName = 'DefaultImpersonateTitle';

const DefaultEmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(({ children, className, ...props }, ref) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { selectionsData: _selectionsData, onClick, ...restProps } = props;
  return (
    <div ref={ref} className={className} {...restProps} onClick={onClick}>
      {children}
    </div>
  );
});
DefaultEmptyState.displayName = 'DefaultEmptyState';

const DefaultDisclaimerSection = forwardRef<HTMLDivElement, DisclaimerSectionProps>(
  ({ children, className, ...props }, ref) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { selectionsData: _selectionsData, ...restProps } = props;
    return (
      <div ref={ref} className={className} {...restProps}>
        {children}
      </div>
    );
  },
);
DefaultDisclaimerSection.displayName = 'DefaultDisclaimerSection';

/**
 * ConnectorsSelections component - Main wallet selection interface with categorized connectors
 *
 * This component provides the primary wallet selection interface with:
 * - Categorized wallet sections (Installed, Popular, Impersonate)
 * - Responsive layout adapting to touch/mouse interfaces
 * - Safe App environment detection and filtering
 * - Empty state handling for missing connectors
 * - Educational content integration for touch devices
 * - Full accessibility support with semantic structure
 * - Complete customization of all child components and styling
 *
 * Wallet categorization:
 * - Installed: Detected browser extension wallets (excluding popular ones)
 * - Popular: Coinbase Wallet and WalletConnect for broader compatibility
 * - Impersonate: Development/testing wallet for address simulation
 * - Safe App filtering: Conditional Safe Wallet display based on environment
 *
 * Layout features:
 * - Touch devices: Horizontal scrolling with educational disclaimer
 * - Mouse devices: Vertical scrolling with fixed height container
 * - Responsive grid adapting to screen size and device capabilities
 * - Custom scrollbar styling with NovaCustomScroll class
 * - Customizable layout parameters and responsive behavior
 *
 * Empty state handling:
 * - Clear error messaging when no connectors found
 * - Contextual help text explaining the issue
 * - Visual indicators with warning icons
 * - Proper error state accessibility
 * - Customizable empty state content and styling
 *
 * Accessibility features:
 * - Semantic HTML structure with proper headings
 * - ARIA labels for screen readers
 * - Role-based navigation support
 * - Focus management for keyboard users
 * - Error states with descriptive messaging
 * - Customizable ARIA labels and descriptions
 *
 * @example Basic usage
 * ```tsx
 * <ConnectorsSelections
 *   selectedAdapter={OrbitAdapter.EVM}
 *   connectors={availableConnectors}
 *   onClick={(connector) => handleWalletSelection(connector)}
 *   setIsConnected={setConnectionStatus}
 *   setIsOpen={setModalOpen}
 *   waitForPredict={() => checkConnectionState()}
 *   setContentType={setModalContent}
 *   withImpersonated={true}
 *   isOnlyOneNetwork={false}
 *   appChains={chainConfiguration}
 *   solanaRPCUrls={solanaConfig}
 *   store={walletStore}
 * />
 * ```
 *
 * @example With full customization
 * ```tsx
 * <ConnectorsSelections
 *   selectedAdapter={undefined}
 *   connectors={allConnectors}
 *   onClick={(connector) => initiateConnection(connector)}
 *   setIsConnected={updateConnectionState}
 *   setIsOpen={toggleModal}
 *   waitForPredict={predictConnection}
 *   setContentType={changeContent}
 *   withImpersonated={false}
 *   isOnlyOneNetwork={true}
 *   customization={{
 *     components: {
 *       Container: CustomSelectionsContainer,
 *       EmptyState: CustomEmptyStateComponent
 *     },
 *     classNames: {
 *       connectorsArea: ({ selectionsData }) =>
 *         selectionsData.isTouch ? 'horizontal-scroll' : 'vertical-stack',
 *       impersonateSection: ({ impersonateData }) =>
 *         impersonateData.isTouch ? 'touch-impersonate' : 'mouse-impersonate'
 *     },
 *     handlers: {
 *       onImpersonateClick: (impersonateData, selectionsData, originalHandler) => {
 *         analytics.track('impersonate_clicked');
 *         originalHandler();
 *       }
 *     },
 *     connectorsBlock: {
 *       installed: {
 *         classNames: {
 *           title: () => 'custom-installed-title'
 *         }
 *       }
 *     }
 *   }}
 * />
 * ```
 */
export const ConnectorsSelections = memo(
  forwardRef<HTMLDivElement, ConnectorsSelectionsProps>(
    (
      {
        setIsConnected,
        setIsOpen,
        selectedAdapter,
        connectors,
        onClick,
        appChains,
        solanaRPCUrls,
        waitForPredict,
        setContentType,
        withImpersonated,
        isOnlyOneNetwork = false,
        store,
        customization,
      },
      ref,
    ) => {
      // Extract customization options
      const {
        Container: CustomContainer = DefaultContainer,
        ContentWrapper: CustomContentWrapper = DefaultContentWrapper,
        ConnectorsArea: CustomConnectorsArea = DefaultConnectorsArea,
        ImpersonateSection: CustomImpersonateSection = DefaultImpersonateSection,
        ImpersonateTitle: CustomImpersonateTitle = DefaultImpersonateTitle,
        EmptyState: CustomEmptyState = DefaultEmptyState,
        DisclaimerSection: CustomDisclaimerSection = DefaultDisclaimerSection,
      } = customization?.components ?? {};

      const customHandlers = customization?.handlers;
      const customConfig = customization?.config;

      /**
       * Memoized labels and touch detection
       */
      const labels = useNovaConnectLabels();
      const isTouch = useMemo(() => isTouchDevice(), []);

      /**
       * Memoized connector filtering
       */
      const connectorGroups = useMemo(() => {
        const installedConnectorsInitial = connectors.filter((group) => {
          const formattedName = formatWalletName(group.name);
          return (
            formattedName !== 'impersonatedwallet' &&
            formattedName !== 'coinbasewallet' &&
            formattedName !== 'walletconnect'
          );
        });

        const installedConnectors = isSafeApp
          ? installedConnectorsInitial
          : installedConnectorsInitial.filter((group) => formatWalletName(group.name) !== 'safewallet');

        const popularConnectors = connectors.filter((group) => {
          const formattedName = formatWalletName(group.name);
          return formattedName === 'coinbasewallet' || formattedName === 'walletconnect';
        });

        const impersonatedConnector = connectors.find((group) => formatWalletName(group.name) === 'impersonatedwallet');

        return {
          installed: installedConnectors,
          popular: popularConnectors,
          impersonated: impersonatedConnector,
        };
      }, [connectors]);

      /**
       * Memoized selections data
       */
      const selectionsData = useMemo(
        (): ConnectorsSelectionsData => ({
          selectedAdapter,
          connectors,
          isOnlyOneNetwork,
          isTouch,
          hasImpersonatedConnector: Boolean(connectorGroups.impersonated),
          showImpersonated: Boolean(connectorGroups.impersonated && withImpersonated),
          connectorGroups,
          labels,
        }),
        [selectedAdapter, connectors, isOnlyOneNetwork, isTouch, connectorGroups, withImpersonated, labels],
      );

      /**
       * Memoized impersonate section data
       */
      const impersonateData = useMemo((): ImpersonateSectionData | undefined => {
        if (!connectorGroups.impersonated) return undefined;

        return {
          connector: connectorGroups.impersonated,
          isTouch,
          labels,
          sectionsData: selectionsData,
        };
      }, [connectorGroups.impersonated, isTouch, labels, selectionsData]);

      /**
       * Memoized layout classes
       */
      const layoutClasses = useMemo(() => {
        const touchConnectorsClasses = customConfig?.layout?.touchConnectorsClasses ?? [
          'novacon:flex-row',
          'novacon:overflow-x-auto',
          'novacon:max-h-none',
          'novacon:gap-3',
          'novacon:pb-4',
          'novacon:px-1',
        ];

        const mouseConnectorsClasses = customConfig?.layout?.mouseConnectorsClasses ?? [
          'novacon:flex-col',
          'novacon:overflow-y-auto',
          'novacon:max-h-[310px]',
          'novacon:gap-2',
        ];

        const touchContentClasses = customConfig?.layout?.touchContentClasses ?? [
          'novacon:flex',
          'novacon:flex-col',
          'novacon:gap-2',
          'novacon:flex-row',
        ];

        const mouseContentClasses = customConfig?.layout?.mouseContentClasses ?? [
          'novacon:flex',
          'novacon:flex-col',
          'novacon:gap-2',
        ];

        return {
          touchConnectorsClasses,
          mouseConnectorsClasses,
          touchContentClasses,
          mouseContentClasses,
        };
      }, [customConfig?.layout]);

      /**
       * Handles click on impersonated wallet option
       */
      const handleImpersonateClick = useCallback(() => {
        if (!connectorGroups.impersonated) return;
        onClick(connectorGroups.impersonated);
      }, [connectorGroups.impersonated, onClick]);

      /**
       * Wrapper for custom impersonate click handler
       */
      const handleImpersonateClickWrapper = useCallback(() => {
        if (!impersonateData) return;

        if (customHandlers?.onImpersonateClick) {
          customHandlers.onImpersonateClick(impersonateData, selectionsData, handleImpersonateClick);
        } else {
          handleImpersonateClick();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [customHandlers?.onImpersonateClick, impersonateData, selectionsData, handleImpersonateClick]);

      /**
       * Memoized CSS classes
       */
      const cssClasses = useMemo(
        () => ({
          container:
            customization?.classNames?.container?.({ selectionsData }) ?? 'novacon:flex novacon:flex-col novacon:gap-4',

          contentWrapper:
            customization?.classNames?.contentWrapper?.({ selectionsData }) ??
            cn(isTouch ? layoutClasses.touchContentClasses : layoutClasses.mouseContentClasses),

          connectorsArea:
            customization?.classNames?.connectorsArea?.({ selectionsData }) ??
            cn(
              'novacon:flex NovaCustomScroll',
              isTouch ? layoutClasses.touchConnectorsClasses : layoutClasses.mouseConnectorsClasses,
            ),

          impersonateSection:
            (impersonateData && customization?.classNames?.impersonateSection?.({ impersonateData, selectionsData })) ??
            cn({ 'novacon:flex novacon:flex-col novacon:gap-2': isTouch }),

          impersonateTitle:
            (impersonateData && customization?.classNames?.impersonateTitle?.({ impersonateData, selectionsData })) ??
            cn('novacon:text-sm novacon:hidden', { 'novacon:block novacon:opacity-0': isTouch }),

          emptyState:
            customization?.classNames?.emptyState?.({ selectionsData }) ??
            'novacon:flex novacon:flex-col novacon:items-center novacon:justify-center novacon:p-8 novacon:text-center novacon:border novacon:border-[var(--tuwa-border-primary)] novacon:rounded-xl novacon:bg-[var(--tuwa-bg-secondary)] novacon:text-[var(--tuwa-text-secondary)]',

          disclaimerSection: customization?.classNames?.disclaimerSection?.({ selectionsData }) ?? '',
        }),
        [customization?.classNames, selectionsData, impersonateData, isTouch, layoutClasses],
      );

      // Early return for empty state
      if (selectedAdapter && !connectors?.length) {
        if (customConfig?.features?.showEmptyState === false) {
          return null;
        }

        return (
          <CustomEmptyState
            ref={ref}
            className={cssClasses.emptyState}
            role="alert"
            aria-live="polite"
            selectionsData={selectionsData}
            onClick={
              customHandlers?.onEmptyStateAction ? () => customHandlers.onEmptyStateAction!(selectionsData) : undefined
            }
          >
            <ExclamationTriangleIcon
              width={32}
              height={32}
              className="novacon:text-[var(--tuwa-text-accent)] novacon:mb-3"
              aria-hidden="true"
            />
            <h2 className="novacon:text-lg novacon:font-semibold novacon:text-[var(--tuwa-text-primary)] novacon:mb-1">
              {labels.noConnectorsFound}
            </h2>
            <p className="novacon:text-sm">{labels.noConnectorsDescription}</p>
          </CustomEmptyState>
        );
      }

      const containerAriaLabel = customConfig?.ariaLabels?.container?.(selectionsData) ?? labels.connectWallet;
      const connectorsAreaAriaLabel =
        customConfig?.ariaLabels?.connectorsArea?.(selectionsData) ?? 'Available wallet connectors';
      const impersonateAriaLabel =
        (impersonateData && customConfig?.ariaLabels?.impersonateSection?.(impersonateData)) ?? labels.impersonate;

      return (
        <CustomContainer
          ref={ref}
          className={cssClasses.container}
          role="region"
          aria-label={containerAriaLabel}
          selectionsData={selectionsData}
        >
          <CustomContentWrapper className={cssClasses.contentWrapper} selectionsData={selectionsData}>
            <CustomConnectorsArea
              className={cssClasses.connectorsArea}
              role="region"
              aria-label={connectorsAreaAriaLabel}
              selectionsData={selectionsData}
            >
              <ConnectorsBlock
                connectors={connectorGroups.installed}
                title={labels.installed}
                selectedAdapter={selectedAdapter}
                onClick={onClick}
                waitForPredict={waitForPredict}
                solanaRPCUrls={solanaRPCUrls}
                setIsConnected={setIsConnected}
                setIsOpen={setIsOpen}
                appChains={appChains}
                isOnlyOneNetwork={isOnlyOneNetwork}
                isTitleBold
                store={store}
                customization={customization?.connectorsBlock?.installed}
              />
              {!!connectorGroups.popular.length && (
                <ConnectorsBlock
                  connectors={connectorGroups.popular}
                  title={labels.popular}
                  selectedAdapter={selectedAdapter}
                  onClick={onClick}
                  waitForPredict={waitForPredict}
                  solanaRPCUrls={solanaRPCUrls}
                  setIsConnected={setIsConnected}
                  setIsOpen={setIsOpen}
                  appChains={appChains}
                  isOnlyOneNetwork={isOnlyOneNetwork}
                  store={store}
                  customization={customization?.connectorsBlock?.popular}
                />
              )}
            </CustomConnectorsArea>

            {selectionsData.showImpersonated &&
              impersonateData &&
              customConfig?.features?.showImpersonate !== false && (
                <CustomImpersonateSection
                  className={cssClasses.impersonateSection}
                  role="region"
                  aria-label={impersonateAriaLabel}
                  impersonateData={impersonateData}
                  selectionsData={selectionsData}
                >
                  <CustomImpersonateTitle
                    className={cssClasses.impersonateTitle}
                    impersonateData={impersonateData}
                    selectionsData={selectionsData}
                  >
                    {labels.impersonate}
                  </CustomImpersonateTitle>
                  <ConnectCard
                    icon={<WalletIcon name="impersonatedwallet" />}
                    adapters={!selectedAdapter ? [OrbitAdapter.EVM] : undefined}
                    onClick={handleImpersonateClickWrapper}
                    title={labels.impersonate}
                    subtitle={labels.readOnlyMode}
                    isOnlyOneNetwork={isOnlyOneNetwork}
                    customization={customization?.impersonateCard}
                  />
                </CustomImpersonateSection>
              )}
          </CustomContentWrapper>

          {isTouch && customConfig?.features?.showDisclaimer !== false && (
            <CustomDisclaimerSection className={cssClasses.disclaimerSection} selectionsData={selectionsData}>
              <Disclaimer
                title={labels.whatIsWallet}
                description={labels.walletDescription}
                learnMoreAction={() => setContentType('about')}
              />
            </CustomDisclaimerSection>
          )}
        </CustomContainer>
      );
    },
  ),
);

ConnectorsSelections.displayName = 'ConnectorsSelections';
