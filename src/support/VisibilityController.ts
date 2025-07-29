import { ABCarousel } from '@/core/ABCarousel';

/**
 * Controls the visibility state of the carousel to pause or resume playback
 * based on the visibility of the DOM element, browser tab, or window focus.
 */
export class VisibilityController {
    /** IntersectionObserver instance used to detect element visibility within the viewport */
    private observer: IntersectionObserver;

    /** Tracks whether the document and element are currently visible */
    private is_visible = true;

    /** Handles IntersectionObserver callback logic */
    private readonly handleIntersection;

    /** Handles visibility changes via the Page Visibility API */
    private readonly handleVisibilityChange: () => void;

    /** Handles window blur events (used to pause activity when the tab loses focus) */
    private readonly handleBlur: () => void;

    /** Handles window focus events (used to resume activity when the tab regains focus) */
    private readonly handleFocus: () => void;

    /**
     * Initializes the visibility controller.
     *
     * @param {ABCarousel} carousel The ABCarousel instance to control.
     * @param {HTMLElement} target The DOM element to observe for visibility.
     */
    constructor( private carousel: ABCarousel, private target: HTMLElement ) {
        this.handleIntersection = ( [ entry ] ) => {
            this.is_visible = entry.isIntersecting;
            if ( this.is_visible ) {
                this.resumeIfActive();
            }
            else {
                this.carousel.pause();
            }
        };

        this.handleVisibilityChange = () => {
            if ( document.visibilityState === 'hidden' ) {
                this.carousel.pause();
            }
            else if ( this.is_visible ) {
                this.resumeIfActive();
            }
        };

        this.handleBlur = () => this.carousel.pause();
        this.handleFocus = () => this.resumeIfActive();

        this.observer = new IntersectionObserver( this.handleIntersection, {
            threshold: 0.1,
        } );

        this.init();
    }

    /**
     * Sets up all visibility-related listeners.
     */
    private init() {
        this.observer.observe( this.target );

        document.addEventListener( 'visibilitychange', this.handleVisibilityChange );
        window.addEventListener( 'blur', this.handleBlur );
        window.addEventListener( 'focus', this.handleFocus );
    }

    /**
     * Resumes the carousel if it is marked as active in its options.
     */
    private resumeIfActive() {
        if ( this.carousel.getOption( 'is_active' ) && this.is_visible && !this.carousel.isPlaying() ) {
            this.carousel.play();
        }
    }

    /**
     * Disconnects all observers and listeners.
     */
    public disconnect() {
        this.observer.disconnect();

        document.removeEventListener( 'visibilitychange', this.handleVisibilityChange );
        window.removeEventListener( 'blur', this.handleBlur );
        window.removeEventListener( 'focus', this.handleFocus );
    }

    /**
     * Determines if the slider is visible
     *
     * @returns {boolean | (() => boolean | (() => any))}
     */
    public isVisible(): boolean {
        return this.is_visible;
    }
}
