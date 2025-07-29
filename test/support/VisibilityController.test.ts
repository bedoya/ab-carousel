/// <reference lib="dom" />

import { describe, it, expect, beforeEach, beforeAll, afterEach, vi } from 'vitest';
import { ABCarousel } from '@/core/ABCarousel';
import { VisibilityController } from '@support/VisibilityController';

let container: HTMLDivElement;
let carousel: ABCarousel;
let visibilityController: VisibilityController;

// eslint-disable-next-line no-undef
const intersectionCallbacks: IntersectionObserverCallback[] = [];

const triggerVisibility = ( state: 'visible' | 'hidden' ) => {
    Object.defineProperty( document, 'visibilityState', {
        configurable: true,
        get: () => state,
    } );
    document.dispatchEvent( new Event( 'visibilitychange' ) );
};

const triggerIntersection = ( isIntersecting: boolean ) => {
    for ( const callback of intersectionCallbacks ) {
        callback( [ { isIntersecting } ] as unknown as IntersectionObserverEntry[] );
    }
};

const setupDOM = () => {
    container = document.createElement( 'div' );
    container.className = 'ab-carousel';
    container.innerHTML = `
    <div class="ab-carousel-container">
      <section>Slide 1</section>
      <section>Slide 2</section>
    </div>`;
    document.body.innerHTML = '';
    document.body.appendChild( container );
};

const setupCarousel = ( active = true, speed = 50 ) => {
    carousel = new ABCarousel( container, { is_active: active, slide_speed: speed } );
    visibilityController = new VisibilityController( carousel, container );
};

describe( 'VisibilityController behavior', () => {
    beforeAll( () => {
        vi.stubGlobal( 'IntersectionObserver', class {
            // eslint-disable-next-line no-undef
            constructor( callback: IntersectionObserverCallback ) {
                intersectionCallbacks.push( callback );
            }

            observe() {
            }

            disconnect() {
            }
        } );
    } );

    beforeEach( () => {
        setupDOM();
        intersectionCallbacks.length = 0;
        vi.restoreAllMocks();
    } );

    afterEach( () => {
        visibilityController?.disconnect();
    } );

    it( 'pauses when scrolled out of view', () => {
        setupCarousel();
        const pauseSpy = vi.spyOn( carousel, 'pause' );

        triggerIntersection( false );
        expect( pauseSpy ).toHaveBeenCalled();
    } );

    it( 'resumes when scrolled into view', () => {
        setupCarousel();
        carousel.pause();
        const playSpy = vi.spyOn( carousel, 'play' );

        triggerIntersection( true );
        expect( playSpy ).toHaveBeenCalled();
    } );

    it( 'pauses on tab hide', () => {
        setupCarousel();
        const pauseSpy = vi.spyOn( carousel, 'pause' );

        triggerVisibility( 'hidden' );
        expect( pauseSpy ).toHaveBeenCalled();
    } );

    it( 'resumes on tab visible if intersecting', () => {
        setupCarousel();
        carousel.pause();
        const playSpy = vi.spyOn( carousel, 'play' );

        triggerIntersection( true );
        triggerVisibility( 'visible' );
        expect( playSpy ).toHaveBeenCalled();
    } );

    it( 'does not resume if still not visible after tab visible', () => {
        setupCarousel();
        carousel.pause();
        const playSpy = vi.spyOn( carousel, 'play' );

        triggerIntersection( false );
        triggerVisibility( 'visible' );
        expect( playSpy ).not.toHaveBeenCalled();
    } );

    it( 'pauses on blur', () => {
        setupCarousel();
        const pauseSpy = vi.spyOn( carousel, 'pause' );

        window.dispatchEvent( new Event( 'blur' ) );
        expect( pauseSpy ).toHaveBeenCalled();
    } );

    it( 'resumes on focus if visible', () => {
        setupCarousel();
        carousel.pause();
        const playSpy = vi.spyOn( carousel, 'play' );

        triggerIntersection( true );
        window.dispatchEvent( new Event( 'focus' ) );
        expect( playSpy ).toHaveBeenCalled();
    } );

    it( 'does not resume on focus if not visible', () => {
        setupCarousel();
        carousel.pause();
        const playSpy = vi.spyOn( carousel, 'play' );

        triggerIntersection( false );
        window.dispatchEvent( new Event( 'focus' ) );
        expect( playSpy ).not.toHaveBeenCalled();
    } );

    it( 'does not resume if is_active = false', () => {
        setupCarousel( false );
        const playSpy = vi.spyOn( carousel, 'play' );

        triggerIntersection( true );
        expect( playSpy ).not.toHaveBeenCalled();
    } );

    it( 'remains paused after visibilitychange if is_active is false', () => {
        carousel.pause(); // sets is_active = false
        expect( carousel.isActive() ).toBe( false );

        document.dispatchEvent( new Event( 'visibilitychange' ) );

        expect( carousel.isPlaying() ).toBe( false );
        expect( carousel.isPaused() ).toBe( true );
    } );
} );
