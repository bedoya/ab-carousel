import type { ABCarouselOptions, ABSliderOptions, ABTransitionOptions } from '@/interfaces';
import { defaultSliderOptions, } from '@/defaults/slider';
import { TransitionOptionsResolver } from '@support/TransitionOptionsResolver';

/**
 * Resolves ABCarouselOptions into a normalized ABSliderOptions object,
 * extracting slide-level settings and defaulting to known fallbacks.
 */
export class SliderOptionsResolver {
    /**
     * Transforms ABCarouselOptions into a clean, resolved ABSliderOptions.
     *
     * @param {ABCarouselOptions} options
     *
     * @returns {ABSliderOptions}
     */
    static resolve( options: ABCarouselOptions ): ABSliderOptions {
        return {
            index: this.resolveIndex( options.slide_index ),
            slideDuration: this.resolveDuration( options.slide_speed ),
            slideDirection: this.resolveDirection( options.direction ),
            slideOptions: this.resolveSlideOptions( options.transition ),
            slideClass: this.resolveClass( options.slide_class ),
            gap: this.resolveGap( options.gap ),
        } as ABSliderOptions;
    }

    /**
     * Resolves the initial slide index.
     *
     * @param {number} input The optional index value from options.
     *
     * @returns {number}
     * @private
     */
    private static resolveIndex( input?: number ): number {
        return input ?? defaultSliderOptions.index!;
    }

    /**
     * Resolves the slide duration in milliseconds.
     *
     * @param {number} input The optional duration value from options.
     *
     * @returns {number}
     * @private
     */
    private static resolveDuration( input?: number ): number {
        return input ?? defaultSliderOptions.slideDuration!;
    }

    /**
     * Resolves the extra classes to be added to the slide
     *
     * @param {string} input
     *
     * @returns {string}
     * @private
     */
    private static resolveClass( input?: string ): string {
        return input ?? defaultSliderOptions.slideClass!;
    }

    /**
     * Resolves the slide direction (true = normal, false = reversed).
     *
     * @param {boolean} input The optional direction value from options.
     *
     * @returns {boolean}
     * @private
     */
    private static resolveDirection( input?: boolean ): boolean {
        return input ?? defaultSliderOptions.slideDirection!;
    }

    /**
     * Resolves the time gap between transitionIn and transitionOut start
     *
     * @param {number} input
     *
     * @returns {number}
     * @private
     */
    private static resolveGap( input?: number ): number {
        return input ?? defaultSliderOptions.gap!;
    }

    /**
     * Resolves slide transition settings into a consistent { in, out } object.
     *
     * @param {string | Partial<ABTransitionOptions> | {in: Partial<ABTransitionOptions>, out: Partial<ABTransitionOptions>}} input Transition settings from carousel options.
     *
     * @returns {{in: ABTransitionOptions, out: ABTransitionOptions}}
     * @private
     */
    private static resolveSlideOptions(
        input?:
            string |
            Partial<ABTransitionOptions> |
            {
                in: Partial<ABTransitionOptions>;
                out: Partial<ABTransitionOptions>
            }
    ): { transitionIn: ABTransitionOptions; transitionOut: ABTransitionOptions } {
        if ( input && typeof input === 'object' && 'in' in input && 'out' in input ) {
            const { in: transitionIn, out: transitionOut } = input;
            return TransitionOptionsResolver.resolve( { transitionIn, transitionOut } );
        }
        return TransitionOptionsResolver.resolve( input as string | Partial<ABTransitionOptions> | undefined );
    }
}
