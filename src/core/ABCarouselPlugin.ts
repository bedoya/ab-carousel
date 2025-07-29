import type { ABCarousel } from '@/core/ABCarousel';
import { PluginType } from '@/types/ABExtensionsTypes';

/**
 * Base class for extensions that extend carousel behavior.
 */
export abstract class ABCarouselPlugin {
    abstract name: string;

    abstract type: PluginType;

    /**
     * Apply the plugin logic to the carousel instance.
     */
    abstract apply( carousel: ABCarousel ): void | Promise<void>;

    protected getPluginContainer( container: HTMLElement ): HTMLElement {
        let pluginLayer = container.querySelector( '.ab-carousel-plugins' ) as HTMLDivElement;

        if ( !pluginLayer ) {
            pluginLayer = document.createElement( 'div' );
            pluginLayer.className = 'ab-carousel-plugins';
            container.appendChild( pluginLayer );
        }

        return pluginLayer;
    }
}
