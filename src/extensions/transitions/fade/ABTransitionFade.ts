import { ABCarouselTransition } from '@/core/ABCarouselTransition';
import { ABTransitionOptions } from '@/interfaces';
import { fadeTransitionDefaults } from './options';

export class ABTransitionFade extends ABCarouselTransition {
    name = 'ABTransitionFade';

    private readonly duration: number;

    /**
     * Sets the Fade transition with the options passed
     *
     * @param {Partial<ABTransitionOptions>} options
     */
    constructor( options: Partial<ABTransitionOptions> = {} ) {
        super();
        const merged: ABTransitionOptions = { ...fadeTransitionDefaults, ...options };
        this.duration = merged.duration!;
    }

    /**
     * Applies the fade-out animation to hide the slide.
     * Updates visibility, display, and opacity styles.
     *
     * @param {HTMLDivElement} element The element to fade out.
     *
     * @returns {Promise<void>}
     */
    async applyOut( element: HTMLDivElement ): Promise<void> {
        element.style.opacity = '1';
        await this.fade( element, '1', '0' );
        element.style.visibility = 'hidden';
        element.style.display = 'none';
        element.classList.remove( 'active' );
    }

    /**
     * Applies the fade-in animation to make the slide visible.
     * Sets visibility, display, and opacity styles.
     *
     * @param {HTMLDivElement} element The element to fade in.
     *
     * @returns {Promise<void>}
     */
    async applyIn( element: HTMLDivElement ): Promise<void> {
        element.style.display = 'block';
        element.style.visibility = 'visible';
        element.style.opacity = '0';
        await this.fade( element, '0', '1' );
        element.classList.add( 'active' );
    }

    /**
     * Fades an element from one opacity value to another over the specified duration.
     *
     * @param {HTMLElement} element The element to animate.
     * @param {string} from The initial opacity value.
     * @param {string} to The final opacity value.
     *
     * @returns {Promise<void>}
     * @private
     */
    private fade( element: HTMLElement, from: string, to: string ): Promise<void> {
        this.applyStyles( element, {
            opacity: from,
            transition: `opacity ${ this.duration }ms`,
        } );

        return new Promise( resolve => {
            requestAnimationFrame( () => {
                element.style.opacity = to;
                setTimeout( resolve, this.duration );
            } );
        } );
    }

    /**
     * Applies a set of CSS styles to the given HTML element.
     *
     * @param {HTMLElement} element The target HTML element.
     * @param {Partial<CSSStyleDeclaration>} styles An object containing CSS properties and values to apply.
     */
    private applyStyles( element: HTMLElement, styles: Partial<CSSStyleDeclaration> ): void {
        Object.assign( element.style, styles );
    }
}
