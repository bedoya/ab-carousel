import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { buildCarouselFixture } from '/test/utils/buildCarouselFixture';
import { ABEffectBounceIn } from '@/extensions/effects/bounce-in/ABEffectBounceIn';

vi.mock( '@support/EffectLayout', () => ( {
    getParentBounds: () => ( { width: 600, height: 300 } ),
    getOffsetRelativeToParent: vi.fn( () => ( { offsetX: 20, offsetY: 20 } ) ),
    prepareElementForEffect: vi.fn(),
} ) );

describe( 'ABEffectBounceIn', () => {
    let root: HTMLElement;
    let element: HTMLElement;
    let effect: ABEffectBounceIn;

    beforeEach( () => {
        root = buildCarouselFixture( 1, 'slider' );
        root.style.width = '600px';
        root.style.height = '300px';

        element = document.createElement( 'div' );
        element.dataset.effect = 'ABEffectBounceIn';
        element.style.position = 'absolute';
        element.style.top = '20px';
        element.style.left = '20px';

        const container = root.querySelector( '.ab-carousel-container' )! as HTMLElement;
        container.style.width = '100%';
        container.style.height = '100%';

        const section = container.querySelector( 'section' )!;
        section.style.position = 'relative';
        section.style.width = '100%';
        section.style.height = '100%';
        section.appendChild( element );

        effect = new ABEffectBounceIn();
    } );

    afterEach( () => {
        element.remove();
    } );

    it( 'should calculate expected values after prepare()', () => {
        effect.prepare( element );
        const anyEffect = effect as any;

        expect( anyEffect.containerWidth ).toBe( 600 );
        expect( anyEffect.containerHeight ).toBe( 300 );
        expect( anyEffect.elementFinalX ).toBe( 20 );
        expect( anyEffect.elementFinalY ).toBe( 20 );

        const elementHeight = element.getBoundingClientRect().height;
        expect( anyEffect.elementFloor ).toBeCloseTo( 300 - elementHeight, 1 );

        expect( anyEffect.elasticity ).toBeCloseTo( 0.933333, 5 );
        expect( anyEffect.direction ).toBeTruthy();
        expect( anyEffect.duration ).toBe( 800 );
        expect( anyEffect.waitTime ).toBe( 0 );
        expect( anyEffect.gravity ).toBeCloseTo( 0.00350417, 5 );
        expect( anyEffect.elementCurrentSpeedY ).toBe( 0 );
    } );

    it( 'should apply initial transform and styles', async () => {
        effect.prepare( element );

        await effect.applyEffect( element );

        expect( element.style.transform ).toContain( 'translate3d(' );
        expect( element.style.willChange ).toBe( 'transform' );
    } );

    it( 'calculateCurrentY should use flat bounce when gravity is 0', () => {
        const effect = new ABEffectBounceIn() as any;
        effect.gravity = 0;
        effect.calculateFlatBounceY = vi.fn().mockReturnValue( 123 );

        const result = effect.calculateCurrentY( 500, 0 );
        expect( result.resolvedY ).toBe( 123 );
        expect( result.bouncePeak ).toBe( 0 );
        expect( effect.calculateFlatBounceY ).toHaveBeenCalledWith( 500 );
    } );

    it( 'calculateFlatBounceY returns correct value in phase 1', () => {
        const effect = new ABEffectBounceIn() as any;
        effect.dropDurationMs = 1000;
        effect.avgSpeed = 2;
        effect.elementStartingY = -200;

        const result = effect.calculateFlatBounceY( 500 );
        expect( result ).toBe( 200 + 500 * 2 ); // -(-200) + 1000
    } );

    it( 'calculateFlatBounceY returns correct value in phase 3', () => {
        const effect = new ABEffectBounceIn() as any;
        effect.dropDurationMs = 300;
        effect.reboundDurationMs = 200;
        effect.avgSpeed = 4;

        const elapsed = 600; // > drop + rebound
        const result = effect.calculateFlatBounceY( elapsed );
        expect( result ).toBe( ( 600 - 300 - 200 ) * 4 ); // 100 * 4 = 400
    } );

    it( 'applyEffect resolves and sets final transform when animation ends', async () => {
        const element = document.createElement( 'div' );
        const effect = new ABEffectBounceIn();

        Object.assign( effect, {
            duration: 10,
            waitTime: 0,
            elementStartingX: 0,
            elementFinalX: 100,
            elementFinalY: 200,
            elementSpeedX: 10,
            calculateCurrentY: vi.fn().mockReturnValue( { resolvedY: 0, bouncePeak: 0 } ),
            animate: vi.fn().mockImplementation( async ( el: HTMLElement, onDone: () => void ) => {
                el.style.transform = 'translate3d(100px, 200px, 0)';
                onDone();
            } )
        } );

        await effect.applyEffect( element );

        expect( element.style.transform ).toBe( 'translate3d(100px, 200px, 0)' );
    } );

    it( 'should set gravity to 0 when gravity is disabled via options', () => {
        element.dataset.gravity = 'false';
        effect.prepare( element );

        const anyEffect = effect as any;
        expect( anyEffect.gravity ).toBe( 0 );
    } );

    it( 'should calculate settle Y when elapsed > drop + rebound and settleDurationMs > 1', () => {
        const anyEffect = effect as any;
        anyEffect.gravity = 1;
        anyEffect.dropDurationMs = 200;
        anyEffect.reboundDurationMs = 100;
        anyEffect.settleDurationMs = 300;
        anyEffect.elementFinalY = 0;
        anyEffect.elementFloor = 300;
        anyEffect.containerHeight = 300;

        const elapsed = 350; // > 200 + 100
        const currentY = 50;

        const result = anyEffect.calculateCurrentY( elapsed, currentY );

        expect( result ).toHaveProperty( 'resolvedY' );
        expect( result ).toHaveProperty( 'bouncePeak', 50 );
        expect( result.resolvedY ).toBeGreaterThan( 0 );
    } );
} );