/**
 * Base class for transitions between two slides.
 * A transition can be applied either when a slide enters (in) or exits (out).
 */
export abstract class ABCarouselTransition {
    abstract name: string;

    /**
     * Whether this transition is instant (no animation).
     */
    public isInstant(): boolean {
        return false;
    }

    /**
     * Applies the entrance animation to a slide.
     *
     * @param {HTMLDivElement} element
     *
     * @returns {void | Promise<void>}
     */
    abstract applyIn( element: HTMLDivElement ): void | Promise<void>;

    /**
     * Applies the exit animation to a slide.
     *
     * @param {HTMLDivElement} element
     *
     * @returns {void | Promise<void>}
     */
    abstract applyOut( element: HTMLDivElement ): void | Promise<void>;
}
