import { ABCarouselTransition } from '@/core/ABCarouselTransition';
import { ABCarouselEffect } from '@/core/ABCarouselEffect';
import { emitCustomEvent, extractDataAttributes, safeParseJson } from '@support/Utilities';
import { defaultTransitionInOptions, defaultTransitionOutOptions, defaultSlideOptions } from '@/defaults';
import { ABTransitionOptions, ABSlideOptions } from '@/interfaces';
import { resolveTransition } from '@transitions/registry';
import { resolveEffect } from '@effects/registry';
import { ABEffectTiming } from '@/types/ABExtensionsTypes';

/**
 * Represents an individual slide within the carousel.
 *
 * Applies transitions, manages visibility and duration,
 * and interacts with effects or animations defined via data attributes.
 */
export class ABSlide {

    /** The original HTML element passed by the user */
    public readonly original: HTMLElement;

    /** The container element that wraps the slide content */
    public element: HTMLDivElement;

    /** Transition used when the slide enters */
    private readonly transitionIn!: ABCarouselTransition;

    /** Transition used when the slide exits */
    private readonly transitionOut!: ABCarouselTransition;

    /** Options associated with this slide instance */
    private readonly options!: ABSlideOptions;

    /**
     * Visual effects applied to elements within the slide.
     * Each entry tracks the effect instance and whether it has already played.
     */
    private effects: {
        element: HTMLElement;
        effect: ABCarouselEffect;
        hasPlayed: boolean;
    }[] = [];

    /**
     * Creates a new ABSlide instance from a given source element and optional configuration.
     * It extracts options from constructor parameters, data attributes, and JSON configuration,
     * and prepares transitions and the slide container element.
     *
     * @param {HTMLElement} source - The original DOM element representing the slide.
     * @param {Partial<ABSlideOptions>} [options={}] - Optional overrides for slide behavior and transitions.
     */
    constructor( public readonly source: HTMLElement, options: Partial<ABSlideOptions> = {} ) {
        this.original = source;
        this.options = this.resolveOptions( source, options );
        this.transitionIn = this.resolveTransition(
            this.getOption<Partial<ABTransitionOptions>>( 'transitionIn' ) ?? {}
        );
        this.transitionOut = this.resolveTransition(
            this.getOption<Partial<ABTransitionOptions>>( 'transitionOut' ) ?? {}
        );
        this.element = this.createDivElement( source, this.options );
        this.initializeEffects();
    }

    /**
     * Creates a new div element that visually represents the slide.
     * Merges the original element's classes, the default class `ab-carousel-slide`,
     * and any additional classes from options. Copies the inner HTML content.
     *
     * @param {HTMLElement} source The original HTML element for the slide.
     * @param {ABSlideOptions} options Options that may include additional classes.
     *
     * @returns {HTMLDivElement} The newly created slide container element.
     * @private
     */
    private createDivElement( source: HTMLElement, options: ABSlideOptions ): HTMLDivElement {
        let element = document.createElement( 'div' );

        element.className = Array.from( new Set( [
            ...source.className.split( ' ' ).filter( Boolean ),
            ...[ 'ab-carousel-slide' ],
            ...( options.slideClass ?? '' ).split( ' ' ).filter( Boolean )
        ] ) ).join( ' ' );

        element.innerHTML = source.innerHTML;
        return element;
    }

    /**
     * Resolves the options of the current slide into an ABSlideOptions to be returned
     *
     * @param {HTMLElement} source
     * @param {Partial<ABSlideOptions>} options
     *
     * @returns {ABSlideOptions}
     * @private
     */
    private resolveOptions( source: HTMLElement, options: Partial<ABSlideOptions> ): ABSlideOptions {
        const fromAttributes = extractDataAttributes(
            source,
            Object.keys( defaultSlideOptions ) as ( keyof ABSlideOptions )[]
        ) as Partial<ABSlideOptions>;
        const fromJson = safeParseJson<Partial<ABSlideOptions>>( source.dataset.transitions ) ?? {};
        const transitionOptions = this.resolveTransitionOptions( options, fromAttributes, fromJson );

        return {
            slideDuration: fromAttributes.slideDuration ?? options.slideDuration ?? defaultSlideOptions.slideDuration,
            slideClass: fromAttributes.slideClass ?? options.slideClass ?? defaultSlideOptions.slideClass,
            transitionIn: transitionOptions.transitionIn,
            transitionOut: transitionOptions.transitionOut
        } as ABSlideOptions;
    }

    /**
     * Resolves final transition options by merging constructor options, data attributes, and JSON config.
     *
     * @param {Partial<ABSlideOptions>} fromOptions Transitions passed in constructor options.
     * @param {Partial<ABSlideOptions>} fromAttributes Transitions extracted from data-* attributes.
     * @param {Partial<ABSlideOptions>} fromJson Transitions parsed from data-transitions JSON.
     *
     * @returns {{ transitionIn: ABTransitionOptions, transitionOut: ABTransitionOptions }}
     * @private
     */
    private resolveTransitionOptions(
        fromOptions: Partial<ABSlideOptions>,
        fromAttributes: Partial<ABSlideOptions>,
        fromJson: Partial<ABSlideOptions>
    ): { transitionIn: ABTransitionOptions; transitionOut: ABTransitionOptions; } {
        const normalize = ( transition: unknown ): Partial<ABTransitionOptions> => {
            if ( typeof transition === 'string' ) {
                return { name: transition };
            }
            if ( typeof transition === 'object' && transition !== null ) {
                return transition as Partial<ABTransitionOptions>;
            }
            return {};
        };

        const transitionIn: ABTransitionOptions = {
            ...defaultTransitionInOptions,
            ...normalize( fromOptions.transitionIn ),
            ...normalize( fromAttributes.transitionIn ),
            ...normalize( fromJson.transitionIn ?? ( fromJson as any ).in )
        };

        const transitionOut: ABTransitionOptions = {
            ...defaultTransitionOutOptions,
            ...normalize( fromOptions.transitionOut ),
            ...normalize( fromAttributes.transitionOut ),
            ...normalize( fromJson.transitionOut ?? ( fromJson as any ).out )
        };

        return { transitionIn, transitionOut };
    }

