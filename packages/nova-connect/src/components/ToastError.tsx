/**
 * @file This file contains the `ToastError` component, a customizable error toast with full styling control.
 */

import { DocumentDuplicateIcon } from '@heroicons/react/24/solid';
import { cn, useCopyToClipboard } from '@tuwaio/nova-core';
import { ComponentPropsWithoutRef, ComponentType, forwardRef, ReactNode, useCallback, useMemo, useState } from 'react';

import { useNovaConnectLabels } from '../hooks/useNovaConnectLabels';

// --- Types for Customization ---
type CustomIconProps = {
  isCopied: boolean;
  className?: string;
  style?: React.CSSProperties;
  'aria-hidden'?: boolean;
};

type CustomTitleProps = {
  title: string;
  titleId: string;
  className?: string;
  style?: React.CSSProperties;
};

type CustomDescriptionProps = {
  rawError: string;
  descriptionId: string;
  className?: string;
  style?: React.CSSProperties;
};

type CustomButtonContentProps = {
  icon: ReactNode;
  isCopied: boolean;
  copyLabel: string;
  copiedLabel: string;
};

/**
 * Customization options for ToastError component
 */
export type ToastErrorCustomization = {
  /** Override container element props */
  containerProps?: Partial<ComponentPropsWithoutRef<'div'>>;
  /** Override button element props */
  buttonProps?: Partial<ComponentPropsWithoutRef<'button'>>;
  /** Custom components */
  components?: {
    /** Custom icon component */
    Icon?: ComponentType<CustomIconProps>;
    /** Custom title component */
    Title?: ComponentType<CustomTitleProps>;
    /** Custom description component */
    Description?: ComponentType<CustomDescriptionProps>;
    /** Custom button content component */
    ButtonContent?: ComponentType<CustomButtonContentProps>;
  };
  /** Custom class name generators */
  classNames?: {
    /** Function to generate container classes */
    container?: (params: { hasTitle: boolean; hasError: boolean }) => string;
    /** Function to generate title classes */
    title?: (params: { title: string }) => string;
    /** Function to generate description classes */
    description?: (params: { rawError: string }) => string;
    /** Function to generate button classes */
    button?: (params: { isCopied: boolean; disabled: boolean }) => string;
    /** Function to generate icon classes */
    icon?: (params: { isCopied: boolean }) => string;
  };
  /** Custom style generators */
  styles?: {
    /** Function to generate container styles */
    container?: (params: { hasTitle: boolean; hasError: boolean }) => React.CSSProperties;
    /** Function to generate title styles */
    title?: (params: { title: string }) => React.CSSProperties;
    /** Function to generate description styles */
    description?: (params: { rawError: string }) => React.CSSProperties;
    /** Function to generate button styles */
    button?: (params: { isCopied: boolean; disabled: boolean }) => React.CSSProperties;
    /** Function to generate icon styles */
    icon?: (params: { isCopied: boolean }) => React.CSSProperties;
  };
  /** Custom event handlers */
  handlers?: {
    /** Custom click handler wrapper */
    onClick?: (
      originalHandler: (event: React.MouseEvent<HTMLButtonElement>) => void,
      event: React.MouseEvent<HTMLButtonElement>,
    ) => void;
    /** Custom keydown handler wrapper */
    onKeyDown?: (
      originalHandler: (event: React.KeyboardEvent<HTMLButtonElement>) => void,
      event: React.KeyboardEvent<HTMLButtonElement>,
    ) => void;
  };
};

export interface ToastErrorProps extends Omit<ComponentPropsWithoutRef<'div'>, 'role' | 'aria-live'> {
  /** Error title to display */
  title: string;
  /** Raw error message to display and copy */
  rawError: string;
  /** Custom CSS classes for the container */
  className?: string;
  /** Custom ARIA label for the error container */
  'aria-label'?: string;
  /** Callback fired when copy operation completes */
  onCopyComplete?: (success: boolean) => void;
  /** Customization options */
  customization?: ToastErrorCustomization;
}

// --- Default Sub-Components ---
const DefaultIcon = ({ isCopied, className, style, ...props }: CustomIconProps) => {
  return (
    <DocumentDuplicateIcon
      className={cn(
        'novacon:w-4 novacon:h-4 novacon:transition-colors',
        isCopied && 'novacon:text-[var(--tuwa-success-text)]',
        className,
      )}
      style={style}
      {...props}
    />
  );
};

const DefaultTitle = ({ title, titleId, className, style }: CustomTitleProps) => {
  return (
    <p
      id={titleId}
      className={cn(
        'novacon:text-sm novacon:font-semibold novacon:truncate novacon:text-[var(--tuwa-error-text)]',
        className,
      )}
      style={style}
      role="heading"
      aria-level={3}
      title={title} // Show full title on hover if truncated
    >
      {title}
    </p>
  );
};

