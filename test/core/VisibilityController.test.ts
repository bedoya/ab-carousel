/* eslint-disable @typescript-eslint/no-unused-vars */
/* global DocumentVisibilityState, IntersectionObserverCallback */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ABCarousel } from '@/core/ABCarousel';
import { VisibilityController } from '@/support/VisibilityController';

let container: HTMLDivElement;

const sleep = ( ms: number ) => new Promise( ( resolve ) => setTimeout( resolve, ms ) );

const triggerVisibilityChange = ( state: 'visible' | 'hidden' ) => {
    Object.defineProperty( document, 'visibilityState', {
        configurable: true,
        get: () => state,
    } );
    document.dispatchEvent( new Event( 'visibilitychange' ) );
};

// const triggerIntersection = ( entry: Partial<IntersectionObserverEntry> ) => {
//     const observe = vi.fn();
//     const disconnect = vi.fn();
//
//     // @ts-expect-error override global constructor
//     globalThis.IntersectionObserver = vi.fn( ( cb: ( entries: IntersectionObserverEntry[] ) => void ) => {
//         cb( [ { isIntersecting: entry.isIntersecting ?? false } ] as IntersectionObserverEntry[] );
//         return { observe, disconnect };
//     } );
// };

const intersectionCallbacks: Function[] = [];

vi.stubGlobal('IntersectionObserver', class {
    constructor(callback: Function) {
        intersectionCallbacks.push(callback);
    }
    observe() {}
    unobserve() {}
    disconnect() {}
});

// Helper para disparar manualmente la intersección
function triggerIntersection(entry: Partial<IntersectionObserverEntry>) {
    for (const callback of intersectionCallbacks) {
        callback([entry]);
    }
}

describe( 'VisibilityController behavior', () => {
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
        document.body.innerHTML = '';
        document.body.appendChild( container );
        intersectionCallbacks.length = 0;
        vi.useRealTimers();
    } );

    const setupCarousel = ( isActive = true, speed = 50 ) => {
        const carousel = new ABCarousel( container, { is_active: isActive, slide_speed: speed } );
        new VisibilityController( carousel, container );
        return carousel;
    };

    it( 'should stop playback when carousel scrolls out of view', async () => {
        const carousel = setupCarousel();
        carousel.play();
        const pauseSpy = vi.spyOn( carousel, 'pause' );

        triggerIntersection( { isIntersecting: false } );
        await sleep( 10 );

        expect( pauseSpy ).toHaveBeenCalled();
    } );

    it( 'should resume playback when carousel becomes visible again', async () => {
        const carousel = setupCarousel();
        carousel.pause();
        const playSpy = vi.spyOn( carousel, 'play' );

        triggerIntersection( { isIntersecting: true } );
        await sleep( 10 );

        expect( playSpy ).toHaveBeenCalled();
    } );

    it( 'should pause when switching to another tab', async () => {
        const carousel = setupCarousel();
        carousel.play();
        const pauseSpy = vi.spyOn( carousel, 'pause' );

        triggerVisibilityChange( 'hidden' );
        await sleep( 10 );

        expect( pauseSpy ).toHaveBeenCalled();
    } );

    it( 'should resume when switching back to tab if visible', async () => {
        const carousel = setupCarousel();
        carousel.pause();
        const playSpy = vi.spyOn( carousel, 'play' );

        triggerIntersection( { isIntersecting: true } );
        triggerVisibilityChange( 'visible' );
        await sleep( 10 );

        expect( playSpy ).toHaveBeenCalled();
    } );

    it( 'should pause when window loses focus', async () => {
        const carousel = setupCarousel();
        carousel.play();
        const pauseSpy = vi.spyOn( carousel, 'pause' );

        window.dispatchEvent( new Event( 'blur' ) );
        await sleep( 10 );

        expect( pauseSpy ).toHaveBeenCalled();
    } );

    it( 'should resume when window regains focus if visible', async () => {
        const carousel = setupCarousel();
        carousel.pause();
        const playSpy = vi.spyOn( carousel, 'play' );

        triggerIntersection( { isIntersecting: true } );
        window.dispatchEvent( new Event( 'focus' ) );
        await sleep( 10 );

        expect( playSpy ).toHaveBeenCalled();
    } );

    it( 'should not resume when not visible after scroll in', async () => {
        const carousel = setupCarousel();
        carousel.pause();
        const playSpy = vi.spyOn( carousel, 'play' );

        triggerIntersection( { isIntersecting: false } );
        window.dispatchEvent( new Event( 'focus' ) );
        await sleep( 10 );

        expect( playSpy ).not.toHaveBeenCalled();
    } );

    it( 'should not resume when not visible after tab change', async () => {
        const carousel = setupCarousel();
        carousel.pause();
        const playSpy = vi.spyOn( carousel, 'play' );

        triggerIntersection( { isIntersecting: false } );
        triggerVisibilityChange( 'visible' );
        await sleep( 10 );

        expect( playSpy ).not.toHaveBeenCalled();
    } );

    it( 'should not resume when not visible after app focus', async () => {
        const carousel = setupCarousel();
        carousel.pause();
        const playSpy = vi.spyOn( carousel, 'play' );

        triggerIntersection( { isIntersecting: false } );
        window.dispatchEvent( new Event( 'focus' ) );
        await sleep( 10 );

        expect( playSpy ).not.toHaveBeenCalled();
    } );
} );
