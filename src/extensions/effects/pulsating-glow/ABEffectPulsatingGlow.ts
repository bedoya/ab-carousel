import { ABCarouselEffect } from '@/core/ABCarouselEffect';
import { defaultPulsatingGlowOptions, PulsatingGlowOptions } from '@effects/pulsating-glow/options';
import { getRandomBetween, getRandomString, makeCSSKeyframes, parseBool, resolveToRGB } from '@support/Utilities';
import { CSSKeyframe, RGB } from '@/types/SupportTypes';

/**
 * `ABEffectPulsatingGlow` applies a pulsing neon-like glow effect to elements
 * within a slide. The effect can target text shadows, box shadows, or both,
 * and supports customization through data attributes or JS options.
 *
 * Supported options:
 * - `data-glowfont` (boolean) → Enable text glow
 * - `data-glowborder` (boolean) → Enable border glow (box-shadow)
 * - `data-fontglowcolor` (string) → RGB or hex color for text glow
 * - `data-boxglowcolor` (string) → RGB or hex color for box glow
 * - `data-intensity` (number) → Glow strength (0–1)
 * - `data-blurincrement` (number) → Distance between glow layers
 * - `data-duration` (number) → Pulse duration in ms
 *
 * The glow animation is injected via dynamically generated keyframes.
 */
export class ABEffectPulsatingGlow extends ABCarouselEffect {
    name = 'ABEffectPulsatingGlow';

    /**
     * Unique name assigned to the generated keyframe animation to avoid
     * collisions and ensure proper animation targeting.
     */
    private keyframeName: string;

    /**
     * Flag indicating whether the effect has already been prepared.
     * Prevents duplicate processing and keyframe injection.
     */
    private prepared = false;

    /**
     * Cached duration of the animation cycle, resolved from options or randomized.
     */
    private duration: number;

    /**
     * Injects a <style> tag into the document head containing the generated
     * CSS keyframes for the glow effect based on the provided options.
     * The generated keyframe name is unique per instance and reused in the animation.
     *
     * @param {PulsatingGlowOptions} options Configuration for the glow animation (colors, intensity, etc.).
     */
    private injectKeyframes( options: PulsatingGlowOptions ): void {
        const style = document.createElement( 'style' );
        const frames0 = this.buildGlowFrames( [ '0%', '100%' ], 1, options );
        const frames50 = this.buildGlowFrames( [ '50%' ], 0.5, options );

        style.textContent = makeCSSKeyframes( [ frames0, frames50 ], this.keyframeName );
        document.head.appendChild( style );
    }

    /**
     * Builds a CSSKeyframe object combining glow effects for font and/or box shadows,
     * depending on the given options. Useful for injecting animated glow styles.
     *
     * @param {string[]} stops The keyframe stop points (e.g., ['0%', '100%']).
     * @param {number} intensity Overall intensity multiplier for opacity.
     * @param {PulsatingGlowOptions} options Configuration options for glow effects.
     *
     * @returns {CSSKeyframe} A keyframe definition with stop points and corresponding styles.
     */
    private buildGlowFrames( stops: string[] = [ '0%' ], intensity: number = 1, options: PulsatingGlowOptions ): CSSKeyframe {
        const styles: Record<string, string[]> = {};

        if ( options.glowFont && options.fontGlowColor ) {
            Object.assign( styles, this.buildShadowSteps(
                resolveToRGB( options.fontGlowColor ),
                intensity,
                options.blurIncrement,
                options.shadowSteps,
                'text-shadow' ) );
        }
        if ( options.glowBox && options.boxGlowColor ) {
            Object.assign( styles, this.buildShadowSteps(
                resolveToRGB( options.boxGlowColor ),
                intensity,
                options.blurIncrement,
                options.shadowSteps,
                'box-shadow' ) );
        }
        return { stops, styles };
    }