const DefaultDescription = ({ rawError, descriptionId, className, style }: CustomDescriptionProps) => {
  return (
    <p
      id={descriptionId}
      className={cn(
        'novacon:mt-1 novacon:text-xs novacon:break-words novacon:text-[var(--tuwa-error-text)] novacon:opacity-80',
        className,
      )}
      style={style}
      role="text"
    >
      {rawError}
    </p>
  );
};

const DefaultButtonContent = ({ icon, isCopied, copyLabel, copiedLabel }: CustomButtonContentProps) => {
  return (
    <>
      {icon}
      <span className="novacon:select-none novacon:transition-colors" aria-live="polite" role="status">
        {isCopied ? copiedLabel : copyLabel}
      </span>
    </>
  );
};

// --- Default Event Handlers ---
const defaultClickHandler = (
  originalHandler: (event: React.MouseEvent<HTMLButtonElement>) => void,
  event: React.MouseEvent<HTMLButtonElement>,
) => {
  originalHandler(event);
};

const defaultKeyDownHandler = (
  originalHandler: (event: React.KeyboardEvent<HTMLButtonElement>) => void,
  event: React.KeyboardEvent<HTMLButtonElement>,
) => {
  originalHandler(event);
};

// Counter for unique IDs (outside component to avoid re-initialization)
let idCounter = 0;

/**
 * A highly customizable error toast component with copy functionality and extensive styling options.
 * Provides comprehensive customization for appearance, behavior, and event handling while maintaining accessibility.
 */
