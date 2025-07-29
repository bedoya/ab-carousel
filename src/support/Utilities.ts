import { CSSKeyframesInput } from '@/types';

/**
 * Parses a string value into the appropriate JavaScript type.
 *
 * Converts strings like "true", "false", and numeric strings
 * into their corresponding boolean or number types.
 * If the value cannot be converted, it returns the original string.
 *
 * @param {string} value The string value to parse
 *
 * @returns The parsed value as boolean, number, or original string
 */
export function parseValue( value: string ): any {
    if ( value === 'true' ) {
        return true;
    }
    if ( value === 'false' ) {
        return false;
    }
    if ( !isNaN( Number( value ) ) ) {
        return Number( value );
    }
    return value;
}

/**
 * Extracts and parses data-* attributes from an HTMLElement.
 *
 * Optionally filters the extracted keys to include only those present
 * in the allowedKeys array.
 *
 * @param {HTMLElement} element The HTML element to extract data attributes from
 * @param {string[]} allowedKeys An optional array of keys to allow (in snake_case)
 *
 * @returns An object with parsed values of matching data-* attributes
 */
export function extractDataAttributes( element: HTMLElement, allowedKeys: string[] ): Record<string, unknown> {
    const data: Record<string, unknown> = {};
    const keyMap = new Map<string, string>();
    for ( const key of allowedKeys ) {
        keyMap.set( key.toLowerCase(), key );
    }

    for ( const [ key, value ] of Object.entries( element.dataset ) ) {
        if ( typeof value !== 'string' ) {
            continue;
        }

        const normalizedKey = key.toLowerCase();
        const mappedKey = keyMap.get( normalizedKey );
        if ( !allowedKeys.length || mappedKey ) {
            data[ mappedKey ?? key ] = parseValue( value );
        }
    }

    return data;
}

/**
 * Emits a custom event on a specified EventTarget.
 *
 * @template TDetail The type of the detail payload for the custom event.
 * @param {EventTarget} element The EventTarget to dispatch the event from (e.g., document, an HTMLElement, or a custom EventTarget instance).
 * @param {string} name The name of the custom event.
 * @param {TDetail} [detail] Optional. The custom data to be passed with the event in its `detail` property.
 * @returns {boolean} Returns `true` if the event was successfully dispatched, `false` otherwise.
 */
export function emitCustomEvent<TDetail = unknown>(
    element: EventTarget,
    name: string,
    detail?: TDetail
): boolean {
    try {
        const customEvent = new CustomEvent<TDetail>( name, {
            detail: detail,
            bubbles: true,
            composed: true,
        } );
        return element.dispatchEvent( customEvent );
    }
    catch ( error ) {
        console.error( `Error emitting custom event "${ name }":`, error );
        return false;
    }
}

/**
 * Merge configuration from user options, data attributes, and defaults.
 *
 * @param {HTMLElement} element HTMLElement containing data-* attributes.
 * @param {Partial<>} options Explicitly provided options.
 * @param defaults
 *
 * @returns object
 */
export function resolveOptionsWithDataAttributes<T extends object>(
    element: HTMLElement,
    options: Partial<T>,
    defaults: T
): T {
    const data = extractDataAttributes( element, Object.keys( defaults ) );
    const final = {} as T;

    for ( const key of Object.keys( defaults ) as ( keyof T )[] ) {
        final[ key ] = options[ key ] ?? data[ key ] ?? defaults[ key ];
    }

    return final;
}

/**
 * Safely parses a JSON string and returns the object if valid.
 * Returns undefined if the input is invalid or not an object.
 *
 * @param input The raw JSON string
 * @returns The parsed object or undefined
 */
export function safeParseJson<T = unknown>( input: string | undefined ): T | undefined {
    if ( !input ) {
        return undefined;
    }

    try {
        const parsed = JSON.parse( input );
        if ( typeof parsed === 'object' && parsed !== null ) {
            return parsed as T;
        }
    }
    catch {
        console.warn( '[utils] Invalid JSON string:', input );
        console.trace();
    }

    return undefined;
}

/**
 * Converts a possible kebab-case string to camelCase
 *
 * @param {string} str
 *
 * @returns {string}
 */
export function toCamelCase( str: string ): string {
    return str.replace( /-([a-z])/g, ( _, char ) => char.toUpperCase() );
}

