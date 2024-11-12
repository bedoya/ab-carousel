import {beforeEach, describe, expect, it, vi} from 'vitest';
import {showElement, hideElement, hideAll} from '../src/utils/helpers.js';
import ABCarousel from '../src/core/ab-carousel.js';

let element;
let slider;
let transition_spy;

beforeEach(() => {
    document.body.innerHTML = '' +
        '<div class="ab-carousel">' +
            '<div class="ab-carousel-container">' +
                '<div class="ab-carousel-slide">Slide 1</div>' +
                '<div class="ab-carousel-slide">Slide 2</div>' +
                '<div class="ab-carousel-slide">Slide 3</div>' +
                '<div class="ab-carousel-slide">Slide 4</div>' +
                '<div class="ab-carousel-slide">Slide 5</div>' +
            '</div>' +
            '<div class="ab-carousel-buttons">' +
                '<div class="button prev ab-carousel-button-prev">' +
                    '<img alt="Prev" src="img/chevron.svg"/>' +
                '</div>' +
                '<div class="button next ab-carousel-button-next">' +
                    '<img alt="Prev" src="img/chevron.svg" class="flipped"/>' +
                '</div>' +
            '</div>' +
            '<div class="ab-carousel-thumbnails-container">' +
                '<div class="ab-carousel-thumbnails">' +
                    '<div class="ab-carousel-thumbnail" data-slide_index="0">1</div>' +
                    '<div class="ab-carousel-thumbnail" data-slide_index="1">2</div>' +
                    '<div class="ab-carousel-thumbnail" data-slide_index="2">3</div>' +
                    '<div class="ab-carousel-thumbnail" data-slide_index="3">4</div>' +
                    '<div class="ab-carousel-thumbnail" data-slide_index="4">5</div>' +
                '</div>' +
            '</div>' +
        '</div>';
    element = document.querySelector('.ab-carousel');
    slider = new ABCarousel(element);
    transition_spy = vi.spyOn(slider, 'animateSlider');
});

describe('Slider setup', () => {
    it('should initialize the slider', () => {
        expect(slider).toBeInstanceOf(ABCarousel);
    });

    it('should return the 5 slides', () => {
        expect(slider.getSlides().length).toBe(5);
    });

    it('should not transition if the slider has only one slide', () => {
        document.body.innerHTML = '' +
            '<div class="ab-carousel">' +
                '<div class="ab-carousel-container">' +
                    '<div class="ab-carousel-slide">Slide 1</div>' +
                '</div>' +
            '</div>';
        const local_element = document.querySelector('.ab-carousel');
        const local_slider = new ABCarousel(local_element);
        const local_animate_spy = vi.spyOn(local_slider, 'animateSlider');
        local_slider.initCarousel();
        expect(local_animate_spy).not.toHaveBeenCalled();
    });

    it('should transition if the slider has more than one slide', () => {
        slider.initCarousel();
        expect(transition_spy).toHaveBeenCalled();
    });
});


describe('Helper functions', () => {
    it('should hide and then show each slide', () => {
        let slides = slider.getSlides();
        slides.forEach((slide) => {
            hideElement(slide);
            expect(slide.style.display).toBe('none');
            showElement(slide);
            expect(slide.style.display).toBe('block');
        });
    });

    it('should hide all the slides in the slider', () => {
        let slides = slider.getSlides();
        hideAll(slides);
        let total = slides.filter(slide => slide.style.display === 'none');
        expect(total === slides.length);
    });
});

describe('ABCarousel Button Navigation', () => {
    it('transitions to the next slide on next button click', () => {
        const initial_index = slider.slide_index;
        slider.elem.querySelector('.button.next').click();
        expect(slider.slide_index).toBe((initial_index + 1) % slider.getSlides().length);
    });

   it('transitions to the previous slide on prev button click', () => {
       const initial_index = slider.slide_index;
       document.querySelector('.button.prev').click();
       const expected_index = (initial_index - 1 + slider.slides.length) % slider.slides.length;
       expect(slider.slide_index).toBe(expected_index);
   });

    it('transitions to the correct slide on thumbnail click', () => {
        const target_index = 2;

        slider.getThumbnails().find(thumbnail => thumbnail.getAttribute('data-slide_index') === target_index.toString()).click();
        expect(slider.slide_index).toBe(target_index);
    });
});

