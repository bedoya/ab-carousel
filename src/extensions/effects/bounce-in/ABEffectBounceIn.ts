import { ABCarouselEffect } from '@/core/ABCarouselEffect';
import { getOffsetRelativeToParent, getParentBounds, prepareElementForEffect } from '@support/EffectLayout';
import { BounceInOptions, defaultBounceInOptions } from '@effects/bounce-in/options';
import { parseBool, wait } from '@support/Utilities';

/**
 * ABEffectBounceIn is a visual effect that animates an element entering the screen
 * with a bounce motion, simulating gravity or a flat constant-speed fall.
 *
 * The animation consists of three phases:
 * 1. A vertical drop from outside the viewport to a virtual floor.
 * 2. A rebound (upward bounce), with height proportional to elasticity or full height in flat mode.
 * 3. A final settle into the element's destination position.
 *
 * This effect supports configurable parameters via `data-*` attributes:
 * - `data-duration`: Total animation time in ms.
 * - `data-direction`: Horizontal entry side (true = left, false = right).
 * - `data-elasticity`: Rebound height ratio (can be >1).
 * - `data-gravity`: If false, disables acceleration and uses flat motion.
 * - `data-wait`: Delay before starting animation in ms.
 *
 * It automatically calculates gravity and phase durations based on container and element size.
 * Internal state includes position tracking (start, final, peak), motion parameters, and speed.
 *
 * Author: Andrés Bedoya
 */
export class ABEffectBounceIn extends ABCarouselEffect {
    name = 'ABEffectBounceIn';

    /** Width of the container element (parent of animated element). */
    private containerWidth: number;

    /** Height of the container element. */
    private containerHeight: number;

    /** X coordinate where the animation starts. */
    private elementStartingX: number;

    /** Y coordinate where the animation starts (typically negative, above container). */
    private elementStartingY: number;

    /** X coordinate where the animation should end. */
    private elementFinalX: number | undefined;

    /** Y coordinate where the animation should end. */
    private elementFinalY: number | undefined;

    /** Maximum Y position where the element hits the "floor" (before bouncing). */
    private elementFloor: number;

    /** Current X during animation. */
    private x: number;

    /** Current Y during animation. */
    private y: number | undefined;

    /** Constant horizontal speed (X-axis) during animation. */
    private elementSpeedX: number;

    /** Current vertical speed (Y-axis) — used only in some phases. */
    private elementCurrentSpeedY: number;

    /**
     * Controls horizontal entry:
     * - true: from left
     * - false: from right
     */
    private direction: boolean;

    /** Total duration of the full animation, in milliseconds. */
    private duration: number;

    /** Time before the animation starts, in milliseconds */
    private waitTime: number;

    /**
     * Acceleration used for vertical motion, in pixels per millisecond squared (px/ms²).
     * Dynamically calculated to match animation timing and vertical distances.
     */
    private gravity: number;

    /**
     * Bounce height as a fraction of container height.
     * Can exceed 1.0 to simulate exaggerated rebounds (e.g., bouncing above the screen).
     * Internally adjusted to ensure the final position is reachable.
     */
    private elasticity: number;

    /** Duration of the fall phase (top to floor). */
    private dropDurationMs: number;

    /** Duration of the upward bounce phase. */
    private reboundDurationMs: number;

    /** Duration of the final fall from bounce peak to resting Y. */
    private settleDurationMs: number;

    /**
     * Average linear speed in pixels per millisecond,
     * used for flat (non-gravity) motion mode.
     */
    private avgSpeed: number;

    /**
     * Calculates the elasticity needed to guarantee that the bounce height
     * allows reaching the final Y position cleanly.
     *
     * Ensures that elasticity is not lower than the required minimum.
     *
     * @param bounceFactor - Desired elasticity (0–1). Default from options.
     *
     * @returns number - Adjusted bounce factor, respecting minimum threshold.
     *
     * @private
     */
    private calculateBounceFactor( bounceFactor: number = defaultBounceInOptions.elasticity ): number {
        const requiredElasticity = ( this.elementFloor - this.elementFinalY ) / this.containerHeight;
        return Math.max( bounceFactor, requiredElasticity );
    }

