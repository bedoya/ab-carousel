import {showElement, hideElement} from '../../utils/helpers.js';
import defaultOptions from './options.js';

function ABSFade(options = {}) {
    let fadeOptions;

    function transitionSlides(current_slide, next_slide) {
        let opacity_out = fadeOptions.max_opacity;
        let opacity_in = fadeOptions.min_opacity;
        let fade_speed = fadeOptions.transition_speed;
        let start_time;
        let last_time;

        showElement(current_slide, opacity_out);
        showElement(next_slide, opacity_in);

        function fade(timestamp) {
            if (!start_time) {
                start_time = timestamp;
                last_time = timestamp;
            }
            let elapsed = (timestamp - last_time);
            opacity_out = fadeOptions.max_opacity - elapsed / fade_speed;
            opacity_in = elapsed / fade_speed;

            current_slide.style.opacity = opacity_out;
            next_slide.style.opacity = opacity_in;

            if (opacity_out > 0 && opacity_in < 1) {
                requestAnimationFrame(fade);
            } else {
                hideElement(current_slide, fadeOptions.min_opacity);
                showElement(next_slide, fadeOptions.max_opacity);
            }
        }

        requestAnimationFrame(fade);
    }

    return {
        name: 'ABSFade',
        type: 'transition',
        init(current_slide, next_slide) {
            fadeOptions = Object.assign({...defaultOptions()}, options);
            transitionSlides(current_slide, next_slide);
        }
    };
}

ABSFade.globalOptions = undefined;

export {ABSFade as default};
