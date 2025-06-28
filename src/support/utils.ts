/**
 * Parses a string value into the appropriate JavaScript type.
 *
 * Converts strings like "true", "false", and numeric strings
 * into their corresponding boolean or number types.
 * If the value cannot be converted, it returns the original string.
 *
 * @param value - The string value to parse
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
 * @param element - The HTML element to extract data attributes from
 * @param allowedKeys - An optional array of keys to allow (in snake_case)
 * @returns An object with parsed values of matching data-* attributes
 */
export function extractDataAttributes(
    element: HTMLElement,
    allowedKeys: string[] = []
): Record<string, any> {
    const data: Record<string, any> = {};

    Array.from( element.attributes ).forEach( attr => {
        if ( attr.name.startsWith( 'data-' ) ) {
            const key = attr.name.replace( 'data-', '' ).replace( /-/g, '_' );
            if ( allowedKeys.length === 0 || allowedKeys.includes( key ) ) {
                data[ key ] = parseValue( attr.value );
            }
        }
    } );

    return data;
}

/**
 * Emits a custom event with optional detail data.
 *
 * @param element - The target element to dispatch the event on.
 * @param name - The name of the custom event.
 * @param detail - Optional data to include in the event detail.
 */
export function emitCustomEvent(
    element: HTMLElement,
    name: string,
    detail: Record<string, any> = {}
): void {
    const event = new CustomEvent( name, { detail } );
    element.dispatchEvent( event );
}

/**
 * Merge configuration from user options, data attributes, and defaults.
 *
 * @param element HTMLElement containing data-* attributes.
 * @param options Explicitly provided options.
 * @param defaults
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

