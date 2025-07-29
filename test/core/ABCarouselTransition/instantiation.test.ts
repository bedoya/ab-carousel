import { describe, it, expect } from 'vitest';
import { ABCarouselTransition } from '@/core/ABCarouselTransition';

class DummyTransition extends ABCarouselTransition {
    name = 'dummy';
    applyIn() {}
    applyOut() {}
}

describe( 'ABCarouselTransition', () => {
    it( 'should return false for isInstant()', () => {
        const transition = new DummyTransition();
        expect( transition.isInstant() ).toBe( false );
    } );

    it( 'should allow subclassing with name and methods', () => {
        const transition = new DummyTransition();
        expect( transition.name ).toBe( 'dummy' );
        expect( typeof transition.applyIn ).toBe( 'function' );
        expect( typeof transition.applyOut ).toBe( 'function' );
    } );
} );
