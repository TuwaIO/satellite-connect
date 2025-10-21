/**
 * @file Highly customizable scrollable chain list with comprehensive styling and behavior control.
 * @module ScrollableChainList
 */

import {
  AnimatePresence,
  type AnyResolvedKeyframe,
  type LegacyAnimationControls,
  motion,
  type TargetAndTransition,
  type Transition,
  type VariantLabels,
} from 'framer-motion';
import React, { type ComponentType, ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useNovaConnectLabels } from '../../hooks/useNovaConnectLabels';
import { ToBottomButton, type ToBottomButtonCustomization } from '../ToBottomButton';
import { ToTopButton, type ToTopButtonCustomization } from '../ToTopButton';
import { ChainListRenderer, type ChainListRendererCustomization } from './ChainListRenderer';

// === TYPES AND INTERFACES ===

/**
 * Chain data structure returned by getChainData function
 */
interface ChainData {
  formattedChainId: string | number;
  chain: string | number;
}

/**
 * Scroll button state context
 */
interface ScrollButtonContext {
  showTopButton: boolean;
  showBottomButton: boolean;
  isScrolling: boolean;
  scrollTop: number;
  scrollHeight: number;
  clientHeight: number;
}

/**
 * Props for custom scroll container component
 */
interface CustomScrollContainerProps {
  children: ReactNode;
  ref: React.RefObject<HTMLDivElement | null>;
  onKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => void;
  className?: string;
  role: string;
  'aria-label': string;
  tabIndex: number;
}

/**
 * Props for custom wrapper component
 */
interface CustomWrapperProps {
  children: ReactNode;
  className?: string;
  role: string;
  'aria-label': string;
}

/**
 * Props for custom button animations wrapper
 */
interface CustomButtonAnimationWrapperProps {
  children: ReactNode;
  isVisible: boolean;
  position: 'top' | 'bottom';
  animationKey: string;
}

/**
 * Animation configuration for scroll buttons
 */
interface ScrollButtonAnimationConfig {
  initial?: TargetAndTransition | VariantLabels | LegacyAnimationControls | undefined;
  animate?: TargetAndTransition | VariantLabels | LegacyAnimationControls | undefined;
  exit?: TargetAndTransition | VariantLabels | LegacyAnimationControls | undefined;
  transition?: Transition<AnyResolvedKeyframe>;
}

/**
 * Comprehensive customization options for ScrollableChainList
 */
export interface ScrollableChainListCustomization {
  /** Custom components */
  components?: {
    /** Custom scroll container component */
    ScrollContainer?: ComponentType<CustomScrollContainerProps>;
    /** Custom wrapper component */
    Wrapper?: ComponentType<CustomWrapperProps>;
    /** Custom button animation wrapper */
    ButtonAnimationWrapper?: ComponentType<CustomButtonAnimationWrapperProps>;
  };
  /** Custom class name generators */
  classNames?: {
    /** Wrapper classes */
    wrapper?: (params: { itemCount: number; hasScrollableContent: boolean }) => string;
    /** Scroll container classes */
    container?: (params: {
      itemCount: number;
      hasScrollableContent: boolean;
      showTopButton: boolean;
      showBottomButton: boolean;
    }) => string;
    /** Button animation wrapper classes */
    buttonWrapper?: (params: { position: 'top' | 'bottom'; isVisible: boolean }) => string;
  };
  /** Custom event handlers */
  handlers?: {
    /** Custom scroll handler wrapper */
    onScroll?: (originalHandler: () => void, event: Event, context: ScrollButtonContext) => void;
    /** Custom key handler wrapper for container */
    onKeyDown?: (
      originalHandler: (event: React.KeyboardEvent<HTMLDivElement>) => void,
      event: React.KeyboardEvent<HTMLDivElement>,
      context: { scrollContainer: HTMLDivElement | null },
    ) => void;
    /** Custom top button click handler wrapper */
    onTopButtonClick?: (originalHandler: () => void, context: ScrollButtonContext) => void;
    /** Custom bottom button click handler wrapper */
    onBottomButtonClick?: (originalHandler: () => void, context: ScrollButtonContext) => void;
  };
  /** Animation configuration */
  animations?: {
    /** Button animation */
    scrollButtons?: ScrollButtonAnimationConfig;
  };
  /** Scroll behavior configuration */
  scrollBehavior?: {
    /** Scroll behavior type */
    behavior?: ScrollBehavior;
    /** Page scroll percentage (0-1) */
    pageScrollPercentage?: number;
    /** Scroll update throttle in ms */
    updateThrottle?: number;
    /** Enable auto-scroll to active item */
    autoScrollToActive?: boolean;
  };
  /** Button customization */
  buttons?: {
    /** Top button customization */
    topButton?: ToTopButtonCustomization;
    /** Bottom button customization */
    bottomButton?: ToBottomButtonCustomization;
    /** Hide buttons when content fits */
    hideWhenContentFits?: boolean;
  };
  /** Chain list renderer customization */
  chainListRenderer?: ChainListRendererCustomization;
}

