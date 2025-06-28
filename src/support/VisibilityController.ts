import { ABCarousel } from '@/core/ABCarousel';

/**
 * Controls the visibility state of the carousel to pause or resume playback
 * based on the visibility of the DOM element, browser tab, or window focus.
 */
export class VisibilityController {
    private observer: IntersectionObserver;
    private isVisible = true;

    private readonly handleIntersection: IntersectionObserverCallback;
    private readonly handleVisibilityChange: () => void;
    private readonly handleBlur: () => void;
    private readonly handleFocus: () => void;

    /**
     * Initializes the visibility controller.
     *
     * @param {ABCarousel} carousel The ABCarousel instance to control.
     * @param {HTMLElement} target The DOM element to observe for visibility.
     */
    constructor( private carousel: ABCarousel, private target: HTMLElement ) {
        this.handleIntersection = ( [ entry ] ) => {
            this.isVisible = entry.isIntersecting;
            if ( this.isVisible ) {
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
            else {
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
        if ( this.carousel.getOption( 'is_active' ) && this.isVisible ) {
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
}
