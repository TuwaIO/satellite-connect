/**
 * @file This file contains the `ToTopButton` component, a customizable scroll-to-top button with full styling control.
 */

import { ChevronUpIcon } from '@heroicons/react/24/solid';
import { cn } from '@tuwaio/nova-core';
import { ComponentPropsWithoutRef, ComponentType, forwardRef, ReactNode, useCallback, useMemo } from 'react';

import { useNovaConnectLabels } from '../hooks/useNovaConnectLabels';

// --- Types for Customization ---
type CustomIconProps = {
  disabled: boolean;
  className?: string;
  'aria-hidden'?: boolean;
};

type CustomContentProps = {
  icon: ReactNode;
  disabled: boolean;
  ariaLabel?: string;
};

/**
 * Customization options for ToTopButton component
 */
export type ToTopButtonCustomization = {
  /** Override button element props */
  buttonProps?: Partial<ComponentPropsWithoutRef<'button'>>;
  /** Custom components */
  components?: {
    /** Custom icon component */
    Icon?: ComponentType<CustomIconProps>;
    /** Custom button content component (wraps the icon) */
    Content?: ComponentType<CustomContentProps>;
  };
  /** Custom class name generators */
  classNames?: {
    /** Function to generate button classes */
    button?: (params: { disabled: boolean; hasOnClick: boolean }) => string;
    /** Function to generate icon classes */
    icon?: (params: { disabled: boolean }) => string;
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

export interface ToTopButtonProps
  extends Omit<ComponentPropsWithoutRef<'button'>, 'type' | 'onClick' | 'onKeyDown' | 'style'> {
  /** Custom CSS classes for the button */
  className?: string;
  /** Custom aria-label for the button */
  'aria-label'?: string;
  /** Callback fired when button is clicked */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /** Whether the button is disabled */
  disabled?: boolean;
  /** Customization options */
  customization?: ToTopButtonCustomization;
}

// --- Default Sub-Components ---
const DefaultIcon = ({ disabled, className, ...props }: CustomIconProps) => {
  return (
    <ChevronUpIcon
      className={cn(
        'novacon:w-4 novacon:h-4 novacon:transition-transform novacon:duration-200',
        disabled && 'novacon:opacity-50',
        className,
      )}
      {...props}
    />
  );
};

const DefaultContent = ({ icon }: CustomContentProps) => {
  return <>{icon}</>;
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

/**
 * A highly customizable scroll-to-top button component with extensive styling options and accessibility features.
 * Provides comprehensive customization for appearance, behavior, and event handling while maintaining keyboard navigation support.
 */
export const ToTopButton = forwardRef<HTMLButtonElement, ToTopButtonProps>(
  ({ className, 'aria-label': ariaLabel, onClick, disabled = false, customization, ...props }, ref) => {
    const labels = useNovaConnectLabels();

    // Extract custom components and handlers
    const { Icon = DefaultIcon, Content = DefaultContent } = customization?.components ?? {};

    const {
      onClick: customOnClickHandler = defaultClickHandler,
      onKeyDown: customOnKeyDownHandler = defaultKeyDownHandler,
    } = customization?.handlers ?? {};

    // Handle click events
    const handleClick = useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        const originalHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
          // Prevent default scroll behavior if custom handler provided
          if (onClick) {
            e.preventDefault();
            onClick(e);
          }
        };

        customOnClickHandler(originalHandler, event);
      },
      [onClick, customOnClickHandler],
    );

    // Handle keyboard events
    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent<HTMLButtonElement>) => {
        const originalHandler = (e: React.KeyboardEvent<HTMLButtonElement>) => {
          // Handle keyboard activation
          if ((e.key === 'Enter' || e.key === ' ') && onClick) {
            e.preventDefault();
            // Create a synthetic mouse event for onClick compatibility
            const syntheticEvent = {
              ...e,
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
            onClick(syntheticEvent as any);
          }
        };

        customOnKeyDownHandler(originalHandler, event);
      },
      [onClick, customOnKeyDownHandler],
    );

    // Generate button classes
    const buttonClasses = useMemo(() => {
      if (customization?.classNames?.button) {
        return customization.classNames.button({ disabled, hasOnClick: Boolean(onClick) });
      }
      return cn(
        'novacon:flex novacon:w-full novacon:h-6 novacon:items-center novacon:justify-center',
        'novacon:bg-[var(--tuwa-bg-secondary)] novacon:text-[var(--tuwa-text-primary)]',
        'novacon:transition-colors novacon:duration-200',
        'novacon:hover:bg-[var(--tuwa-bg-tertiary)] novacon:hover:text-[var(--tuwa-text-secondary)]',
        'novacon:focus:outline-none novacon:focus:ring-2 novacon:focus:ring-[var(--tuwa-text-accent)] novacon:focus:ring-inset',
        'novacon:active:bg-[var(--tuwa-bg-quaternary)]',
        'novacon:disabled:opacity-50 novacon:disabled:cursor-not-allowed novacon:disabled:hover:bg-[var(--tuwa-bg-secondary)] novacon:cursor-default',
        {
          'novacon:cursor-pointer': onClick,
        },
        className,
      );
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [customization?.classNames?.button, disabled, onClick, className]);

    // Generate icon classes
    const iconClasses = useMemo(() => {
      if (customization?.classNames?.icon) {
        return customization.classNames.icon({ disabled });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [customization?.classNames?.icon, disabled]);

    // Create icon element
    const iconElement = useMemo(
      () => <Icon disabled={disabled} className={iconClasses} aria-hidden />,
      [Icon, disabled, iconClasses],
    );

    // Merge button props
    const buttonProps = useMemo(
      () => ({
        ...customization?.buttonProps,
        ...props,
        ref,
        type: 'button' as const,
        onClick: handleClick,
        onKeyDown: handleKeyDown,
        disabled,
        className: buttonClasses,
        'aria-label': ariaLabel || labels.scrollToTop,
        title: ariaLabel || labels.scrollToTop,
      }),
      [
        customization?.buttonProps,
        props,
        ref,
        handleClick,
        handleKeyDown,
        disabled,
        buttonClasses,
        ariaLabel,
        labels.scrollToTop,
      ],
    );

    return (
      <button {...buttonProps}>
        <Content icon={iconElement} disabled={disabled} ariaLabel={ariaLabel} />
      </button>
    );
  },
);

ToTopButton.displayName = 'ToTopButton';
