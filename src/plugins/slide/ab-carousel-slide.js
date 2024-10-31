import {hideElement, showElement} from '../../utils/helpers.js';
import default_options from './options.js';

class ABSlide {
    constructor(options = {}, event_emitter) {
        this.name = 'ABSlide';
        this.type = 'transition';
        this.event_emitter = event_emitter;
        this.handleButtonClick = this.handleButtonClick.bind(this);

        this.slide_options = Object.assign({...default_options()}, options);
    }

    init(current_slide, next_slide) {
        this.current_slide = current_slide;
        this.next_slide = next_slide;
        this.width = this.current_slide.parentElement.offsetWidth;
        this.step = Math.abs(this.width / parseFloat(this.slide_options.transition_speed) * 16);

        this.removeListeners();
        this.event_emitter.on('buttonClicked', this.handleButtonClick);

        this.transitionSlides();
    }

    /**
     * What to do when the plugin detects a button click event
     *
     * @param event
     */
    handleButtonClick(event) {
        const {direction} = event;
        (direction === -1) ?
            this.transitionSlides(1) :
            this.transitionSlides(-1);
    }

    /**
     * The main function that performs the transition
     *
     * @param slide_direction
     */
    transitionSlides(slide_direction = null) {
        this.slide_direction = (slide_direction === null) ?
            (this.slide_options.transition_direction ? -1 : 1) :
            slide_direction;
        this.progress = 0;

        showElement(this.current_slide);
        showElement(this.next_slide);

        this.current_slide.style.transform = 'translateX(0px)';
        this.next_slide.style.transform = 'translateX(' + this.nextSlideOrigin() + 'px)';

        const self = this;

        function slide() {
            self.current_slide.style.transform = 'translateX(' + Math.round(self.progress * self.slide_direction) + 'px)';
            self.next_slide.style.transform = 'translateX(' + (self.nextSlideOrigin() + Math.round(self.progress * self.slide_direction)) + 'px)';

            if (Math.abs(self.progress) < self.width) {
                self.progress += self.step;
                requestAnimationFrame(slide);
            }
            else {
                hideElement(self.current_slide);
                self.next_slide.style.transform = 'translateX(0px)';
            }
        }

        requestAnimationFrame(slide);
    }

    /**
     * Determines the x position of the next slide
     *
     * @returns {number|*}
     */
    nextSlideOrigin() {
        return (this.slide_direction === 1) ? this.width * -1 : this.width;
    }

    /**
     * Removes previous listeners
     */
    removeListeners() {
        this.event_emitter.off('buttonClicked', this.handleButtonClick);
    }
}

export default ABSlide;
