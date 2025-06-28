import { ABCarouselTransition } from '@/core/ABCarouselTransition';

export class ABSlide {

    public readonly original: HTMLElement;
    public element: HTMLElement;
    public transitionIn?: ABCarouselTransition;
    public transitionOut?: ABCarouselTransition;

    constructor ( public readonly source: HTMLElement ) {
        this.original = source;

        this.element = document.createElement ( 'div' );
        this.element.className = source.className;
        this.element.innerHTML = source.innerHTML;
        this.element.classList.add ( 'ab-carousel-slide' );
    }

    /**
     * Makes the slide visible
     */
    public show (): void {
        this.element.style.display = 'block';
        this.element.style.visibility = 'visible';
        this.element.classList.add ( 'active' );
    }

    /**
     * Makes the slide hidden
     */
    public hide (): void {
        this.element.style.display = 'none';
        this.element.style.visibility = 'hidden';
        this.element.classList.remove ( 'active' );
    }
}
