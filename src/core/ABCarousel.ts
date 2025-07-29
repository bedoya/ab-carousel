import { ABSlider } from '@/core/ABSlider.js';
import { ABSlide } from '@/core/ABSlide';
import type { ABCarouselPlugin } from '@/core/ABCarouselPlugin';
import { ABCarouselOptions, ABSliderOptions } from '@/interfaces';
import { VisibilityController } from '@/support/VisibilityController';
import { SliderOptionsResolver } from '@support/SliderOptionsResolver';
import { CarouselOptionsResolver } from '@support/CarouselOptionsResolver';
import { PluginType } from '@/types';
import { resolvePlugin } from '@/extensions/plugins/registry';
import '@/styles/ab-carousel.css';

/**
 * Main class responsible for initializing and managing the carousel behavior.
 *
 * Handles slide transitions, autoplay logic, visibility-based playback,
 * plugin integration, and configuration resolution from various sources.
 *
 * Usage:
 * ```js
 * const carousel = new ABCarousel('#slider', { slide_speed: 6000 });
 * ```
 */
export class ABCarousel {

    /** The root DOM element passed during instantiation (either selector or HTMLElement). */
    private readonly element: HTMLElement;

    /** Internal ABSlider instance responsible for managing slides. */
    private readonly slider: ABSlider;

    /** Final resolved configuration options for the carousel. */
    public options: ABCarouselOptions;

    /** Reference to the autoplay interval. `null` when not playing. */
    private interval: ReturnType<typeof setInterval> | null = null;

    /** Controls autoplay based on visibility and focus changes. */
    private visibilityController: VisibilityController;

    /** Indicates whether the carousel is currently autoplaying. */
    private is_playing: boolean = false;

    /** Promise that resolves when the carousel is fully initialized and ready. */
    public ready: Promise<void>

    /** Loaded plugin instances applied to the carousel. */
    private plugins: ABCarouselPlugin[] = [];

    /** Internal resolver function for the `ready` promise. */
    private resolveReady!: ( value?: void | PromiseLike<void> ) => void;

    /** Holds available resolver classes used for parsing options. */
    private resolvers = {
        slider: SliderOptionsResolver,
    };

    /**
     * Initializes the ABCarousel instance.
     *
     * @param {string | HTMLElement} elem A CSS selector string or an HTMLElement representing the root carousel element.
     * @param {ABCarouselOptions} options
     *
     * @throws Error if the element or required internal container is not found.
     */
    constructor( elem: string | HTMLElement, options: Partial<ABCarouselOptions> = {} ) {
        try {
            this.element = this.resolveHtmlElement( elem );
            this.options = CarouselOptionsResolver.resolve( this.element, options );
            this.slider = this.createSlider();
            this.visibilityController = new VisibilityController( this, this.element );
            this.resolvePlugins( options.plugins );
        }
        catch ( e ) {
            throw new Error( `[ABCarousel] ${ e instanceof Error ? e.message : 'Unknown error' }` );
        }

        this.ready = new Promise( resolve => {
            this.resolveReady = resolve
        } );

        this.startSlider();
    }

