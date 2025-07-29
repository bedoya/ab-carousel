import { ABTransitionNone } from '@transitions/none/ABTransitionNone';
import { ABTransitionSlide } from '@transitions/slide/ABTransitionSlide';
import { ABTransitionFade } from '@transitions/fade/ABTransitionFade';

import type { ABCarouselTransition } from '@/core/ABCarouselTransition';
import type { ABTransitionOptions } from '@/interfaces';

/**
 * Constructor signature for transition extensions.
 */
export type TransitionConstructor = new ( options?: Partial<ABTransitionOptions> ) => ABCarouselTransition;

/**
 * Internal registry of available transitions.
 * Keys are transition names, values are their constructors.
 */
const transitionRegistry: Record<string, TransitionConstructor> = {
    ABTransitionNone: ABTransitionNone,
    ABTransitionSlide: ABTransitionSlide,
    ABTransitionFade: ABTransitionFade,
};

/**
 * Registers a transition constructor under a given name.
 *
 * @param {string} name
 * @param {TransitionConstructor} constructor
 */
export function registerTransition( name: string, constructor: TransitionConstructor ): void {
    transitionRegistry[ name ] = constructor;
}

/**
 * Optionally unregisters a transition constructor by name.
 *
 * @param {string} name
 */
export function unregisterTransition( name: string ): void {
    delete transitionRegistry[ name ];
}

/**
 * Resolves a transition instance by name with optional parameters.
 * Falls back to ABTransitionNone if name not found.
 *
 * @param {string} name
 * @param {Partial<ABTransitionOptions>} options
 *
 * @returns {ABCarouselTransition}
 */
export function resolveTransition( name: string, options: Partial<ABTransitionOptions> = {} ): ABCarouselTransition {
    const TransitionClass = transitionRegistry[ name ] ?? ABTransitionNone;
    return new TransitionClass( options );
}
