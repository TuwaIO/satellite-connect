import { cn, StarsBackground } from '@tuwaio/nova-core';
import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';

import { useNovaConnectLabels } from '../../hooks/useNovaConnectLabels';
import { digitalPassportImage } from './images/digitalPassportImage';
import { walletImage } from './images/walletImage';

/**
 * Slide data configuration with image assets and content keys
 * Uses translation keys instead of hardcoded strings for internationalization
 */
const slidesConfig = [
  {
    id: 1,
    image: digitalPassportImage,
    titleKey: 'keyToNewInternet' as const,
    descriptionKey: 'keyToNewInternetDescription' as const,
  },
  {
    id: 2,
    image: walletImage,
    titleKey: 'logInWithoutHassle' as const,
    descriptionKey: 'logInWithoutHassleDescription' as const,
  },
];

/**
 * Framer Motion variants for slide animations
 * Provides smooth slide transitions with proper entrance/exit animations
 */
const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: '0%',
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? '100%' : '-100%',
    opacity: 0,
    position: 'absolute' as const,
  }),
};

/**
 * Educational carousel component about wallet functionality
 *
 * This component provides an interactive slideshow explaining wallet benefits:
 * - Animated slide transitions with Framer Motion
 * - Keyboard navigation support for accessibility
 * - Auto-play functionality with pause on user interaction
 * - Internationalization support with translation keys
 * - WCAG compliant with proper ARIA labels and semantics
 * - Responsive design with embedded base64 images
 * - Visual indicators for current slide position
 *
 * The component automatically cycles through slides and pauses when users interact
 * with navigation controls. It supports both mouse and keyboard navigation.
 *
 * @returns JSX element displaying educational wallet slideshow
 *
 * @example
 * ```tsx
 * <AboutWallets />
 * ```
 *
 * @example
 * ```tsx
 * // With custom styling
 * <div className="custom-container">
 *   <AboutWallets />
 * </div>
 * ```
 *
 * @public
 */
