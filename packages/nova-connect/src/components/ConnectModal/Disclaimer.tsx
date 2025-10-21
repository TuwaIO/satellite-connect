/**
 * @file Disclaimer component with comprehensive customization options.
 */

import { cn, standardButtonClasses } from '@tuwaio/nova-core';
import React, { ComponentType, forwardRef, useCallback, useId, useMemo } from 'react';

import { useNovaConnectLabels } from '../../hooks/useNovaConnectLabels';

// --- Types ---
/**
 * Type definition for button actions
 * Can be either a URL string for external links or a callback function
 */
type ButtonAction = string | (() => void);

// --- Component Props Types ---
type ContainerProps = {
  className?: string;
  children: React.ReactNode;
  role?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
  'data-testid'?: string;
  'aria-live'?: 'polite' | 'assertive' | 'off';
} & React.RefAttributes<HTMLDivElement>;

type ContentSectionProps = {
  className?: string;
  children: React.ReactNode;
  role?: string;
  'aria-labelledby'?: string;
};

type TitleProps = {
  id: string;
  className?: string;
  children: React.ReactNode;
  role?: string;
  'aria-level'?: number;
};

type DescriptionProps = {
  id: string;
  className?: string;
  children: React.ReactNode;
  role?: string;
};

type AdditionalContentProps = {
  className?: string;
  children: React.ReactNode;
  role?: string;
  'aria-label'?: string;
};

type ActionsProps = {
  className?: string;
  children: React.ReactNode;
  role?: string;
  'aria-label'?: string;
};

type ButtonProps = {
  action: ButtonAction;
  children: React.ReactNode;
  'aria-label'?: string;
  className?: string;
  'data-testid'?: string;
};

type StatusProps = {
  className?: string;
  children?: React.ReactNode;
  'aria-live'?: 'polite' | 'assertive' | 'off';
  'aria-atomic'?: boolean;
  role?: string;
};

/**
 * Customization options for Disclaimer component
 */
export type DisclaimerCustomization = {
  /** Custom components */
  components?: {
    /** Custom container wrapper */
    Container?: ComponentType<ContainerProps>;
    /** Custom content section */
    ContentSection?: ComponentType<ContentSectionProps>;
    /** Custom title component */
    Title?: ComponentType<TitleProps>;
    /** Custom description component */
    Description?: ComponentType<DescriptionProps>;
    /** Custom additional content wrapper */
    AdditionalContent?: ComponentType<AdditionalContentProps>;
    /** Custom actions section */
    Actions?: ComponentType<ActionsProps>;
    /** Custom link button */
    LinkButton?: ComponentType<ButtonProps>;
    /** Custom action button */
    ActionButton?: ComponentType<ButtonProps>;
    /** Custom status component */
    Status?: ComponentType<StatusProps>;
  };
  /** Custom class name generators */
  classNames?: {
    /** Function to generate container classes */
    container?: (params: { compact: boolean }) => string;
    /** Function to generate content section classes */
    contentSection?: (params: { compact: boolean }) => string;
    /** Function to generate title classes */
    title?: (params: { compact: boolean }) => string;
    /** Function to generate description classes */
    description?: () => string;
    /** Function to generate additional content classes */
    additionalContent?: () => string;
    /** Function to generate actions classes */
    actions?: () => string;
    /** Function to generate button classes */
    button?: (params: { isLink: boolean; isPrimary: boolean }) => string;
    /** Function to generate status classes */
    status?: () => string;
  };
  /** Custom event handlers */
  handlers?: {
    /** Custom handler for primary button action */
    onLearnMoreAction?: () => void;
    /** Custom handler for secondary button action */
    onListAction?: () => void;
    /** Custom handler for component mount */
    onMount?: () => void;
    /** Custom handler for component unmount */
    onUnmount?: () => void;
  };
  /** Configuration options */
  config?: {
    /** Custom button labels */
    buttonLabels?: {
      learnMore?: string;
      listAction?: string;
    };
    /** Custom ARIA labels */
    ariaLabels?: {
      container?: string;
      contentSection?: string;
      actions?: string;
      additionalContent?: string;
    };
  };
};

/**
 * Props for the Disclaimer component
 */
