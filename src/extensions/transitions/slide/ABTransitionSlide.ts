import { ABCarouselTransition } from '@/core/ABCarouselTransition';
import { slideTransitionDefaults } from '@/extensions/transitions/slide/options';
import { ABTransitionOptions } from '@/interfaces';

export class ABTransitionSlide extends ABCarouselTransition {
    name = 'ABTransitionSlide';

    private readonly duration: number;
    private readonly direction: number;
    private width: number;
    private step: number;

    /**
     * Sets the Slide transition with the options passed
     *
     * @param {Partial<ABTransitionOptions>} options
     */
    constructor( options: Partial<ABTransitionOptions> = {} ) {
        super();
        const merged: ABTransitionOptions = { ...slideTransitionDefaults, ...options };
        this.duration = merged.duration!;
        this.direction = merged.direction ? 1 : -1;
    }

    /**
     * Prepares the element to be animated
     *
     * @param {HTMLDivElement} element
     * @private
     */
    private prepare( element: HTMLDivElement ) {
        this.width = element.parentElement!.offsetWidth;
        this.step = Math.abs( this.width / this.duration * 16 );
        element.style.display = 'block';
        element.style.visibility = 'visible';
        element.classList.add( 'active' );
    }

    /**
     * Applies the slideOut animation to a slide.
     *
     * @param {HTMLDivElement} element
     *
     * @returns {Promise<void>}
     */
    async applyOut( element: HTMLDivElement ): Promise<void> {
        this.prepare( element );
        element.style.transform = 'translateX(0px)';

        let progress = 0;

        return new Promise( resolve => {
            const self = this;

            function slide() {
                const newPos = Math.round( progress ) * ( -self.direction );
                element.style.transform = `translateX(${ newPos }px)`;

                if ( progress < self.width ) {
                    progress += self.step;
                    requestAnimationFrame( slide );
                }
                else {
                    element.removeAttribute( 'style' );
                    element.style.display = 'none';
                    element.style.visibility = 'hidden';
                    element.classList.remove( 'active' );
                    resolve();
                }
            }

            requestAnimationFrame( slide );
        } );
    }

    /**
     * Applies the slideIn animation to a slide.
     *
     * @param {HTMLDivElement} element
     *
     * @returns {Promise<void>}
     */
    async applyIn( element: HTMLDivElement ): Promise<void> {
        this.prepare( element );
        element.style.transform = `translateX(${ this.width * this.direction }px)`;

        let progress = 0;

        return new Promise( resolve => {

            const self = this;

            function slide() {
                const newPos = ( self.width * self.direction ) + ( Math.round( progress ) * ( -self.direction ) );
                element.style.transform = `translateX(${ newPos }px)`;
                // Calculate new progress
                if ( progress < self.width ) {
                    progress += self.step;
                    requestAnimationFrame( slide );
                }
                else {
                    element.removeAttribute( 'style' );
                    resolve();
                }
            }

            requestAnimationFrame( slide );
        } );
    }
}