import { ABNoTransition } from '@/plugins/transitions/ABNoTransition';
import type { ABSlideOptions } from '@/interfaces/interfaces';

export const defaultSlideOptions: ABSlideOptions = {
    transitionIn: new ABNoTransition(),
    transitionOut: new ABNoTransition(),
};