export interface DisclaimerProps {
  /** Main title text for the disclaimer */
  title: string;
  /** Descriptive text explaining the disclaimer content */
  description: string;
  /** Action for the primary "Learn More" button - can be URL or callback */
  learnMoreAction: ButtonAction;
  /** Optional action for the secondary "List of Networks" button */
  listAction?: ButtonAction;
  /** Custom CSS classes for styling the disclaimer container */
  className?: string;
  /** Optional custom ARIA label for enhanced accessibility */
  'aria-label'?: string;
  /** Whether to show the disclaimer in compact mode */
  compact?: boolean;
  /** Additional content to display below the description */
  children?: React.ReactNode;
  /** Custom test ID for testing purposes */
  'data-testid'?: string;
  /** Whether the disclaimer should be announced to screen readers */
  announceToScreenReader?: boolean;
  /** Customization options */
  customization?: DisclaimerCustomization;
}

/**
 * Type guard to determine if action is a URL string
 * @param action - The action to check
 * @returns True if action is a string (URL), false if it's a function
 */
const isLink = (action: ButtonAction): action is string => typeof action === 'string';

// --- Default Sub-Components ---
const DefaultContainer = forwardRef<HTMLDivElement, ContainerProps>(({ children, className, ...props }, ref) => (
  <div ref={ref} className={className} {...props}>
    {children}
  </div>
));
DefaultContainer.displayName = 'DefaultContainer';

const DefaultContentSection: React.FC<ContentSectionProps> = ({ children, className, ...props }) => (
  <div className={className} {...props}>
    {children}
  </div>
);

const DefaultTitle: React.FC<TitleProps> = ({ children, className, ...props }) => (
  <h3 className={className} {...props}>
    {children}
  </h3>
);

const DefaultDescription: React.FC<DescriptionProps> = ({ children, className, ...props }) => (
  <p className={className} {...props}>
    {children}
  </p>
);

const DefaultAdditionalContent: React.FC<AdditionalContentProps> = ({ children, className, ...props }) => (
  <div className={className} {...props}>
    {children}
  </div>
);

const DefaultActions: React.FC<ActionsProps> = ({ children, className, ...props }) => (
  <div className={className} {...props}>
    {children}
  </div>
);

const DefaultLinkButton: React.FC<ButtonProps> = ({
  action,
  children,
  'aria-label': ariaLabel,
  className,
  'data-testid': testId,
}) => {
  const labels = useNovaConnectLabels();

  // Type guard to ensure action is string for href
  if (!isLink(action)) {
    console.error('LinkButton received non-string action:', action);
    return null;
  }

  return (
    <a
      href={action}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      aria-label={ariaLabel || `${children} (${labels.learnMore})`}
      data-testid={testId}
      role="button"
    >
      {children}
      {/* Screen reader indication for external link */}
      <span className="novacon:sr-only"> (opens in new tab)</span>
    </a>
  );
};

const DefaultActionButton: React.FC<ButtonProps> = ({
  action,
  children,
  'aria-label': ariaLabel,
  className,
  'data-testid': testId,
}) => {
  const handleClick = useCallback(() => {
    if (typeof action === 'function') {
      action();
    }
  }, [action]);

  return (
    <button type="button" onClick={handleClick} className={className} aria-label={ariaLabel} data-testid={testId}>
      {children}
    </button>
  );
};

const DefaultStatus: React.FC<StatusProps> = ({ children, className, ...props }) => (
  <div className={className} {...props}>
    {children}
  </div>
);

