# ABEffectPulsatingGlow

**ABEffectPulsatingGlow** creates a pulsating glow animation effect on HTML elements using box-shadow and/or text-shadow.

Supports full customization through `data-*` attributes for color, intensity, duration, blur increment, and more.

## ✨ Features

- Pulsating glow using `box-shadow` and/or `text-shadow`
- Custom glow colors for box and text
- Adjustable intensity and blur behavior
- Pure CSS animation (no runtime JavaScript manipulation)
- Easy configuration via `data-*` attributes

## 🚀 Usage

### Basic Example

```html
<div
  data-effect="ABEffectPulsatingGlow"
  data-glowborder="true"
  data-boxglowcolor="cyan"
  data-intensity="0.5"
  data-duration="1200"
>
  Glowing Box
</div>
```

### Text Glow Only

```html
<span
  data-effect="ABEffectPulsatingGlow"
  data-glowfont="true"
  data-fontglowcolor="magenta"
  data-intensity="0.8"
>
  Glowing Text
</span>
```

## ⚙️ Supported data-* Attributes

| Attribute             | Type    | Default     | Description                                                       |
|------------------------|---------|-------------|-------------------------------------------------------------------|
| `data-effect`          | string  | —           | Must be `ABEffectPulsatingGlow`                                   |
| `data-duration`        | number  | random      | Duration of one glow cycle (ms)                                   |
| `data-intensity`       | number  | 0.4         | Opacity level of shadows (0 to 1)                                 |
| `data-boxglowcolor`    | string  | `#0ff`      | Color for `box-shadow` glow                                       |
| `data-fontglowcolor`   | string  | `#f0f`      | Color for `text-shadow` glow                                      |
| `data-glowborder`      | boolean | true        | Enables glow on element borders via `box-shadow`                  |
| `data-glowfont`        | boolean | false       | Enables glow on text via `text-shadow`                            |
| `data-blurincrement`   | number  | 3           | Step increment for each shadow blur layer                         |
| `data-wait`            | number  | 0           | Time to wait before starting the animation (in ms)                |

### Notes

- The glow is created using multiple layered shadows to simulate a smooth pulse.
- If both `data-glowborder` and `data-glowfont` are false, no visible effect will be applied.
