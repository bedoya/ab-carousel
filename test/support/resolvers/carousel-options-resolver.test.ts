import { describe, it, expect } from 'vitest';
import { CarouselOptionsResolver } from '@support/CarouselOptionsResolver';
import { defaultCarouselOptions } from '@/defaults';

describe( 'CarouselOptionsResolver', () => {
    it( 'merges default options with explicit options', () => {
        const elem = document.createElement( 'div' );

        const resolved = CarouselOptionsResolver.resolve( elem, { autoplay: false } );

        expect( resolved.autoplay ).toBe( false );
        expect( resolved ).toMatchObject( { ...defaultCarouselOptions, autoplay: false } );
    } );

    it( 'parses plugins option as JSON string', () => {
        const elem = document.createElement( 'div' );
        const resolved = CarouselOptionsResolver.resolve( elem, {
            plugins: '{"playback":"classic"}' as any
        } );

        expect( resolved.plugins ).toEqual( { playback: 'classic' } );
    } );

    it( 'parses plugins string fallback', () => {
        const elem = document.createElement( 'div' );
        const resolved = CarouselOptionsResolver.resolve( elem, {
            plugins: 'playback:classic,markers:dots' as any
        } );

        expect( resolved.plugins ).toEqual( { playback: 'classic', markers: 'dots' } );
    } );

    it( 'ignores malformed plugin input', () => {
        const elem = document.createElement( 'div' );
        const resolved = CarouselOptionsResolver.resolve( elem, {
            plugins: 'invalid-format' as any
        } );

        expect( resolved.plugins ).toEqual( {} );
    } );
} );
