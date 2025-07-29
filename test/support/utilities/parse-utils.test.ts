import { describe, it, expect, vi } from 'vitest';
import {
    parseValue,
    extractDataAttributes,
    parseBool,
    getRandomBetween,
    getRandomString,
    resolveToRGB,
    toCamelCase,
    safeParseJson, wait, makeCSSKeyframes, emitCustomEvent, resolveOptionsWithDataAttributes

} from '@support/Utilities';
import { CSSKeyframe, CSSKeyframesInput } from '@/types/SupportTypes';

describe( 'Utils', () => {
    it( 'parseValue should return correct types', () => {
        expect( parseValue( 'true' ) ).toBe( true );
        expect( parseValue( 'false' ) ).toBe( false );
        expect( parseValue( '123' ) ).toBe( 123 );
        expect( parseValue( 'abc' ) ).toBe( 'abc' );
    } );

    it( 'parseBool should handle string values correctly', () => {
        expect( parseBool( 'true' ) ).toBe( true );
        expect( parseBool( 'false' ) ).toBe( false );
        expect( parseBool( '0' ) ).toBe( false );
        expect( parseBool( 'no' ) ).toBe( false );
        expect( parseBool( 'yes' ) ).toBe( true );
        expect( parseBool( undefined ) ).toBe( false );
    } );

    it( 'getRandomBetween should be within range', () => {
        for ( let i = 0; i < 20; i++ ) {
            const n = getRandomBetween( 5, 10 );
            expect( n ).toBeGreaterThanOrEqual( 5 );
            expect( n ).toBeLessThanOrEqual( 10 );
        }
    } );

    it( 'getRandomString returns expected length', () => {
        expect( getRandomString( 6 ) ).toHaveLength( 6 );
        expect( getRandomString( 10 ) ).toHaveLength( 10 );
    } );

    it( 'resolveToRGB parses various color formats', () => {
        expect( resolveToRGB( '188, 19, 254' ) ).toEqual( { r: 188, g: 19, b: 254 } );
        expect( resolveToRGB( 'rgb(188 19 254)' ) ).toEqual( { r: 188, g: 19, b: 254 } );
        expect( resolveToRGB( 'rgb(188, 19, 254)' ) ).toEqual( { r: 188, g: 19, b: 254 } );
        expect( resolveToRGB( '#bc13fe' ) ).toEqual( { r: 188, g: 19, b: 254 } );
        expect( resolveToRGB( 'bc13fe' ) ).toEqual( { r: 188, g: 19, b: 254 } );
        expect( resolveToRGB( '#c3e' ) ).toEqual( { r: 204, g: 51, b: 238 } );
        expect( resolveToRGB( 'c3e' ) ).toEqual( { r: 204, g: 51, b: 238 } );
    } );

    it( 'resolveToRGB throws on invalid input', () => {
        expect( () => resolveToRGB( 'not-a-color' ) ).toThrow();
        expect( () => resolveToRGB( '#zzz' ) ).toThrow();
    } );

    it( 'toCamelCase converts kebab-case correctly', () => {
        expect( toCamelCase( 'box-shadow' ) ).toBe( 'boxShadow' );
        expect( toCamelCase( 'data-test-case' ) ).toBe( 'dataTestCase' );
    } );

    it( 'safeParseJson parses valid json or returns undefined', () => {
        expect( safeParseJson( '{"a": 1}' ) ).toEqual( { a: 1 } );
        expect( safeParseJson( 'not-json' ) ).toBeUndefined();
        expect( safeParseJson( undefined ) ).toBeUndefined();
    } );

    it( 'extractDataAttributes returns only allowed keys', () => {
        const div = document.createElement( 'div' );
        div.dataset.slide_speed = '3000';
        div.dataset.ignore = 'should-not-be-included';
        const result = extractDataAttributes( div, [ 'slide_speed' ] );
        expect( result ).toHaveProperty( 'slide_speed', 3000 );
        expect( result ).not.toHaveProperty( 'ignore' );
    } );

    it( 'makeCSSKeyframes generates valid CSS from input', () => {
        const frame1: CSSKeyframe = { stops: [ '0%' ], styles: { opacity: '0' } };
        const frame2: CSSKeyframe = { stops: [ '100%' ], styles: { opacity: '1' } };
        const input: CSSKeyframesInput = [ frame1, frame2 ];

        const css = makeCSSKeyframes( input, 'fade' );
        expect( css ).toContain( '@keyframes fade' );
        expect( css ).toContain( '0% {' );
        expect( css ).toContain( 'opacity: 0;' );
        expect( css ).toContain( '100% {' );
        expect( css ).toContain( 'opacity: 1;' );
    } );

    it( 'emits custom event with detail and bubbles', () => {
        const el = document.createElement( 'div' );
        const handler = vi.fn();
        el.addEventListener( 'test-event', handler );

        emitCustomEvent( el, 'test-event', { foo: 'bar' } );

        expect( handler ).toHaveBeenCalled();
        const event = handler.mock.calls[ 0 ][ 0 ];
        expect( event.detail ).toEqual( { foo: 'bar' } );
        expect( event.bubbles ).toBe( true );
    } );

    it( 'returns false and logs error if dispatchEvent throws', () => {
        const el = document.createElement( 'div' );
        const error = new Error( 'dispatch failed' );

        vi.spyOn( el, 'dispatchEvent' ).mockImplementation( () => {
            throw error;
        } );
        const consoleError = vi.spyOn( console, 'error' ).mockImplementation( () => {
        } );

        const result = emitCustomEvent( el, 'ab-carousel-test', { foo: 'bar' } );

        expect( result ).toBe( false );
        expect( consoleError ).toHaveBeenCalledWith(
            'Error emitting custom event "ab-carousel-test":',
            error
        );

        consoleError.mockRestore();
    } );

    it( 'merges options from data attributes if JSON is valid', () => {
        const el = document.createElement( 'div' );
        el.dataset.slideIndex = '3';
        el.dataset.autoPlay = 'true';

        const options = { autoPlay: false };
        const defaults = { slideIndex: 0, autoPlay: true };

        const result = resolveOptionsWithDataAttributes( el, options, defaults );

        expect( result ).toEqual( {
            slideIndex: 3,      // parsed from dataset
            autoPlay: false     // overridden by `options`
        } );
    } );

    it( 'returns parsed object for valid JSON', () => {
        const input = '{"test":123}';
        expect( safeParseJson( input ) ).toEqual( { test: 123 } );
    } );

    it( 'returns undefined for invalid JSON and logs warning', () => {
        const spy = vi.spyOn( console, 'warn' ).mockImplementation( () => {
        } );
        expect( safeParseJson( '{invalid' ) ).toBeUndefined();
        expect( spy ).toHaveBeenCalled();
        spy.mockRestore();
    } );

    it( 'returns undefined for non-string input', () => {
        expect( safeParseJson( 123 as any ) ).toBeUndefined();
    } );

    it( 'resolves after timeout', async () => {
        const spy = vi.spyOn( global, 'setTimeout' );
        await wait( 10 );
        expect( spy ).toHaveBeenCalledWith( expect.any( Function ), 10 );
        spy.mockRestore();
    } );

} );
