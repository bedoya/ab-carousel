import { beforeEach, describe, expect, it } from 'vitest';
import { showElement, hideElement } from '../src/utils/helpers.js';
import ABSSlider from '../src/core/abs-slider.js';

describe('Helper functions', () => {
    let slider;

    beforeEach(() => {
        document.body.innerHTML = '' +
            '<div class="abs-slider">' +
                '<div class="abs-slider-container">' +
                    '<div class="abs-slider-slide">Slide 1</div>' +
                    '<div class="abs-slider-slide">Slide 2</div>' +
                    '<div class="abs-slider-slide">Slide 3</div>' +
                '</div>' +
            '</div>';
        slider = new ABSSlider('.slider', { slide_class: 'abs-slider-slide' });
    });

    it('should hide and then show each slide', () => {
        let slides = document.body.querySelectorAll('.abs-slider-slide');
        slides.forEach((slide) =>{
            hideElement(slide);
            expect(slide.style.display).toBe('none');
            showElement(slide);
            expect(slide.style.display).toBe('block');
        });
    });

    it('should initialize the slider', () => {
        slider.init();
        const slides = document.querySelectorAll('.abs-slider-slide');
        expect(slides.length).to.equal(3);
    });
});
