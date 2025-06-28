import type { ABSlide } from './ABSlide';

/**
 * Base class for transitions between two slides.
 * A transition can be applied either when a slide enters (in) or exits (out).
 */
export abstract class ABCarouselTransition {
    abstract name: string;

    /**
     * Applies the transition.
     * When used as a "transition in", `next` is the target slide.
     * When used as a "transition out", `current` is the slide being removed.
     *
     * @param {ABSlide} current
     * @param {ABSlide} next
     * @returns {void | Promise<void>}
     */
    abstract apply( current: ABSlide, next: ABSlide ): void | Promise<void>;
}