export function AboutWallets() {
  const labels = useNovaConnectLabels();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [userInteracted, setUserInteracted] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Use refs for proper cleanup of timers - using number type for browser compatibility
  const autoPlayIntervalRef = useRef<number | null>(null);
  const resumeTimeoutRef = useRef<number | null>(null);

  /**
   * Navigate to a specific slide with proper direction calculation
   */
  const goToSlide = useCallback(
    (index: number) => {
      if (index === currentSlide) return;

      const newDirection = index > currentSlide ? 1 : -1;
      setDirection(newDirection);
      setCurrentSlide(index);
      setUserInteracted(true);
      setIsAutoPlaying(false);
      setImageLoaded(false); // Reset loading state for new slide
    },
    [currentSlide],
  );

  /**
   * Navigate to the next slide in sequence
   */
  const goToNextSlide = useCallback(() => {
    const nextIndex = (currentSlide + 1) % slidesConfig.length;
    goToSlide(nextIndex);
  }, [currentSlide, goToSlide]);

  /**
   * Navigate to the previous slide in sequence
   */
  const goToPreviousSlide = useCallback(() => {
    const prevIndex = currentSlide === 0 ? slidesConfig.length - 1 : currentSlide - 1;
    goToSlide(prevIndex);
  }, [currentSlide, goToSlide]);

  /**
   * Handle keyboard navigation for accessibility
   */
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowLeft':
        case 'ArrowUp':
          event.preventDefault();
          goToPreviousSlide();
          break;
        case 'ArrowRight':
        case 'ArrowDown':
          event.preventDefault();
          goToNextSlide();
          break;
        case 'Home':
          event.preventDefault();
          goToSlide(0);
          break;
        case 'End':
          event.preventDefault();
          goToSlide(slidesConfig.length - 1);
          break;
        case ' ':
        case 'Enter':
          event.preventDefault();
          setIsAutoPlaying(!isAutoPlaying);
          break;
      }
    },
    [goToPreviousSlide, goToNextSlide, goToSlide, isAutoPlaying],
  );

  /**
   * Auto-play functionality with pause on user interaction
   */
  useEffect(() => {
    // Clear any existing interval
    if (autoPlayIntervalRef.current !== null) {
      window.clearInterval(autoPlayIntervalRef.current);
      autoPlayIntervalRef.current = null;
    }

    if (!isAutoPlaying || userInteracted) return;

    autoPlayIntervalRef.current = window.setInterval(() => {
      setCurrentSlide((prev) => {
        const next = (prev + 1) % slidesConfig.length;
        setDirection(1);
        return next;
      });
    }, 5000); // 5 second intervals

    return () => {
      if (autoPlayIntervalRef.current !== null) {
        window.clearInterval(autoPlayIntervalRef.current);
        autoPlayIntervalRef.current = null;
      }
    };
  }, [isAutoPlaying, userInteracted]);

  /**
   * Resume auto-play after user interaction timeout
   */
  useEffect(() => {
    // Clear any existing timeout
    if (resumeTimeoutRef.current !== null) {
      window.clearTimeout(resumeTimeoutRef.current);
      resumeTimeoutRef.current = null;
    }

    if (!userInteracted) return;

    resumeTimeoutRef.current = window.setTimeout(() => {
      setUserInteracted(false);
      setIsAutoPlaying(true);
    }, 10000); // Resume after 10 seconds of inactivity

    return () => {
      if (resumeTimeoutRef.current !== null) {
        window.clearTimeout(resumeTimeoutRef.current);
        resumeTimeoutRef.current = null;
      }
    };
  }, [userInteracted]);

  /**
   * Cleanup timers on unmount
   */
  useEffect(() => {
    return () => {
      if (autoPlayIntervalRef.current !== null) {
        window.clearInterval(autoPlayIntervalRef.current);
      }
      if (resumeTimeoutRef.current !== null) {
        window.clearTimeout(resumeTimeoutRef.current);
      }
    };
  }, []);

  /**
   * Reset image loading state when slide changes
   */
  useEffect(() => {
    // eslint-disable-next-line
    setImageLoaded(false);
  }, [currentSlide]);

  const currentSlideData = slidesConfig[currentSlide];

  return (
    <section
      className="novacon:relative novacon:m-[-16px]"
      role="region"
      aria-label={labels.aboutWallets}
      aria-roledescription="carousel"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Main carousel content */}
      <div className="novacon:relative novacon:z-1 novacon:overflow-hidden" aria-live="polite" aria-atomic="false">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentSlide}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="novacon:flex novacon:flex-col novacon:justify-start"
            role="tabpanel"
            aria-label={`Slide ${currentSlide + 1} of ${slidesConfig.length}`}
          >
            {/* Image section with background effects */}
            <div className="novacon:flex novacon:justify-center novacon:relative novacon:pt-4">
              <StarsBackground />
              <div
                className="novacon:absolute novacon:inset-0 novacon:z-1 novacon:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]"
                aria-hidden="true"
              />

              <AnimatePresence mode="wait">
                <motion.div
                  key={`image-${currentSlide}`}
                  animate={{ opacity: 1, scale: 1 }}
                  initial={{ opacity: 0, scale: 0.1 }}
                  exit={{ opacity: 0, scale: 0.1 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                  className="novacon:relative novacon:z-2"
                >
                  <div className="novacon:relative">
                    <img
                      src={currentSlideData.image}
                      alt={labels[currentSlideData.titleKey]}
                      width={250}
                      height={250}
                      className={cn(
                        'novacon:rounded-full novacon:transition-opacity novacon:duration-300',
                        'novacon:object-cover',
                        imageLoaded ? 'novacon:opacity-100' : 'novacon:opacity-0',
                      )}
                      style={{
                        width: 250,
                        height: 250,
                      }}
                      onLoad={() => setImageLoaded(true)}
                      onError={() => {
                        console.warn(`Failed to load slide image for slide ${currentSlide + 1}`);
                        setImageLoaded(true); // Show even if failed to avoid permanent loading state
                      }}
                      loading="eager" // Since these are critical images for the slideshow
                      decoding="async"
                    />

                    {/* Loading placeholder */}
                    {!imageLoaded && (
                      <div
                        className="novacon:absolute novacon:inset-0 novacon:bg-[var(--tuwa-bg-muted)] novacon:animate-pulse novacon:rounded-full novacon:flex novacon:items-center novacon:justify-center"
                        style={{
                          width: 250,
                          height: 250,
                        }}
                        aria-hidden="true"
                      >
                        <div className="novacon:w-12 novacon:h-12 novacon:border-2 novacon:border-[var(--tuwa-text-accent)] novacon:border-t-transparent novacon:rounded-full novacon:animate-spin" />
                      </div>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Content section */}
            <div className="novacon:text-center novacon:relative novacon:z-3 novacon:p-4">
              <h2
                className="novacon:text-xl novacon:font-bold novacon:text-[var(--tuwa-text-primary)] novacon:mb-2"
                id={`slide-title-${currentSlide}`}
              >
                {labels[currentSlideData.titleKey]}
              </h2>
              <p
                className="novacon:text-[var(--tuwa-text-secondary)] novacon:leading-relaxed"
                aria-describedby={`slide-title-${currentSlide}`}
              >
                {labels[currentSlideData.descriptionKey]}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation indicators */}
      <nav
        className="novacon:flex novacon:justify-center novacon:space-x-2 novacon:mt-6 novacon:relative novacon:z-3 novacon:mx-4 novacon:mb-4"
        role="tablist"
        aria-label={`${labels.aboutWallets} navigation`}
      >
        {/* Background line */}
        <div
          className="novacon:absolute novacon:left-1/2 novacon:top-1/2 novacon:transform novacon:-translate-x-1/2 novacon:-translate-y-1/2 novacon:z-1 novacon:h-[2px] novacon:w-full novacon:bg-[var(--tuwa-border-primary)]"
          aria-hidden="true"
        />

        {/* Indicator buttons container */}
        <div className="novacon:flex novacon:gap-2 novacon:px-4 novacon:bg-[var(--tuwa-bg-primary)] novacon:relative novacon:z-2">
          {slidesConfig.map((slide, index) => (
            <button
              key={slide.id}
              onClick={() => goToSlide(index)}
              className={cn(
                'novacon:cursor-pointer novacon:h-2 novacon:rounded-full novacon:transition-all novacon:duration-300',
                'novacon:focus:outline-none novacon:focus:ring-2 novacon:focus:ring-[var(--tuwa-text-accent)] novacon:focus:ring-offset-2',
                'novacon:bg-[var(--tuwa-border-primary)] novacon:w-2 novacon:hover:bg-[var(--tuwa-text-accent)]',
                {
                  'novacon:bg-[var(--tuwa-text-accent)] novacon:w-6': currentSlide === index,
                },
              )}
              role="tab"
              aria-selected={currentSlide === index}
              aria-controls={`slide-${index}`}
              aria-label={`Go to slide ${index + 1}: ${labels[slide.titleKey]}`}
              tabIndex={currentSlide === index ? 0 : -1}
            />
          ))}
        </div>
      </nav>

      {/* Screen reader announcements */}
      <div className="novacon:sr-only" aria-live="polite" role="status">
        {`Slide ${currentSlide + 1} of ${slidesConfig.length}: ${labels[currentSlideData.titleKey]}`}
        {isAutoPlaying ? ' (Auto-playing)' : ' (Paused)'}
      </div>

      {/* Instructions for screen readers */}
      <div className="novacon:sr-only">
        Use arrow keys to navigate slides, Space or Enter to pause/resume auto-play, Home to go to first slide, End to
        go to last slide.
      </div>
    </section>
  );
}
