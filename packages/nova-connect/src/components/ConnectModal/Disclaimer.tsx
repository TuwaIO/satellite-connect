import { cn, standardButtonClasses } from '@tuwaio/nova-core';
import React, { useCallback, useId, useMemo } from 'react';

import { useNovaConnectLabels } from '../../hooks/useNovaConnectLabels';

/**
 * Type definition for button actions
 * Can be either a URL string for external links or a callback function
 */
type ButtonAction = string | (() => void);

/**
 * Props for the Disclaimer component
 */
interface DisclaimerProps {
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
}

/**
 * Props for internal button components
 */
interface ButtonProps {
  /** The action to execute - URL or callback function */
  action: ButtonAction;
  /** Button content/label */
  children: React.ReactNode;
  /** Optional ARIA label for enhanced accessibility */
  'aria-label'?: string;
  /** Custom CSS classes for button styling */
  className?: string;
  /** Custom test ID for testing purposes */
  'data-testid'?: string;
}

/**
 * Type guard to determine if action is a URL string
 * @param action - The action to check
 * @returns True if action is a string (URL), false if it's a function
 */
const isLink = (action: ButtonAction): action is string => typeof action === 'string';

/**
 * Link button component for external URLs
 * Renders an anchor tag with proper security attributes for external links
 *
 * @param action - URL to navigate to
 * @param children - Button content
 * @param aria-label - Optional ARIA label for accessibility
 * @param className - Custom CSS classes
 * @param data-testid - Test ID for testing
 * @returns JSX element representing an external link button
 */
