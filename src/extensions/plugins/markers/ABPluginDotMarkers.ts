import { ABCarousel } from '@/core/ABCarousel';
import { PluginType } from '@/types';
import { ABCarouselPlugin } from '@/core/ABCarouselPlugin';
import '@plugins/markers/ab-plugin-dots.css';

export class ABPluginDotMarkers extends ABCarouselPlugin {
    name = 'ABPluginDotMarkers';
    type: PluginType = 'markers';

    apply( carousel: ABCarousel ) {
        const container = this.getPluginContainer( carousel.getContainer() );
        const dotContainer = document.createElement( 'div' );
        dotContainer.className = 'ab-carousel-dots';
        container.appendChild( dotContainer );

        const dots = this.createDots( carousel, dotContainer );
        this.setupDotSync( carousel, dots );
    }

    /**
     * Creates the dot elements and attaches them to the given container.
     * Each dot is bound to advance the carousel when clicked.
     *
     * @param {ABCarousel} carousel - The carousel instance.
     * @param {HTMLElement} container - The element where dots will be appended.
     *
     * @returns {HTMLElement[]} An array of created dot elements.
     */
    private createDots( carousel: ABCarousel, container: HTMLElement ): HTMLElement[] {
        const dots: HTMLElement[] = [];

        for ( let index = 0; index < carousel.getSlidesCount(); index++ ) {
            const dot = document.createElement( 'button' );
            dot.className = 'ab-carousel-dot';
            dot.addEventListener( 'click', async () => {
                const delta = index - carousel.getVisibleSlideIndex();
                if ( delta !== 0 ) {
                    await carousel.getSlider().advance( delta );
                    carousel.play();
                }
            } );
            dots.push( dot );
            container.appendChild( dot );
        }

        return dots;
    }

    /**
     * Sets up synchronization between the carousel's current slide
     * and the active state of the dot markers.
     *
     * @param {ABCarousel} carousel - The carousel instance.
     * @param {HTMLElement[]} dots - The array of dot elements to sync.
     */
    private setupDotSync( carousel: ABCarousel, dots: HTMLElement[] ): void {
        const initialIndex = carousel.getVisibleSlideIndex();
        dots[ initialIndex ]?.classList.add( 'active' );

        carousel.getContainer().addEventListener( 'ab-carousel-transition', () => {
            const activeIndex = carousel.getVisibleSlideIndex();
            dots.forEach( ( dot, index ) => {
                dot.classList.toggle( 'active', index === activeIndex );
            } );
        } );
    }
}