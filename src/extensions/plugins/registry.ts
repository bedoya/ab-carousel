import type { ABCarouselPlugin } from '@/core/ABCarouselPlugin';
import { PluginType } from '@/types';
import { ABPluginClassicPlayback } from '@plugins/playback/ABPluginClassicPlayback.ts';
import { ABPluginDotMarkers } from '@plugins/markers/ABPluginDotMarkers';

type PluginConstructor = new () => ABCarouselPlugin;

const pluginRegistry: Record<PluginType, Record<string, PluginConstructor>> = {
    playback: {
        classic: ABPluginClassicPlayback,
    },
    markers: {
        dots: ABPluginDotMarkers,
    },
};

/** Register one plugin class */
export function registerPlugin( type: PluginType, key: string, pluginClass: PluginConstructor ): void {
    ( pluginRegistry[ type ] ??= {} )[ key ] = pluginClass;
}

/** Lookup helper */
export function resolvePlugin( type: PluginType, key: string ): PluginConstructor {
    const group = pluginRegistry[ type ];
    if ( !group || !group[ key ] ) {
        throw new Error( `Plugin not found: ${ type }.${ key }` );
    }
    return group[ key ];
}