/**
 * Educational disclaimer component with call-to-action buttons
 *
 * This component provides educational content with actionable buttons for:
 * - Informational disclaimers about wallets, networks, or other concepts
 * - Educational content with "Learn More" functionality
 * - Network information with optional "List of Networks" access
 * - Responsive layout with proper spacing and visual hierarchy
 * - Full WCAG accessibility compliance with screen reader support
 * - Keyboard navigation with proper focus management
 * - Semantic HTML structure with comprehensive ARIA labeling
 * - Internationalization support for button labels
 * - Support for both internal callbacks and external links
 * - Flexible content areas with optional children support
 * - Full customization of all child components
 *
 * The component automatically handles different action types:
 * - **String actions**: Rendered as external links with security attributes
 * - **Function actions**: Rendered as buttons with callback execution
 * - **Mixed actions**: Can combine both types for different buttons
 *
 * @example Basic usage
 * ```tsx
 * <Disclaimer
 *   title="What is a wallet?"
 *   description="Wallets are essential for managing your crypto..."
 *   learnMoreAction={() => setContentType('about')}
 *   listAction="https://example.com/networks"
 * />
 * ```
 *
 * @example With customization
 * ```tsx
 * <Disclaimer
 *   title="Network Information"
 *   description="Choose the right network for your transactions"
 *   learnMoreAction={handleLearnMore}
 *   compact
 *   customization={{
 *     classNames: {
 *       container: ({ compact }) => compact ? 'custom-compact' : 'custom-full',
 *       title: () => 'custom-title-styling'
 *     },
 *     components: {
 *       LinkButton: CustomLinkButton
 *     }
 *   }}
 * />
 * ```
 */
