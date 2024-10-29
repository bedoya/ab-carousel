import {hideAll, showElement, hideElement} from '../utils/helpers.js';
import default_options from './options.js';
import './styles/ab-carousel.css';

import ABFade from '../plugins/fade/ab-carousel-fade.js';
import ABSlide from '../plugins/slide/ab-carousel-slide.js';
import ABKenBurns from '../plugins/kenburns/ab-carousel-kenburns.js';

/**
 *
 * @param container
 * @param options
 * @param plugins
 *
 * @returns {{init(): void, name: string, options}}
 * @constructor
 */
function ABCarousel(container, options = {}, plugins = []) {
    /**
     * An object to store the loaded transitions an effects
     *
     * @type {{effects: {}, transitions: {}}}
     */
    const plugin_map = {
        transitions: {},
        effects: {}
    };

    /**
     * Load the plugins of the effects and transitions
     */
    plugins.concat([ABFade, ABSlide, ABKenBurns]).forEach(plugin => {
        const plugin_instance = plugin();
        if (plugin_instance.type === 'transition') {
            plugin_map.transitions[plugin_instance.name] = plugin_instance;
        }
		else if (plugin_instance.type === 'effect') {
            plugin_map.effects[plugin_instance.name] = plugin_instance;
        }
    });

    /**
     * Applies the effect defined in the dataset.effect to the background image
     *
     * @param slide
     * @param assigned_options
     *
     * @returns {{effect_name: string}|null}
     */
    function applyImageEffects(slide, assigned_options) {
        let image = slide.querySelector('img.' + assigned_options.slide_image_class);
        if (image && image.dataset.effect) {
            const effect_name = image.dataset.effect;
            plugin_map.effects[effect_name].resetEffect(image);
            if (!image.dataset.initialized) {
                plugin_map.effects[effect_name].init(image);
                image.dataset.initialized = true;
            }
			else {
                plugin_map.effects[effect_name].applyEffect(image);
            }
            return {effect_name};
        }
    }

    /**
     * Updates the slide index
     *
     * @param slides
     * @param slide_index
     * @param direction
     *
     * @returns number
     */
    function getNextSlideIndex(slides, slide_index, direction = true) {
        let slider_direction = () => {
            return direction ? 1 : -1;
        };
        let n = slide_index + slider_direction();

        if (n < 0) {
            n = slides.length - 1;
        }
        if (n >= slides.length) {
            n = 0;
        }
        return n;
    }

    /**
     * Inits the slider to start the animation
     *
     * @param el
     */
    function initSingleSlider(el) {
        if (el !== null) {
            let assigned_options = Object.assign({...default_options()}, {...options}, {...el.dataset});
            let transition_name = assigned_options.transition;
            let slides = el.getElementsByClassName(assigned_options.slide_class);

            hideAll(slides);
            showElement(slides[0]);
            applyImageEffects(slides[0], assigned_options);

            if (options.is_active !== '0') {
                animateSlider(slides, transition_name, assigned_options);
            }
        }
    }

    /**
     * This is the main function of the slider. It will run the animation
     *
     * @param slides
     * @param transition_name
     * @param assigned_options
     */
    function animateSlider(slides, transition_name = 'ABSlide', assigned_options = {}) {
        let slide_index = 0;
        const transition_plugin = plugin_map.transitions[transition_name];

        setInterval(() => {
            const next_index = getNextSlideIndex(slides, slide_index, assigned_options.direction);
            if (transition_plugin && typeof transition_plugin.init === 'function') {
                transition_plugin.init(slides[slide_index], slides[next_index]);
            }
			else {
                hideElement(slides[slide_index]);
                showElement(slides[next_index]);
            }
            applyImageEffects(slides[next_index], assigned_options);
            slide_index = next_index;
        }, assigned_options.slide_speed);
    }

    /**
     * The main process of the ab-carousel module
     */
    return {
        name: 'ab-carousel',
        init() {
            const rootElements = document.querySelectorAll(container);
            if (rootElements.length > 0) {
                rootElements.forEach((el) => {
                    initSingleSlider(el);
                });
            }
			else {
//                console.log('No elements');
            }
        }
    };
}

ABCarousel.globalOptions = undefined;

export {ABCarousel as default};
