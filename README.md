![Logo](logo.svg)
# AB Carousel

`ab-carousel` is a highly customizable and lightweight JavaScript slider module.

`ab-carousel` provides built-in support for Fade and Slide transitions as well as for the *Ken Burns* effect. The module is fully extensible and can be easily integrated into any project.

## Installation

Install `ab-carousel` using npm:

```bash
npm install ab-carousel
```

## Basic Usage
### HTML Structure
In your HTML, each slide can have an image and/or other elements like text. You can configure the options of the slider using the dataset `data-` attributes of your root element.

### Available Options

- `slide_speed`: 5000,
- `is_active`: true,
- `direction`: true,
- `transition`: 'ABFade',
- `container_class`: 'ab-carousel',
- `slide_class`: 'ab-carousel-slide',
- `slide_image_class`: 'ab-carousel-slide-image',

Here’s a sample structure for your slider with the transition set to `ABFade` and the slide speed set to `5000`:
```html
<div class="ab-carousel" data-transition="ABFade" data-slide_speed="5000">
    <div id="slider-container">
        <div class="ab-carousel-slide">
            <img src="image1.jpg" alt="Slide 1" class="ab-carousel-slide-image" data-effect="ABKenBurns" />
            <span class="slide-text">Slide 1 Text</span>
        </div>
        <div class="ab-carousel-slide">
            <img src="image2.jpg" alt="Slide 2" class="ab-carousel-slide-image" data-effect="ABKenBurns" />
            <span class="slide-text">Slide 2 Text</span>
        </div>
    </div>
</div>
```

### JavaScript Usage
Import the ab-carousel module and the desired plugins into your JavaScript file:

```javascript
import ABCarousel from 'ab-carousel';

// Initialize the slider
const slider = new ABCarousel('.ab-carousel', {
    slide_class: 'ab-carousel-slide', // class for individual slides
    transition: 'ABFade',           // Default transition (ABFade or ABSlide)
    is_active: true,                 // Auto-slide
    slide_speed: 5000
});

slider.init();
```

### Available Options
- `slide_class`: The class name used for the slide elements (default: ab-carousel-slide).
- `transition`: Specify the default transition (e.g., 'ABFade' or 'ABSlide').
- `is_active`: Boolean to determine if the slider should auto-slide (default: false).

### Ken Burns Effect
You can apply the Ken Burns effect to your slide images by adding custom data attributes in your HTML:
```html
<img src="image.jpg" alt="Slide" class="ab-carousel-slide-image"
     data-effect="ABKenBurns"
     data-zoom_start="1"
     data-zoom_final="1.25"
     data-pan_amount="10%"
     data-pan_direction="90" />
```

## Plugin API
### Transition Plugins
- `ABFade`: A fade transition between slides.
- `ABSlide`: A sliding transition from one slide to the next.
### Effect Plugins
- `ABKenBurns`: Creates a smooth zoom and pan effect.

### Customizing Transitions & Effects
You can add additional plugins by creating your own custom transitions or effects. Simply follow the structure used in the built-in plugins like `ab-carousel-fade`, `ab-carousel-slide`, or `ab-carousel-kenburns`.

## License
MIT
