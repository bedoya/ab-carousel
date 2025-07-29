/// <reference lib="dom" />
import { buildCarouselFixture } from '/test/utils/buildCarouselFixture'
import { describe, it, vi, expect, beforeEach, afterEach } from 'vitest';
import { ABCarousel } from '@/core/ABCarousel';
import { wait } from '@support/Utilities';
import { defaultCarouselOptions } from '@/defaults/carousel';
import { ABSlide } from '@/core/ABSlide';

let root: HTMLElement;
let carousel: ABCarousel;

describe( 'ABCarousel: api', () => {

    beforeEach( () => {
        root = buildCarouselFixture( 4, 'slider' );
    } );

    afterEach( () => {
        if ( carousel.isPlaying() ) {
            carousel.pause();
        }
        document.body.innerHTML = '';
    } );

    it( 'isActive() reflects is_active option correctly', () => {
        carousel = new ABCarousel( root, { is_active: true } );
        expect( carousel.isActive() ).toBe( true );

        carousel.pause( true );
        expect( carousel.isActive() ).toBe( false );

        carousel.play( true );
        expect( carousel.isActive() ).toBe( true );
    } );

    it( 'getSlider returns the ABSlider instance', () => {
        carousel = new ABCarousel( root );

        expect( carousel.getSlider() ).toBeDefined();
        expect( carousel.getSlider().constructor.name ).toBe( 'ABSlider' );
    } );

    it( 'isVisible returns true if carousel is visible, false if not', () => {
        let intersectionCallback: IntersectionObserverCallback;

        global.IntersectionObserver = vi.fn( ( cb ) => {
            intersectionCallback = cb;
            return {
                observe: vi.fn(),
                disconnect: vi.fn(),
            } as unknown as IntersectionObserver;
        } );

        root = buildCarouselFixture( 1, 'slider' );
        carousel = new ABCarousel( root );

        // simulate visible
        intersectionCallback?.( [ { isIntersecting: true } as IntersectionObserverEntry ], {} as IntersectionObserver );
        expect( carousel.isVisible() ).toBe( true );

        // simulate hidden
        intersectionCallback?.( [ { isIntersecting: false } as IntersectionObserverEntry ], {} as IntersectionObserver );
        expect( carousel.isVisible() ).toBe( false );
    } );

    it( 'getOption returns correct value for a known option', () => {
        carousel = new ABCarousel( root );

        expect( carousel.getOption( 'slide_speed' ) ).toBe( defaultCarouselOptions.slide_speed );
    } );

    it( 'getSlidesCount returns total number of slides', () => {
        carousel = new ABCarousel( root );

        expect( carousel.getSlidesCount() ).toBeGreaterThan( 0 );
    } );

    it( 'pause() sets is_playing = false and stops the interval', async () => {
        vi.useFakeTimers();
        carousel = new ABCarousel( root, { slide_speed: 50 } );
        const spy = vi.spyOn( carousel[ 'slider' ], 'advance' );

        carousel.pause();
        const visible = carousel.getVisibleSlideIndex();
        vi.advanceTimersByTime( 1000 );

        expect( spy ).not.toHaveBeenCalled();
        expect( carousel.getVisibleSlideIndex() ).toBe( visible );
        expect( carousel.isPaused( true ) ).toBe( true );
        vi.useRealTimers();
    } );

    it( 'pause(true) also sets is_active = false', () => {
        carousel = new ABCarousel( root );
        carousel.pause( true );
        expect( carousel.isActive() ).toBe( false );
    } );

    it( 'play() starts the interval only if is_active is true', async () => {
        carousel = new ABCarousel( root, { slide_speed: 50, is_active: true } );
        carousel.play();
        const index = carousel.getVisibleSlideIndex();
        await wait( 60 );
        expect( carousel.getVisibleSlideIndex() ).not.toBe( index );
    } );

    it( 'play(true) sets is_active = true and starts autoplay', async () => {
        carousel = new ABCarousel( root, { slide_speed: 50, is_active: false } );
        carousel.play( true );
        await wait( 60 );
        expect( carousel.isActive() ).toBe( true );
        expect( carousel.getVisibleSlideIndex() ).toBe( 1 );
    } );

    it( 'returns the visible slide', () => {
        const carousel = new ABCarousel( root );
        const visibleSlide = carousel.getVisibleSlide();
        expect( visibleSlide ).toBeInstanceOf( ABSlide );
    } );
} );
