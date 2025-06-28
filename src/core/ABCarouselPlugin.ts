import type { ABCarousel } from './ABCarousel';

/**
 * Base class for plugins that extend carousel behavior.
 */
export abstract class ABCarouselPlugin {
    abstract name: string;

    /**
     * Apply the plugin logic to the carousel instance.
     */
    abstract apply( carousel: ABCarousel ): void | Promise<void>;
}
