import { defaultSlideOptions } from '@/defaults/slide';

export const defaultKenBurnsOptions = {
    zoomStart: 1,
    zoomFinal: 1.2,
    panAmount: 30,
    panDirection: 45,
    duration: defaultSlideOptions.slideDuration,
    wait: 100
};

export type KenBurnsOptions = typeof defaultKenBurnsOptions;