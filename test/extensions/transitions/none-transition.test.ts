import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ABTransitionNone } from '@/extensions/transitions/none/ABTransitionNone';

describe( 'ABTransitionNone', () => {
    let transition: ABTransitionNone;
    let element: HTMLDivElement;

    beforeEach( () => {
        transition = new ABTransitionNone();
        element = document.createElement( 'div' );
        document.body.appendChild( element );
    } );

    afterEach( () => {
        element.remove();
    } );

    it( 'should be instant', () => {
        expect( transition.isInstant() ).toBe( true );
    } );

    it( 'should apply "in" styles correctly', () => {
        transition.applyIn( element );
        expect( element.style.display ).toBe( 'block' );
        expect( element.style.visibility ).toBe( 'visible' );
        expect( element.classList.contains( 'active' ) ).toBe( true );
    } );

    it( 'should apply "out" styles correctly', () => {
        element.classList.add( 'active' );
        transition.applyOut( element );
        expect( element.style.display ).toBe( 'none' );
        expect( element.style.visibility ).toBe( 'hidden' );
        expect( element.classList.contains( 'active' ) ).toBe( false );
    } );
} );
