import {describe, it, expect, beforeEach} from 'vitest';
import {ABCarousel} from '../../src/core/ABCarousel';

let container: HTMLElement;

describe('ABCarousel', () => {
    beforeEach(() => {
        container = document.createElement('div');
        container.id = 'carousel';
        container.innerHTML = `
      <div class="ab-carousel">
        <div class="ab-carousel-container">
          <div class="ab-carousel-slide">Slide 1</div>
          <div class="ab-carousel-slide">Slide 2</div>
        </div>
      </div>
    `;
        document.body.appendChild(container);
    });

    it('should instantiate ABCarousel using a selector string', () => {
        const instance = new ABCarousel('#carousel');
        expect(instance).toBeInstanceOf(ABCarousel);
    });

    it('should instantiate ABCarousel using an HTMLElement', () => {
        const element = document.querySelector('#carousel') as HTMLElement;
        const instance = new ABCarousel(element);
        expect(instance).toBeInstanceOf(ABCarousel);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
});