![ab-carousel Logo](./logo.svg)
# AB Carousel
**AB Carousel** is a lightweight and customizable image carousel built with JavaScript. It supports multiple transitions and effects through a plugin-based architecture.

**AB Carousel** provides built-in support for Fade and Slide transitions as well as for the *Ken Burns* effect. The module is fully extensible and can be easily integrated into any project.

[![MIT License](https://img.shields.io/badge/license-MIT_License-green.svg?style=flat-square)](https://github.com/bedoya/ab-carousel/blob/main/LICENSE.md)


### Features

- Easy to use and integrate
- Multiple transition effects
- Supports multiple sliders in the same page
- Customizable options via html dataset `data-` or plugin options
- Supports various content types (images, text, etc.)
- Plugin architecture for extensibility


## Installation

You can install the package **AB Carousel** via npm::

```bash
npm install ab-carousel
```


## Basic Usage

### HTML Structure
To use the carousel, ensure your HTML structure follows this format:

```html
<div class="ab-carousel">
    <div class="ab-carousel-container">
        <div class="ab-carousel-slide" data-effect="ABKenBurns">
            <img src="https://picsum.photos/id/1084/450/300"
                 alt="Slide 1 background image"
                 class="ab-carousel-slide-background" />
            <span>Slide 1 Description</span>
        </div>
        <div class="ab-carousel-slide" data-effect="ABBounceIn">
            <img src="https://picsum.photos/id/1083/450/300"
                 alt="Slide 2 background image"
                 class="ab-carousel-slide-background" />
            <span>Slide 2 Description</span>
        </div>
        <div class="ab-carousel-slide">
            <span>A slide without an image</span>
        </div>
    </div>
    <div class="ab-carousel-buttons">
        <div class="button prev ab-carousel-button-prev">Prev</div>
        <div class="button next ab-carousel-button-next">Next</div>
    </div>
</div>
```


## Initialization
To initialize the carousel, you should import the package in your entry pont (`app.js`).
```javascript
import ABCarousel from 'ab-carousel';
```
You must instantiate each of the sliders of the page. If there is just one slider:
```javascript
const carousel = new ABCarousel(document.querySelector('.ab-carousel'));
```
If there are multiple sliders and all have the same container class:
```javascript
document.querySelectorAll('.ab-carousel').forEach((container) => {
    new ABCarousel(container);
});
```

### Options
There are two ways to pass initialization options to the package.
You can customize the carousel behavior using the following options:

- `transition`: The name of the transition to use (default: 'fade').
- `slide_speed`: Duration for which each slide is displayed (default: 3000 ms).
- `is_active`: Set to true to enable automatic transitions, or false to disable.
- `direction`: Set to `true` to start from first to last and `false` to animate backwards.
- `slide_class`: The class name used for each slide (default: `'ab-carousel-slide'`).
- `slide_image_class`: The class name used for the background image of a slide (default: `'ab-carousel-slide-background'`)

#### JavaScript
The first one is using a list of options with your Javascript:

```javascript
const carousel = new ABCarousel(document.querySelector('.ab-carousel'), { ...options });
```

#### HTML
The second option to pass initialization variables is in your html container class

```html
<div class="ab-carousel" data-transition="ABSlide" data-slide_speed="6000">
    ...
</div>
```
The module will determine the options values based on their priority. The options in the HTML dataset have the highest
priority for the module. Then, it will look for the values defined in the JavaScript initialization. If no values are
provided, the module will set the default value for the option.

## Plugins
There are two types of plugins available for the slider. **Transitions** and **Effects**.
**Transitions** affect the way the slides switch from one to the next one.
**Effects** change the behaviour of the elements of each slide.

The package ships with two **transitions** and one **effect** already. 

### Transition Plugins
- `ABFade`: A fade transition between slides.
- `ABSlide`: A sliding transition from one slide to the next.

### Effect Plugins
- `ABKenBurns`: Creates a smooth zoom and pan effect.

### Fade transition
The slides transitioning will start from opposing grades of opacity. The active slide will take the `max_opacity`
value. While the next slide will take the `min_opacity` value to start the transition. For a period of `transition_speed`
both slides will change their opacity towards the other value.

### Slide transition
The slides transitioning will start moving. The active slide will start moving out of the screen while at the same time
the next slide will start entering the visible area of the slider.

### Ken Burns Effect
The Ken Burns effect will add movement to the element it was applied, by zooming and panning the element.
You can apply the Ken Burns effect to your slide elements using the custom `data-` attributes in your HTML:

```html
<img src="image.jpg"
     alt="Slide"
     class="ab-carousel-slide-background"
     data-effect="ABKenBurns"
     data-zoom_start="1"
     data-zoom_final="1.25"
     data-pan_amount="10%"
     data-pan_direction="90" />
```

### Creating your own plugins
You can create additional custom plugins. Make sure you follow this simple rules.
1. Add a `type` of transition or effect to the return object of the plugin.
2. If the plugin type is `effect` you must include an `applyEffect` and a `resetEffect` method
3. If the plugin type is `transition` you must include an `init` function that receives the two slides transitioning:
`init(current_slide, next_slide);`

You can simply follow the structure used in the built-in plugins like `ab-carousel-fade`, `ab-carousel-slide`, or `ab-carousel-kenburns`.

## License
MIT
