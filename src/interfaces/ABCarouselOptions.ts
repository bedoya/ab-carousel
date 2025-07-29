import { ABTransitionOptions } from '@/interfaces';
import { PluginType } from '@/types';

/**
 * Configuration options for the ABCarousel instance.
 */
export interface ABCarouselOptions {
    /**
     * Time in milliseconds before automatically advancing to the next slide.
     * Defaults to 9000 ms.
     */
    slide_speed?: number;

    /**
     * If true, the carousel starts rotating automatically.
     * Defaults to true.
     */
    is_active?: boolean;

    /**
     * A delay between the start of the transition out and the transition in
     * given in milliseconds
     */
    gap?: number;

    /**
     * If true, the carousel moves in reverse direction (right to left).
     * Defaults to false.
     */
    direction?: boolean;

    /**
     * Transition configuration: can be a single transition or an object with `in` and `out` transitions.
     */
    transition?:
        Partial<ABTransitionOptions> |
        {
            in: Partial<ABTransitionOptions>;
            out: Partial<ABTransitionOptions>;
        } |
        string;

    /**
     * CSS class applied to each slide container (ab-carousel-slide is .
     */
    slide_class?: string;

    /**
     * CSS class applied to the image inside a slide.
     */
    slide_image_class?: string;

    /**
     * CSS class for the "previous" navigation button.
     */
    button_prev_class?: string;

    /**
     * CSS class for the "next" navigation button.
     */
    button_next_class?: string;

    /**
     * CSS class for the "stop" or "pause" button.
     */
    button_stop_class?: string;

    /**
     * CSS class used to select the thumbnail navigation container.
     */
    thumbnails_class?: string;

    /**
     * Initial slide index to display (0-based).
     * If out of range, defaults to 0.
     */
    slide_index?: number;

    /**
     * Optional plugins to extend carousel functionality.
     * The key is the plugin type, and the value is the plugin name to use.
     *
     * Example:
     * { playback: "classic", markers: "dots" }
     */
    plugins?: Partial<Record<PluginType, string>>;
}