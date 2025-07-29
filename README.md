# ABCarousel

![Version](https://img.shields.io/npm/v/ab-carousel?style=flat&color=success)
![License](https://img.shields.io/github/license/bedoya/ab-carousel?style=flat&color=success)
![Tests](https://img.shields.io/github/actions/workflow/status/bedoya/ab-carousel/tests.yml?label=tests&style=flat&color=success)
![Downloads](https://img.shields.io/npm/dt/ab-carousel?style=flat&color=success)

**ABCarousel** is a modular, plugin-based carousel for web applications built in TypeScript. It supports transitions and element-level effects using simple HTML markup and declarative attributes.

## Installation

Install with your preferred package manager:

```
npm install abc-carousel
```

## Usage

### 1. HTML Structure

The minimal structure requires a wrapper with class `ab-carousel` and an inner container `ab-carousel-container`. Each slide is typically a `<section>`, but any block-level element works.

```html
<div class="ab-carousel" id="slider">
  <div class="ab-carousel-container">
    <section>Slide 1</section>
    <section>Slide 2</section>
    <section>Slide 3</section>
  </div>
</div>
```

### 2. JavaScript Initialization

Import the carousel and initialize it with a DOM element:

```ts
import { ABCarousel } from 'abc-carousel';

const carousel = new ABCarousel('#slider');
```

### 3. Import Styles (Required)

You **must** import the carousel CSS styles manually:

```ts
import 'ab-carousel/dist/ab-carousel.css'
```

Or via `<link>` in HTML:

```html
<link rel="stylesheet" href="node_modules/ab-carousel/dist/ab-carousel.css" />
```

---

## Custom Transitions

Each slide can define custom `in` and `out` transitions using `data-transition-in` and `data-transition-out`.

```html
<section
  data-transition-in="ABTransitionFade"
  data-transition-out="ABTransitionSlide"
>
  Slide with custom transition
</section>
```

## Effects on Elements

Inside a slide, individual elements can use `data-effect` and related attributes to animate them.

```html
<section>
  <span
    data-effect="ABEffectBounceIn"
    data-duration="1000"
    data-direction="true"
    data-gravity="false"
  >
    Animated Element
  </span>
</section>
```

## Included Features

This package comes bundled with ready-to-use transitions, effects, and plugins:

### Transitions
- `ABTransitionSlide`
- `ABTransitionFade`

### Effects
- `ABEffectBounceIn`
- `ABEffectKenBurns`
- `ABEffectPulsatingGlow`

### Plugins
- `ABPluginClassicPlayback` (more coming soon)

## Extending the Carousel

You can create your own transitions, effects, or plugins by extending the respective base classes:

- `ABCarouselTransition`
- `ABCarouselEffect`
- `ABCarouselPlugin`

After implementing your custom extension, register it using the appropriate factory function:

- `registerTransition('customTransitionName', TransitionClass)`
- `registerEffect('customEffectName', YourEffectClass)`
- `registerPlugin('customPluginType', 'pluginKey', YourPluginClass)`

These registered components become available for use via `data-*` attributes in the HTML or through the `options` object passed to the carousel instance.

---

## Default Options

The carousel can be customized through options or HTML `data-*` attributes:

| Option             | Type       | Default     | Description                                      |
|--------------------|------------|-------------|--------------------------------------------------|
| slide-speed        | number     | `6000`      | Time in ms before advancing to next slide       |
| is-active          | boolean    | `true`      | Autoplay enabled                                |
| direction          | boolean    | `true`      | `true` = forward, `false` = reverse             |
| gap                | number     | `0`         | Time between transitions (ms)                   |
| transition         | string\|object | Slide/Fade combo | Transition config for slides            |
| plugins            | object     | `undefined` | Plugin types and names                          |

---

## License

MIT
