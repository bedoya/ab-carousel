import { defaultSlideOptions } from '@/defaults/slide';
import { ABSliderOptions, ABSlideOptions } from '@/interfaces';

/**
 * Resolves the configuration for an individual slide based on global slider options.
 * This resolver merges user-defined values with default settings.
 */
export class SlideOptionsResolver {
    /**
     * Builds a complete ABSlideOptions object using the provided slider options.
     *
     * @param {ABSliderOptions} options The resolved ABSliderOptions containing global slide configuration.
     *
     * @returns {ABSlideOptions}
     */
    static resolve( options: ABSliderOptions ): ABSlideOptions {
        const slideClass = ( options.slideClass === undefined || options.slideClass === '' ) ?
            defaultSlideOptions.slideClass :
            options.slideClass;

        return {
            slideDuration: options.slideDuration ?? defaultSlideOptions.slideDuration,
            slideClass: slideClass,
            transitionIn: options.slideOptions!.transitionIn ?? defaultSlideOptions.transitionIn,
            transitionOut: options.slideOptions!.transitionOut ?? defaultSlideOptions.transitionOut
        };
    }
}
