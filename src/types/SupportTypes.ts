export type CSSKeyframe = {
    stops: string[];
    styles: Record<string, string | string[]>;
};

export type CSSKeyframesInput = CSSKeyframe[];

export type RGB = { r: number; g: number; b: number };
