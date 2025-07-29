import type { ABTransitionOptions } from '@/interfaces';

/**
 * Default options for any transition
 *
 * @type {{duration: number, direction: boolean}}
 */
export const defaultTransitionOptions: Partial<ABTransitionOptions> = {
    duration: 500,
    direction: true,
};

/**
 * Default options for transition-in effects.
 *
 * @type {{duration: number, name: string, direction: boolean}}
 */
export const defaultTransitionInOptions: Required<ABTransitionOptions> = {
    name: 'ABTransitionNone',
    duration: 500,
    direction: true,
};

/**
 * Default options for transition-out effects.
 *
 * @type {{duration: number, name: string, direction: boolean}}
 */
export const defaultTransitionOutOptions: Required<ABTransitionOptions> = {
    name: 'ABTransitionNone',
    duration: 500,
    direction: true,
};