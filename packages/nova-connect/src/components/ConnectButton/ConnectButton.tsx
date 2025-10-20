import { cn } from '@tuwaio/nova-core';
import { Transaction, TransactionPool, TxAdapter } from '@tuwaio/pulsar-core';
import { motion } from 'framer-motion';
import React, { ComponentPropsWithoutRef, ComponentType, forwardRef, memo, useCallback, useMemo } from 'react';

import { NovaConnectProviderProps, useNovaConnect } from '../../hooks/useNovaConnect';
import { useNovaConnectLabels } from '../../hooks/useNovaConnectLabels';
import { InitialChains } from '../../types';
import { ChainSelector, ChainSelectorCustomization } from '../Chains/ChainSelector';
import { ConnectedModal, ConnectedModalCustomization } from '../ConnectedModal/ConnectedModal';
import { ConnectModal, ConnectModalCustomization } from '../ConnectModal/ConnectModal';
import { ConnectedContent, ConnectedContentCustomization } from './ConnectedContent';
import { WaitForConnectionContent, WaitForConnectionContentCustomization } from './WaitForConnectionContent';

/**
 * Connect button data for customization context
 */
export interface ConnectButtonData {
  /** Whether wallet is connected */
  isConnected: boolean;
  /** Whether balance should be shown */
  withBalance?: boolean;
  /** Whether chain selector should be shown */
  withChain?: boolean;
  /** Whether impersonated wallets are enabled */
  withImpersonated?: boolean;
  /** Current labels from i18n */
  labels: ReturnType<typeof useNovaConnectLabels>;
  /** Active wallet information */
  activeWallet: ReturnType<typeof useNovaConnect>['activeWallet'];
}

// --- Component Props Types ---
type NavigationProps = {
  className?: string;
  children: React.ReactNode;
  'aria-label'?: string;
  role?: string;
  buttonData: ConnectButtonData;
} & React.RefAttributes<HTMLElement>;

type ContainerProps = {
  className?: string;
  children: React.ReactNode;
  buttonData: ConnectButtonData;
} & React.RefAttributes<HTMLDivElement>;

type ButtonContainerProps = {
  className?: string;
  children: React.ReactNode;
  buttonData: ConnectButtonData;
} & React.RefAttributes<HTMLDivElement>;

type ButtonProps = {
  className?: string;
  children: React.ReactNode;
  onClick: () => void;
  onKeyDown: (event: React.KeyboardEvent) => void;
  'aria-label'?: string;
  'aria-pressed'?: boolean;
  disabled?: boolean;
  buttonData: ConnectButtonData;
} & React.RefAttributes<HTMLButtonElement>;

/**
 * Customization options for ConnectButton component
 */
export type ConnectButtonCustomization = {
  /** Custom components */
  components?: {
    /** Custom navigation wrapper */
    Navigation?: ComponentType<NavigationProps>;
    /** Custom container div */
    Container?: ComponentType<ContainerProps>;
    /** Custom button container with motion */
    ButtonContainer?: ComponentType<ButtonContainerProps>;
    /** Custom button element */
    Button?: ComponentType<ButtonProps>;
    /** Custom motion div */
    MotionDiv?: ComponentType<ComponentPropsWithoutRef<typeof motion.div>>;
  };
  /** Custom class name generators */
  classNames?: {
    /** Function to generate navigation classes */
    navigation?: (params: { buttonData: ConnectButtonData }) => string;
    /** Function to generate container classes */
    container?: (params: { buttonData: ConnectButtonData }) => string;
    /** Function to generate button container classes */
    buttonContainer?: (params: { buttonData: ConnectButtonData }) => string;
    /** Function to generate button classes */
    button?: (params: { buttonData: ConnectButtonData }) => string;
  };
  /** Custom event handlers */
  handlers?: {
    /** Custom button click handler */
    onButtonClick?: (buttonData: ConnectButtonData, originalHandler: () => void) => void;
    /** Custom key down handler */
    onKeyDown?: (
      event: React.KeyboardEvent,
      buttonData: ConnectButtonData,
      originalHandler: (event: React.KeyboardEvent) => void,
    ) => void;
  };
  /** Configuration options */
  config?: {
    /** Custom ARIA labels */
    ariaLabels?: {
      navigation?: (buttonData: ConnectButtonData) => string;
      button?: (buttonData: ConnectButtonData) => string;
    };
    /** Animation configuration */
    animation?: {
      /** Layout transition duration */
      layoutDuration?: number;
      /** Layout transition easing */
      layoutEase?: [number, number, number, number];
      /** Disable animations */
      disabled?: boolean;
    };
  };
  /** Child component customizations */
  childComponents?: {
    /** ChainSelector customization */
    chainSelector?: ChainSelectorCustomization;
    /** ConnectedContent customization */
    connectedContent?: ConnectedContentCustomization;
    /** WaitForConnectionContent customization */
    waitForConnectionContent?: WaitForConnectionContentCustomization;
    /** ConnectModal customization */
    connectModal?: ConnectModalCustomization;
    /** ConnectedModal customization */
    connectedModal?: ConnectedModalCustomization;
  };
};