    /**
     * Instantiates a concrete ABCarouselTransition based on direction and options.
     *
     * @param {ABTransitionOptions} options The resolved options for the transition.
     *
     * @returns {ABCarouselTransition} A concrete instance of a transition effect.
     * @private
     */
    private resolveTransition( options: ABTransitionOptions ): ABCarouselTransition {
        return resolveTransition( options.name ?? 'ABTransitionNone', options );
    }

    /**
     * Scans the slide for elements with a `data-effect` attribute and initializes them.
     *
     * @private
     */
    private initializeEffects(): void {
        const elements: HTMLElement[] = this.getElementsWith( '[data-effect]' );

        elements.forEach( ( element: HTMLElement ) => {
            const effectName = element.dataset.effect!;
            const effect = resolveEffect( effectName );

            if ( !effect ) {
                console.warn( `[ABSlide] Unknown effect "${ effectName }" ignored.` );
                return;
            }
            this.effects.push( { element, effect, hasPlayed: false } );
        } );
    }

    /**
     * Returns all the elements with the given attribute
     *
     * @param {string} attribute
     *
     * @returns {HTMLElement[]}
     * @private
     */
    private getElementsWith( attribute: string ) {
        const elements = this.element.querySelectorAll<HTMLElement>( attribute );
        return Array.from( elements );
    }

    /**
     * Prepares all registered effects by calling their `prepare()` method.
     * Temporarily shows the slide (while keeping it hidden) to allow effects to measure or initialize.
     */
    public prepareEffects(): void {
        const originalDisplay = this.element.style.display;

        this.element.style.visibility = 'hidden';
        this.element.style.display = '';

        this.effects.forEach( ( { element, effect } ) => {
            effect.prepare( element );
        } );

        this.element.style.display = originalDisplay;
        this.element.style.visibility = '';
    }

    /**
     * Makes the slide visible
     */
    public show(): void {
        this.element.style.display = 'block';
        this.element.style.visibility = 'visible';
        this.element.classList.add( 'active' );
    }

    /**
     * Hides the slide element by modifying its visibility, display,
     * and removing the `active` class.
     */
    public hide(): void {
        this.element.style.display = 'none';
        this.element.style.visibility = 'hidden';
        this.element.classList.remove( 'active' );
    }

    /**
     * Applies effects to all elements within the slide whose configured timing matches the provided value.
     * Supports asynchronous effects and will await each one sequentially.
     *
     * @param {ABEffectTiming} timing The timing at which the effect should be applied (e.g., 'onVisible').
     *
     * @returns {Promise<void>}
     */
    public async playEffects( timing: ABEffectTiming ): Promise<void> {
        for ( const entry of this.effects ) {
            const { element, effect } = entry;
            if ( effect.getTiming() === timing ) {
                await effect.applyEffect( element );
                entry.hasPlayed = true;
            }
        }
    }

    /**
     * Resets all non-persistent effects associated with this slide.
     * This is typically used during slide transitions or cleanup.
     */
    public resetEffects(): void {
        for ( const { element, effect } of this.effects ) {
            if ( !effect.isPersistent() ) {
                effect.resetEffect( element );
            }
        }
    }

    /**
     * Called after the transition-in has fully completed.
     */
    public async afterTransition(): Promise<void> {
        emitCustomEvent( this.element, 'ab-carousel-after-transition' );
        await this.playEffects( 'afterTransition' );
    }

    /**
     * Called before the transition-out starts.
     */
    public async beforeTransition(): Promise<void> {
        emitCustomEvent( this.element, 'ab-carousel-before-transition' );
        await this.playEffects( 'beforeTransition' );
    }

    /**
     * Returns the duration of the slide
     *
     * @returns {number | undefined}
     */
    public getDuration(): number {
        return this.getOption<number>( 'slideDuration' )!;
    }

    /**
     * Returns a string of the classes of the div element separated by space
     *
     * @returns {string}
     */
    public getClass(): string {
        return this.element.className;
    }

    /**
     * Returns the transition to show the slide
     *
     * @returns {ABCarouselTransition}
     */
    public getTransitionIn(): ABCarouselTransition {
        return this.transitionIn;
    }

    /**
     * Returns the transition to make the slide invisible
     *
     * @returns {ABCarouselTransition}
     */
    public getTransitionOut(): ABCarouselTransition {
        return this.transitionOut;
    }

    /**
     * Returns the value of a specific option key if it exists.
     * Intended for controlled access to slide configuration.
     *
     * @template T The expected return type.
     * @param {string} key The name of the option to retrieve.
     *
     * @returns {T | undefined} The value of the option, or undefined if not found.
     */
    public getOption<T = unknown>( key: string ): T | undefined {
        if ( key in this.options ) {
            return this.options[ key as keyof ABSlideOptions ] as T;
        }

        console.warn( `[ABSlide] Option "${ key }" does not exist.` );
        return undefined;
    }
}
