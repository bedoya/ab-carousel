import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ABSlider } from '../../src/core/ABSlider';
import { ABSlide } from "../../src/core/ABSlide";

let container: HTMLElement;

describe('ABSlider', () => {
    beforeEach(() => {
        container = document.createElement('div');
        container.innerHTML = `
      <div class="ab-carousel-slide">Slide 1</div>
      <div class="ab-carousel-slide">Slide 2</div>
    `;
        document.body.appendChild(container);
    });

    it('should create the correct number of slides', () => {
        const slider = new ABSlider(container);
        // @ts-expect-error: Testing private access
        expect(slider.getSlideCount()).toBe(2);
    });

    it('should convert each slide into an ABSlide instance', () => {
        const slider = new ABSlider(container);
        // @ts-expect-error: Testing private property
        const slides = slider.slides;

        expect(slides.length).toBe(2);
        for (const slide of slides) {
            expect(slide).toBeInstanceOf(ABSlide);
        }
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});