    /**
     * Computes the duration (in ms) of each animation phase:
     * - fall (from top to floor)
     * - bounce (rebound upward)
     * - settle (final drop to resting Y)
     *
     * The durations are proportional to the distances of each segment.
     *
     * @private
     */
    private calculatePhaseDurations( isFlat: boolean = false ): void {
        const bounceHeight = isFlat ? ( this.elementFloor ) : this.elasticity * this.containerHeight;
        const bouncePeakY = isFlat ? 0 : this.elementFloor - bounceHeight;
        const distancePhase1 = this.containerHeight;
        const distancePhase2 = bounceHeight;
        const distancePhase3 = Math.max( 0, this.elementFinalY - bouncePeakY );
        const totalDistance = distancePhase1 + distancePhase2 + distancePhase3;

        this.dropDurationMs = this.duration * (distancePhase1 / totalDistance);
        this.reboundDurationMs = this.duration * (distancePhase2 / totalDistance);
        this.settleDurationMs = this.duration * (distancePhase3 / totalDistance);

        this.avgSpeed = totalDistance / this.duration;

    }

    /**
     * Defines the starting position of the element based on the configured direction.
     * The element enters from the top-left, top-right, or directly from above.
     *
     * @param {HTMLElement} element - The HTMLElement being animated.
     *
     * @private
     */
    private setStartingPosition( element: HTMLElement ): void {
        const { width } = getParentBounds(element);
        const elemWidth = element.getBoundingClientRect().width;
        const elemHeight = element.getBoundingClientRect().height;

        this.elementStartingX = this.direction ? -elemWidth : width;
        this.elementStartingY = -elemHeight;
        this.x = this.elementStartingX;
        this.y = this.elementStartingY;
    }

    /**
     * Captures the final destination of the element before animation.
     * Stores the final offset position relative to the parent container.
     *
     * @param element - The HTMLElement to analyze.
     *
     * @private
     */
    private setDestiny( element: HTMLElement ): void {
        const { offsetX, offsetY } = getOffsetRelativeToParent( element );
        if ( ( this.elementFinalX === undefined ) || ( this.elementFinalY === undefined ) ) {
            this.elementFinalX = offsetX;
            this.elementFinalY = offsetY;
        }
    }

    /**
     * Calculates the gravity value needed to land exactly on finalY during the settle phase.
     * Ensures that the final fall is physically consistent and accurate.
     *
     * @private
     */
    private calculateGravity( hasGravity: boolean = true ): number {
        if( !hasGravity ){
            return 0;
        }
        const distance = this.containerHeight;
        const time = this.dropDurationMs;

        return this.gravity = ( 2 * ( distance ) ) / ( time * time );
    }

    /**
     * Resolves and normalizes the animation options from the element's data attributes.
     * Falls back to default values when attributes are missing.
     *
     * Supported attributes:
     * - data-duration: total animation time in ms
     * - data-elasticity: bounce height ratio (can be > 1)
     * - data-direction: 'true' or 'false' (true = from left)
     * - data-gravity: 'true' or 'false' (false = disables physics)
     * - data-wait: delay before animation starts (in ms)
     *
     * @param {HTMLElement} element - The target HTMLElement with data-* attributes.
     *
     * @returns A fully resolved BounceInOptions object.
     *
     * @private
     */
    private resolveOptions( element: HTMLElement ): BounceInOptions {
        const {
            duration,
            elasticity,
            direction,
            gravity,
            wait
        } = element.dataset;

        return {
            duration: duration ? parseInt( duration ) : defaultBounceInOptions.duration,
            elasticity: elasticity ? parseFloat( elasticity ) : defaultBounceInOptions.elasticity,
            direction: direction ? parseBool( direction ) : defaultBounceInOptions.direction,
            gravity: gravity ? parseBool( gravity ) : defaultBounceInOptions.gravity,
            wait: wait ? parseInt( wait ) : defaultBounceInOptions.wait
        };
    }

