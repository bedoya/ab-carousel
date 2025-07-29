import { ABCarouselOptions } from '@/interfaces/ABCarouselOptions';
import { defaultCarouselOptions } from '@/defaults';
import { extractDataAttributes } from '@support/Utilities';
import { PluginType } from '@/types';

/**
 * Resolves ABCarousel configuration from defaults, data attributes, and inline options.
 */
export class CarouselOptionsResolver {
    /**
     * Combines default options, explicitly passed options, and data-* attributes on the element.
     * Ensures all expected option values are populated and normalized.
     *
     * @param {HTMLElement} element Carousel root element.
     * @param {Partial<ABCarouselOptions>} options Explicit options passed to the instance.
     *
     * @returns {ABCarouselOptions} Resolved and normalized options object.
     */
    static resolve(
        element: HTMLElement,
        options: Partial<ABCarouselOptions> = {}
    ): ABCarouselOptions {
        const dataOptions = extractDataAttributes(
            element,
            Object.keys( defaultCarouselOptions )
        );

        const resolved = {
            ...defaultCarouselOptions,
            ...dataOptions,
            ...options,
        };

        resolved.plugins = CarouselOptionsResolver.resolvePluginsOptions( resolved.plugins as unknown )

        return resolved;
    }

    /**
     * Resolves the `plugins` option from a raw string, trying JSON parsing first,
     * and falling back to `parsePlugins` if JSON fails.
     *
     * @param {unknown} raw Raw value potentially from a data attribute or options.
     *
     * @returns {Partial<Record<PluginType, string>> | undefined} Resolved plugin config or undefined.
     */
    private static resolvePluginsOptions( raw: unknown ): Partial<Record<PluginType, string>> | undefined {
        let resolved;
        if ( typeof raw === 'string' ) {
            try {
                resolved = JSON.parse( raw );
            }
            catch {
                resolved = CarouselOptionsResolver.parsePlugins( raw );
            }
        }
        return resolved;
    }

    /**
     * Parses a plugin definition string into a plugins object.
     *
     * Example: "playback:classic,markers:dots" → { playback: "classic", markers: "dots" }
     *
     * @param {string} input The raw plugin string.
     *
     * @returns {Partial<Record<PluginType, string>>} Parsed plugins object.
     */
    private static parsePlugins( input: string ): Record<string, string> {
        return input
            .split( ',' )
            .map( pair => pair.trim().split( ':' ) )
            .filter( ( [ type, val ] ) => type && val )
            .reduce( ( acc, [ type, val ] ) => {
                acc[ type.trim() ] = val.trim();
                return acc;
            }, {} as Record<string, string> );
    }
}
