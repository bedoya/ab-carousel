import { ABCarouselTransition } from '@/core/ABCarouselTransition';

/**
 * Basic transition effect with no animation.
 * Instantly hides the current slide and shows the next one.
 */
export class ABTransitionNone extends ABCarouselTransition {
    name = 'ABTransitionNone';

    isInstant(): boolean {
        return true;
    }

    applyIn( element: HTMLDivElement ): void {
        element.style.transform = `transform(0, 0)`;
        element.style.display = 'block';
        element.style.visibility = 'visible';
        element.classList.add( 'active' );
    }

    applyOut( element: HTMLDivElement ): void {
        element.style.display = 'none';
        element.style.visibility = 'hidden';
        element.classList.remove( 'active' );
    }
}