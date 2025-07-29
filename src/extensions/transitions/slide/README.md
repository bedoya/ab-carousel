# ABTransitionSlide

**ABTransitionSlide** is a horizontal sliding transition for carousel slides. It animates the slides in or out of view by translating them along the X-axis.

## Features

- Smooth left-to-right or right-to-left slide animation
- Customizable duration and direction
- No external dependencies or CSS classes required

## Usage

### Example in a Carousel Slide

```html
<div data-transition="ABTransitionSlide">
  Sliding Slide
</div>
```

If initializing via JavaScript:

```ts
import { ABCarousel } from 'ab-carousel';
import { ABTransitionSlide } from 'ab-carousel';

const carousel = new ABCarousel( '#carousel', {
  transitionIn: { name: 'ABTransitionSlide' },
  transitionOut: { name: 'ABTransitionSlide' },
});
```

## Supported `data-*` Attributes

| Attribute           | Type    | Default | Description                                               |
|---------------------|---------|---------|-----------------------------------------------------------|
| `data-transition`   | string  | —       | Must be `ABTransitionSlide`                               |
| `data-duration`     | number  | `1000`  | Duration of the slide animation in milliseconds           |
| `data-direction`    | boolean | `true`  | Direction: `true` for left-to-right, `false` for right-to-left |

## Notes

- Direction is calculated relative to the current slide's container width.
- The slide moves in 60fps-like steps using `requestAnimationFrame` to simulate smooth motion.
- Works well with effects applied to the individual slides.
