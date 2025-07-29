/**
 * Normalizes specific inline styles on a DOM element to ensure consistent layout and animation behavior.
 *
 * @param {HTMLElement} element The element to normalize
 * @param {string[]} [props] Optional list of style properties to normalize; defaults to a common set
 *
 * @returns {void}
 */
export function normalizeElementStyle(
    element: HTMLElement,
    props: string[] = [ 'display', 'position', 'boxSizing', 'margin', 'transform', 'transition', 'top', 'left', 'right', 'bottom' ]
): void {
    const rules: Record<string, string> = {
        display: 'inline-block',
        position: 'absolute',
        boxSizing: 'border-box',
        margin: '0',
        transform: 'none',
        transition: 'none',
        top: '0px',
        left: '0px',
        bottom: 'auto',
        right: 'auto',
    };
    props.forEach( prop => {
        if ( prop in rules ) {
            element.style.setProperty( prop, rules[ prop ] );
        }
    } );
}

/**
 * Returns the offset width and height of the element's parent.
 *
 * @param {HTMLElement} element
 *
 * @returns {{ width: number; height: number }}
 */
export function getParentBounds( element: HTMLElement ): { width: number; height: number } {
    const parent = element.parentElement;
    if ( !( parent instanceof HTMLElement ) ) {
        throw new Error( 'Element has no valid HTMLElement parent.' );
    }

    return { width: parent.offsetWidth, height: parent.offsetHeight };
}

/**
 * Returns the element's offset from the top-left of its parent.
 *
 * @param {HTMLElement} element
 *
 * @returns {{ x: number; y: number }}
 */
export function getOffsetRelativeToParent( element: HTMLElement ): { offsetX: number; offsetY: number } {
    const parent = element.parentElement;

    if ( !( parent instanceof HTMLElement ) ) {
        throw new Error( 'Element has no valid HTMLElement parent.' );
    }

    const elementRect = element.getBoundingClientRect();
    const parentRect = parent.getBoundingClientRect();

    return {
        offsetX: elementRect.left - parentRect.left,
        offsetY: elementRect.top - parentRect.top,
    };
}

/**
 * Forces an element to be ready for animation by ensuring it is positioned absolutely
 * and visible for measurements.
 *
 * @param {HTMLElement} element
 * @param allowed
 */
export function prepareElementForEffect(
    element: HTMLElement,
    allowed: string[] = [ 'position', 'boxSizing', 'margin', 'transform', 'transition', 'top', 'left', 'right', 'bottom' ]
): void {
    const allowedDisplays = [ 'inline', 'inline-block', 'absolute' ];
    const computedStyle = window.getComputedStyle( element );

    if ( allowedDisplays.includes( computedStyle.display ) ) {
        allowed.push( 'display' );
    }

    normalizeElementStyle( element, allowed );
}