// --- Default Sub-Components ---
const DefaultNavigation = forwardRef<HTMLElement, NavigationProps>(
  ({ className, children, buttonData, ...props }, ref) => (
    <nav ref={ref} role="navigation" aria-label={buttonData.labels.walletControls} className={className} {...props}>
      {children}
    </nav>
  ),
);
DefaultNavigation.displayName = 'DefaultNavigation';

const DefaultContainer = forwardRef<HTMLDivElement, ContainerProps>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ({ className, children, buttonData, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('novacon:flex novacon:items-center novacon:gap-2 novacon:sm:gap-3', className)}
      {...props}
    >
      {children}
    </div>
  ),
);
DefaultContainer.displayName = 'DefaultContainer';

const DefaultButtonContainer = forwardRef<HTMLDivElement, ButtonContainerProps>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ({ className, children, buttonData, ...props }, ref) => (
    <div ref={ref} className={cn('novacon:relative', className)} {...props}>
      {children}
    </div>
  ),
);
DefaultButtonContainer.displayName = 'DefaultButtonContainer';

const DefaultButton = forwardRef<HTMLButtonElement, ButtonProps>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ({ className, children, onClick, onKeyDown, buttonData, disabled, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      onKeyDown={onKeyDown}
      disabled={disabled}
      className={className}
      role="button"
      tabIndex={0}
      {...props}
    >
      {children}
    </button>
  ),
);
DefaultButton.displayName = 'DefaultButton';

/**
 * Base props for ConnectButton component
 */
export type ConnectButtonProps = InitialChains &
  Pick<NovaConnectProviderProps, 'store'> & {
    /** CSS classes to apply to the button */
    className?: string;
    /** Transaction pool for pending transactions display */
    transactionPool?: TransactionPool<Transaction>;
    /** Pulsar adapter(s) for transaction handling */
    pulsarAdapter?: TxAdapter<Transaction> | TxAdapter<Transaction>[];
    /** Show wallet balance in button */
    withBalance?: boolean;
    /** Show chain selector when connected */
    withChain?: boolean;
    /** Enable impersonated wallet functionality */
    withImpersonated?: boolean;
    /** Customization options */
    customization?: ConnectButtonCustomization;
  };

