# ABTransitionNone

**ABTransitionNone** is the default fallback transition that instantly switches slides with no animation.

## Features

- No visual effect or animation
- Instant visibility toggle between slides
- Useful for testing, fallback, or performance-sensitive scenarios

## Usage

### Example in a Carousel Slide

```html
<div data-transition="ABTransitionNone">
  Static Slide
</div>
```

If initializing via JavaScript:

```ts
import { ABCarousel } from 'ab-carousel';

const carousel = new ABCarousel( '#carousel', {
  transitionIn: { name: 'ABTransitionNone' },
  transitionOut: { name: 'ABTransitionNone' },
});
```

## Supported `data-*` Attributes

## Supported `data-*` Attributes

| Attribute         | Type   | Default         | Description                                                  |
|-------------------|--------|-----------------|--------------------------------------------------------------|
| `data-transition` | string | `ABTransitionNone` (fallback) | Optional. If omitted, this transition is used by default.   |


## Notes

- This transition does not require any configuration or animation.
- Can be used as a placeholder during development or debugging.
