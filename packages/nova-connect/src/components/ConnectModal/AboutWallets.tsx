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
      className="relative m-[-16px]"
      role="region"
      aria-label={labels.aboutWallets}
      aria-roledescription="carousel"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Main carousel content */}
      <div className="relative z-1 overflow-hidden" aria-live="polite" aria-atomic="false">
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
            className="flex flex-col justify-start"
            role="tabpanel"
            aria-label={`Slide ${currentSlide + 1} of ${slidesConfig.length}`}
          >
            {/* Image section with background effects */}
            <div className="flex justify-center relative pt-4">
              <StarsBackground />
              <div
                className="absolute inset-0 z-1 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]"
                aria-hidden="true"
              />

              <AnimatePresence mode="wait">
                <motion.div
                  key={`image-${currentSlide}`}
                  animate={{ opacity: 1, scale: 1 }}
                  initial={{ opacity: 0, scale: 0.1 }}
                  exit={{ opacity: 0, scale: 0.1 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                  className="relative z-2"
                >
                  <div className="relative">
                    <img
                      src={currentSlideData.image}
                      alt={labels[currentSlideData.titleKey]}
                      width={250}
                      height={250}
                      className={cn(
                        'rounded-full transition-opacity duration-300',
                        'object-cover',
                        imageLoaded ? 'opacity-100' : 'opacity-0',
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
                        className="absolute inset-0 bg-[var(--tuwa-bg-muted)] animate-pulse rounded-full flex items-center justify-center"
                        style={{
                          width: 250,
                          height: 250,
                        }}
                        aria-hidden="true"
                      >
                        <div className="w-12 h-12 border-2 border-[var(--tuwa-text-accent)] border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Content section */}
            <div className="text-center relative z-3 p-4">
              <h2 className="text-xl font-bold text-[var(--tuwa-text-primary)] mb-2" id={`slide-title-${currentSlide}`}>
                {labels[currentSlideData.titleKey]}
              </h2>
              <p
                className="text-[var(--tuwa-text-secondary)] leading-relaxed"
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
        className="flex justify-center space-x-2 mt-6 relative z-3 mx-4 mb-4"
        role="tablist"
        aria-label={`${labels.aboutWallets} navigation`}
      >
        {/* Background line */}
        <div
          className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-1 h-[2px] w-full bg-[var(--tuwa-border-primary)]"
          aria-hidden="true"
        />

        {/* Indicator buttons container */}
        <div className="flex gap-2 px-4 bg-[var(--tuwa-bg-primary)] relative z-2">
          {slidesConfig.map((slide, index) => (
            <button
              key={slide.id}
              onClick={() => goToSlide(index)}
              className={cn(
                'cursor-pointer h-2 rounded-full transition-all duration-300',
                'focus:outline-none focus:ring-2 focus:ring-[var(--tuwa-text-accent)] focus:ring-offset-2',
                'bg-[var(--tuwa-border-primary)] w-2 hover:bg-[var(--tuwa-text-accent)]',
                {
                  'bg-[var(--tuwa-text-accent)] w-6': currentSlide === index,
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
      <div className="sr-only" aria-live="polite" role="status">
        {`Slide ${currentSlide + 1} of ${slidesConfig.length}: ${labels[currentSlideData.titleKey]}`}
        {isAutoPlaying ? ' (Auto-playing)' : ' (Paused)'}
      </div>

      {/* Instructions for screen readers */}
      <div className="sr-only">
        Use arrow keys to navigate slides, Space or Enter to pause/resume auto-play, Home to go to first slide, End to
        go to last slide.
      </div>
    </section>
  );
}
