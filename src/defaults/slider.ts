import { ABSliderOptions } from '@/interfaces';
import {
    defaultCarouselOptions, defaultTransitionInOptions, defaultTransitionOutOptions
} from '@/defaults';

export const defaultSliderOptions: ABSliderOptions = {
    index: defaultCarouselOptions.slide_index,
    slideDuration: defaultCarouselOptions.slide_speed,
    slideDirection: defaultCarouselOptions.direction,
    slideClass: defaultCarouselOptions.slide_class,
    gap: defaultCarouselOptions.gap,
    slideOptions: {
        transitionIn: defaultTransitionInOptions,
        transitionOut: defaultTransitionOutOptions
    }
};
