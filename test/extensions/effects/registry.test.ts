import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { registerEffect, unregisterEffect, resolveEffect } from '@effects/registry';
import { ABCarouselEffect } from '@/core/ABCarouselEffect';

class DummyEffect extends ABCarouselEffect {
    name = 'DummyEffect';
    applyEffect() {}
    resetEffect() {}
}

describe( 'Effect registry', () => {
    it( 'registerEffect should allow resolving the effect', () => {
        registerEffect( 'Dummy', DummyEffect );
        const effect = resolveEffect( 'Dummy' );
        expect( effect ).toBeInstanceOf( DummyEffect );
    } );

    it( 'unregisterEffect should make the effect unavailable', () => {
        unregisterEffect( 'Dummy' );
        const effect = resolveEffect( 'Dummy' );
        expect( effect ).toBeNull();
    } );
} );
