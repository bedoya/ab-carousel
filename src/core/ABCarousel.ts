import { ABSlider } from '@/core/ABSlider.js';
import { ABSlide } from '@/core/ABSlide';
import { ABCarouselPlugin } from '@/core/ABCarouselPlugin';
import { ABCarouselOptions } from '@/interfaces/interfaces';
import { emitCustomEvent, resolveOptionsWithDataAttributes } from '@/support/utils';
import { VisibilityController } from '@/support/VisibilityController';
import { ABNoTransition } from '@/plugins/transitions/ABNoTransition';

import defaultCarouselOptions from '@/defaults/carousel';
import '@/styles/ab-carousel.css';

export class ABCarousel {

    private readonly element: HTMLElement;
    private slider: ABSlider;
    public options: ABCarouselOptions;
    private interval: ReturnType<typeof setInterval> | null = null;
    private visibilityController: VisibilityController;
    private is_playing: boolean = false;
    private plugins: ABCarouselPlugin[] = [];
    private is_transitioning = false;


    /**
     * Initializes the ABCarousel instance.
     *
     * @param {string | HTMLElement} elem A CSS selector string or an HTMLElement representing the root carousel element.
     * @param {ABCarouselOptions} options
     *
     * @throws Error if the element or required internal container is not found.
     */
    constructor( elem: string | HTMLElement, options: ABCarouselOptions = {} ) {
        try {
            this.element = this.resolveHtmlElement( elem );
            this.options = resolveOptionsWithDataAttributes<ABCarouselOptions>(
                this.element,
                options,
                defaultCarouselOptions
            );
            this.slider = this.createSlider( this.element.querySelector( '.ab-carousel-container' ) );
            this.visibilityController = new VisibilityController( this, this.element );
            emitCustomEvent( this.element, 'ab-carousel-transition', { speed: this.getOption( 'slide_speed' ) } );
        }
        catch ( e ) {
            throw new Error( `[ABCarousel] ${ e instanceof Error ? e.message : 'Unknown error' }` );
        }

        if ( this.isActive() ) {
            this.slider.getSlide( this.slider.getIndex() ).show();
            this.play();
        }
    }

    /**
     * Resolves a selector or HTMLElement to a valid HTMLElement.
     *
     * @param {string | HTMLElement} input A string selector or HTMLElement.
     *
     * @returns A valid HTMLElement.
     * @throws Error if the input is invalid or the element is not found.
     */
    private resolveHtmlElement( input: string | HTMLElement ): HTMLElement {
        if ( typeof input === 'string' ) {
            const el = document.querySelector( input );
            if ( !( el instanceof HTMLElement ) ) {
                throw new Error( `Element not found for selector "${ input }"` );
            }
            return el;
        }

        if ( input instanceof HTMLElement ) {
            return input;
        }

        throw new Error( 'Invalid target element' );
    }

    /**
     * Creates an ABSlider instance from a container element.
     *
     * @param {Element | null} container The element with class .ab-carousel-container.
     *
     * @returns {ABSlider} instance.
     * @throws Error if the container is invalid.
     */
    private createSlider( container: Element | null ): ABSlider {
        if ( !( container instanceof HTMLElement ) ) {
            throw new Error( 'Missing .ab-carousel-container element' );
        }

        return new ABSlider( container, this.getOption( 'slide_index' ) ?? 0 );
    }

    /**
     * Starts the automatic slide rotation.
     *
     * @param {number} delta Number of slides to advance each interval (default is 1).
     * @param {boolean} update_configuration Indicates if it should change de option if the change was triggered
     */
    public play( delta: number = 1, update_configuration: boolean = false ) {
        if ( this.interval !== null ) {
            return;
        }

        this.interval = setInterval( () => {
            void this.advanceIfPlaying( delta );
        }, this.getOption( 'slide_speed' ) as number );
        if ( update_configuration ) {
            this.updateOption( 'is_active', true );
        }
        this.is_playing = true;
    }

