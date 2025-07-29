import { describe, expect, it } from 'vitest';
import { SlideOptionsResolver } from '@support/SlideOptionsResolver';

describe( 'SlideOptionsResolver', () => {
    it( 'throws if slideOptions is missing', () => {
        const badInput = {
            slideDuration: 5000,
            slideDirection: true,
            index: 0,
        };

        // @ts-expect-error: testing runtime failure on invalid input
        expect( () => SlideOptionsResolver.resolve( badInput ) ).toThrow();
    } );

    it( 'resolves valid ABSliderOptions into ABSlideOptions', () => {
        const input = {
            slideDuration: 5000,
            slideDirection: false,
            index: 0,
            slideOptions: {
                transitionIn: { name: 'ABTransitionSlide', duration: 700, direction: true },
                transitionOut: { name: 'ABTransitionFade', duration: 500, direction: false }
            }
        };

        const result = SlideOptionsResolver.resolve( input );

        expect( result.slideDuration ).toBe( 5000 );
        expect( result.slideClass ).toBe( '' );
        expect( result.transitionIn!.name ).toBe( 'ABTransitionSlide' );
        expect( result.transitionOut!.name ).toBe( 'ABTransitionFade' );
    } );
} );