    /**
     * Calculates the current Y position of the element based on elapsed time.
     * Handles both gravity-based and flat (constant speed) vertical motion.
     *
     * The animation is divided into three phases:
     * 1. Drop from starting position to floor.
     * 2. Rebound (bounce) from floor to peak.
     * 3. Settle from peak to final Y position.
     *
     * In gravity mode, acceleration is used for natural motion.
     * In flat mode, a constant average speed is used with artificial bounce simulation.
     *
     * @param {number} elapsed - Time in milliseconds since animation started.
     * @param {number} currentY - Current Y position used to track bounce peak.
     * @returns {{ resolvedY: number, bouncePeak: number }} - Current Y and updated bounce peak.
     */
    private calculateCurrentY( elapsed: number, currentY: number ) {
        let bouncePeak;
        let resolvedY;

        if ( this.gravity === 0 ) {
            resolvedY = this.calculateFlatBounceY( elapsed );
            return { resolvedY, bouncePeak: 0 };
        }

        if ( elapsed <= this.dropDurationMs ) {
            const time = elapsed;
            resolvedY = -this.elementFinalY + 0.5 * this.gravity * time * time;
        }
        else if ( elapsed <= this.dropDurationMs + this.reboundDurationMs ) {
            const time = elapsed - this.dropDurationMs;
            const bounceHeight = this.elasticity * this.containerHeight;
            const v0 = Math.sqrt( 2 * this.gravity * bounceHeight );
            resolvedY = this.elementFloor - v0 * time + 0.5 * this.gravity * time * time;
            bouncePeak = ( bouncePeak === undefined ) ? resolvedY : Math.min( currentY, resolvedY );
        }
        else if ( this.settleDurationMs > 1 ) {
            bouncePeak = currentY;
            const t = elapsed - ( this.dropDurationMs + this.reboundDurationMs );
            const gravityToFinal = 2 * ( this.elementFinalY - bouncePeak ) / Math.pow( this.settleDurationMs, 2 );
            resolvedY = bouncePeak + 0.5 * gravityToFinal * t * t;
        }

        return { resolvedY, bouncePeak };
    }

    /**
     * Calculates the vertical bounce offset based on elapsed time.
     *
     * @param {number} elapsed Time in milliseconds since the effect started
     *
     * @returns {number} Vertical offset in pixels
     */
    private calculateFlatBounceY( elapsed: number ): number {
        if ( elapsed <= this.dropDurationMs ) {
            // Phase 1: fall from top to floor
            return -this.elementStartingY + elapsed * this.avgSpeed;
        }

        else if ( elapsed <= this.dropDurationMs + this.reboundDurationMs ) {
            // Phase 2: bounce up from floor to top (Y = 0)
            const localTime = elapsed - this.dropDurationMs;
            return this.elementFloor - localTime * this.avgSpeed;
        }

        // Phase 3: settle from top to final Y
        const localTime = elapsed - this.dropDurationMs - this.reboundDurationMs;
        return localTime * this.avgSpeed;
    }

    /**
     * Prepares all physical parameters and initial positions before animation starts.
     * Resets transform and transition styles, measures bounds, and calculates motion phases.
     *
     * @param {HTMLElement} element - The HTMLElement that will be animated.
     */
    prepare( element: HTMLElement ): void {
        super.prepare( element );
        const options = this.resolveOptions( element );

        const { width, height } = getParentBounds( element );
        this.containerWidth = width;
        this.containerHeight = height;

        if( !element.dataset.animated ){
            this.setDestiny( element );
        }
        const { offsetX, offsetY } = getOffsetRelativeToParent( element );
        this.elementFinalX = offsetX;
        this.elementFinalY = offsetY;

        prepareElementForEffect( element );

        this.elementFloor = height - element.getBoundingClientRect().height;
        this.elasticity = this.calculateBounceFactor( options.elasticity );

        this.direction = options.direction;
        this.duration = options.duration;
        this.waitTime = options.wait;

        this.calculatePhaseDurations( !options.gravity );
        this.gravity = this.calculateGravity( options.gravity );
        this.elementCurrentSpeedY = 0;
        this.setStartingPosition( element );
    }

    /**
     * Runs the bounce-in animation on the provided element.
     * The effect consists of three phases: fall, bounce, and settle.
     *
     * @param {HTMLElement} element - The HTMLElement to animate.
     *
     * @returns Promise<void> - Resolves when the animation completes.
     */
    public async applyEffect( element: HTMLElement ): Promise<void> {

        element.style.willChange = 'transform';

        return new Promise( resolve => {
            const self = this;

            this.elementSpeedX = ( self.elementFinalX - self.elementStartingX ) / self.duration;
            wait( this.waitTime );
            const start = performance.now();

            let bouncePeak;
            function animate( now: number ) {
                const elapsed = now - start;
                self.x = self.elementStartingX + elapsed * self.elementSpeedX;

                if( elapsed < self.duration ){
                    const { resolvedY, bouncePeak: peak} = self.calculateCurrentY( elapsed, bouncePeak );
                    self.y = resolvedY;
                    bouncePeak = peak;
                    element.style.transform = `translate3d(${ self.x }px, ${ self.y }px, 0)`;
                    requestAnimationFrame( animate );
                }
                else {
                    element.style.transform = `translate3d(${ self.elementFinalX }px, ${ self.elementFinalY }px, 0)`;
                    resolve();
                }
            }

            requestAnimationFrame( animate );
        } );
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    resetEffect( element: HTMLElement ): void {
        // No reset needed
    }
}
