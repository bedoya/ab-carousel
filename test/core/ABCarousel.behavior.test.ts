import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ABCarousel } from '@/core/ABCarousel';
import '@/styles/ab-carousel.css';

let container: HTMLElement;

describe( 'ABCarousel behavior', () => {
    beforeEach( () => {
        container = document.createElement( 'div' );
        container.className = 'ab-carousel';
        container.innerHTML = `
      <div class="ab-carousel-container">
        <section>Slide 1</section>
        <section>Slide 2</section>
        <section>Slide 3</section>
      </div>
    `;
        document.body.appendChild( container );
        vi.useFakeTimers();
    } );

    afterEach( () => {
        document.body.innerHTML = '';
        vi.clearAllTimers();
        vi.useRealTimers();
    } );

    it( 'should display only the first slide initially', () => {
        new ABCarousel( container );
        const slides = container.querySelectorAll( '.ab-carousel-slide' );

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

    it( 'should change to the next slide manually', () => {
        const carousel = new ABCarousel( container, { is_active: false } );
        // @ts-expect-error: testing internal method
        carousel.advanceSlide();

        const slides = container.querySelectorAll( '.ab-carousel-slide' );
        const style = window.getComputedStyle( slides[ 1 ] );
        expect( style.display ).not.toBe( 'none' );
    } );

    it( 'should animate automatically when is_active is true or undefined', async () => {
        vi.useRealTimers();
        const carousel = new ABCarousel( container, { slide_speed: 50 } );
        const getVisibleIndex = () => carousel.getVisibleSlideIndex();

        await new Promise( resolve => setTimeout( resolve, 10 ) );
        expect( getVisibleIndex() ).toBe( 0 );
        await new Promise( resolve => setTimeout( resolve, 50 ) );
        expect( getVisibleIndex() ).toBe( 1 );
        await new Promise( resolve => setTimeout( resolve, 50 ) );
        expect( getVisibleIndex() ).toBe( 2 );
        carousel.pause();
    }, 1000 );

    it( 'should stop the automatic slide change when pause() is called', async () => {
        vi.useRealTimers();
        const carousel = new ABCarousel( container, { slide_speed: 50 } );
        console.log( { active: carousel.getOption( 'is_active' ) } );

        await new Promise( resolve => setTimeout( resolve, 60 ) );
        console.log( { active: carousel.getOption( 'is_active' ), index: carousel.getVisibleSlideIndex() } );
        carousel.pause();
        console.log( { active: carousel.getOption( 'is_active' ), index: carousel.getVisibleSlideIndex() } );
        const visibleIndex = carousel.getVisibleSlideIndex();

        // @ts-expect-error
        expect( carousel.isPaused() ).toBe( true );
        console.log( { paused: carousel.isPaused(), index: carousel.getVisibleSlideIndex() } );
        await new Promise( resolve => setTimeout( resolve, 50 ) );
        console.log( { paused: carousel.isPaused(), index: carousel.getVisibleSlideIndex() } );
        expect( carousel.getVisibleSlideIndex() ).toBe( visibleIndex );
        carousel.pause();
    }, 1000 );

    it( 'should start the automatic slide change when play() is called', async () => {
        vi.useRealTimers();
        const carousel = new ABCarousel( container, { is_active: false, slide_speed: 50 } );
        expect( carousel.getVisibleSlideIndex() ).toBe( 0 );
        carousel.play( 1, true );
        await new Promise( resolve => setTimeout( resolve, 60 ) );
        expect( carousel.getVisibleSlideIndex() ).toBe( 1 );
        carousel.pause();
    } );

    it( 'should auto-rotate if is_active is true', () => {
        new ABCarousel( container, { slide_speed: 1000 } );

        vi.advanceTimersByTime( 1100 );

        const slides = container.querySelectorAll( '.ab-carousel-slide' );
        const style = window.getComputedStyle( slides[ 1 ] );
        expect( style.display ).not.toBe( 'none' );
    } );

    it( 'should not auto-rotate if is_active is false', async () => {
        vi.useRealTimers();
        const carousel = new ABCarousel( container, { is_active: false, slide_speed: 50 } );
        const visibleIndex = carousel.getVisibleSlideIndex();
        await new Promise( resolve => setTimeout( resolve, Math.floor( Math.random() * ( 1000 - 60 + 1 ) ) + 60 ) );
        expect( carousel.getVisibleSlideIndex() ).toBe( visibleIndex );
        carousel.pause();
    } );
} );