export const Disclaimer = forwardRef<HTMLDivElement, DisclaimerProps>(
  (
    {
      title,
      description,
      learnMoreAction,
      listAction,
      className,
      'aria-label': ariaLabel,
      compact = false,
      children,
      'data-testid': testId,
      announceToScreenReader = false,
      customization,
    },
    ref,
  ) => {
    // Get localized labels for UI text
    const labels = useNovaConnectLabels();

    // Generate unique ID using React's useId hook
    const uniqueId = useId();

    // Extract customization options
    const {
      Container: CustomContainer = DefaultContainer,
      ContentSection: CustomContentSection = DefaultContentSection,
      Title: CustomTitle = DefaultTitle,
      Description: CustomDescription = DefaultDescription,
      AdditionalContent: CustomAdditionalContent = DefaultAdditionalContent,
      Actions: CustomActions = DefaultActions,
      LinkButton: CustomLinkButton = DefaultLinkButton,
      ActionButton: CustomActionButton = DefaultActionButton,
      Status: CustomStatus = DefaultStatus,
    } = customization?.components ?? {};

    const customHandlers = customization?.handlers;
    const customConfig = customization?.config;

    /**
     * Memoized container classes based on compact mode
     */
    const containerClasses = useMemo(
      () =>
        cn(
          customization?.classNames?.container?.({ compact }) ??
            cn(
              'novacon:p-2 novacon:rounded-xl novacon:border novacon:border-[var(--tuwa-border-primary)] novacon:flex novacon:flex-col',
              compact
                ? 'novacon:gap-2 novacon:sm:p-3 novacon:sm:gap-3'
                : 'novacon:gap-2 novacon:sm:p-4 novacon:sm:gap-4',
            ),
          className,
        ),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [compact, className, customization?.classNames?.container],
    );

    /**
     * Memoized content classes based on compact mode
     */
    const contentClasses = useMemo(
      () =>
        customization?.classNames?.contentSection?.({ compact }) ??
        cn('novacon:flex novacon:flex-col', compact ? 'novacon:gap-1' : 'novacon:gap-2'),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [compact, customization?.classNames?.contentSection],
    );

    /**
     * Memoized title classes based on compact mode
     */
    const titleClasses = useMemo(
      () =>
        customization?.classNames?.title?.({ compact }) ??
        cn(
          'novacon:font-bold novacon:text-[var(--tuwa-text-primary)]',
          compact ? 'novacon:text-base' : 'novacon:text-lg',
        ),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [compact, customization?.classNames?.title],
    );

    /**
     * Generate unique ID for the disclaimer content using React's useId
     */
    const disclaimerId = useMemo(() => {
      const sanitizedTitle = title.toLowerCase().replace(/\s+/g, '-');
      return `disclaimer-${sanitizedTitle}-${uniqueId}`;
    }, [title, uniqueId]);

    /**
     * Generate button test IDs based on main test ID
     */
    const buttonTestIds = useMemo(
      () => ({
        learnMore: testId ? `${testId}-learn-more` : undefined,
        listAction: testId ? `${testId}-list-action` : undefined,
      }),
      [testId],
    );

    /**
     * Handle rendering of action buttons with proper type checking
     */
    const renderActionButton = useCallback(
      (action: ButtonAction, buttonText: string, ariaLabel: string, testId?: string, isPrimary = false) => {
        const isLinkAction = isLink(action);
        const buttonClasses = cn(
          customization?.classNames?.button?.({ isLink: isLinkAction, isPrimary }) ?? standardButtonClasses,
        );

        if (isLinkAction) {
          return (
            <CustomLinkButton action={action} aria-label={ariaLabel} data-testid={testId} className={buttonClasses}>
              {buttonText}
            </CustomLinkButton>
          );
        } else {
          return (
            <CustomActionButton action={action} aria-label={ariaLabel} data-testid={testId} className={buttonClasses}>
              {buttonText}
            </CustomActionButton>
          );
        }
      },
      [customization, CustomLinkButton, CustomActionButton],
    );

    // Handle mount/unmount effects
    React.useEffect(() => {
      customHandlers?.onMount?.();
      return () => customHandlers?.onUnmount?.();
    }, [customHandlers]);

    return (
      <CustomContainer
        ref={ref}
        className={containerClasses}
        role="complementary"
        aria-label={customConfig?.ariaLabels?.container ?? ariaLabel ?? `${title} disclaimer`}
        aria-describedby={`${disclaimerId}-description`}
        data-testid={testId}
        {...(announceToScreenReader && { 'aria-live': 'polite' as const })}
      >
        {/* Content Section */}
        <CustomContentSection className={contentClasses} role="group" aria-labelledby={`${disclaimerId}-title`}>
          {/* Title */}
          <CustomTitle id={`${disclaimerId}-title`} className={titleClasses} role="heading" aria-level={3}>
            {title}
          </CustomTitle>

          {/* Description */}
          <CustomDescription
            id={`${disclaimerId}-description`}
            className={
              customization?.classNames?.description?.() ?? 'novacon:text-sm novacon:text-[var(--tuwa-text-secondary)]'
            }
            role="text"
          >
            {description}
          </CustomDescription>

          {/* Additional Content */}
          {children && (
            <CustomAdditionalContent
              className={customization?.classNames?.additionalContent?.() ?? 'novacon:mt-1'}
              role="group"
              aria-label={customConfig?.ariaLabels?.additionalContent ?? 'Additional disclaimer information'}
            >
              {children}
            </CustomAdditionalContent>
          )}
        </CustomContentSection>

        {/* Actions Section */}
        <CustomActions
          className={customization?.classNames?.actions?.() ?? 'novacon:flex novacon:gap-3 novacon:justify-end'}
          role="group"
          aria-label={customConfig?.ariaLabels?.actions ?? 'Disclaimer actions'}
        >
          {/* Primary Learn More Button */}
          {renderActionButton(
            learnMoreAction,
            customConfig?.buttonLabels?.learnMore ?? labels.learnMore,
            `${customConfig?.buttonLabels?.learnMore ?? labels.learnMore} about ${title.toLowerCase()}`,
            buttonTestIds.learnMore,
            true,
          )}

          {/* Optional Secondary Action Button */}
          {listAction &&
            renderActionButton(
              listAction,
              customConfig?.buttonLabels?.listAction ?? labels.listOfNetworks,
              `View ${(customConfig?.buttonLabels?.listAction ?? labels.listOfNetworks).toLowerCase()}`,
              buttonTestIds.listAction,
              false,
            )}
        </CustomActions>

        {/* Screen reader summary */}
        <CustomStatus className={customization?.classNames?.status?.() ?? 'novacon:sr-only'}>
          Disclaimer about {title.toLowerCase()}. {description}
          {learnMoreAction && ` ${customConfig?.buttonLabels?.learnMore ?? labels.learnMore} action available.`}
          {listAction && ` ${customConfig?.buttonLabels?.listAction ?? labels.listOfNetworks} action available.`}
        </CustomStatus>

        {/* Hidden live region for dynamic content updates */}
        {announceToScreenReader && (
          <CustomStatus
            className={customization?.classNames?.status?.() ?? 'novacon:sr-only'}
            aria-live="polite"
            aria-atomic={true}
            role="status"
          >
            {/* This will announce content changes to screen readers */}
          </CustomStatus>
        )}
      </CustomContainer>
    );
  },
);

Disclaimer.displayName = 'Disclaimer';
