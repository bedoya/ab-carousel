# ABEffectBounceIn

**ABEffectBounceIn** is a dynamic entry animation effect for HTML elements that simulates a bounce as the element enters the screen.

Supports gravity-based and constant-speed (flat) animation modes. Configuration is passed using `data-*` attributes.

## ✨ Features

- Bounce in from the top with realistic or stylized motion
- Enter from left or right
- Optional elasticity (even >1 for exaggerated rebounds)
- Flat (non-accelerated) mode for smooth constant motion
- Simple usage via data-* attributes

## 🚀 Usage

### Basic Example

```html
<span
  data-effect="ABEffectBounceIn"
  data-duration="2000"
  data-direction="true"
  data-elasticity="0.5"
  data-wait="100"
>
  Hello!
</span>
```
### Flat Bounce (No gravity)

```html
<span
  data-effect="ABEffectBounceIn"
  data-gravity="false"
>
  Flat bounce effect
</span>
```

## ⚙️ Supported data-* Attributes

| Attribute           | Type    | Default | Description                                                   |
|---------------------|---------|---------|---------------------------------------------------------------|
| `data-effect`       | string  | —       | Must be `ABEffectBounceIn`                                    |
| `data-duration`     | number  | 2000    | Total duration in ms                                          |
| `data-direction`    | boolean | true    | Entry from left (`true`) or right (`false`)                   |
| `data-elasticity`   | number  | 0.4     | Rebound height ratio (can be > 1 for exaggerated bounce)      |
| `data-gravity`      | boolean | true    | If false, disables gravity and uses linear constant motion    |
| `data-wait`         | number  | 100     | Time to wait before animation starts (in ms)                  |

### Notes

- If `data-gravity="false"` is used, the element bounces once at the bottom and once at the top before reaching its final position.
- You can safely combine `ABEffectBounceIn` with other effects in different slides.
- Final positioning is computed automatically unless you override it via inline `top` / `left` CSS.