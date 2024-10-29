# ABS Slider

`abs-slider` is a highly customizable and lightweight JavaScript slider module.

`abs-slider` provides built-in support for Fade and Slide transitions as well as for the *Ken Burns* effect. The module is fully extensible and can be easily integrated into any project.

## Installation

Install `abs-slider` using npm:

```bash
npm install abs-slider
```

## Basic Usage
### HTML Structure
In your HTML, each slide can have an image and/or other elements like text. You can configure the options of the slider using the dataset `data-` attributes of your root element.

### Available Options

- `slide_speed`: 5000,
- `is_active`: true,
- `direction`: true,
- `transition`: 'ABSFade',
- `container_class`: 'abs-slider',
- `slide_class`: 'abs-slider-slide',
- `slide_image_class`: 'abs-slider-slide-image',

Here’s a sample structure for your slider with the transition set to `ABSFade` and the slide speed set to `5000`:
```html
<div class="abs-slider" data-transition="ABSFade" data-slide_speed="5000">
    <div id="slider-container">
        <div class="abs-slider-slide">
            <img src="image1.jpg" alt="Slide 1" class="abs-slider-slide-image" data-effect="ABSKenBurns" />
            <span class="slide-text">Slide 1 Text</span>
        </div>
        <div class="abs-slider-slide">
            <img src="image2.jpg" alt="Slide 2" class="abs-slider-slide-image" data-effect="ABSKenBurns" />
            <span class="slide-text">Slide 2 Text</span>
        </div>
    </div>
</div>
```

### JavaScript Usage
Import the abs-slider module and the desired plugins into your JavaScript file:

```javascript
import ABSSlider from 'abs-slider';

// Initialize the slider
const slider = new ABSSlider('.abs-slider', {
    slide_class: 'abs-slider-slide', // class for individual slides
    transition: 'ABSFade',           // Default transition (ABSFade or ABSSlide)
    is_active: true,                 // Auto-slide
    slide_speed: 5000
});

slider.init();
```

### Available Options
- `slide_class`: The class name used for the slide elements (default: abs-slider-slide).
- `transition`: Specify the default transition (e.g., 'ABSFade' or 'ABSSlide').
- `is_active`: Boolean to determine if the slider should auto-slide (default: false).

### Ken Burns Effect
You can apply the Ken Burns effect to your slide images by adding custom data attributes in your HTML:
```html
<img src="image.jpg" alt="Slide" class="abs-slider-slide-image"
     data-effect="ABSKenBurns"
     data-zoom_start="1"
     data-zoom_final="1.25"
     data-pan_amount="10%"
     data-pan_direction="90" />
```

## Plugin API
### Transition Plugins
- `ABSFade`: A fade transition between slides.
- `ABSSlide`: A sliding transition from one slide to the next.
### Effect Plugins
- `ABSKenBurns`: Creates a smooth zoom and pan effect.

### Customizing Transitions & Effects
You can add additional plugins by creating your own custom transitions or effects. Simply follow the structure used in the built-in plugins like `abs-slider-fade`, `abs-slider-slide`, or `abs-slider-kenburns`.

## Running Examples

To run the examples for the `abs-slider`, follow these steps:

1. **Ensure you have Vite installed**. If you haven't installed it globally, you can do so using npm:
```bash
npm install -g vite
```
2. Navigate to the root directory of the abs-slider your project:
```bash
cd resources/abs-slider
```
3. Run the development server:
```bash
npm run dev
```
4. Open your browser and navigate to the following URL to view the examples:
```bash
http://localhost:5173/examples/basic-slider.html
http://localhost:5173/examples/kenburns-slider.html
http://localhost:5173/examples/multiple-sliders.html
```
- You should see the various examples demonstrating the functionality of the abs-slider, including slide transitions, fade transitions, Ken Burns effects, and multiple slides on one page.
- Feel free to adjust any wording or add more details based on your preferences!

## License
MIT
