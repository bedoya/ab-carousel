import { buildCarouselFixture } from '/test/utils/buildCarouselFixture';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ABCarousel } from '@/core/ABCarousel';

let carousel: ABCarousel;
let container: HTMLElement;
let dots;
let transition: Promise<void>;

function waitForTransition( container: HTMLElement ): Promise<void> {
    return new Promise( resolve => {
        container.addEventListener( 'ab-carousel-transition', () => resolve(), { once: true } );
    } );
}

describe( '', () => {
    beforeEach( () => {
        container = buildCarouselFixture( 4, 'slider' );

        document.body.appendChild( container );
        carousel = new ABCarousel( container, {
            plugins: { markers: 'dots' }
        } );

        transition = waitForTransition( container );
        dots = container.querySelectorAll( '.ab-carousel-dot' );

        vi.spyOn( carousel, 'play' );
    } );

    afterEach( () => {
        carousel.pause();
        document.body.innerHTML = '';
    } );

    it( 'creates the correct number of dots', () => {
        expect( dots.length ).toBe( 4 );
    } );

    it( 'clicking a dot activates the corresponding slide and restarts playback', async () => {
        dots[ 2 ].dispatchEvent( new MouseEvent( 'click', { bubbles: true } ) );
        await transition;

        expect( carousel.getVisibleSlideIndex() ).toBe( 2 );
    } );

    it( 'clicking the current dot does not restart playback', async () => {
        expect( carousel.getVisibleSlideIndex() ).toBe( 0 );
        dots[ 0 ].dispatchEvent( new MouseEvent( 'click', { bubbles: true } ) );

        expect( carousel.play ).not.toHaveBeenCalled();
    } );

    it( 'clicking a dot updates the .active class', async () => {
        expect( dots[ 0 ].classList.contains( 'active' ) ).toBe( true );
        expect( dots[ 2 ].classList.contains( 'active' ) ).toBe( false );

        await carousel.getSlider().advance( 2 );
        await Promise.resolve();

        expect( dots[ 0 ].classList.contains( 'active' ) ).toBe( false );
        expect( dots[ 2 ].classList.contains( 'active' ) ).toBe( true );
    } );
} );