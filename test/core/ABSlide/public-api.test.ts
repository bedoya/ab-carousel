import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ABCarousel } from '@/core/ABCarousel';
import { ABSlide } from '@/core/ABSlide';
import { ABCarouselTransition } from '@/core/ABCarouselTransition';
import { ABCarouselOptions } from '@/interfaces/ABCarouselOptions';

let carousel: ABCarousel;
let slide: ABSlide;

describe( 'ABSlide: public API', () => {
    // getElement, getOriginal, getDuration, getOption, getTransitionIn/Out
    beforeEach( () => {
        document.body.innerHTML = `
			<div id="carousel" class="ab-carousel">
			    <div class="ab-carousel-container">
                    <div data-ab-slide data-duration="5000" class="slide solid" data-effect="fade" data-transition="ABTransitionFade">
                        <span data-effect="ABEffectBounceIn">Hello</span>
                        <span data-effect="ABEffectBounceIn">Hi</span>
                    </div>
                    <div data-ab-slide></div>
			    </div>
			</div>
		`;
        let options = {
            is_active: false,
            slide_speed: 6000,
            transition: { in: { name: "ABTransitionFade" }, out: { name: "ABTransitionSlide" } }
        } as ABCarouselOptions;

        carousel = new ABCarousel( '#carousel', options );
        slide = carousel.getSlide( 0 );
    } );

    afterEach( () => {
        if ( carousel.isPlaying() ) {
            carousel.pause();
        }
        document.body.innerHTML = '';
    } );

    it( 'getOption returns resolved values for the slide', () => {
        expect( slide.getOption( 'slideDuration' ) ).toBe( 6000 );
        expect( slide.getOption( 'slideClass' ) ).toContain( 'ab-carousel-slide' );
        expect( slide.getOption( 'transitionIn' ).name ).toBe( 'ABTransitionFade' );
        expect( slide.getOption( 'transitionOut' ).name ).toBe( 'ABTransitionSlide' );
    } );

    it( 'getTransitionIn returns a valid transition instance', () => {
        expect( slide.getTransitionIn() ).toBeInstanceOf( ABCarouselTransition );
    } );

    it( 'getTransitionOut returns a valid transition instance', () => {
        expect( slide.getTransitionIn() ).toBeInstanceOf( ABCarouselTransition );
    } );

    it( 'getClass returns the slide element classes', () => {
        expect( slide.getClass() ).toContain( 'slide solid' );
    } );

    it( 'getDuration returns duration from data attribute', () => {
        expect( slide.getDuration() ).toBe( 6000 );
    } );

    it( 'returns undefined and warns if option key does not exist', () => {
        const warnSpy = vi.spyOn( console, 'warn' ).mockImplementation( () => {} );
        const result = slide.getOption( 'nonexistent' );

        expect( result ).toBeUndefined();
        expect( warnSpy ).toHaveBeenCalledWith( '[ABSlide] Option "nonexistent" does not exist.' );

        warnSpy.mockRestore();
    } );
} );