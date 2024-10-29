import { beforeEach, describe, expect, it } from 'vitest';
import { showElement, hideElement } from '../src/utils/helpers.js';
import ABCarousel from '../src/core/ab-carousel.js';

describe('Helper functions', () => {
    let slider;

    beforeEach(() => {
        document.body.innerHTML = '' +
            '<div class="ab-carousel">' +
                '<div class="ab-carousel-container">' +
                    '<div class="ab-carousel-slide">Slide 1</div>' +
                    '<div class="ab-carousel-slide">Slide 2</div>' +
                    '<div class="ab-carousel-slide">Slide 3</div>' +
                '</div>' +
            '</div>';
        slider = new ABCarousel('.slider', { slide_class: 'ab-carousel-slide' });
    });

    it('should hide and then show each slide', () => {
        let slides = document.body.querySelectorAll('.ab-carousel-slide');
        slides.forEach((slide) =>{
            hideElement(slide);
            expect(slide.style.display).toBe('none');
            showElement(slide);
            expect(slide.style.display).toBe('block');
        });
    });

    it('should initialize the slider', () => {
        slider.init();
        const slides = document.querySelectorAll('.ab-carousel-slide');
        expect(slides.length).to.equal(3);
    });
});
