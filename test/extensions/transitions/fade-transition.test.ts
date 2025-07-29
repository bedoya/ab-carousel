import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ABTransitionFade } from '@/extensions/transitions/fade/ABTransitionFade';
import { defaultTransitionOptions } from '@/defaults/transitions';

describe( 'ABTransitionFade', () => {
    let transition: ABTransitionFade;
    let element: HTMLDivElement;

    beforeEach( () => {
        vi.useFakeTimers();
        // eslint-disable-next-line no-undef
        vi.stubGlobal( 'requestAnimationFrame', ( cb: FrameRequestCallback ) => {
            return setTimeout( () => cb( performance.now() ), 0 );
        } );

        element = document.createElement( 'div' );
        document.body.appendChild( element );
    } );

    afterEach( () => {
        vi.unstubAllGlobals();
        vi.useRealTimers();
        element.remove();
    } );

    it( 'should apply fade-in styles and activate element', async () => {
        transition = new ABTransitionFade( { duration: 500 } );
        const promise = transition.applyIn( element );
        vi.runAllTimers();
        await promise;

        expect( element.style.display ).toBe( 'block' );
        expect( element.style.visibility ).toBe( 'visible' );
        expect( element.style.opacity ).toBe( '1' );
        expect( element.classList.contains( 'active' ) ).toBe( true );
    } );

    it( 'should apply fade-out styles and deactivate element', async () => {
        transition = new ABTransitionFade( { duration: 500 } );
        element.classList.add( 'active' );
        const promise = transition.applyOut( element );
        vi.runAllTimers();
        await promise;

        expect( element.style.opacity ).toBe( '0' );
        expect( element.style.display ).toBe( 'none' );
        expect( element.style.visibility ).toBe( 'hidden' );
        expect( element.classList.contains( 'active' ) ).toBe( false );
    } );

    it( 'should animate opacity over the given duration', async () => {
        transition = new ABTransitionFade( { duration: 500 } );
        const promise = transition.applyIn( element );
        vi.advanceTimersByTime( 500 );
        await promise;

        expect( element.style.opacity ).toBe( '1' );
    } );

    it( 'should fall back to default duration if not provided', () => {
        const transition = new ABTransitionFade();
        // @ts-expect-error: access private duration for testing
        expect( transition[ 'duration' ] ).toBe( defaultTransitionOptions.duration );
    } );
} );
