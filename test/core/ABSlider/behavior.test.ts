import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ABCarousel } from '@/core/ABCarousel';
import { ABSlider } from '@/core/ABSlider';
import { buildCarouselFixture } from '/test/utils/buildCarouselFixture';

let root: HTMLElement;
let carousel: ABCarousel;
let slider: ABSlider;

describe( 'ABSlider: behavior', () => {
    beforeEach( () => {
        root = buildCarouselFixture( 3, 'slider' );
        carousel = new ABCarousel( root );
        slider = carousel.getSlider();
    } );

    it( 'advance() should increase index by 1', async () => {
        const index = slider.getIndex();
        await slider.advance();
        expect( slider.getIndex() ).toBe( ( index + 1 ) % 3 );
    } );

    it( 'advance() should respect custom delta', async () => {
        await slider.advance( 2 );
        expect( slider.getIndex() ).toBe( 2 );
    } );

    it( 'advanceIndex() should update index without transition', () => {
        slider.advanceIndex( 2 );
        expect( slider.getIndex() ).toBe( 2 );
    } );

    it( 'advanceIndex() wraps correctly on overflow', () => {
        slider.advanceIndex( 4 );
        expect( slider.getIndex() ).toBe( 1 );
    } );

    it( 'advance() should not run if already transitioning', async () => {
        slider[ 'is_transitioning' ] = true;
        const index = slider.getIndex();
        await slider.advance();
        expect( slider.getIndex() ).toBe( index );
    } );

    it( 'getNextIndex() returns 0 if there are no slides', () => {
        slider[ 'slides' ].length = 0;
        expect( slider.getNextIndex( 1 ) ).toBe( 0 );
    } );

    it( 'getNextIndex() wraps correctly with negative delta', () => {
        slider.setIndex( 0 );
        expect( slider.getNextIndex( -1 ) ).toBe( 2 );
    } );

    it( 'getNextIndex() wraps correctly with positive delta beyond length', () => {
        slider.setIndex( 2 );
        expect( slider.getNextIndex( 2 ) ).toBe( 1 );
    } );

} );
