import type { ABCarouselTransition } from '@/core/ABCarouselTransition';

/**
 * Configuration options for a slide.
 * Defines which transitions are used when the slide enters or exits the view.
 */
export interface ABSlideOptions {
    /**
     * Transition effect to apply when the slide becomes visible.
     */
    transitionIn: ABCarouselTransition;

    /**
     * Transition effect to apply when the slide is hidden.
     */
    transitionOut: ABCarouselTransition;
}