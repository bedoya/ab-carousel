import { buildCarouselFixture } from '/test/utils/buildCarouselFixture'
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ABCarousel } from '@/core/ABCarousel';

let root: HTMLElement;
let carousel: ABCarousel;

describe( 'ABCarousel: rendering', () => {
    beforeEach( () => {
        root = buildCarouselFixture( 2, 'slider' );
    } );

    afterEach( () => {
        if ( carousel.isPlaying() ) {
            carousel.pause();
        }
        document.body.innerHTML = '';
    } );

    it( 'displays only the first slide initially', () => {
        carousel = new ABCarousel( root );
        const slides = root.querySelectorAll( '.ab-carousel-slide' );
        slides.forEach( ( slide, index ) => {
            const style = window.getComputedStyle( slide );
            if ( index === 0 ) {
                expect( style.display ).not.toBe( 'none' );
                expect( style.visibility ).not.toBe( 'hidden' );
            }
            else {
                expect( style.display === 'none' || style.visibility === 'hidden' ).toBe( true );
            }
        } );
    } );
} );