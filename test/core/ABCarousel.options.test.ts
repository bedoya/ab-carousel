import {describe, it, expect, beforeEach} from 'vitest';
import defaultCarouselOptions from '../../src/defaults/carousel';
import {ABCarousel} from '../../src/core/ABCarousel';

describe('ABCarousel Options', () => {
    let container: HTMLElement;

    beforeEach(() => {
        container = document.createElement('div');
        container.classList.add('ab-carousel');
        container.innerHTML = `
            <div class="ab-carousel-container">
                <div class="ab-carousel-slide">Slide 1</div>
                <div class="ab-carousel-slide">Slide 2</div>
            </div>
        `;
        document.body.appendChild(container);
    });

    it('should use default options when no config is provided', () => {
        const carousel = new ABCarousel(container);
        const defaultOptions = defaultCarouselOptions;
        expect(carousel.options).toEqual(defaultOptions);
    });

    it('should read options from data-* attributes', () => {
        container.setAttribute('data-slide_speed', '9000');
        container.setAttribute('data-transition', 'ABFade');

        const carousel = new ABCarousel(container);

        expect(carousel.options.slide_speed).toBe(9000);
        expect(carousel.options.transition).toBe('ABFade');
    });

    it('should override default options with provided options', () => {
        const options = {
            slide_speed: 12000,
            transition: 'ABFade',
        };

        const carousel = new ABCarousel(container, options);

        expect(carousel.options.slide_speed).toBe(12000);
        expect(carousel.options.transition).toBe('ABFade');
    });
});