    /**
     * Builds a set of shadow steps used for CSS animations like box-shadow or text-shadow.
     * Each step increases the blur radius and decreases the opacity to create a glowing effect.
     *
     * @param {RGB} param0 RGB color object with `r`, `g`, `b` values.
     * @param {number} intensityFactor Multiplier to amplify or reduce the overall opacity of the glow.
     * @param {number} blurIncrement Number of pixels to increment the blur radius per step.
     * @param {number} blurringSteps Number of shadow steps to generate.
     * @param {string} style CSS style key to use (e.g., 'text-shadow' or 'box-shadow').
     * @param {string} skeleton Template string with placeholders for generating shadow values.
     *
     * @returns {Record<string, string[]>} A dictionary where the key is the style (e.g., 'text-shadow')
     *                                     and the value is an array of formatted CSS shadow strings.
     */
    private buildShadowSteps(
        { r, g, b }: RGB,
        intensityFactor: number = 1,
        blurIncrement: number = defaultPulsatingGlowOptions.blurIncrement,
        blurringSteps: number = defaultPulsatingGlowOptions.shadowSteps,
        style: string = 'text-shadow',
        skeleton: string = '0 0 [blur] rgba([red], [green], [blue], [opacity])',
    ): Record<string, string[]> {
        let shadowSteps: string[] = [];
        for ( let i = 0; i < blurringSteps; i++ ) {
            const blur = `${ ( i + 1 ) * blurIncrement * intensityFactor }px`;
            const opacity = Math.max( 0, 1 - i * 0.2 );

            const step = skeleton
                .replace( '[blur]', blur.toString() )
                .replace( '[red]', r.toString() )
                .replace( '[green]', g.toString() )
                .replace( '[blue]', b.toString() )
                .replace( '[opacity]', opacity.toFixed( 2 ) );

            shadowSteps.push( step );
        }
        return {
            [ style ]: shadowSteps
        };
    }

    /**
     * Builds a full set of configuration options, based on the data-* attributes given in the
     * html code and the fallback defaults of the extension.
     *
     * @param {HTMLElement} element The root element where the effect will be applied.
     *
     * @return {PulsatingGlowOptions} The resolved configuration options for glow effects.
     * @private
     */
    private resolveOptions( element: HTMLElement ): PulsatingGlowOptions {
        const dataset = element.dataset;
        let glowBox: string | boolean | undefined = dataset.glowborder ?? dataset.glowBorder;
        let glowFont: string | boolean | undefined = dataset.glowfont ?? dataset.glowFont;
        let blurIncrement: string | number | undefined = dataset.blurincrement ?? dataset.blurIncrement;

        const duration = dataset.duration ? parseInt( dataset.duration, 10 ) : getRandomBetween();
        const intensity = dataset.intensity ? parseFloat( dataset.intensity ) : defaultPulsatingGlowOptions.intensity!;
        const boxGlowColor = ( dataset.boxglowcolor ?? dataset.boxGlowColor ) ?? defaultPulsatingGlowOptions.boxGlowColor;
        const fontGlowColor = ( dataset.fontglowcolor ?? dataset.fontGlowColor ) ?? defaultPulsatingGlowOptions.fontGlowColor;
        glowBox = glowBox !== undefined ? parseBool( glowBox ) : defaultPulsatingGlowOptions.glowBox;
        glowFont = glowFont !== undefined ? parseBool( glowFont ) : defaultPulsatingGlowOptions.glowFont;
        blurIncrement = blurIncrement !== undefined ? parseInt( blurIncrement as string, 10 ) : defaultPulsatingGlowOptions.blurIncrement;
        const shadowSteps = defaultPulsatingGlowOptions.shadowSteps;

        return { duration, intensity, boxGlowColor, fontGlowColor, glowBox, glowFont, blurIncrement, shadowSteps };
    }

    /**
     * Prepares the effect by resolving configuration and injecting necessary keyframes.
     * This method should be called only once before applying the effect.
     *
     * @param {HTMLElement} element The root element where the effect will be applied.
     */
    public prepare( element: HTMLElement ): void {
        if ( this.prepared ) {
            return;
        }

        const options = this.resolveOptions( element );
        this.duration = options.duration as number;
        this.keyframeName = `ab-glow-${ getRandomString() }`;
        this.injectKeyframes( options );
        this.prepared = true;
    }

    /**
     * Indicates whether the effect should persist after being applied.
     *
     * Returning `true` means the effect remains active and is not removed automatically.
     *
     * @returns {boolean} Always returns `true` for persistent behavior.
     */
    public isPersistent(): boolean {
        return true;
    }

    /**
     * Applies the pulsating glow animation to the target element.
     *
     * Looks for elements with the `data-pulsating-glow` attribute within `element`
     * and applies the generated CSS animation, enabling glow effects on font or border
     * depending on the resolved options.
     *
     * @param {HTMLElement} element The root element to apply the effect to.
     */
    async applyEffect( element: HTMLElement ): Promise<void> {
        const targets = [ element ];

        targets.forEach( el => {
            el.style.animation = `${ this.keyframeName } ${ this.duration }ms infinite alternate`;
            el.style.willChange = 'opacity, box-shadow, text-shadow';
        } );
    }

    /**
     * Resets animation-related styles from the given element.
     *
     * Clears the `animation` and `will-change` styles from the target element.
     * Intended to stop the pulsating glow effect.
     *
     * @param {HTMLElement} element The element to reset.
     */
    resetEffect( element: HTMLElement ): void {
        const targets = [ element ];
        targets.forEach( el => {
            el.style.animation = '';
            el.style.willChange = '';
        } );
    }
}