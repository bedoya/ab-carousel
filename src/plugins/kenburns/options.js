/**
 * @function default_options
 * Set options that can be overridden
 * when creating the ABCarousel instance.
 */
const default_options = () => {
    return {
        zoom_start: 1,
        zoom_final: 1.2,
        pan_amount: '0%',
        pan_direction: 0,
        duration: 9000,
        image_class: 'ab-carousel-slide-image',
    };
};

export default default_options;
