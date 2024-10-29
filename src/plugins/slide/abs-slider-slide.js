import {showElement, hideElement} from '../../utils/helpers.js';
import defaultOptions from './options.js';

function ABSSlide(options = {}) {
    let slide_options;

    function transitionSlides(current_slide, next_slide) {
        slide_options = Object.assign({...defaultOptions()}, options);
        const slider_container = current_slide.parentElement;
        const slider_width = slider_container.offsetWidth;
        const transition_speed = parseFloat(slide_options.transition_speed);
        const slide_direction = slide_options.transition_direction ? 1 : -1;

        const step = ( slider_width / transition_speed * slide_direction ) * 16;
        let progress = 0;

        showElement(current_slide);
        showElement(next_slide);

        current_slide.style.transform = 'translateX(0)';
        next_slide.style.transform = `translateX(${slider_container * slide_direction}px)`;

        let start_time;

        function slide(timestamp) {
            if (!start_time) {
                start_time = timestamp;
            }

            current_slide.style.transform = `translateX(${progress}px)`;
            next_slide.style.transform = `translateX(${(progress - (slide_direction * slider_width))}px)`;

            if (Math.abs(progress) < slider_width) {
                progress += step;
                requestAnimationFrame(slide);
            }
            else {
                hideElement(current_slide);
                next_slide.style.transform = 'translateX(0px)';
            }
        }

        requestAnimationFrame(slide);
    }

    return {
        name: 'ABSSlide',
        type: 'transition',
        init(current_slide, next_slide) {
            slide_options = Object.assign({...defaultOptions()}, options);
            transitionSlides(current_slide, next_slide);
        }
    };
}

ABSSlide.globalOptions = undefined;

export {ABSSlide as default};
