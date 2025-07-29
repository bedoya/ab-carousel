import { ABTransitionOptions } from '@/interfaces';

/**
 * Configuration options for a slide.
 * Defines which transitions are used when the slide enters or exits the view.
 */
export interface ABSlideOptions {
    /**
     * Override slide_speed
     */
    slideDuration?: number;

    /**
     * Additional css classes added to the <div class="ab-carousel-slide">
     */
    slideClass?: string;

    /**
     * Transition effect to apply when the slide becomes visible.
     */
    transitionIn?: Partial<ABTransitionOptions>;

    /**
     * Transition effect to apply when the slide is hidden.
     */
    transitionOut?: Partial<ABTransitionOptions>;
}