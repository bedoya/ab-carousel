import { ABCarouselOptions } from '@/interfaces';
import { defaultTransitionInOptions, defaultTransitionOutOptions } from '@/defaults/transitions';

export const defaultCarouselOptions: ABCarouselOptions = {
    slide_speed: 6000,
    is_active: true,
    direction: true,
    gap: 0,
    transition: {
        in: defaultTransitionInOptions,
        out: defaultTransitionOutOptions
    },
    slide_class: 'ab-carousel-slide',
    slide_image_class: 'ab-carousel-slide-background',
    button_prev_class: 'ab-carousel-button-prev',
    button_next_class: 'ab-carousel-button-next',
    button_stop_class: 'ab-carousel-button-stop',
    thumbnails_class: 'ab-carousel-thumbnail',
    slide_index: 0,
    plugins: undefined,
};
