import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ABEffectKenBurns } from '@effects/ken-burns/ABEffectKenBurns';

describe( 'ABEffectKenBurns', () => {
    let effect: ABEffectKenBurns;
    let element: HTMLElement;

    beforeEach( () => {
        effect = new ABEffectKenBurns();
        element = document.createElement( 'div' );
    } );

    afterEach( () => {
        element.remove();
    } );

    it( 'should have the correct name', () => {
        expect( effect.name ).toBe( 'ABEffectKenBurns' );
    } );

    it( 'should resolve default options when no dataset is present', () => {
        const options = effect[ 'resolveKenBurnsOptions' ]( element );
        expect( options.zoomStart ).toBeGreaterThan( 0 );
        expect( options.zoomFinal ).toBeGreaterThan( 0 );
        expect( options.panAmount ).toBeGreaterThanOrEqual( 0 );
        expect( options.panDirection ).toBeGreaterThanOrEqual( 0 );
        expect( options.duration ).toBeGreaterThan( 0 );
        expect( options.wait ).toBeGreaterThanOrEqual( 0 );
    } );

    it( 'should resolve options from dataset', () => {
        element.dataset.zoom_start = '1.1';
        element.dataset.zoom_final = '1.5';
        element.dataset.pan_amount = '50';
        element.dataset.pan_direction = '90';
        element.dataset.duration = '3000';
        element.dataset.wait = '500';

        const options = effect[ 'resolveKenBurnsOptions' ]( element );

        expect( options ).toEqual( {
            zoomStart: 1.1,
            zoomFinal: 1.5,
            panAmount: 50,
            panDirection: 90,
            duration: 3000,
            wait: 500
        } );
    } );

    it( 'should apply the Ken Burns effect correctly', async () => {
        vi.useFakeTimers();
        const rafSpy = vi.spyOn( window, 'requestAnimationFrame' ).mockImplementation( fn => {
            fn( 0 );
            return 1;
        } );

        Object.assign( element.dataset, {
            zoom_start: '1.0',
            zoom_final: '1.2',
            pan_amount: '40',
            pan_direction: '0',
            duration: '1000',
            wait: '100'
        } );

        const promise = effect.applyEffect( element );

        vi.advanceTimersByTime( 100 ); // simulate wait
        await promise;

        expect( element.style.transition ).toContain( 'transform' );
        expect( element.style.transform ).toContain( 'scale(1.2)' );
        expect( element.style.transform ).toContain( 'translate(40px, 0px)' );

        rafSpy.mockRestore();
        vi.useRealTimers();
    } );

    it( 'should reset the Ken Burns effect', () => {
        element.style.transition = 'transform 1s ease-in-out';
        element.style.transform = 'scale(1.2) translate(40px, 0px)';

        effect.resetEffect( element );

        expect( element.style.transition ).toBe( 'none' );
        expect( element.style.transform ).toBe( 'scale(1) translate(0, 0)' );
    } );

} );
