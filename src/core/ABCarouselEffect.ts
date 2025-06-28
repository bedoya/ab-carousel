/**
 * Base class for visual effects applied to elements inside a slide.
 */
export abstract class ABCarouselEffect {
    abstract name: string;

    /**
     * Applies the effect to a specific DOM element inside a slide.
     */
    abstract apply( target: HTMLElement ): void | Promise<void>;
}
