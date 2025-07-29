import { describe, it, expect } from 'vitest';
import { registerPlugin, resolvePlugin } from '@/extensions/plugins/registry';
import { ABPluginClassicPlayback } from '@/extensions/plugins/playback/ABPluginClassicPlayback';
import { ABCarouselPlugin } from '@/core/ABCarouselPlugin';
import { PluginType } from '@/types/ABExtensionsTypes';

class DummyPlugin extends ABCarouselPlugin {
    name = 'Dummy';
    type: PluginType = 'playback';

    apply(): void {}
}

describe( 'plugin registry', () => {
    it( 'resolves a known plugin', () => {
        const plugin = resolvePlugin( 'playback', 'classic' );
        expect( plugin ).toBe( ABPluginClassicPlayback );
    } );

    it( 'throws for unknown plugin', () => {
        expect( () => resolvePlugin( 'playback', 'invalid' ) ).toThrow( /Plugin not found/ );
        expect( () => resolvePlugin( 'unknown' as any, 'classic' ) ).toThrow( /Plugin not found/ );
    } );

    it( 'registers and resolves a new plugin', () => {
        registerPlugin( 'markers', 'dummy', DummyPlugin );
        const plugin = resolvePlugin( 'markers', 'dummy' );
        expect( plugin ).toBe( DummyPlugin );
    } );
} );
