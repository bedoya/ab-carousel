import { ABEffectTiming } from '@/types/ABExtensionsTypes';

/**
 * Base class for visual effects applied to elements inside a slide.
 */
export abstract class ABCarouselEffect {
    abstract name: string;

    /**
     * Determines if the effect is persistent
     *
     * @returns {boolean}
     */
    public isPersistent(): boolean {
        return false;
    }

    /**
     * Determines if the effect should be reapplied every time the slide becomes visible.
     * Defaults to false.
     *
     * @returns {boolean}
     */
    public shouldRepeat(): boolean {
        return false;
    }

    /**
     * Determines when the effect will be executed
     *
     * @returns {ABEffectTiming}
     */
    public getTiming(): ABEffectTiming {
        return 'afterTransition';
    }

    /**
     * Prepares the element before the effect is applied.
     * Useful for setting initial styles or attributes.
     *
     * @param {HTMLElement} element - The element to prepare
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public prepare( element: HTMLElement ): void {
        // Default: no preparation needed
    }

    /**
     * Applies the effect to a specific DOM element inside a slide.
     *
     * @param {HTMLElement} element The element to have the effect applied
     *
     * @returns {void | Promise<void>}
     */
    abstract applyEffect( element: HTMLElement ): void | Promise<void>;

    /**
     * Resets the effect on the given element.
     *
     * @param {HTMLElement} element The element with the effect
     *
     * @returns {void | Promise<void>}
     */
    abstract resetEffect( element: HTMLElement ): void | Promise<void>;
}
