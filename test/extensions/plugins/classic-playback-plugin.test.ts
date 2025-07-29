import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ABCarousel } from '@/core/ABCarousel';
import { buildCarouselFixture } from '../../utils/buildCarouselFixture';

let carousel: ABCarousel;
let container: HTMLElement;
let playback: HTMLDivElement;


describe( 'ABPluginClassicPlayback', () => {
    beforeEach( async () => {
        container = buildCarouselFixture( 4, 'slider' );

        carousel = new ABCarousel( container, {
            plugins: { playback: 'classic' }
        } );

        playback = container.querySelector( '.ab-carousel-playback' ) as HTMLDivElement;
    } );

    afterEach( () => {
        document.body.innerHTML = '';
    } );

    it( 'renders playback buttons into the DOM', () => {
        expect( playback ).not.toBeNull();

        expect( playback?.querySelector( '.ab-carousel-play-button' ) ).not.toBeNull();
        expect( playback?.querySelector( '.ab-carousel-stop-button' ) ).not.toBeNull();
    } );

    it( 'calls carousel.play() when play button is clicked', () => {
        const spy = vi.spyOn( carousel, 'play' );
        const playBtn = container.querySelector( '.ab-carousel-play-button' );
        playBtn?.dispatchEvent( new MouseEvent( 'click', { bubbles: true } ) );

        expect( spy ).toHaveBeenCalledWith( true );
    } );

    it( 'calls carousel.pause() when stop button is clicked', () => {
        const spy = vi.spyOn( carousel, 'pause' );
        const stopBtn = container.querySelector( '.ab-carousel-stop-button' );
        stopBtn?.dispatchEvent( new MouseEvent( 'click', { bubbles: true } ) );

        expect( spy ).toHaveBeenCalledWith( true );
    } );

    it( 'sets carousel.options.is_active to true when play button is clicked', () => {
        carousel.pause( true );
        expect( carousel.getOption( 'is_active' ) ).toBe( false );
        const playBtn = container.querySelector( '.ab-carousel-play-button' ) as HTMLAnchorElement;
        playBtn.click();
        expect( carousel.getOption( 'is_active' ) ).toBe( true );
    } );

    it( 'sets carousel.options.is_active to false when stop button is clicked', () => {
        const stopBtn = container.querySelector( '.ab-carousel-stop-button' ) as HTMLAnchorElement;
        stopBtn.click();
        expect( carousel.getOption( 'is_active' ) ).toBe( false );
    } );
} );
