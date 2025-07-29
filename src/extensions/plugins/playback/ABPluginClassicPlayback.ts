import { ABCarouselPlugin } from '@/core/ABCarouselPlugin';
import { PluginType } from '@/types/ABExtensionsTypes';
import { ABCarousel } from '@/core/ABCarousel';
import '@plugins/playback/ab-plugin-playback.css';

/**
 * A plugin that adds classic playback controls (Play/Stop) to the carousel.
 * Renders SVG-based buttons and binds them to the carousel's play and pause methods.
 */
export class ABPluginClassicPlayback extends ABCarouselPlugin {
    name = 'ABPluginClassicPlayback';
    type: PluginType = 'playback';

    apply( carousel: ABCarousel ): void {
        const container = this.getPluginContainer( carousel.getContainer() );

        const playbackWrapper = this.createControlsContainer();
        this.addPlayButtonToElement( playbackWrapper, carousel );
        this.addStopButtonToElement( playbackWrapper, carousel );
        container.appendChild( playbackWrapper );
    }

    /**
     * Creates and returns the DOM container that will hold the playback controls.
     *
     * @returns {HTMLDivElement} The wrapper element with the appropriate CSS class.
     */
    private createControlsContainer(): HTMLDivElement {
        const playbackWrapper = document.createElement( 'div' );
        playbackWrapper.classList.add( 'ab-carousel-playback' );

        return playbackWrapper;
    }

    /**
     * Appends a Play button to the given container and binds it to the carousel's play method.
     *
     * @param {HTMLElement} container - The element where the button will be added.
     * @param {ABCarousel} carousel - The carousel instance to control.
     */
    private addPlayButtonToElement( container: HTMLElement, carousel: ABCarousel ): void {
        const link = document.createElement( 'a' );
        link.classList.add( 'ab-carousel-play-button' );
        link.href = '#';
        link.innerHTML = `
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <polygon points="6,4 20,12 6,20" fill="currentColor"></polygon>
        </svg>`;
        link.addEventListener( 'click', ( e ) => {
            e.preventDefault();
            carousel.play( true );
        } );
        container.appendChild( link );
    }

    /**
     * Appends a Stop button to the given container and binds it to the carousel's pause method.
     *
     * @param {HTMLElement} container - The element where the button will be added.
     * @param {ABCarousel} carousel - The carousel instance to control.
     */
    private addStopButtonToElement( container: HTMLElement, carousel: ABCarousel ): void {
        const link = document.createElement( 'a' );
        link.classList.add( 'ab-carousel-stop-button' );
        link.href = '#';
        link.innerHTML = `
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <rect x="6" y="4" width="4" height="16" fill="currentColor"></rect>
            <rect x="14" y="4" width="4" height="16" fill="currentColor"></rect>
        </svg>`;
        link.addEventListener( 'click', ( e ) => {
            e.preventDefault();
            carousel.pause( true );
        } );
        container.appendChild( link );
    }
}