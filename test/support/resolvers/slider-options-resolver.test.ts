import { describe, it, expect } from 'vitest';
import { SliderOptionsResolver } from '@support/SliderOptionsResolver';
import { defaultTransitionInOptions, defaultTransitionOutOptions } from '@/defaults';

describe( 'SliderOptionsResolver', () => {
    it( 'falls back to defaults when no transition is provided', () => {
        const resolved = SliderOptionsResolver.resolve( {} );

        expect( resolved.slideOptions?.transitionIn ).toEqual( defaultTransitionInOptions );
        expect( resolved.slideOptions?.transitionOut ).toEqual( defaultTransitionOutOptions );
    } );

    it( 'resolves transition from string', () => {
        const resolved = SliderOptionsResolver.resolve( { transition: 'ABTransitionSlide' } );

        expect( resolved.slideOptions?.transitionIn.name ).toBe( 'ABTransitionSlide' );
        expect( resolved.slideOptions?.transitionOut.name ).toBe( 'ABTransitionSlide' );
    } );

    it( 'resolves transition from flat object', () => {
        const resolved = SliderOptionsResolver.resolve( {
            transition: {
                name: 'ABTransitionFade',
                duration: 800,
                direction: false
            },
        } );

        expect( resolved.slideOptions?.transitionIn.name ).toBe( 'ABTransitionFade' );
        expect( resolved.slideOptions?.transitionIn.duration ).toBe( 800 );
        expect( resolved.slideOptions?.transitionIn.direction ).toBe( false );
        expect( resolved.slideOptions?.transitionOut.name ).toBe( 'ABTransitionFade' );
    } );

    it( 'resolves transition from {in, out} object', () => {
        const resolved = SliderOptionsResolver.resolve( {
            transition: {
                in: { name: 'ABTransitionFade', duration: 700 },
                out: { name: 'ABTransitionSlide' },
            },
        } );

        expect( resolved.slideOptions?.transitionIn.name ).toBe( 'ABTransitionFade' );
        expect( resolved.slideOptions?.transitionIn.duration ).toBe( 700 );
        expect( resolved.slideOptions?.transitionOut.name ).toBe( 'ABTransitionSlide' );
    } );

    it( 'resolves slideDuration, slideDirection and slideClass', () => {
        const resolved = SliderOptionsResolver.resolve( {
            slide_speed: 1234,
            direction: false,
            slide_class: 'my-slide-class',
        } );

        expect( resolved.slideDuration ).toBe( 1234 );
        expect( resolved.slideDirection ).toBe( false );
        expect( resolved.slideClass ).toBe( 'my-slide-class' );
    } );
} );
