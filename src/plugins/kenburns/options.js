/**
 * @function defaultOptions
 * Set options that can be overridden
 * when creating the ABSSlider instance.
 */
const defaultOptions = () => {
    return {
        zoom_start: 1,
        zoom_final: 1.2,
        pan_amount: '0%',
        pan_direction: 0,
        duration: 9000,
        image_class: 'abs-slider-slide-image',
    };
};

export default defaultOptions;
