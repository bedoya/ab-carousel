import {hideAll, showElement, hideElement} from '../utils/helpers.js';
import defaultOptions from './options.js';
import './styles/abs-slider.css';

import ABSFade from '../plugins/fade/abs-slider-fade.js';
import ABSSlide from '../plugins/slide/abs-slider-slide.js';
import ABSKenBurns from '../plugins/kenburns/abs-slider-kenburns.js';

/**
 *
 * @param container
 * @param options
 * @param plugins
 *
 * @returns {{init(): void, name: string, options}}
 * @constructor
 */
function ABSSlider(container, options = {}, plugins = []) {
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
    plugins.concat([ABSFade, ABSSlide, ABSKenBurns]).forEach(plugin => {
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
            let assigned_options = Object.assign({...defaultOptions()}, {...options}, {...el.dataset});
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
     * The main process of the abs-slider module
     */
    return {
        name: 'abs-slider',
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

ABSSlider.globalOptions = undefined;

export {ABSSlider as default};
