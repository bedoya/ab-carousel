import { ABTransitionOptions } from '@/interfaces';

export interface ABSliderOptions {
    /**
     * Initial slide index to display (0-based).
     */
    index?: number;

    /**
     * Generic slide duration if not set.
     */
    slideDuration?: number;

    /**
     * A delay between the start of the transition out and the transition in
     * given in milliseconds
     */
    gap?: number;

    /**
     * Generic slide direction if not set.
     */
    slideDirection?: boolean;

    /**
     * Extra classes to be added to the slides
     */
    slideClass?: string;

    /**
     * Final resolved transition configuration for slides.
     */
    slideOptions?: {
        transitionIn: ABTransitionOptions;
        transitionOut: ABTransitionOptions;
    };
}
