import { describe, it, expect } from 'vitest';
import { unregisterTransition, resolveTransition, registerTransition } from '@transitions/registry';
import { ABCarouselTransition } from '@/core/ABCarouselTransition';
import { ABTransitionNone } from '@transitions/none/ABTransitionNone';

class DummyTransition extends ABCarouselTransition {
    name: string;
    applyIn() {}
    applyOut() {}
}

describe( 'Transition registry', () => {
    it( 'registerTransition should allow resolving the transition', () => {
        registerTransition( 'Dummy', DummyTransition );
        const effect = resolveTransition( 'Dummy' );
        expect( effect ).toBeInstanceOf( DummyTransition );
    } );

    it( 'unregisterTransition should make the transition unavailable', () => {
        unregisterTransition( 'Dummy' );
        const transition = resolveTransition( 'Dummy' );
        expect( transition ).toBeInstanceOf( ABTransitionNone );
    } );
} );
