import { buildCarouselFixture } from '/test/utils/buildCarouselFixture';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ABCarousel } from '@/core/ABCarousel';

let root: HTMLElement;
let carousel: ABCarousel;
describe( 'ABCarousel: autoplay behavior', () => {
    beforeEach( () => {
        root = buildCarouselFixture( 2, 'slider' );
    } );

    afterEach( () => {
        if ( carousel.isPlaying() ) {
            carousel.pause();
        }
        document.body.innerHTML = '';
    } );

    it( 'starts playing automatically when is_active is true', async () => {
        carousel = new ABCarousel( root, { is_active: true, slide_speed: 10 } );

        await carousel.ready;
        const firstIndex = carousel.getVisibleSlideIndex();

        await vi.waitFor( () => {
            expect( carousel.isPlaying() ).toBe( true );
        } );
        await new Promise( resolve => setTimeout( resolve, 11 ) );
        const currentIndex = carousel.getVisibleSlideIndex();

        expect( currentIndex ).not.toBe( firstIndex );
    } );

    it( 'does not play when is_active is false', async () => {
        carousel = new ABCarousel( root, { is_active: false, slide_speed: 10 } );

        await carousel.ready;
        const firstIndex = carousel.getVisibleSlideIndex();

        await vi.waitFor( () => {
            expect( carousel.isPlaying() ).toBe( false );
        } );
        await new Promise( resolve => setTimeout( resolve, 11 ) );
        const currentIndex = carousel.getVisibleSlideIndex();

        expect( currentIndex ).toBe( firstIndex );
    } );

    it( 'pauses and updates is_active when called with true', async () => {
        carousel = new ABCarousel( root, { is_active: true, slide_speed: 10 } );
        await carousel.ready;
        await vi.waitFor( () => {
            expect( carousel.isPlaying() ).toBe( true );
        } );

        carousel.pause( true )

        expect( carousel.isPlaying() ).toBe( false )
        expect( carousel.isActive() ).toBe( false )
    } );

    it( 'pauses without changing is_active when called without arguments', async () => {
        carousel = new ABCarousel( root, { is_active: true, slide_speed: 10 } );
        await carousel.ready;
        await vi.waitFor( () => {
            expect( carousel.isPlaying() ).toBe( true );
        } );

        carousel.pause();

        expect( carousel.isPlaying() ).toBe( false )
        expect( carousel.isActive() ).toBe( true )
    } );

    it( 'resolves and applies a plugin when configured', async () => {
        const carousel = new ABCarousel( root, {
            plugins: { playback: 'classic' }
        } );

        await carousel.ready;

        expect(carousel.plugins.length).toBeGreaterThan(0);
        expect(carousel.plugins[0].constructor.name).toBe('ABPluginClassicPlayback');
    } );

    it( 'throws an error when slide index is out of bounds', () => {
        const carousel = new ABCarousel( root );

        const invalidIndex = 999;
        expect( () => carousel.getSlide( invalidIndex ) ).toThrow(
            `Slide index ${ invalidIndex } is out of bounds`
        );
    } );
} );