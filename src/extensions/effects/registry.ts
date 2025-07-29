import type { ABCarouselEffect } from '@/core/ABCarouselEffect';
import { ABEffectKenBurns } from '@effects/ken-burns/ABEffectKenBurns';
import { ABEffectBounceIn } from '@effects/bounce-in/ABEffectBounceIn';
import { ABEffectPulsatingGlow } from '@effects/pulsating-glow/ABEffectPulsatingGlow';

/**
 * Constructor signature for effects.
 */
export type EffectConstructor = new () => ABCarouselEffect;

/**
 * Internal registry of available effects.
 */
const effectRegistry: Record<string, EffectConstructor> = {
    ABEffectKenBurns: ABEffectKenBurns,
    ABEffectBounceIn: ABEffectBounceIn,
    ABEffectPulsatingGlow: ABEffectPulsatingGlow,
};

/**
 * Registers a new effect under a given name.
 */
export function registerEffect( name: string, constructor: EffectConstructor ): void {
    effectRegistry[ name ] = constructor;
}

/**
 * Unregisters an effect by name.
 */
export function unregisterEffect( name: string ): void {
    delete effectRegistry[ name ];
}

/**
 * Resolves an effect instance by name.
 *
 * @param name The effect name.
 * @returns ABCarouselEffect instance or null if not found.
 */
export function resolveEffect( name: string ): ABCarouselEffect | null {
    const EffectClass = effectRegistry[ name ];
    return EffectClass ? new EffectClass() : null;
}
