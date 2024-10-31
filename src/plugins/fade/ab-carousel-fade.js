import {showElement, hideElement} from '../../utils/helpers.js';
import default_options from './options.js';

class ABFade {
    /**
     *
     * @param options
     * @param event_emitter
     */
    constructor(options = {}, event_emitter) {
        this.name = 'ABFade';
        this.type = 'transition';
        this.event_emitter = event_emitter;
        this.handleButtonClick = this.handleButtonClick.bind(this);

        this.fade_options = Object.assign({...default_options()}, options);
    }

    init(current_slide, next_slide) {
        this.current_slide = current_slide;
        this.next_slide = next_slide;

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

    transitionSlides(direction) {
        let opacity_out = this.fade_options.max_opacity;
        let opacity_in = this.fade_options.min_opacity;
        let fade_speed = this.fade_options.transition_speed;
        let start_time;
        let last_time;

        showElement(this.current_slide, opacity_out);
        showElement(this.next_slide, opacity_in);

        const self = this;

        function fade(timestamp) {
            if (!start_time) {
                start_time = timestamp;
                last_time = timestamp;
            }
            let elapsed = (timestamp - last_time);
            opacity_out = self.fade_options.max_opacity - elapsed / fade_speed;
            opacity_in = elapsed / fade_speed;

            self.current_slide.style.opacity = opacity_out;
            self.next_slide.style.opacity = opacity_in;

            if (opacity_out > 0 && opacity_in < 1) {
                requestAnimationFrame(fade);
            }
            else {
                hideElement(self.current_slide, self.fade_options.min_opacity);
                showElement(self.next_slide, self.fade_options.max_opacity);
            }
        }

        requestAnimationFrame(fade);
    }

    /**
     * Removes previous listeners
     */
    removeListeners() {
        this.event_emitter.off('buttonClicked', this.handleButtonClick);
    }
}

ABFade.globalOptions = undefined;

export {ABFade as default};