    /**
     * Initializes the first visible slide by explicitly showing it
     * and triggering any effects associated with the `onVisible` timing.
     * This is called only once during carousel construction.
     *
     * @returns {Promise<void>} Resolves once the initial slide and its effects are fully applied.
     */
    private async initFirstSlide(): Promise<void> {
        const firstSlide: ABSlide = this.getSlide( this.getVisibleSlideIndex() );
        firstSlide.show();
        await firstSlide.afterTransition();
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
     * Resolves the final configuration options for the internal slider.
     * Merges attributes, dataset values, and defaults into a structured
     * `ABSliderOptions` object used by the `ABSlider` instance.
     *
     * @returns {ABSliderOptions} The normalized slider options.
     */
    private resolveSliderOptions(): ABSliderOptions {
        return this.resolvers.slider.resolve( this.options );
    }

    /**
     * Resolves and applies carousel plugins based on the provided configuration.
     *
     * This method looks up each plugin by type and key, instantiates it, stores
     * the instance, and applies its behavior to the current carousel.
     *
     * @param {Partial<Record<PluginType, string>>} plugins An optional map of plugin types to plugin keys.
     */
    private resolvePlugins( plugins?: Partial<Record<PluginType, string>> ): void {
        if ( plugins === undefined ) {
            return;
        }

        for ( const [ type, key ] of Object.entries( plugins ) as [ PluginType, string ][] ) {
            const pluginClass = resolvePlugin( type, key );
            if ( pluginClass ) {
                this.plugins.push( new pluginClass() );
            }
        }

        this.plugins.forEach( plugin => plugin.apply( this ) );
    }

    /**
     * Creates an ABSlider instance from a container element.
     *
     * @returns {ABSlider} instance.
     * @throws Error if the container is invalid.
     */
    private createSlider(): ABSlider {
        const resolvedOptions = this.resolveSliderOptions();
        const container = this.element.querySelector( '.ab-carousel-container' );
        if ( !( container instanceof HTMLElement ) ) {
            throw new Error( 'Missing .ab-carousel-container element' );
        }

        return new ABSlider( container, resolvedOptions );
    }

    /**
     * Starts the slider if it is active
     *
     * @private
     */
    private startSlider() {
        if ( this.isActive() ) {
            this.initFirstSlide().then( () => {
                queueMicrotask( () => {
                    this.play();
                    this.resolveReady();
                } );
            } );
        }
        else {
            this.resolveReady();
        }

    }

    /**
     * Resets the time interval of the slider
     */
    private resetInterval() {
        if ( this.interval !== null ) {
            clearInterval( this.interval );
            this.interval = null;
        }
    }

    /**
     * Starts the automatic slide rotation.
     *
     * @param {boolean} update_configuration Indicates if it should change de option if the change was triggered
     */
    public play( update_configuration: boolean = false ) {
        this.resetInterval();
        if ( update_configuration ) {
            this.updateOption( 'is_active', true );
        }
        if ( this.getOption( 'is_active' ) === true ) {
            this.interval = setInterval( () => {
                void this.slider.advance();
            }, this.getOption( 'slide_speed' ) as number );
            this.is_playing = true;
        }
    }

    /**
     * Stops the automatic slide rotation.
     *
     * @param {boolean} update_configuration Flag to detect user fired action
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
     * Returns the number of slides in the carousel.
     *
     * @returns Number of slides.
     */
    public getSlidesCount(): number {
        return this.slider.getSlidesCount();
    }

    /**
     * Returns the slide in the index position
     *
     * @param {number} index
     *
     * @returns {ABSlide}
     */
    public getSlide( index: number ): ABSlide {
        if ( index >= 0 && index < this.getSlidesCount() ) {
            return this.slider.getSlide( index );
        }
        throw new Error( `Slide index ${ index } is out of bounds` );
    }

    /**
     * Returns the visible slide
     *
     * @returns {number}
     */
    public getVisibleSlide(): ABSlide {
        return this.getSlide( this.getVisibleSlideIndex() );
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
     * Returns the root carousel container element.
     *
     * @returns {HTMLElement} The main DOM element wrapping the carousel.
     */
    public getContainer(): HTMLElement {
        return this.element;
    }

    /**
     * Returns the carousel's slider
     *
     * @returns {ABSlider}
     */
    public getSlider(): ABSlider {
        return this.slider;
    }

    /**
     * Returns whether the carousel is currently paused.
     *
     * @returns {boolean}
     */
    public isPaused(): boolean {
        return !this.isPlaying();
    }

    /**
     * Returns whether the carousel is currently playing (i.e., performing transitions).
     *
     * @returns {boolean}
     */
    public isPlaying(): boolean {
        return ( this.interval !== null );
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
     * Determines if the carousel is visible
     *
     * @returns {boolean}
     */
    public isVisible(): boolean {
        return this.visibilityController.isVisible();
    }
}