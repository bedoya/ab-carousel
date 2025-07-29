export const defaultPulsatingGlowOptions = {
    duration: undefined as number | undefined,
    intensity: 0.6,
    boxGlowColor: '255, 255, 255',
    fontGlowColor: '255, 255, 255',
    glowBox: true,
    glowFont: true,
    blurIncrement: 6,
    shadowSteps: 3,
};

export type PulsatingGlowOptions = typeof defaultPulsatingGlowOptions;