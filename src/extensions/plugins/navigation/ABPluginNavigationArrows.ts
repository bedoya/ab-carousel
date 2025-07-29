import { PluginType } from '@/types';
import { ABCarouselPlugin } from '@/core/ABCarouselPlugin';
import '@plugins/markers/ab-plugin-dots.css';
import { ABCarousel } from '@/core/ABCarousel';
import '@plugins/navigation/ab-plugin-arrows.css';

/**
 * A plugin that adds previous and next navigation arrows to the carousel.
 */
export class ABPluginNavigationArrows extends ABCarouselPlugin {
    /** Plugin name **/
    name = 'ABPluginNavigationArrows';

    /** Plugin type **/
    type: PluginType = 'navigation';

    /** Injects into the carousel container **/
    contained = false;

    /**
     * Applies the plugin by adding navigation arrows to the carousel.
     *
     * @param {ABCarousel} carousel - The carousel instance to which the plugin is applied.
     */
    apply( carousel: ABCarousel ): void {
        const container = this.getPluginContainer( carousel.getContainer() );

        const navigationWrapper: HTMLDivElement = this.createArrowsContainer();
        this.addNextButtonToElement( navigationWrapper, carousel );
        this.addPrevButtonToElement( navigationWrapper, carousel );

        container.appendChild( navigationWrapper );
    }

    /**
     * Creates the wrapper element for the navigation arrows.
     *
     * @returns {HTMLDivElement} The created wrapper element.
     */
    private createArrowsContainer(): HTMLDivElement {
        const arrowsWrapper: HTMLDivElement = document.createElement( 'div' );
        arrowsWrapper.classList.add( 'ab-carousel-navigation' );

        return arrowsWrapper;
    }

    /**
     * Creates and appends the "next" button to the container.
     *
     * @param {HTMLDivElement} container The container element to append the button to.
     * @param {ABCarousel} carousel The carousel instance.
     */
    private addNextButtonToElement( container: HTMLDivElement, carousel: ABCarousel ) {
        const nextBtn = document.createElement( 'button' );
        nextBtn.classList.add( 'ab-carousel-next' );
        nextBtn.setAttribute( 'aria-label', 'Next slide' );
        nextBtn.innerHTML = this.getArrow();

        nextBtn.addEventListener( 'click', async ( e ) => {
            e.preventDefault();
            await carousel.getSlider().advance();
            carousel.play();
        } );

        container.appendChild( nextBtn );
    }

    /**
     * Creates and appends the "previous" button to the container.
     *
     * @param {HTMLDivElement} container The container element to append the button to.
     * @param {ABCarousel} carousel The carousel instance.
     */
    private addPrevButtonToElement( container: HTMLDivElement, carousel: ABCarousel ) {
        const prevBtn = document.createElement( 'button' );
        prevBtn.classList.add( 'ab-carousel-prev' );
        prevBtn.setAttribute( 'aria-label', 'Previous slide' );
        prevBtn.innerHTML = this.getArrow();

        prevBtn.addEventListener( 'click', async  ( e ) => {
            e.preventDefault();
            await carousel.getSlider().advance( -1 );
            carousel.play();
        } );

        container.appendChild( prevBtn );
    }

    /**
     * Returns the SVG markup for the navigation arrow.
     *
     * @returns {string} The arrow SVG as a string.
     */
    private getArrow(): string {
        return `
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <polygon points="18,4 4,12 18,20" fill="currentColor"></polygon>
        </svg>`;
    }
}