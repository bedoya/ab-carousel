# ABEffectKenBurns

**ABEffectKenBurns** is a smooth pan-and-zoom effect inspired by the classic Ken Burns technique used in documentaries. It animates scale and movement on a given slide element, creating a cinematic feel with minimal configuration.

## Usage

### Basic Example

```html
<div
  data-effect="ABEffectKenBurns"
  data-zoom-start="1"
  data-zoom-final="1.2"
  data-pan-amount="40"
  data-pan-direction="45"
  data-duration="6000"
  data-wait="100"
>
  <img src="example.jpg" />
</div>
```

## Supported `data-*` attributes

| Attribute             | Type    | Default | Description                                                  |
|-----------------------|---------|---------|--------------------------------------------------------------|
| `data-effect`         | string  | —       | Must be `"ABEffectKenBurns"`                                 |
| `data-zoom-start`     | number  | `1`     | Initial zoom scale                                           |
| `data-zoom-final`     | number  | `1.2`   | Final zoom scale                                             |
| `data-pan-amount`     | number  | `30`    | Distance (in px) to pan across the image                     |
| `data-pan-direction`  | number  | `45`    | Pan direction in degrees (0 = right, 90 = down, etc.)        |
| `data-duration`       | number  | `6000`  | Total effect duration in milliseconds                        |
| `data-wait`           | number  | `0`     | Delay before animation starts (in milliseconds)              |

## Notes

- Pan and zoom are calculated using simple trigonometry based on `data-pan-direction`.
- The effect runs once per slide appearance.
- Can be combined with transitions or other non-conflicting effects.