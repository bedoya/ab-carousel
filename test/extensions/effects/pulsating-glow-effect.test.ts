import { describe, it, expect, beforeEach } from 'vitest';
import { ABEffectPulsatingGlow } from '@effects/pulsating-glow/ABEffectPulsatingGlow';

describe( 'ABEffectPulsatingGlow', () => {
    let element: HTMLElement;
    let effect: ABEffectPulsatingGlow;

    beforeEach( () => {
        element = document.createElement( 'div' );
        element.dataset.glowfont = 'true';
        effect = new ABEffectPulsatingGlow();
    } );

    it( 'should prepare and inject keyframes', () => {
        effect.prepare( element );
        expect( document.head.innerHTML ).toContain( 'keyframes ab-glow-' );
    } );

    it( 'should apply CSS animation on target', async () => {
        effect.prepare( element );
        await effect.applyEffect( element );
        expect( element.style.animation ).toContain( 'ab-glow-' );
        expect( element.style.willChange ).toContain( 'text-shadow' );
    } );

    it( 'should reset styles', async () => {
        effect.prepare( element );
        await effect.applyEffect( element );
        effect.resetEffect( element );
        expect( element.style.animation ).toBe( '' );
        expect( element.style.willChange ).toBe( '' );
    } );

    it( 'should be persistent', () => {
        expect( effect.isPersistent() ).toBe( true );
    } );

    it( 'should skip prepare if already prepared', () => {
        const element = document.createElement( 'div' );
        const effect = new ABEffectPulsatingGlow();

        effect.prepare( element );
        const spy = vi.spyOn<any, any>( effect, 'resolveOptions' );

        effect.prepare( element );
        expect( spy ).not.toHaveBeenCalled();
    } );

    it( 'should resolve all dataset options correctly', () => {
        const element = document.createElement( 'div' );
        element.dataset.duration = '1500';
        element.dataset.intensity = '0.9';
        element.dataset.boxGlowColor = 'red';
        element.dataset.fontGlowColor = 'blue';
        element.dataset.glowborder = 'true';
        element.dataset.glowfont = 'false';
        element.dataset.blurIncrement = '8';

        const effect = new ABEffectPulsatingGlow();
        const options = ( effect as any ).resolveOptions( element );

        expect( options.duration ).toBe( 1500 );
        expect( options.intensity ).toBeCloseTo( 0.9 );
        expect( options.boxGlowColor ).toBe( 'red' );
        expect( options.fontGlowColor ).toBe( 'blue' );
        expect( options.glowBox ).toBe( true );
        expect( options.glowFont ).toBe( false );
        expect( options.blurIncrement ).toBe( 8 );
    } );

} );
