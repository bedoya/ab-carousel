import { ABCarouselTransition } from '@/core/ABCarouselTransition';
import { ABSlide } from '@/core/ABSlide';

/**
 * Basic transition effect with no animation.
 * Instantly hides the current slide and shows the next one.
 */
export class ABNoTransition extends ABCarouselTransition {
    name = 'ABNoTransition';

    apply( current: ABSlide, next: ABSlide ): void {
        current.hide();
        next.show();
    }
}