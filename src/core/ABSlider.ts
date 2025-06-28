import { ABSlide } from './ABSlide.js';

export class ABSlider {
    private readonly slides: ABSlide[];
    private slide_index: number;

    /**
     *
     * @param container
     * @param index
     */
    constructor( private container: HTMLElement, private index: number ) {
        this.slides = this.initializeSlides();
        this.slide_index = ( index < this.getSlideCount() ) ? index : 0;
    }

    /**
     * Initializes all ABSlide instances from the DOM container.
     *
     * @returns ABSlide[]
     */
    private initializeSlides(): ABSlide[] {
        const elements = Array.from( this.container.children ) as HTMLElement[];
        return elements.map( ( element ) => {
            let slide = new ABSlide( element );
            slide.hide();
            this.container.replaceChild( slide.element, element );
            return slide;
        } );
    }

    /**
     * Returns the number of slides in the carousel.
     *
     * @returns number
     */
    public getSlideCount(): number {
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
        const length = this.getSlideCount();

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
