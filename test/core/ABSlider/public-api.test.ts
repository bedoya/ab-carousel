import { describe, it, expect, beforeEach } from 'vitest';
import { ABSlider } from '@/core/ABSlider';
import { buildCarouselFixture } from '/test/utils/buildCarouselFixture';
import { ABCarousel } from '@/core/ABCarousel';
import { ABSlide } from '@/core/ABSlide';

let root;
let carousel: ABCarousel;
let slider: ABSlider;

function getSlides() {
    return document.getElementsByClassName( 'ab-carousel-slide' );
}

describe( 'ABSlider: public API', () => {
    beforeEach( () => {
        root = buildCarouselFixture( 3, 'slider' );
        carousel = new ABCarousel( root );
        slider = carousel.getSlider();
    } );

    it( 'getSlidesCount returns correct count', () => {
        expect( slider.getSlidesCount() ).toBe( 3 );
    } );

    it( 'getSlide returns correct slide', () => {
        const slide = slider.getSlide( 1 );
        expect( slide ).toBeDefined();
        expect( slide.element ).toStrictEqual( getSlides()[ 1 ] );
        expect( slide ).toBeInstanceOf( ABSlide );
    } );

    it( 'getCurrentSlide returns current slide', () => {
        expect( slider.getCurrentSlide().element ).toStrictEqual( getSlides()[ 0 ] );
    } );

    it( 'getIndex returns current index', () => {
        expect( slider.getIndex() ).toBe( 0 );
    } );

    it( 'setIndex updates index correctly', () => {
        slider.setIndex( 2 );
        expect( slider.getIndex() ).toBe( 2 );
    } );

    it( 'advanceIndex increases index and wraps', () => {
        slider.advanceIndex( 2 );
        expect( slider.getIndex() ).toBe( 2 );
        slider.advanceIndex( 1 );
        expect( slider.getIndex() ).toBe( 0 );
    } );

    it( 'getNextIndex wraps correctly', () => {
        slider.setIndex( 2 );
        expect( slider.getNextIndex( 1 ) ).toBe( 0 );
        expect( slider.getNextIndex( -1 ) ).toBe( 1 );
    } );

    it( 'advance executes a transition and updates index', async () => {
        const initial = slider.getIndex();
        await slider.advance();
        expect( slider.getIndex() ).toBe( ( initial + 1 ) % 3 );
    } );
} );
