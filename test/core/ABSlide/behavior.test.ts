import { buildCarouselFixture } from '/test/utils/buildCarouselFixture';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ABCarousel } from '@/core/ABCarousel';
import { ABCarouselOptions } from '@/interfaces/ABCarouselOptions';

let root: HTMLElement;
let carousel: ABCarousel;

describe( 'ABSlide: option resolution', () => {
    // data-*, priority: options < data-* < defaults
    beforeEach( () => {
        root = buildCarouselFixture( 1, 'slider' );
    } );

    afterEach( () => {
        if ( carousel.isPlaying() ) {
            carousel.pause();
        }
        document.body.innerHTML = '';
    } );

    it( 'resets only non-persistent effects', () => {
        const original = root.querySelector( '.ab-carousel-container > *:first-child' ) as HTMLElement;
        const span = document.createElement( 'span' );
        span.dataset.effect = 'ABEffectBounceIn';
        original.appendChild( span );

        carousel = new ABCarousel( '#slider' );
        const slide = carousel.getSlide( 0 );

        const effect = slide[ 'effects' ][ 0 ].effect;
        const spy = vi.spyOn( effect, 'resetEffect' );

        slide.resetEffects();

        expect( spy ).toHaveBeenCalledTimes( 1 );
    } );

    it( 'emits event and plays effects before transition', async () => {
        const original = root.querySelector( '.ab-carousel-container > *:first-child' ) as HTMLElement;
        const span = document.createElement( 'span' );
        span.dataset.effect = 'ABEffectBounceIn';
        original.appendChild( span );

        carousel = new ABCarousel( '#slider' );
        const slide = carousel.getSlide( 0 );

        const spy = vi.spyOn( slide as any, 'playEffects' );

        const eventListener = vi.fn();
        slide.element.addEventListener( 'ab-carousel-before-transition', eventListener );

        await slide.beforeTransition();

        expect( eventListener ).toHaveBeenCalled();
        expect( spy ).toHaveBeenCalledWith( 'beforeTransition' );
    } );
} );