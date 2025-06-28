import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ABSlider } from '../../src/core/ABSlider';

let container: Element;

describe('ABSlider Index Management', () => {
    beforeEach(() => {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = `
        <div class="ab-carousel-container">
            <section>Slide 1</section>
            <section>Slide 2</section>
            <section>Slide 3</section>
            <section>Slide 4</section>
        </div>
    `;
        document.body.appendChild(wrapper);
        container = wrapper.querySelector('.ab-carousel-container') as HTMLElement;
    });


    afterEach(() => {
        document.body.innerHTML = '';
    });

    it('should correctly advance forward through all indices', () => {
        const slider = new ABSlider(container, 0);

        const expected = [0, 1, 2, 3, 0, 1];
        const results: number[] = [];

        for (let i = 0; i < 6; i++) {
            // @ts-expect-error
            results.push(slider.slide_index);
            slider.advanceIndex();
        }

        expect(results).toEqual(expected);
    });

    it('should correctly advance backward through all indices', () => {
        const slider = new ABSlider(container);

        // @ts-expect-error
        slider.slide_index = 0;

        const expected = [0, 3, 2, 1, 0, 3];
        const results: number[] = [];

        for (let i = 0; i < 6; i++) {
            // @ts-expect-error
            results.push(slider.slide_index);
            slider.advanceIndex(-1);
        }

        expect(results).toEqual(expected);
    });
});
