/**
 * Configuration options for the ABCarouselTransition instance.
 */
export interface ABTransitionOptions {
    /**
     * The name of the transition
     */
    name?: string;

    /**
     * Duration of the transition animation in milliseconds.
     * Defaults to 1000 ms.
     */
    duration?: number;

    /**
     * Direction of the transition. If true, the transition moves from right to left.
     * If false, it moves from left to right.
     * Defaults to true.
     */
    direction?: boolean;
}