/**
 * Builds an <ABCarousel> test fixture.
 *
 * @param {string[] | number } slides Array of inner‑HTML strings (one per slide).
 *                                    If omitted, you get n empty <section> elements.
 * @param {string} id Optional id for the root element.
 * @param {string} containerType the type of HTMLElement to be created, defaults to div
 */
export function buildCarouselFixture(
    slides: string[] | number = 1,
    id = 'slider',
    containerType: string = 'div',
): HTMLElement {
    const root = document.createElement( containerType );
    root.className = 'ab-carousel';
    root.id = id;

    const container = document.createElement( 'div' );
    container.className = 'ab-carousel-container';

    const count = Array.isArray( slides ) ? slides.length : slides;
    for ( let i = 0; i < count; i++ ) {
        const section = document.createElement( 'section' );
        section.innerHTML = Array.isArray( slides ) ? slides[ i ] : `Slide ${ i + 1 }`;
        container.appendChild( section );
    }

    root.appendChild( container );
    document.body.appendChild( root );
    return root;
}
