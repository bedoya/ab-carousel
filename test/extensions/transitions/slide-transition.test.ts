import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ABTransitionSlide } from '@/extensions/transitions/slide/ABTransitionSlide';

describe( 'ABTransitionSlide', () => {
    let transition: ABTransitionSlide;
    let element: HTMLDivElement;
    let parent: HTMLDivElement;

    beforeEach( () => {
        vi.useFakeTimers();
        // eslint-disable-next-line no-undef
        vi.stubGlobal( 'requestAnimationFrame', ( cb: FrameRequestCallback ) =>
            setTimeout( () => cb( performance.now() ), 0 )
        );

        parent = document.createElement( 'div' );
        parent.style.width = '600px'; // just for visual; not used
        Object.defineProperty( parent, 'offsetWidth', { value: 600 } );

        element = document.createElement( 'div' );
        parent.appendChild( element );
        document.body.appendChild( parent );

        transition = new ABTransitionSlide( { duration: 300 } ); // step = (600 / 300) * 16 = 32
    } );

    afterEach( () => {
        vi.useRealTimers();
        vi.unstubAllGlobals();
        parent.remove();
    } );

    it( 'should apply slide-in and end with no inline styles', async () => {
        const promise = transition.applyIn( element );
        vi.runAllTimers();
        await promise;

        expect( element.getAttribute( 'style' ) ).toBeNull();
    } );

    it( 'should apply slide-out and hide element', async () => {
        element.classList.add( 'active' );
        const promise = transition.applyOut( element );
        vi.runAllTimers();
        await promise;

        expect( element.style.display ).toBe( 'none' );
        expect( element.style.visibility ).toBe( 'hidden' );
        expect( element.classList.contains( 'active' ) ).toBe( false );
    } );

    it( 'should compute direction based on options', () => {
        const leftToRight = new ABTransitionSlide( { direction: false } );
        const rightToLeft = new ABTransitionSlide( { direction: true } );

        // @ts-expect-error testing private property
        expect( leftToRight[ 'direction' ] ).toBe( -1 );
        // @ts-expect-error testing private property
        expect( rightToLeft[ 'direction' ] ).toBe( 1 );
    } );
} );
