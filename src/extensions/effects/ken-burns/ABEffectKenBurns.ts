import { ABCarouselEffect } from '@/core/ABCarouselEffect';
import { defaultKenBurnsOptions, KenBurnsOptions } from '@effects/ken-burns/options';
import { defaultSlideOptions } from '@/defaults/slide';
import { wait } from '@support/Utilities';

export class ABEffectKenBurns extends ABCarouselEffect {
    name = 'ABEffectKenBurns';

    async applyEffect( element: HTMLElement ): Promise<void> {
        const {
            zoomStart,
            zoomFinal,
            panAmount,
            panDirection,
            duration,
            wait: waitTime
        } = this.resolveKenBurnsOptions( element );

        const panX = Math.cos( panDirection * Math.PI / 180 ) * panAmount;
        const panY = Math.sin( panDirection * Math.PI / 180 ) * panAmount;

        element.style.transform = `scale(${ zoomStart }) translate(0px, 0px)`;
        element.style.transition = 'none';

        await wait( waitTime ?? 0 );

        await new Promise<void>( ( resolve ) => {
            requestAnimationFrame( () => {
                element.style.transition = `transform ${ duration / 1000 }s ease-in-out`;
                element.style.transform = `scale(${ zoomFinal }) translate(${ panX }px, ${ panY }px)`;
                resolve();
            } );
        } );
    }

    resetEffect( element: HTMLElement ): void {
        element.style.transition = 'none';
        element.style.transform = 'scale(1) translate(0, 0)';
    }

    /**
     * Resolves options from element dataset with fallback to defaults.
     *
     * @param {HTMLElement} element - The target element with data-* attributes
     *
     * @returns {KenBurnsOptions}
     */
    private resolveKenBurnsOptions( element: HTMLElement ): KenBurnsOptions {
        return {
            zoomStart: parseFloat( element.dataset.zoom_start ?? `${ defaultKenBurnsOptions.zoomStart }` ),
            zoomFinal: parseFloat( element.dataset.zoom_final ?? `${ defaultKenBurnsOptions.zoomFinal }` ),
            panAmount: parseFloat( element.dataset.pan_amount ?? `${ defaultKenBurnsOptions.panAmount }` ),
            panDirection: parseFloat( element.dataset.pan_direction ?? `${ defaultKenBurnsOptions.panDirection }` ),
            duration: parseFloat( element.dataset.duration ?? `${ defaultSlideOptions.slideDuration }` ),
            wait: parseFloat( element.dataset.wait ?? `${ defaultKenBurnsOptions.wait }` )
        };
    }
}
