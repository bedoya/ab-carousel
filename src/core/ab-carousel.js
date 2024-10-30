import {hideAll, showElement, hideElement} from '../utils/helpers.js';
import default_options from './options.js';
import './styles/ab-carousel.css';

import ABFade from '../plugins/fade/ab-carousel-fade.js';
import ABSlide from '../plugins/slide/ab-carousel-slide.js';
import ABKenBurns from '../plugins/kenburns/ab-carousel-kenburns.js';

class ABCarousel {
    /**
     * This is the constructor of the carousel.
     *
     * @param elem
     * @param options
     * @param plugins
     */
    constructor(elem, options = {}, plugins = []) {
        this.elem = elem;
        this.slide_index = 0;
        this.slide_interval = null;

        this.options = Object.assign(
            {...default_options()},
            {...options},
            {...this.elem.dataset}
        );

        this.slides = this.elem.querySelectorAll(`.${this.options.slide_class}`);
        this.loadPlugins(plugins);
        this.transition_plugin = this.plugins.transitions[this.options.transition];
        this.initControls();
        this.initCarousel();
    }

    /**
     * Loads the available plugins to be used by the slider
     *
     * @param plugins
     */
    loadPlugins(plugins = []) {
        this.plugins = {
            transitions: {},
            effects: {}
        };

        plugins.concat([ABFade, ABSlide, ABKenBurns]).forEach(plugin => {
            const plugin_instance = plugin();
            if (plugin_instance.type === 'transition') {
                this.plugins.transitions[plugin_instance.name] = plugin_instance;
            }
            else if (plugin_instance.type === 'effect') {
                this.plugins.effects[plugin_instance.name] = plugin_instance;
            }
        });
    }

    /**
     * Initializes the previous and next controls
     */
    initControls() {
        const prev_button = this.elem.querySelector('.' + this.options.buttons.prev.class);
        const next_button = this.elem.querySelector('.' + this.options.buttons.next.class);

        const handleButtonClick = (direction) => {
            let next_index = this.getNextSlideIndex(direction);
            this.transitionSlides(next_index);
            this.slide_index = next_index;

            if (this.options.is_active) {
                this.animateSlider();
            }
        };

        if (prev_button) {
            prev_button.addEventListener('click', () => handleButtonClick(-1));
        }
        if (next_button) {
            next_button.addEventListener('click', () => handleButtonClick(1));
        }
    }

    /**
     * This is the main function of the slider. It will run the animation
     */
    animateSlider() {
        this.resetInterval();

        this.slide_interval = setInterval(() => {
            const next_index = this.getNextSlideIndex();
            this.transitionSlides(next_index);
            this.slide_index = next_index;
        }, this.options.slide_speed);
    }

    /**
     * Stop the slider from transitioning
     */
    stopSlider(){
        this.options.is_active = false;
        this.resetInterval();
    }

    startSlider() {
        this.options.is_active = true;
        this.animateSlider();
    }

    /**
     * Resets the time interval of the slider
     */
    resetInterval(){
        if (this.slide_interval) {
            clearInterval(this.slide_interval);
        }
    }

    transitionSlides(next_index){
        if (this.transition_plugin && typeof this.transition_plugin.init === 'function') {
            this.transition_plugin.init(this.slides[this.slide_index], this.slides[next_index]);
        }
        else {
            hideElement(this.slides[this.slide_index]);
            showElement(this.slides[next_index]);
        }
        Array.from(this.slides[next_index].children).forEach(child => {
            this.applyEffects(child);
        });
    }

    /**
     * This function initializes a single carousel
     */
    initCarousel() {
        if (this.elem !== null) {
            if(this.slide_interval == null){
                hideAll(this.slides);
                showElement(this.slides[0]);

                Array.from(this.slides[0].children).forEach(child => {
                    this.applyEffects(child);
                });
            }

            const inactive_values = [false, 'false', 0, '0'];
            if (!inactive_values.includes(this.options.is_active)) {
                this.startSlider();
            }
        }
    }

    /**
     * Applies the effect defined in the dataset.effect to the background image
     *
     * @param elem
     *
     * @returns {{effect_name: string}|null}
     */
    applyEffects(elem) {
        const effect_name = elem.dataset.effect;
        if(effect_name){
            const effect = this.plugins.effects[effect_name];
            if (effect && (typeof effect.applyEffect === 'function')) {
                if (typeof effect.resetEffect === 'function') {
                    effect.resetEffect(elem);
                }
                if (!elem.dataset.initialized) {
                    effect.init(elem);
                    elem.dataset.initialized = true;
                }
                effect.applyEffect(elem);
            }
        }
    }

    /**
     * Updates the slide index
     *
     * @returns number
     */
    getNextSlideIndex(direction = null) {

        let slider_direction = () => {
            return this.options.direction ? 1 : -1;
        };

        let n = this.slide_index + (slider_direction() * (direction == null ? 1 : parseInt(direction)));

        if (n < 0) {
            n = this.slides.length - 1;
        }
        if (n >= this.slides.length) {
            n = 0;
        }
        return n;
    }
}

export default ABCarousel;