    /**
     * Stops the automatic slide rotation.
     */
    public pause( update_configuration: boolean = false ) {
        if ( update_configuration ) {
            this.updateOption( 'is_active', false );
        }

        this.element.dispatchEvent( new CustomEvent( 'ab-carousel-pause' ) );
        this.resetInterval();
        this.is_playing = false;
    }

    /**
     * Advances the carousel by a given number of slides.
     * It hides the current slide, updates the index, and shows the new slide.
     * If the carousel is not currently playing, the transition is skipped.
     *
     * @param {number} delta Number of slides to move (can be negative).
     */
    public async advanceSlide( delta: number = 1 ): Promise<void> {
        const current = this.slider.getSlide( this.slider.getIndex() );
        const next = this.slider.getSlide( this.slider.getNextIndex( delta ) );

        try {
            await this.startTransition( current, next );
        }
        catch ( e ) {
            // Handle gracefully
        }

        emitCustomEvent( this.element, 'ab-carousel-transition', {
            speed: this.getOption( 'slide_speed' ),
        } );
    }

    /**
     * Performs the transition between the current and next slide.
     * Each slide can define its own transitionOut and transitionIn effects.
     * If not defined, a default transition is used.
     *
     * @param {ABSlide} current The slide that is currently visible.
     * @param {ABSlide} next The slide that will become visible.
     * @private
     */
    private async startTransition( current: ABSlide, next: ABSlide ): Promise<void> {
        const transitionOut = current.transitionOut || this.getDefaultTransition();
        const transitionIn = next.transitionIn || this.getDefaultTransition();

        await transitionOut.apply( current, next );
        await transitionIn.apply( current, next );
    }

    /**
     * Advances the carousel by one (or more) slides, only if currently playing.
     *
     * @param {number} delta Number of slides to move (can be negative).
     * @private
     */
    private async advanceIfPlaying( delta: number = 1 ): Promise<void> {
        if ( this.isPlaying() && !this.is_transitioning ) {
            this.is_transitioning = true;
            await this.advanceSlide( delta );
            this.slider.advanceIndex( delta );
            this.is_transitioning = false;
        }
    }

    /**
     * Updates an internal option value.
     *
     * @param {string} option The option key to update.
     * @param value The new value to assign.
     */
    public updateOption( option: string, value: any ): void {
        if ( option in this.options ) {
            this.options[ option ] = value;
        }
    }

    /**
     * Returns the default transition effect of the slider
     *
     * @returns {ABNoTransition}
     * @private
     */
    private getDefaultTransition(): ABNoTransition {
        return new ABNoTransition();
    }

    /**
     * Returns the number of slides in the carousel.
     *
     * @returns Number of slides.
     */
    public getSlideCount(): number {
        return this.slider.getSlideCount();
    }

    /**
     * Returns the visible slide
     *
     * @returns {number}
     */
    public getVisibleSlide(): ABSlide {
        return this.slider.getSlide( this.slider.getIndex() );
    }

    /**
     * Returns the index of the currently visible slide.
     *
     * @returns number
     */
    public getVisibleSlideIndex(): number {
        return this.slider.getIndex();
    }

    /**
     * Retrieves the value of a given option.
     *
     * @param {string} option The option key to retrieve.
     *
     * @returns {any} The current value of the option.
     */
    public getOption( option: string ): any {
        return this.options[ option ];
    }

    /**
     * Returns whether the carousel is currently paused.
     *
     * @returns {boolean}
     */
    public isPaused() {
        return !this.isPlaying() && ( this.interval === null );
    }

    /**
     * Returns whether the carousel is currently playing (i.e., performing transitions).
     *
     * @returns {boolean}
     */
    public isPlaying(): boolean {
        return this.interval !== null;
    }

    /**
     * Returns whether the carousel is configured to be active (i.e., should play automatically).
     *
     * @returns {boolean}
     */
    public isActive(): boolean {
        return this.getOption( 'is_active' ) === true;
    }

    /**
     * Resets the time interval of the slider
     */
    private resetInterval() {
        if ( this.interval !== null ) {
            clearInterval( this.interval );
            this.interval = null;
            this.is_playing = false;
        }
    }
}