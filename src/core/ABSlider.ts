import { ABSlide } from '@/core/ABSlide.js';
import { ABSlideOptions, ABSliderOptions } from '@/interfaces';
import { SlideOptionsResolver } from '@support/SlideOptionsResolver';
import { emitCustomEvent, wait } from '@support/Utilities';

/**
 * Internal class responsible for managing the collection of slides.
 *
 * Handles transitions, active slide state, slide retrieval, and navigation.
 * This class is not intended for public use—it's used internally by ABCarousel.
 */
export class ABSlider {
    /** The container of the slider **/
    private readonly container: HTMLElement;

    /** The collection of slides managed by this slider instance */
    private readonly slides: ABSlide[];

    /** Index of the currently active slide */
    private slide_index: number;

    /** Whether a transition is currently in progress */
    private is_transitioning = false;

    /**
     * Creates a new instance of ABSlider.
     *
     * @param {HTMLElement} container The DOM element that contains the slides
     * @param {ABSliderOptions} [options={}] Configuration options for the slider
     */
    constructor( private container: HTMLElement, private options: ABSliderOptions = {} ) {
        this.container = container;
        this.slides = this.initializeSlides();
        this.slide_index = ( options.index ?? 0 ) < this.getSlidesCount() ? options.index! : 0;
    }

    /**
     * Initializes all ABSlide instances from the DOM container.
     *
     * @returns ABSlide[]
     */
    private initializeSlides(): ABSlide[] {
        const slideOptions = this.resolveSlideOptions();
        const elements = Array.from( this.container.children ) as HTMLElement[];
        return elements.map( ( element ) => {
            let slide = new ABSlide( element, slideOptions );
            slide.hide();
            this.container.replaceChild( slide.element, element );
            return slide;
        } );
    }

    /**
     * Resolves and merges slide-specific configuration from multiple sources,
     * including DOM attributes and JSON options.
     *
     * @returns {ABSlideOptions} The final set of slide options
     */
    private resolveSlideOptions(): ABSlideOptions {
        return SlideOptionsResolver.resolve( this.options );
    }

    /**
     * Executes the slide transition between the current and next slide.
     * It handles overlapping transitions and optional delays (`gap`)
     * between exit and entry animations.
     *
     * @param {ABSlide} current The currently visible slide.
     * @param {ABSlide} next The next slide to be shown.
     *
     * @returns {Promise<void>}
     * @private
     */
    private async performTransition( current: ABSlide, next: ABSlide ): Promise<void> {
        await current.beforeTransition();
        next.prepareEffects();

        await Promise.all( [
            current.getTransitionOut().applyOut( current.element ),
            !next.getTransitionIn().isInstant() ?
                wait( this.options.gap! ).then( () => next.getTransitionIn().applyIn( next.element ) ) :
                next.getTransitionIn().applyIn( next.element )
        ] );

        await next.afterTransition();
    }

    /**
     * Advances the slider by a given number of slides.
     * Prevents overlapping transitions and updates the current index after a successful transition.
     *
     * @param {number} delta Number of slides to advance (can be negative). Defaults to 1.
     *
     * @returns {Promise<void>}
     */
    public async advance( delta: number = 1 ): Promise<void> {

        if ( this.is_transitioning ) {
            return;
        }
        this.is_transitioning = true;

        const current = this.getCurrentSlide();
        const nextIndex = this.getNextIndex( delta );
        const next = this.getSlide( nextIndex );
        try {
            await this.performTransition( current, next );
            this.setIndex( nextIndex );
            emitCustomEvent( this.container.closest( '.ab-carousel' ) as HTMLElement, 'ab-carousel-transition', {
                speed: this.options.slideDuration,
            } );
        }
        finally {
            this.is_transitioning = false;
        }
    }

    /**
     * Returns the number of slides in the carousel.
     *
     * @returns number
     */
    public getSlidesCount(): number {
        return this.slides.length;
    }

    /**
     * Returns the slide at the given index.
     *
     * @param index Index of the slide to retrieve.
     *
     * @returns ABSlide
     */
    public getSlide( index: number ): ABSlide {
        return this.slides[ index ];
    }

    /**
     * Returns the slide on the current index
     *
     * @returns {ABSlide}
     */
    public getCurrentSlide(): ABSlide {
        return this.getSlide( this.getIndex() );
    }

    /**
     * Returns the current slide index
     *
     * @returns {number}
     */
    public getIndex(): number {
        return this.slide_index;
    }

    /**
     * Returns the next index in the slide sequence, wrapping around.
     *
     * @returns {number}
     */
    public getNextIndex( delta: number ): number {
        const length = this.getSlidesCount();
        if ( length === 0 ) {
            return 0;
        }

        return ( ( this.getIndex() + delta ) % length + length ) % length;
    }

    /**
     * Sets the index of the current slide
     *
     * @param {number} index
     */
    public setIndex( index: number ): void {
        this.slide_index = index;
    }

    /**
     * Advances the slide index by a given delta, wrapping around the slide count.
     *
     * @param delta Number of positions to move the index (can be negative).
     */
    public advanceIndex( delta: number = 1 ): void {
        this.setIndex( this.getNextIndex( delta ) );
    }
}