/**
 * ConnectButton component - Main wallet connection button with full customization
 *
 * This component provides a comprehensive wallet connection interface with:
 * - Connect/disconnect wallet functionality
 * - Balance display when connected
 * - Chain selector for multi-network support
 * - Transaction pool integration
 * - Impersonated wallet support
 * - Full accessibility features
 * - Comprehensive customization system
 *
 * Features:
 * - Responsive design with smooth animations
 * - Keyboard navigation support
 * - Screen reader compatibility
 * - Proper ARIA labels and roles
 * - Loading states and error handling
 * - Memoized performance optimizations
 *
 * Accessibility:
 * - Semantic HTML structure with proper roles
 * - ARIA labels for screen readers
 * - Keyboard navigation with Enter and Space
 * - Focus management and visual indicators
 * - High contrast compatible styling
 *
 * @param appChains - Configuration for supported blockchain networks
 * @param solanaRPCUrls - RPC URLs configuration for Solana network
 * @param store - Wallet store instance
 * @param className - Additional CSS classes for the button
 * @param transactionPool - Transaction pool for pending transactions
 * @param pulsarAdapter - Pulsar adapter(s) for transaction handling
 * @param withBalance - Whether to show wallet balance
 * @param withChain - Whether to show chain selector
 * @param withImpersonated - Whether to enable impersonated wallets
 * @param customization - Customization options
 * @returns JSX element representing the connection button
 *
 * @example
 * ```tsx
 * <ConnectButton
 *   appChains={{
 *     [OrbitAdapter.EVM]: [1, 137, 56],
 *     [OrbitAdapter.SOLANA]: ['mainnet-beta', 'devnet']
 *   }}
 *   solanaRPCUrls={{
 *     'mainnet-beta': 'https://api.mainnet-beta.solana.com'
 *   }}
 *   store={walletStore}
 *   withBalance
 *   withChain
 *   withImpersonated
 *   customization={{
 *     classNames: {
 *       button: ({ buttonData }) =>
 *         buttonData.isConnected ? 'custom-connected-style' : 'custom-disconnected-style'
 *     }
 *   }}
 * />
 * ```
 *
 * @public
 */
