import type { ABSlideOptions } from '@/interfaces';
import { defaultCarouselOptions } from '@/defaults/carousel';
import { defaultTransitionInOptions, defaultTransitionOutOptions } from '@/defaults/transitions';

export const defaultSlideOptions: ABSlideOptions = {
    slideDuration: defaultCarouselOptions.slide_speed,
    slideClass: '',
    transitionIn: defaultTransitionInOptions,
    transitionOut: defaultTransitionOutOptions,
};