/**
 * Creates a pause of the given ms milliseconds
 *
 * @param {number} ms
 *
 * @returns {Promise<void>}
 */
export function wait( ms: number ): Promise<void> {
    return new Promise( resolve => setTimeout( resolve, ms ) );
}

/**
 * Converts a string into a boolean using common human interpretations.
 * Returns false for: "false", "0", "no", "off", "", or undefined.
 * Returns true for any other non-empty string.
 *
 * @param {string | undefined} value The value to be evaluated
 *
 * @returns {boolean}
 */
export function parseBool( value: string | undefined ): boolean {
    if ( value === undefined ) {
        return false;
    }

    const normalized = value.trim().toLowerCase();

    return ![ 'false', '0', 'no', 'off', '' ].includes( normalized );
}

/**
 * Returns a random integer between the given min and max values (inclusive).
 *
 * @param {number} min Minimum value (inclusive). Defaults to 1000.
 * @param {number} max Maximum value (inclusive). Defaults to 2000.
 *
 * @returns {number} A random integer between min and max.
 */
export function getRandomBetween( min: number = 1000, max: number = 2000 ): number {
    return Math.floor( Math.random() * ( max - min + 1 ) ) + min;
}

/**
 * Generates a random alphanumeric string of the specified length.
 * Useful for creating unique identifiers (e.g., CSS class or keyframe names).
 *
 * @param {number} length The length of the random string.
 *
 * @returns {string} A random lowercase alphanumeric string.
 */
export function getRandomString( length: number = 8 ): string {
    return Math.random().toString( 36 ).substring( 2, 2 + length );
}

/**
 * Resolves various RGB/hex color formats into a normalized RGB object.
 *
 * Accepts the following formats:
 * - "rgb(188 19 254)"
 * - "rgb(188, 19, 254)"
 * - "#bc13fe"
 * - "bc13fe"
 * - "#c3e"
 * - "c3e"
 *
 * @param input A string representing a color in RGB or hex format
 *
 * @returns An object with numeric r, g, b components
 * @throws If the input is not a valid color format
 */
export function resolveToRGB( input: string ): { r: number, g: number, b: number } {
    input = input.trim();
    if ( /^\d{1,3},\s*\d{1,3},\s*\d{1,3}$/.test( input ) ) {
        const [ r, g, b ] = input.split( ',' ).map( n => parseInt( n.trim(), 10 ) );
        return { r, g, b };
    }
    if ( input.startsWith( 'rgb' ) ) {
        const parts = input.match( /\d+/g );
        if ( parts && parts.length === 3 ) {
            const [ r, g, b ] = parts.map( Number );
            return { r, g, b };
        }
    }
    input = ( input.startsWith( '#' ) ) ? input.slice( 1 ) : input;
    input = ( /^[0-9a-f]{3}$/i.test( input ) ) ? input.split( '' ).map( c => c + c ).join( '' ) : input;
    if ( /^[0-9a-f]{6}$/i.test( input ) ) {
        const r = parseInt( input.slice( 0, 2 ), 16 );
        const g = parseInt( input.slice( 2, 4 ), 16 );
        const b = parseInt( input.slice( 4, 6 ), 16 );
        return { r, g, b };
    }

    throw new Error( `Invalid RGB/hex input: ${ input }` );
}

/**
 * Generates a CSS @keyframes block from structured input.
 *
 * @param {CSSKeyframesInput} frames An array of keyframe definitions (stops and styles)
 * @param {string} name The name of the animation
 *
 * @returns {string} A complete @keyframes CSS string
 */
export function makeCSSKeyframes( frames: CSSKeyframesInput, name: string ): string {
    const keyframeBlocks = frames.map( ( { stops, styles } ) => {
        const stopLine = stops.join( ', ' );

        const styleLines = Object.entries( styles ).map( ( [ prop, value ] ) => {
            const val = Array.isArray( value ) ? value.join( ', ' ) : value;
            return `    ${ prop }: ${ val };`;
        } );

        return `  ${ stopLine } {\n${ styleLines.join( '\n' ) }\n  }`;
    } );
    return `@keyframes ${ name } {\n${ keyframeBlocks.join( '\n' ) }\n}`;
}
