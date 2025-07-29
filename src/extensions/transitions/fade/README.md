# ABTransitionFade

**ABTransitionFade** is a simple crossfade transition used to smoothly fade slides in and out. It adjusts opacity and visibility using a configurable duration.

## Features

- Smooth fade-in / fade-out between slides
- Easy configuration via JavaScript or `data-*` attributes
- Clean default behavior, with minimal CSS manipulation

## Usage

### Example in a Carousel Slide

```html
<div data-transition="ABTransitionFade">
  Fading Slide
</div>
```

If you’re initializing the carousel manually, ensure the transition is registered and selected:

```ts
import { ABCarousel } from 'ab-carousel';
import { ABTransitionFade } from 'ab-carousel';

const carousel = new ABCarousel( '#carousel', {
  transitionIn: { name: 'ABTransitionFade' },
  transitionOut: { name: 'ABTransitionFade' },
});
```

## Supported `data-*` Attributes

| Attribute         | Type    | Default | Description                                  |
|------------------|---------|---------|----------------------------------------------|
| `data-transition`| string  | —       | Must be `ABTransitionFade`                   |
| `data-duration`  | number  | `500`   | Fade animation duration in milliseconds      |

## Notes

- The default transition duration is `500ms`.
- Internally, it uses `element.style.transition` and `opacity` to animate visibility.
- You can combine it with any effect or other transition for flexible slide control.
