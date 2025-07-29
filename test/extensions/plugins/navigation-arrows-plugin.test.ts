import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ABCarousel } from '@/core/ABCarousel';
import { buildCarouselFixture } from '../../utils/buildCarouselFixture';

let carousel: ABCarousel;
let container: HTMLElement;
let arrows: HTMLDivElement;

const waitForNextFrame = () => new Promise( r => requestAnimationFrame( r ) );

describe( 'ABPluginClassicPlayback', () => {
    beforeEach( async () => {
        container = buildCarouselFixture( 4, 'slider' );
        document.body.appendChild( container );

        carousel = new ABCarousel( container, {
            plugins: { navigation: 'arrows' }
        } );

        arrows = container.querySelector( '.ab-carousel-navigation' ) as HTMLDivElement;
    } );

    afterEach( () => {
        document.body.innerHTML = '';
    } );

    it( 'renders previous and next arrow buttons into the DOM', () => {
        expect( arrows ).not.toBeNull();

        expect( arrows?.querySelector( '.ab-carousel-next' ) ).not.toBeNull();
        expect( arrows?.querySelector( '.ab-carousel-prev' ) ).not.toBeNull();
    } );

    it( 'renders arrows directly inside the main container, not in the plugin layer', () => {
        const arrowsWrapper = container.querySelector( '.ab-carousel-navigation' )!;
        expect( arrowsWrapper.parentElement?.classList ).toContain( 'ab-carousel' );
    } );

    it( 'advances to the next slide when next arrow is clicked', async () => {
        const next = arrows.querySelector( '.ab-carousel-next' ) as HTMLButtonElement;
        expect( carousel.getVisibleSlideIndex() ).toBe( 0 );
        next.click();
        await waitForNextFrame();

        expect( carousel.getVisibleSlideIndex() ).toBe( 1 );
    } );

    it( 'moves to the previous slide when previous arrow is clicked', async () => {
        const prev = arrows.querySelector( '.ab-carousel-prev' ) as HTMLButtonElement;
        expect( carousel.getVisibleSlideIndex() ).toBe( 0 );
        prev.click();
        await waitForNextFrame();

        expect( carousel.getVisibleSlideIndex() ).toBe( 3 );
    } );
} );
