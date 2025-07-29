import { describe, it, expect, beforeEach } from 'vitest';
import { ABCarousel } from '@/core/ABCarousel';
import { ABSlider } from '@/core/ABSlider';
import { buildCarouselFixture } from '/test/utils/buildCarouselFixture';

let root: HTMLElement;
let carousel: ABCarousel;
let slider: ABSlider;

describe( 'ABSlider: instantiation', () => {
    beforeEach( () => {
        root = buildCarouselFixture( 3, 'slider' );
        carousel = new ABCarousel( root, { slide_index: 1 } );
        slider = carousel.getSlider();
    } );

    it( 'should initialize the correct number of slides', () => {
        expect( slider.getSlidesCount() ).toBe( 3 );
    } );

    it( 'should use the slide_index from options', () => {
        expect( slider.getIndex() ).toBe( 1 );
    } );

    it( 'should default to index 0 if slide_index is out of bounds', () => {
        carousel = new ABCarousel( root, { slide_index: 99 } );
        slider = carousel.getSlider();
        expect( slider.getIndex() ).toBe( 0 );
    } );
} );
