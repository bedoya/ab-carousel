import { buildCarouselFixture } from '/test/utils/buildCarouselFixture';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ABCarousel } from '@/core/ABCarousel';
import { wait } from '@support/Utilities';
import { ABSlide } from '@/core/ABSlide';

let carousel: ABCarousel;
let root: HTMLElement;

describe( 'ABSlide: instantiation', () => {
    // DOM copy, original, slideClass
    beforeEach( () => {
        root = buildCarouselFixture( 1, 'slider' );
    } );

    afterEach( () => {
        if ( carousel.isPlaying() ) {
            carousel.pause();
        }
        document.body.innerHTML = '';
    } );

    it( 'resolves the options from a string', () => {
        const firstSlide = root.querySelector( '.ab-carousel-container > *:first-child' ) as HTMLElement;
        firstSlide.dataset.transitionIn = 'ABTransitionFade';
        firstSlide.dataset.transitionOut = 'ABTransitionSlide';

        carousel = new ABCarousel( '#slider' );
        const slide = carousel.getSlide( 0 );

        expect( slide.getTransitionIn().name ).toBe( 'ABTransitionFade' );
        expect( slide.getTransitionOut().name ).toBe( 'ABTransitionSlide' );
    } );

    it( 'initializes effects from data-effect attributes', () => {
        const original = root.querySelector( '.ab-carousel-container > *:first-child' ) as HTMLElement;
        const span = document.createElement( 'span' );
        span.textContent = 'Hello';
        span.dataset.effect = 'ABEffectPulsatingGlow';
        span.dataset.boxGlowColor = '188, 19, 254';
        span.dataset.fontGlowColor = '0, 0, 255';
        span.dataset.duration = '1500';

        original.appendChild( span );

        carousel = new ABCarousel( '#slider', { slide_speed: 10 } );
        const slide = carousel.getSlide( 0 );

        expect( slide.effects.length ).toBe( 1 );
        expect( slide.effects[ 0 ].effect.constructor.name ).toBe( 'ABEffectPulsatingGlow' );
        expect( slide.effects[ 0 ].hasPlayed ).toBe( false );
    } );

    it( 'ignores unknown effects and warns', () => {
        const original = root.querySelector( '.ab-carousel-container > *:first-child' ) as HTMLElement;
        const span = document.createElement( 'span' );
        span.textContent = 'Hello';
        span.dataset.effect = 'NonExistentEffect';

        original.appendChild( span );
        const warnSpy = vi.spyOn( console, 'warn' ).mockImplementation( () => {
        } );

        carousel = new ABCarousel( '#slider' );
        const slide = carousel.getSlide( 0 );

        expect( warnSpy ).toHaveBeenCalledWith( '[ABSlide] Unknown effect "NonExistentEffect" ignored.' );
        expect( slide[ 'effects' ] ).toHaveLength( 0 );

        warnSpy.mockRestore();
    } );

    it( 'prepares all effects and restores original styles', () => {
        const original = root.querySelector( '.ab-carousel-container > *:first-child' ) as HTMLElement;
        const span = document.createElement( 'span' );
        span.textContent = 'Hello';
        span.dataset.effect = 'ABEffectBounceIn';
        span.style.position = 'relative';
        span.style.display = 'inline';

        original.appendChild( span );
        const element = original.querySelector( 'span' ) as HTMLElement;

        carousel = new ABCarousel( '#slider' );
        const slide = carousel.getSlide( 0 );

        slide.prepareEffects();

        expect( slide[ 'effects' ] ).toHaveLength( 1 );
        expect( element.style.display ).toBe( 'inline' );
    } );
} );