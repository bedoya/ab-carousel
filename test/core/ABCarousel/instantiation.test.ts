import { buildCarouselFixture } from '/test/utils/buildCarouselFixture'
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ABCarousel } from '@/core/ABCarousel';

let root: HTMLElement;
let carousel: ABCarousel;

describe( 'ABCarousel: instantiation', () => {
    beforeEach( () => {
        root = buildCarouselFixture( 1, 'slider' );
    } );

    afterEach( () => {
        if ( carousel.isPlaying() ) {
            carousel.pause();
        }
        document.body.innerHTML = '';
    } );

    it( 'creates ABCarousel from a selector', () => {
        carousel = new ABCarousel( '#slider' );

        expect( carousel ).toBeInstanceOf( ABCarousel );
    } );

    it( 'creates ABCarousel from an HTMLElement', () => {
        carousel = new ABCarousel( root );

        expect( carousel ).toBeInstanceOf( ABCarousel );
    } );

    it( 'throws an error when selector does not match any element', () => {
        expect( () => {
            new ABCarousel( '#not-valid' );
        } ).toThrow( '[ABCarousel] Element not found for selector "#not-valid"' );
    } );

    it( 'throws an error when selector is not valid', () => {
        expect( () => {
            new ABCarousel( 123 );
        } ).toThrow( '[ABCarousel] Invalid target element' );
    } );

    it( 'throws if HTMLElement has no .ab-carousel-container', () => {
        const invalid = document.createElement( 'div' );
        invalid.className = 'ab-carousel';
        document.body.appendChild( invalid );

        expect( () => new ABCarousel( invalid ) ).toThrow();
    } );
} );