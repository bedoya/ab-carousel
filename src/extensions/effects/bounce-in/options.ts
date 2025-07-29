export const defaultBounceInOptions = {
    duration: 800,    // Total animation time (ms)
    direction: true,  // true: from left, false: from right, undefined: vertical
    elasticity: 0.85, // Bounce height ratio
    gravity: true,    // true = physics-based gravity, false = fixed-speed motion
    wait: 0           // Optional delay before starting
};

export type BounceInOptions = typeof defaultBounceInOptions;