const LinkButton: React.FC<ButtonProps> = ({
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
      className={cn(standardButtonClasses, className)}
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

/**
 * Action button component for callback functions
 * Renders a button element that executes a provided callback
 *
 * @param action - Callback function to execute
 * @param children - Button content
 * @param aria-label - Optional ARIA label for accessibility
 * @param className - Custom CSS classes
 * @param data-testid - Test ID for testing
 * @returns JSX element representing an action button
 */
const ActionButton: React.FC<ButtonProps> = ({
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
    <button
      type="button"
      onClick={handleClick}
      className={cn(standardButtonClasses, className)}
      aria-label={ariaLabel}
      data-testid={testId}
    >
      {children}
    </button>
  );
};

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
 *
 * The component automatically handles different action types:
 * - **String actions**: Rendered as external links with security attributes
 * - **Function actions**: Rendered as buttons with callback execution
 * - **Mixed actions**: Can combine both types for different buttons
 *
 * Layout features:
 * - Responsive design with mobile-first approach
 * - Proper visual hierarchy with title and description
 * - Right-aligned action buttons for clear call-to-action
 * - Compact mode for space-constrained layouts
 * - Custom styling support via className prop
 *
 * Accessibility features:
 * - Semantic HTML with proper heading structure
 * - Comprehensive ARIA labeling for screen readers
 * - Keyboard navigation support for all interactive elements
 * - External link indication for screen readers
 * - Optional live region announcements
 * - High contrast compatible styling
 *
 * @param title - Main heading text for the disclaimer
 * @param description - Explanatory text providing context
 * @param learnMoreAction - Primary action (URL or callback) for learning more
 * @param listAction - Optional secondary action for additional resources
 * @param className - Custom CSS classes for container styling
 * @param aria-label - Custom ARIA label for enhanced accessibility
 * @param compact - Whether to use compact spacing and layout
 * @param children - Additional content to display below description
 * @param data-testid - Test identifier for testing purposes
 * @param announceToScreenReader - Whether to announce content changes
 * @returns JSX element displaying the educational disclaimer
 *
 * @example
 * ```tsx
 * <Disclaimer
 *   title="What is a wallet?"
 *   description="Wallets are essential for managing your crypto..."
 *   learnMoreAction={() => setContentType('about')}
 *   listAction="https://example.com/networks"
 * />
 * ```
 *
 * @example
 * ```tsx
 * // With custom styling and accessibility features
 * <Disclaimer
 *   title="Network Information"
 *   description="Choose the right network for your transactions"
 *   learnMoreAction={handleLearnMore}
 *   compact
 *   className="custom-disclaimer-styling"
 *   aria-label="Network selection guidance"
 *   data-testid="network-disclaimer"
 *   announceToScreenReader
 * >
 *   <div className="mt-2">
 *     <p className="text-xs text-gray-500">
 *       Additional network-specific information
 *     </p>
 *   </div>
 * </Disclaimer>
 * ```
 *
 * @example
 * ```tsx
 * // Educational content with external links
 * <Disclaimer
 *   title="Security Notice"
 *   description="Always verify wallet authenticity before connecting"
 *   learnMoreAction="https://docs.example.com/security"
 *   listAction="https://example.com/approved-wallets"
 * />
 * ```
 *
 * @public
 */
export function Disclaimer({
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
}: DisclaimerProps) {
  // Get localized labels for UI text
  const labels = useNovaConnectLabels();

  // Generate unique ID using React's useId hook
  const uniqueId = useId();

  /**
   * Memoized container classes based on compact mode
   */
  const containerClasses = useMemo(
    () =>
      cn(
        'novacon:p-2 novacon:rounded-xl novacon:border novacon:border-[var(--tuwa-border-primary)] novacon:flex novacon:flex-col',
        compact ? 'novacon:gap-2 novacon:sm:p-3 novacon:sm:gap-3' : 'novacon:gap-2 novacon:sm:p-4 novacon:sm:gap-4',
        className,
      ),
    [compact, className],
  );

  /**
   * Memoized content classes based on compact mode
   */
  const contentClasses = useMemo(
    () => cn('novacon:flex novacon:flex-col', compact ? 'novacon:gap-1' : 'novacon:gap-2'),
    [compact],
  );

  /**
   * Memoized title classes based on compact mode
   */
  const titleClasses = useMemo(
    () =>
      cn(
        'novacon:font-bold novacon:text-[var(--tuwa-text-primary)]',
        compact ? 'novacon:text-base' : 'novacon:text-lg',
      ),
    [compact],
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
    (action: ButtonAction, buttonText: string, ariaLabel: string, testId?: string) => {
      if (isLink(action)) {
        return (
          <LinkButton action={action} aria-label={ariaLabel} data-testid={testId}>
            {buttonText}
          </LinkButton>
        );
      } else {
        return (
          <ActionButton action={action} aria-label={ariaLabel} data-testid={testId}>
            {buttonText}
          </ActionButton>
        );
      }
    },
    [],
  );

  return (
    <div
      className={containerClasses}
      role="complementary"
      aria-label={ariaLabel || `${title} disclaimer`}
      aria-describedby={`${disclaimerId}-description`}
      data-testid={testId}
      {...(announceToScreenReader && { 'aria-live': 'polite' as const })}
    >
      {/* Content Section */}
      <div className={contentClasses} role="group" aria-labelledby={`${disclaimerId}-title`}>
        {/* Title */}
        <h3 id={`${disclaimerId}-title`} className={titleClasses} role="heading" aria-level={3}>
          {title}
        </h3>

        {/* Description */}
        <p
          id={`${disclaimerId}-description`}
          className="novacon:text-sm novacon:text-[var(--tuwa-text-secondary)]"
          role="text"
        >
          {description}
        </p>

        {/* Additional Content */}
        {children && (
          <div className="novacon:mt-1" role="group" aria-label="Additional disclaimer information">
            {children}
          </div>
        )}
      </div>

      {/* Actions Section */}
      <div className="novacon:flex novacon:gap-3 novacon:justify-end" role="group" aria-label="Disclaimer actions">
        {/* Primary Learn More Button */}
        {renderActionButton(
          learnMoreAction,
          labels.learnMore,
          `${labels.learnMore} about ${title.toLowerCase()}`,
          buttonTestIds.learnMore,
        )}

        {/* Optional Secondary Action Button */}
        {listAction &&
          renderActionButton(
            listAction,
            labels.listOfNetworks,
            `View ${labels.listOfNetworks.toLowerCase()}`,
            buttonTestIds.listAction,
          )}
      </div>

      {/* Screen reader summary */}
      <div className="novacon:sr-only">
        Disclaimer about {title.toLowerCase()}. {description}
        {learnMoreAction && ` ${labels.learnMore} action available.`}
        {listAction && ` ${labels.listOfNetworks} action available.`}
      </div>

      {/* Hidden live region for dynamic content updates */}
      {announceToScreenReader && (
        <div className="novacon:sr-only" aria-live="polite" aria-atomic="true" role="status">
          {/* This will announce content changes to screen readers */}
        </div>
      )}
    </div>
  );
}