export const ToastError = forwardRef<HTMLDivElement, ToastErrorProps>(
  ({ title, rawError, className, 'aria-label': ariaLabel, onCopyComplete, customization, ...props }, ref) => {
    const labels = useNovaConnectLabels();
    const { isCopied, copy } = useCopyToClipboard();

    // Generate unique IDs only once per component instance
    const [uniqueId] = useState(() => {
      idCounter += 1;
      return `${idCounter}-${Date.now()}`;
    });

    const titleId = `error-title-${uniqueId}`;
    const descriptionId = `error-description-${uniqueId}`;

    // Extract custom components and handlers
    const {
      Icon = DefaultIcon,
      Title = DefaultTitle,
      Description = DefaultDescription,
      ButtonContent = DefaultButtonContent,
    } = customization?.components ?? {};

    const {
      onClick: customOnClickHandler = defaultClickHandler,
      onKeyDown: customOnKeyDownHandler = defaultKeyDownHandler,
    } = customization?.handlers ?? {};

    // Memoize error text for copying
    const errorToCopy = useMemo(() => rawError, [rawError]);

    // Handle copy with error handling and callback
    const handleCopy = useCallback(
      async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        e.preventDefault();

        try {
          await copy(errorToCopy);
          onCopyComplete?.(true);
        } catch (error) {
          console.error('Failed to copy error:', error);
          onCopyComplete?.(false);
        }
      },
      [copy, errorToCopy, onCopyComplete],
    );

    // Handle keyboard interaction for copy button
    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLButtonElement>) => {
        const originalHandler = (event: React.KeyboardEvent<HTMLButtonElement>) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            // Create a synthetic mouse event for onClick compatibility
            const syntheticEvent = {
              ...event,
              button: 0,
              buttons: 1,
              clientX: 0,
              clientY: 0,
              movementX: 0,
              movementY: 0,
              offsetX: 0,
              offsetY: 0,
              pageX: 0,
              pageY: 0,
              relatedTarget: null,
              screenX: 0,
              screenY: 0,
              x: 0,
              y: 0,
              getModifierState: () => false,
              initMouseEvent: () => {},
            };
            // eslint-disable-next-line
            handleCopy(syntheticEvent as any);
          }
        };

        customOnKeyDownHandler(originalHandler, e);
      },
      [customOnKeyDownHandler, handleCopy],
    );

    // Generate container classes
    const containerClasses = useMemo(() => {
      if (customization?.classNames?.container) {
        return customization.classNames.container({ hasTitle: Boolean(title), hasError: Boolean(rawError) });
      }

      return cn(
        'novacon:bg-[var(--tuwa-bg-primary)] novacon:p-4 novacon:rounded-md novacon:w-full',
        'novacon:border novacon:border-[var(--tuwa-border-primary)]',
        className,
      );
    }, [customization, title, rawError, className]);

    // Generate title classes
    const titleClasses = useMemo(() => {
      if (customization?.classNames?.title) {
        return customization.classNames.title({ title });
      }

      return undefined; // Let DefaultTitle handle its own classes
    }, [customization, title]);

    // Generate description classes
    const descriptionClasses = useMemo(() => {
      if (customization?.classNames?.description) {
        return customization.classNames.description({ rawError });
      }

      return undefined; // Let DefaultDescription handle its own classes
    }, [customization, rawError]);

    // Generate button classes
    const buttonClasses = useMemo(() => {
      const disabled = !errorToCopy.trim();
      if (customization?.classNames?.button) {
        return customization.classNames.button({ isCopied, disabled });
      }

      return cn(
        'novacon:cursor-pointer novacon:mt-2 novacon:text-xs novacon:font-medium novacon:inline-flex novacon:items-center novacon:space-x-1.5',
        'novacon:focus:outline-none novacon:focus:ring-2 novacon:focus:ring-[var(--tuwa-error-text)] novacon:focus:ring-opacity-50',
        'novacon:rounded-md novacon:px-2 novacon:py-1 novacon:transition-all novacon:duration-200',
        'novacon:hover:bg-[var(--tuwa-error-text)] novacon:hover:bg-opacity-10',
        'novacon:active:bg-[var(--tuwa-error-text)] novacon:active:bg-opacity-20',
        'novacon:text-[var(--tuwa-error-text)] novacon:hover:text-[var(--tuwa-error-text)]',
        isCopied &&
          'novacon:bg-[var(--tuwa-success-text)] novacon:bg-opacity-10 novacon:text-[var(--tuwa-success-text)]',
      );
    }, [customization, isCopied, errorToCopy]);

    // Generate icon classes
    const iconClasses = useMemo(() => {
      if (customization?.classNames?.icon) {
        return customization.classNames.icon({ isCopied });
      }

      return undefined; // Let DefaultIcon handle its own classes
    }, [customization, isCopied]);

    // Generate container styles
    const containerStyles = useMemo(() => {
      if (customization?.styles?.container) {
        return customization.styles.container({ hasTitle: Boolean(title), hasError: Boolean(rawError) });
      }

      return undefined;
    }, [customization, title, rawError]);

    // Generate title styles
    const titleStyles = useMemo(() => {
      if (customization?.styles?.title) {
        return customization.styles.title({ title });
      }

      return undefined;
    }, [customization, title]);

    // Generate description styles
    const descriptionStyles = useMemo(() => {
      if (customization?.styles?.description) {
        return customization.styles.description({ rawError });
      }

      return undefined;
    }, [customization, rawError]);

    // Generate button styles
    const buttonStyles = useMemo(() => {
      const disabled = !errorToCopy.trim();
      if (customization?.styles?.button) {
        return customization.styles.button({ isCopied, disabled });
      }

      return undefined;
    }, [customization, isCopied, errorToCopy]);

    // Generate icon styles
    const iconStyles = useMemo(() => {
      if (customization?.styles?.icon) {
        return customization.styles.icon({ isCopied });
      }

      return undefined;
    }, [customization, isCopied]);

    // Create icon element
    const iconElement = useMemo(
      () => <Icon isCopied={isCopied} className={iconClasses} style={iconStyles} aria-hidden />,
      [Icon, isCopied, iconClasses, iconStyles],
    );

    // Merge container props
    const containerProps = useMemo(
      () => ({
        ...customization?.containerProps,
        ...props,
        ref,
        className: containerClasses,
        style: { ...containerStyles, ...customization?.containerProps?.style, ...props.style },
        role: 'alert' as const,
        'aria-live': 'assertive' as const,
        'aria-labelledby': titleId,
        'aria-describedby': descriptionId,
        'aria-label': ariaLabel,
      }),
      [customization?.containerProps, props, ref, containerClasses, containerStyles, titleId, descriptionId, ariaLabel],
    );

    // Merge button props
    const buttonProps = useMemo(
      () => ({
        ...customization?.buttonProps,
        onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
          customOnClickHandler(handleCopy, e);
        },
        onKeyDown: handleKeyDown,
        className: buttonClasses,
        style: { ...buttonStyles, ...customization?.buttonProps?.style },
        type: 'button' as const,
        'aria-label': isCopied ? `${labels.copied} ${labels.copyRawError}` : labels.copyRawError,
        'aria-describedby': `${titleId} ${descriptionId}`,
        disabled: !errorToCopy.trim(),
      }),
      [
        customization?.buttonProps,
        customOnClickHandler,
        handleCopy,
        handleKeyDown,
        buttonClasses,
        buttonStyles,
        isCopied,
        labels.copied,
        labels.copyRawError,
        titleId,
        descriptionId,
        errorToCopy,
      ],
    );

    return (
      <div {...containerProps}>
        {/* Error Title */}
        <Title title={title} titleId={titleId} className={titleClasses} style={titleStyles} />

        {/* Error Description */}
        <Description
          rawError={rawError}
          descriptionId={descriptionId}
          className={descriptionClasses}
          style={descriptionStyles}
        />

        {/* Copy Button */}
        <button {...buttonProps}>
          <ButtonContent
            icon={iconElement}
            isCopied={isCopied}
            copyLabel={labels.copyRawError}
            copiedLabel={labels.copied}
          />
        </button>
      </div>
    );
  },
);

ToastError.displayName = 'ToastError';