export const ConnectButton = memo<ConnectButtonProps>(
  ({
    solanaRPCUrls,
    appChains,
    transactionPool,
    pulsarAdapter,
    withImpersonated,
    withBalance,
    withChain,
    store,
    className,
    customization = {},
  }) => {
    const labels = useNovaConnectLabels();
    const { setIsConnectedModalOpen, setIsConnectModalOpen, activeWallet } = useNovaConnect();

    const isConnected = useMemo(() => Boolean(activeWallet?.isConnected), [activeWallet?.isConnected]);

    // Memoize button data for customization context
    const buttonData = useMemo<ConnectButtonData>(
      () => ({
        isConnected,
        withBalance,
        withChain,
        withImpersonated,
        labels,
        activeWallet,
      }),
      [isConnected, withBalance, withChain, withImpersonated, labels, activeWallet],
    );

    // Extract customization options
    const { components = {}, classNames = {}, handlers = {}, config = {}, childComponents = {} } = customization;

    // Component selections with defaults
    const Navigation = components.Navigation || DefaultNavigation;
    const Container = components.Container || DefaultContainer;
    const ButtonContainer = components.ButtonContainer || DefaultButtonContainer;
    const Button = components.Button || DefaultButton;
    const CustomMotionDiv = components.MotionDiv || motion.div;

    /**
     * Handle button click with custom handler support
     */
    const handleConnectButtonClick = useCallback(() => {
      const originalHandler = () => {
        if (isConnected) {
          setIsConnectedModalOpen(true);
        } else {
          setIsConnectModalOpen(true);
        }
      };

      if (handlers.onButtonClick) {
        handlers.onButtonClick(buttonData, originalHandler);
      } else {
        originalHandler();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isConnected, buttonData]);

    /**
     * Handle key down events with custom handler support
     */
    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent) => {
        const originalHandler = (e: React.KeyboardEvent) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleConnectButtonClick();
          }
        };

        if (handlers.onKeyDown) {
          handlers.onKeyDown(event, buttonData, originalHandler);
        } else {
          originalHandler(event);
        }
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [handleConnectButtonClick, buttonData],
    );

    // Memoize button aria-label for better performance
    const buttonAriaLabel = useMemo(() => {
      if (config.ariaLabels?.button) {
        return config.ariaLabels.button(buttonData);
      }

      if (isConnected) {
        return `${labels.walletConnected}. ${labels.openWalletModal}`;
      }
      return `${labels.walletNotConnected}. ${labels.connectWallet}`;
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isConnected, labels, config.ariaLabels?.button, buttonData]);

    // Memoize navigation aria-label
    const navigationAriaLabel = useMemo(() => {
      if (config.ariaLabels?.navigation) {
        return config.ariaLabels.navigation(buttonData);
      }
      return labels.walletControls;
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [labels, config.ariaLabels?.navigation, buttonData]);

    // Memoize button class names for better performance
    const buttonClasses = useMemo(() => {
      const customClasses = classNames.button?.({ buttonData });
      if (customClasses) return customClasses;

      return cn(
        'novacon:cursor-pointer novacon:inline-flex novacon:items-center novacon:justify-center novacon:gap-2 novacon:px-3 novacon:min-h-[42px] novacon:py-1',
        'novacon:rounded-xl novacon:font-medium novacon:text-sm novacon:transition-all novacon:duration-200',
        'novacon:hover:scale-[1.02] novacon:active:scale-[0.98]',
        'novacon:focus:outline-none novacon:focus:ring-2 novacon:focus:ring-offset-2',
        'novacon:focus:ring-offset-[var(--tuwa-bg-primary)]',
        'novacon:disabled:opacity-50 novacon:disabled:cursor-not-allowed novacon:disabled:hover:scale-100',
        isConnected
          ? [
              'novacon:bg-[var(--tuwa-bg-secondary)]',
              'novacon:text-[var(--tuwa-text-primary)]',
              'novacon:hover:bg-[var(--tuwa-bg-muted)]',
              'novacon:focus:ring-[var(--tuwa-text-secondary)]',
              'novacon:border novacon:border-[var(--tuwa-border-primary)]',
            ]
          : [
              'novacon:bg-gradient-to-r',
              'novacon:from-[var(--tuwa-button-gradient-from)]',
              'novacon:to-[var(--tuwa-button-gradient-to)]',
              'novacon:text-[var(--tuwa-text-on-accent)]',
              'novacon:hover:from-[var(--tuwa-button-gradient-from-hover)]',
              'novacon:hover:to-[var(--tuwa-button-gradient-to-hover)]',
              'novacon:focus:ring-[var(--tuwa-text-accent)]',
            ],
        className,
      );
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isConnected, className, classNames.button, buttonData]);

    // Memoize animation configuration
    const animationConfig = useMemo(() => {
      if (config.animation?.disabled) {
        return {};
      }

      return {
        layout: true,
        transition: {
          layout: {
            duration: config.animation?.layoutDuration ?? 0.2,
            ease: config.animation?.layoutEase ?? [0.1, 0.1, 0.2, 1],
          },
        },
      };
    }, [config.animation?.disabled, config.animation?.layoutDuration, config.animation?.layoutEase]);

    return (
      <Navigation
        className={classNames.navigation?.({ buttonData })}
        aria-label={navigationAriaLabel}
        buttonData={buttonData}
      >
        <Container className={classNames.container?.({ buttonData })} buttonData={buttonData}>
          {/* Chain Selector - only show when connected and withChain is enabled */}
          {withChain && isConnected && (
            <ChainSelector
              store={store}
              appChains={appChains}
              solanaRPCUrls={solanaRPCUrls}
              customization={childComponents.chainSelector}
            />
          )}

          {/* Main Connect Button */}
          <CustomMotionDiv {...animationConfig}>
            <ButtonContainer className={classNames.buttonContainer?.({ buttonData })} buttonData={buttonData}>
              <Button
                onClick={handleConnectButtonClick}
                onKeyDown={handleKeyDown}
                className={buttonClasses}
                aria-label={buttonAriaLabel}
                aria-pressed={isConnected}
                buttonData={buttonData}
              >
                {isConnected ? (
                  <ConnectedContent
                    store={store}
                    withBalance={withBalance}
                    transactionPool={transactionPool}
                    customization={childComponents.connectedContent}
                  />
                ) : (
                  <WaitForConnectionContent customization={childComponents.waitForConnectionContent} />
                )}
              </Button>
            </ButtonContainer>
          </CustomMotionDiv>

          {/* Hidden modals - these will be shown based on application state */}
          <ConnectModal
            store={store}
            withImpersonated={withImpersonated}
            solanaRPCUrls={solanaRPCUrls}
            appChains={appChains}
            customization={childComponents.connectModal}
          />
          <ConnectedModal
            solanaRPCUrls={solanaRPCUrls}
            appChains={appChains}
            transactionPool={transactionPool}
            pulsarAdapter={pulsarAdapter}
            store={store}
            customization={childComponents.connectedModal}
          />
        </Container>
      </Navigation>
    );
  },
);

ConnectButton.displayName = 'ConnectButton';