/**
 * Props for the ScrollableChainList component
 */
export interface ScrollableChainListProps {
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
  /** Comprehensive customization options */
  customization?: ScrollableChainListCustomization;
  /** ARIA label for the wrapper */
  'aria-label'?: string;
  /** Loading state */
  isLoading?: boolean;
  /** Error state */
  error?: string | null;
}

// === DEFAULT COMPONENTS ===

/**
 * Default scroll container component
 */
const DefaultScrollContainer: React.FC<CustomScrollContainerProps> = React.forwardRef<
  HTMLDivElement,
  CustomScrollContainerProps
>(({ children, className, onKeyDown, ...props }, ref) => (
  <div ref={ref} className={className} onKeyDown={onKeyDown} {...props}>
    {children}
  </div>
));

DefaultScrollContainer.displayName = 'DefaultScrollContainer';

/**
 * Default wrapper component
 */
const DefaultWrapper: React.FC<CustomWrapperProps> = ({ children, className, ...props }) => (
  <div className={className} {...props}>
    {children}
  </div>
);

/**
 * Default button animation wrapper
 */
const DefaultButtonAnimationWrapper: React.FC<CustomButtonAnimationWrapperProps> = ({
  children,
  isVisible,
  animationKey,
}) => {
  if (!isVisible) return null;

  return (
    <motion.div
      key={animationKey}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
};

// === MAIN COMPONENT ===

/**
 * Highly customizable scrollable chain list with comprehensive styling and behavior control.
 */
export const ScrollableChainList: React.FC<ScrollableChainListProps> = ({
  chainsList,
  selectValue,
  handleValueChange,
  getChainData,
  onClose,
  customization,
  'aria-label': ariaLabel,
  isLoading = false,
  error = null,
}) => {
  const labels = useNovaConnectLabels();
  const containerRef = useRef<HTMLDivElement>(null);
  const [showTopButton, setShowTopButton] = useState(false);
  const [showBottomButton, setShowBottomButton] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [hasScrollableContent, setHasScrollableContent] = useState(false);
  const [scrollContext, setScrollContext] = useState<ScrollButtonContext>({
    showTopButton: false,
    showBottomButton: false,
    isScrolling: false,
    scrollTop: 0,
    scrollHeight: 0,
    clientHeight: 0,
  });

  // Extract customization options with defaults
  const {
    ScrollContainer = DefaultScrollContainer,
    Wrapper = DefaultWrapper,
    ButtonAnimationWrapper = DefaultButtonAnimationWrapper,
  } = customization?.components ?? {};

  const scrollBehavior = customization?.scrollBehavior ?? {};
  const buttonConfig = customization?.buttons ?? {};
  const animations = customization?.animations;

  // Scroll behavior settings
  const scrollBehaviorType = scrollBehavior.behavior ?? 'smooth';
  const pageScrollPercentage = scrollBehavior.pageScrollPercentage ?? 0.8;

  // Update scroll context
  const updateScrollContext = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    setScrollContext({
      showTopButton,
      showBottomButton,
      isScrolling,
      scrollTop,
      scrollHeight,
      clientHeight,
    });
  }, [showTopButton, showBottomButton, isScrolling]);

  // Update scroll buttons visibility
  const updateScrollButtons = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const hasContent = scrollHeight > clientHeight;

    setHasScrollableContent(hasContent);

    if (buttonConfig.hideWhenContentFits && !hasContent) {
      setShowTopButton(false);
      setShowBottomButton(false);
      return;
    }

    setShowTopButton(scrollTop > 0);
    setShowBottomButton(scrollTop + clientHeight < scrollHeight - 1);

    // Call custom scroll handler if provided
    if (customization?.handlers?.onScroll) {
      customization.handlers.onScroll(() => {}, new Event('scroll'), {
        showTopButton: scrollTop > 0,
        showBottomButton: scrollTop + clientHeight < scrollHeight - 1,
        isScrolling,
        scrollTop,
        scrollHeight,
        clientHeight,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buttonConfig.hideWhenContentFits, customization?.handlers?.onScroll, isScrolling]);

  // Update context after button states change
  useEffect(() => {
    updateScrollContext();
  }, [updateScrollContext]);

  // Setup scroll listeners and observers
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      setIsScrolling(true);
      updateScrollButtons();

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    };

    updateScrollButtons();
    container.addEventListener('scroll', handleScroll);

    const resizeObserver = new ResizeObserver(updateScrollButtons);
    resizeObserver.observe(container);

    return () => {
      container.removeEventListener('scroll', handleScroll);
      resizeObserver.disconnect();
      clearTimeout(scrollTimeout);
    };
  }, [chainsList, updateScrollButtons]);

  // Scroll to extreme positions
  const scrollToExtreme = useCallback(
    (isTop: boolean) => {
      const container = containerRef.current;
      if (container) {
        container.scrollTo({
          top: isTop ? 0 : container.scrollHeight,
          behavior: scrollBehaviorType,
        });
      }
    },
    [scrollBehaviorType],
  );

  // Handle scroll button clicks
  const handleTopButtonClick = useCallback(() => {
    const originalHandler = () => scrollToExtreme(true);

    if (customization?.handlers?.onTopButtonClick) {
      customization.handlers.onTopButtonClick(originalHandler, scrollContext);
    } else {
      originalHandler();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customization?.handlers?.onTopButtonClick, scrollToExtreme, scrollContext]);

  const handleBottomButtonClick = useCallback(() => {
    const originalHandler = () => scrollToExtreme(false);

    if (customization?.handlers?.onBottomButtonClick) {
      customization.handlers.onBottomButtonClick(originalHandler, scrollContext);
    } else {
      originalHandler();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customization?.handlers?.onBottomButtonClick, scrollToExtreme, scrollContext]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      const originalHandler = (e: React.KeyboardEvent<HTMLDivElement>) => {
        // Handle arrow key navigation within the scrollable area
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
          // Let the ChainListRenderer handle the focus management
          return;
        }

        // Handle Page Up/Page Down for large scrolls
        if (e.key === 'PageUp') {
          e.preventDefault();
          const container = containerRef.current;
          if (container) {
            container.scrollBy({
              top: -container.clientHeight * pageScrollPercentage,
              behavior: scrollBehaviorType,
            });
          }
        }

        if (e.key === 'PageDown') {
          e.preventDefault();
          const container = containerRef.current;
          if (container) {
            container.scrollBy({
              top: container.clientHeight * pageScrollPercentage,
              behavior: scrollBehaviorType,
            });
          }
        }
      };

      if (customization?.handlers?.onKeyDown) {
        customization.handlers.onKeyDown(originalHandler, event, {
          scrollContainer: containerRef.current,
        });
      } else {
        originalHandler(event);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [customization?.handlers?.onKeyDown, pageScrollPercentage, scrollBehaviorType],
  );

  // Generate wrapper classes and styles
  const wrapperClasses = useMemo(() => {
    const customClasses = customization?.classNames?.wrapper?.({
      itemCount: chainsList.length,
      hasScrollableContent,
    });
    return customClasses || 'novacon:relative novacon:py-[24px]';
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customization?.classNames?.wrapper, chainsList.length, hasScrollableContent]);

  // Generate container classes and styles
  const containerClasses = useMemo(() => {
    const customClasses = customization?.classNames?.container?.({
      itemCount: chainsList.length,
      hasScrollableContent,
      showTopButton,
      showBottomButton,
    });
    return (
      customClasses ||
      'NovaCustomScroll novacon:relative novacon:flex novacon:w-full novacon:flex-col novacon:p-2 novacon:gap-1 novacon:max-h-[312px] novacon:overflow-x-hidden novacon:overflow-y-auto'
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customization?.classNames?.container, chainsList.length, hasScrollableContent, showTopButton, showBottomButton]);

  // Button animation wrapper classes and styles
  const topButtonWrapperClasses = useMemo(() => {
    return (
      customization?.classNames?.buttonWrapper?.({ position: 'top', isVisible: showTopButton }) ||
      'novacon:absolute novacon:top-0 novacon:z-10 novacon:w-full'
    );
  }, [customization, showTopButton]);

  const bottomButtonWrapperClasses = useMemo(() => {
    return (
      customization?.classNames?.buttonWrapper?.({ position: 'bottom', isVisible: showBottomButton }) ||
      'novacon:absolute novacon:bottom-0 novacon:z-10 novacon:w-full'
    );
  }, [customization, showBottomButton]);

  // Create button animation wrapper with custom animations
  const createButtonWrapper = useCallback(
    (
      children: ReactNode,
      isVisible: boolean,
      position: 'top' | 'bottom',
      wrapperClasses: string,
      wrapperStyles?: React.CSSProperties,
    ) => {
      const animationConfig = animations?.scrollButtons;
      const animationKey = `${position}-button`;

      const wrapperElement = (
        <div className={wrapperClasses} style={wrapperStyles}>
          {children}
        </div>
      );

      return (
        <ButtonAnimationWrapper isVisible={isVisible} position={position} animationKey={animationKey}>
          {animationConfig ? <motion.div {...animationConfig}>{wrapperElement}</motion.div> : wrapperElement}
        </ButtonAnimationWrapper>
      );
    },
    [animations, ButtonAnimationWrapper],
  );

  return (
    <Wrapper className={wrapperClasses} role="region" aria-label={ariaLabel || labels.chainListContainer}>
      <AnimatePresence>
        {createButtonWrapper(
          <ToTopButton
            onClick={handleTopButtonClick}
            aria-label={labels.scrollToTop}
            className="novacon:w-full"
            customization={buttonConfig.topButton}
          />,
          showTopButton,
          'top',
          topButtonWrapperClasses,
        )}
      </AnimatePresence>

      <ScrollContainer
        ref={containerRef}
        className={containerClasses}
        role="listbox"
        aria-label={labels.selectChain}
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        <ChainListRenderer
          chainsList={chainsList}
          selectValue={selectValue}
          handleValueChange={handleValueChange}
          getChainData={getChainData}
          onClose={onClose}
          isMobile={true}
          isLoading={isLoading}
          error={error}
          customization={customization?.chainListRenderer}
        />
      </ScrollContainer>

      <AnimatePresence>
        {createButtonWrapper(
          <ToBottomButton
            onClick={handleBottomButtonClick}
            aria-label={labels.scrollToBottom}
            className="novacon:w-full"
            customization={buttonConfig.bottomButton}
          />,
          showBottomButton,
          'bottom',
          bottomButtonWrapperClasses,
        )}
      </AnimatePresence>
    </Wrapper>
  );
};
