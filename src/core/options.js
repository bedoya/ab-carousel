/**
 * @function defaultOptions
 * Set options that can be overridden
 * when creating the ABSSlider instance.
 */
const defaultOptions = () => {
    return {
        slide_speed: 9000,
        is_active: true,
        direction: true,
        transition: 'ABSFade',
        container_class: 'abs-slider',
        slide_class: 'abs-slider-slide',
        slide_image_class: 'abs-slider-slide-image',
    };
};

export default defaultOptions;
